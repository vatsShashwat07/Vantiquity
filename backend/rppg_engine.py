"""
VantiQuity Pulse — rPPG Signal Processing Engine

Implements the CHROM (Chrominance-based) method for remote photoplethysmography.
Extracts heart rate (BPM), heart rate variability (HRV/SDNN), and estimates
blood pressure from RGB time-series data captured from facial skin.

References:
- De Haan & Jeanne (2013) "Robust Pulse Rate from Chrominance-Based rPPG"
- FFT-based heart rate extraction
- SDNN-based HRV calculation
"""

import numpy as np
from scipy import signal
from scipy.fft import fft, fftfreq
from dataclasses import dataclass
from typing import List, Optional


@dataclass
class VitalsResult:
    """Container for computed vital signs."""
    bpm: int
    hrv_sdnn: float          # Standard deviation of NN intervals (ms)
    stress_level: str        # Low / Moderate / High
    systolic: int            # Estimated systolic BP (mmHg)
    diastolic: int           # Estimated diastolic BP (mmHg)
    bp_status: str           # Normal / Elevated / High
    signal_quality: str      # Excellent / Good / Poor
    confidence: float        # 0.0 - 1.0
    raw_bpm_float: float     # Precise BPM before rounding
    dominant_freq: float     # Dominant frequency in Hz


class RPPGEngine:
    """
    Remote Photoplethysmography engine using the CHROM method.

    Pipeline:
    1. Normalize RGB channels (temporal normalization)
    2. Apply CHROM skin-tone projection
    3. Bandpass filter (0.7 - 4.0 Hz → 42-240 BPM)
    4. FFT to extract dominant frequency → BPM
    5. Peak detection → inter-beat intervals → HRV (SDNN)
    6. Blood pressure estimation via pulse morphology model
    """

    # Bandpass filter bounds (Hz)
    FREQ_LOW = 0.7    # 42 BPM minimum
    FREQ_HIGH = 3.5   # 210 BPM maximum
    FILTER_ORDER = 4  # Butterworth filter order

    def __init__(self, fps: float = 30.0):
        self.fps = fps

    def process(self, red: List[float], green: List[float], blue: List[float]) -> VitalsResult:
        """
        Main processing pipeline.

        Args:
            red:   List of mean red channel values from ROI (forehead/cheeks)
            green: List of mean green channel values from ROI
            blue:  List of mean blue channel values from ROI

        Returns:
            VitalsResult with all computed vitals
        """
        r = np.array(red, dtype=np.float64)
        g = np.array(green, dtype=np.float64)
        b = np.array(blue, dtype=np.float64)

        n_samples = len(r)
        if n_samples < int(self.fps * 5):
            raise ValueError(f"Need at least 5 seconds of data. Got {n_samples} samples at {self.fps}fps.")

        # Assess signal quality
        signal_quality, quality_score = self._assess_quality(r, g, b)

        # Step 1: Temporal normalization
        r_norm, g_norm, b_norm = self._normalize(r, g, b)

        # Step 2: CHROM projection
        pulse_signal = self._chrom(r_norm, g_norm, b_norm)

        # Step 3: Bandpass filter
        filtered = self._bandpass_filter(pulse_signal)

        # Step 4: FFT for BPM
        bpm_float, dominant_freq = self._extract_bpm(filtered)
        bpm = int(round(bpm_float))

        # Clamp to physiological range
        bpm = max(42, min(200, bpm))
        bpm_float = max(42.0, min(200.0, bpm_float))

        # Step 5: Peak detection for HRV
        hrv_sdnn = self._calculate_hrv(filtered, bpm_float)

        # Determine stress level
        stress_level = self._get_stress_level(hrv_sdnn)

        # Step 6: Blood pressure estimation
        systolic, diastolic = self._estimate_bp(bpm_float, hrv_sdnn, filtered)
        bp_status = self._get_bp_status(systolic)

        return VitalsResult(
            bpm=bpm,
            hrv_sdnn=round(hrv_sdnn, 1),
            stress_level=stress_level,
            systolic=systolic,
            diastolic=diastolic,
            bp_status=bp_status,
            signal_quality=signal_quality,
            confidence=round(quality_score, 2),
            raw_bpm_float=round(bpm_float, 2),
            dominant_freq=round(dominant_freq, 4),
        )

    # -------- Internal Pipeline Steps --------

    def _normalize(self, r: np.ndarray, g: np.ndarray, b: np.ndarray):
        """Temporal normalization: divide by running mean (window = 1 second)."""
        window = max(int(self.fps), 5)

        def norm_channel(ch):
            # Running mean using convolution
            kernel = np.ones(window) / window
            mean = np.convolve(ch, kernel, mode='same')
            mean[mean == 0] = 1  # prevent division by zero
            return ch / mean

        return norm_channel(r), norm_channel(g), norm_channel(b)

    def _chrom(self, r: np.ndarray, g: np.ndarray, b: np.ndarray) -> np.ndarray:
        """
        CHROM (Chrominance-based) rPPG method.

        Projects skin-color variations into chrominance space to separate
        pulse signal from specular/motion noise.

        Xf = 3R - 2G
        Yf = 1.5R + G - 1.5B
        S  = Xf - (σ(Xf)/σ(Yf)) * Yf
        """
        Xf = 3.0 * r - 2.0 * g
        Yf = 1.5 * r + g - 1.5 * b

        # Compute per-window to handle changing conditions
        window = max(int(self.fps * 1.6), 10)  # ~1.6 second windows
        n = len(r)
        pulse = np.zeros(n)

        for start in range(0, n, window):
            end = min(start + window, n)
            seg_x = Xf[start:end]
            seg_y = Yf[start:end]

            std_x = np.std(seg_x)
            std_y = np.std(seg_y)

            if std_y > 1e-10:
                alpha = std_x / std_y
            else:
                alpha = 1.0

            pulse[start:end] = seg_x - alpha * seg_y

        # Zero-mean
        pulse -= np.mean(pulse)

        return pulse

    def _bandpass_filter(self, sig: np.ndarray) -> np.ndarray:
        """Apply Butterworth bandpass filter (0.7 - 3.5 Hz)."""
        nyq = self.fps / 2.0
        low = self.FREQ_LOW / nyq
        high = min(self.FREQ_HIGH / nyq, 0.99)

        b, a = signal.butter(self.FILTER_ORDER, [low, high], btype='band')
        filtered = signal.filtfilt(b, a, sig)

        return filtered

    def _extract_bpm(self, filtered: np.ndarray) -> tuple:
        """Use FFT to find dominant frequency → convert to BPM."""
        n = len(filtered)

        # Apply Hanning window to reduce spectral leakage
        windowed = filtered * np.hanning(n)

        # FFT
        yf = fft(windowed)
        xf = fftfreq(n, 1.0 / self.fps)

        # Only positive frequencies in our band of interest
        mask = (xf >= self.FREQ_LOW) & (xf <= self.FREQ_HIGH)
        power = np.abs(yf[mask]) ** 2
        freqs = xf[mask]

        if len(power) == 0:
            return 72.0, 1.2  # fallback

        # Dominant frequency
        peak_idx = np.argmax(power)
        dominant_freq = freqs[peak_idx]
        bpm = dominant_freq * 60.0

        return bpm, dominant_freq

    def _calculate_hrv(self, filtered: np.ndarray, bpm: float) -> float:
        """
        Calculate HRV (SDNN) from inter-beat intervals.
        Uses peak detection to find individual heartbeats.
        """
        # Expected inter-beat distance in samples
        expected_distance = (60.0 / bpm) * self.fps

        # Find peaks (heartbeats)
        min_distance = int(expected_distance * 0.6)
        min_distance = max(min_distance, 1)

        peaks, properties = signal.find_peaks(
            filtered,
            distance=min_distance,
            height=np.std(filtered) * 0.3
        )

        if len(peaks) < 3:
            # Not enough peaks, estimate from BPM
            return max(20.0, 75.0 - (bpm - 60) * 0.5)

        # Inter-beat intervals in milliseconds
        ibi = np.diff(peaks) / self.fps * 1000.0

        # Remove outliers (beats < 300ms or > 2000ms apart)
        ibi = ibi[(ibi >= 300) & (ibi <= 2000)]

        if len(ibi) < 2:
            return max(20.0, 75.0 - (bpm - 60) * 0.5)

        # SDNN = standard deviation of NN intervals
        sdnn = np.std(ibi)

        # Clamp to realistic range
        sdnn = max(10.0, min(120.0, sdnn))

        return sdnn

    def _estimate_bp(self, bpm: float, hrv: float, pulse: np.ndarray) -> tuple:
        """
        Estimate blood pressure using pulse morphology model.

        This uses a correlational model based on:
        - Heart rate (higher HR → higher estimated BP)
        - HRV (lower HRV → higher stress → higher estimated BP)
        - Pulse amplitude variability

        Note: This is an estimation, not a clinical measurement.
        """
        # Base values (population average)
        base_systolic = 118.0
        base_diastolic = 76.0

        # Heart rate contribution
        hr_factor = (bpm - 72.0) * 0.25

        # HRV contribution (lower HRV = more stress = higher BP)
        hrv_factor = (50.0 - hrv) * 0.15

        # Pulse amplitude variability
        pulse_std = np.std(pulse)
        pulse_factor = (pulse_std - np.mean(np.abs(pulse))) * 2.0
        pulse_factor = max(-5.0, min(5.0, pulse_factor))

        systolic = int(round(base_systolic + hr_factor + hrv_factor + pulse_factor))
        diastolic = int(round(base_diastolic + hr_factor * 0.5 + hrv_factor * 0.4))

        # Clamp to realistic ranges
        systolic = max(90, min(180, systolic))
        diastolic = max(55, min(120, diastolic))

        # Ensure systolic > diastolic
        if systolic <= diastolic:
            systolic = diastolic + 30

        return systolic, diastolic

    # -------- Helper Methods --------

    def _assess_quality(self, r, g, b) -> tuple:
        """Assess signal quality based on channel statistics."""
        # Check brightness
        mean_brightness = np.mean([np.mean(r), np.mean(g), np.mean(b)])

        # Check variability (motion artifact indicator)
        r_var = np.std(r) / (np.mean(r) + 1e-10)
        g_var = np.std(g) / (np.mean(g) + 1e-10)

        # Too much variation = too much movement
        motion_score = 1.0 - min(1.0, max(r_var, g_var) * 5.0)

        # Brightness score
        if mean_brightness > 80 and mean_brightness < 200:
            brightness_score = 1.0
        elif mean_brightness > 50:
            brightness_score = 0.7
        else:
            brightness_score = 0.3

        quality_score = (motion_score * 0.5 + brightness_score * 0.5)

        if quality_score > 0.75:
            return "Excellent", quality_score
        elif quality_score > 0.5:
            return "Good", quality_score
        else:
            return "Poor", quality_score

    @staticmethod
    def _get_stress_level(hrv_sdnn: float) -> str:
        """Map HRV (SDNN) to stress level."""
        if hrv_sdnn > 50:
            return "Low"
        elif hrv_sdnn > 30:
            return "Moderate"
        else:
            return "High"

    @staticmethod
    def _get_bp_status(systolic: int) -> str:
        """Map systolic BP to status category."""
        if systolic < 120:
            return "Normal"
        elif systolic < 130:
            return "Elevated"
        elif systolic < 140:
            return "High (Stage 1)"
        else:
            return "High (Stage 2)"
