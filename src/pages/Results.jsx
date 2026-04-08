import { useLocation, Link } from 'react-router-dom'
import { Heart, Activity, Gauge, Download, Share2, Lock, ArrowRight, AlertTriangle, Cpu, Clock, CreditCard } from 'lucide-react'
import VitalsCard from '../components/VitalsCard'
import { downloadReport, createPaymentOrder, openRazorpayCheckout, createStripeSession } from '../utils/api'
import { useState } from 'react'
import jsPDF from 'jspdf'
import './Results.css'

export default function Results() {
    const location = useLocation()
    const vitals = location.state || {
        bpm: 74, hrv_sdnn: 48, systolic: 122, diastolic: 78,
        stress_level: 'Moderate', bp_status: 'Elevated',
        signal_quality: 'Good', confidence: 0.75,
        scan_id: null, is_free_scan: true, insights_unlocked: true,
        timestamp: new Date().toISOString(), source: 'local'
    }

    const [paymentLoading, setPaymentLoading] = useState(false)
    // ⚡ TEST MODE: Set to false for production to enable paywall
    const TEST_MODE = false
    const [insightsUnlocked, setInsightsUnlocked] = useState(TEST_MODE || vitals.insights_unlocked)

    const hrv = vitals.hrv_sdnn || vitals.hrv || 48
    const stressLevel = vitals.stress_level || (hrv > 50 ? 'Low' : hrv > 35 ? 'Moderate' : 'High')
    const stressColor = stressLevel === 'Low' ? 'green' : stressLevel === 'Moderate' ? 'orange' : 'red'

    const bpStatus = vitals.bp_status || (vitals.systolic < 120 ? 'Normal' : vitals.systolic < 130 ? 'Elevated' : 'High')
    const bpColor = vitals.systolic < 120 ? 'green' : vitals.systolic < 130 ? 'orange' : 'red'

    const bpmStatus = vitals.bpm >= 60 && vitals.bpm <= 100 ? 'Normal' : 'Review'
    const bpmColor = vitals.bpm >= 60 && vitals.bpm <= 100 ? 'green' : 'orange'

    const scanDate = new Date(vitals.timestamp).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })

    const handleDownloadPDF = async () => {
        // Try backend PDF first
        if (vitals.scan_id) {
            try {
                await downloadReport(vitals.scan_id)
                return
            } catch (e) {
                console.warn('Backend PDF failed, using local generation')
            }
        }

        // Local PDF fallback
        const doc = new jsPDF()
        doc.setFillColor(139, 92, 246)
        doc.rect(0, 0, 210, 40, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(24)
        doc.setFont('helvetica', 'bold')
        doc.text('VantiQuity Pulse', 20, 22)
        doc.setFontSize(12)
        doc.setFont('helvetica', 'normal')
        doc.text('Vitals Scorecard', 20, 32)

        doc.setTextColor(100, 100, 100)
        doc.setFontSize(10)
        doc.text(`Scan Date: ${scanDate}`, 20, 52)
        if (vitals.source === 'backend') doc.text(`Signal Quality: ${vitals.signal_quality} (${Math.round(vitals.confidence * 100)}%)`, 20, 58)

        const startY = 70
        const gap = 35

        doc.setTextColor(33, 37, 41)
        doc.setFontSize(16)
        doc.setFont('helvetica', 'bold')
        doc.text('Heart Rate', 20, startY)
        doc.setFontSize(28)
        doc.setTextColor(139, 92, 246)
        doc.text(`${vitals.bpm} BPM`, 20, startY + 14)
        doc.setFontSize(11)
        doc.setTextColor(100, 100, 100)
        doc.text(`Status: ${bpmStatus}`, 20, startY + 22)

        doc.setFontSize(16)
        doc.setTextColor(33, 37, 41)
        doc.text('Stress Level (HRV)', 20, startY + gap + 10)
        doc.setFontSize(28)
        doc.setTextColor(139, 92, 246)
        doc.text(`${stressLevel}`, 20, startY + gap + 24)
        doc.setFontSize(11)
        doc.setTextColor(100, 100, 100)
        doc.text(`HRV (SDNN): ${hrv} ms`, 20, startY + gap + 32)

        doc.setFontSize(16)
        doc.setTextColor(33, 37, 41)
        doc.text('Estimated Blood Pressure', 20, startY + gap * 2 + 20)
        doc.setFontSize(28)
        doc.setTextColor(139, 92, 246)
        doc.text(`${vitals.systolic}/${vitals.diastolic} mmHg`, 20, startY + gap * 2 + 34)
        doc.setFontSize(11)
        doc.setTextColor(100, 100, 100)
        doc.text(`Status: ${bpStatus}`, 20, startY + gap * 2 + 42)

        doc.setFontSize(8)
        doc.setTextColor(150, 150, 150)
        const disclaimer = 'DISCLAIMER: VantiQuity Pulse is a digital wellness tool. It is NOT an FDA/CDSCO approved medical device. Do not use for clinical diagnosis or treatment. If you feel chest pain, call emergency services immediately.'
        const lines = doc.splitTextToSize(disclaimer, 170)
        doc.text(lines, 20, 250)

        doc.save('VantiQuity_Pulse_Report.pdf')
    }

    const handleShare = async () => {
        const shareData = {
            title: 'VantiQuity Pulse - My Heart Scan',
            text: `Just scanned my heart! ❤️ BPM: ${vitals.bpm} | Stress: ${stressLevel} | BP: ${vitals.systolic}/${vitals.diastolic} mmHg. Try your free scan at VantiQuity Pulse!`,
            url: window.location.origin
        }
        if (navigator.share) {
            try { await navigator.share(shareData) } catch { }
        } else {
            navigator.clipboard.writeText(shareData.text + ' ' + shareData.url)
            alert('Link copied to clipboard!')
        }
    }

    const handlePayment = async (type = 'scan') => {
        setPaymentLoading(true)
        try {
            const orderData = await createPaymentOrder(vitals.scan_id, type)
            openRazorpayCheckout(orderData, vitals.scan_id, () => {
                setInsightsUnlocked(true)
                setPaymentLoading(false)
            })
        } catch (e) {
            console.error('Razorpay error:', e)
            setPaymentLoading(false)
            alert('Razorpay not configured. Add API keys in backend/.env')
        }
    }

    const handleStripePayment = async (type = 'scan') => {
        setPaymentLoading(true)
        try {
            await createStripeSession(vitals.scan_id, type)
            // Stripe redirects to checkout page — no callback needed
        } catch (e) {
            console.error('Stripe error:', e)
            setPaymentLoading(false)
            alert('Stripe not configured. Add API keys in backend/.env')
        }
    }

    return (
        <div className="results-page">
            <div className="container">
                {/* Header */}
                <div className="results-header animate-in">
                    <div className="results-badge">
                        <Heart size={14} /> Scan Complete
                    </div>
                    <h1>Your Vitals Scorecard</h1>
                    <p className="results-date">{scanDate}</p>
                    {vitals.source === 'backend' && (
                        <div className="results-source">
                            <Cpu size={14} /> Processed by rPPG Engine
                            <span className="results-quality">• {vitals.signal_quality} ({Math.round(vitals.confidence * 100)}%)</span>
                        </div>
                    )}
                </div>

                {/* Vitals Grid */}
                <div className="vitals-grid">
                    <VitalsCard
                        icon={<Heart size={24} />}
                        label="Heart Rate"
                        value={vitals.bpm}
                        unit="BPM"
                        status={bpmStatus}
                        statusColor={bpmColor}
                    />
                    <VitalsCard
                        icon={<Activity size={24} />}
                        label="Stress Level"
                        value={stressLevel}
                        status={`HRV: ${hrv} ms`}
                        statusColor={stressColor}
                    />
                    <VitalsCard
                        icon={<Gauge size={24} />}
                        label="Blood Pressure"
                        value={`${vitals.systolic}/${vitals.diastolic}`}
                        unit="mmHg"
                        status={bpStatus}
                        statusColor={bpColor}
                    />
                </div>

                {/* Actions */}
                <div className="results-actions animate-in animate-delay-2">
                    <button className="btn btn-primary" onClick={handleDownloadPDF}>
                        <Download size={18} />
                        Download PDF Report
                    </button>
                    <button className="btn btn-secondary" onClick={handleShare}>
                        <Share2 size={18} />
                        Share Results
                    </button>
                    <Link to="/history" className="btn btn-secondary">
                        <Clock size={18} />
                        Scan History
                    </Link>
                </div>

                {/* Detailed Insights — Unlocked */}
                {insightsUnlocked && (
                    <div className="insights-section animate-in animate-delay-3">
                        <div className="insights-unlocked-card">
                            <h2 className="insights-title">📊 Detailed Insights</h2>

                            {/* Heart Rhythm Analysis */}
                            <div className="insight-block">
                                <h3>❤️ Heart Rhythm Analysis</h3>
                                <p>
                                    Your resting heart rate of <strong>{vitals.bpm} BPM</strong> is {vitals.bpm >= 60 && vitals.bpm <= 100
                                        ? 'within the normal range (60-100 BPM). This indicates a healthy cardiovascular rhythm.'
                                        : vitals.bpm < 60
                                            ? 'below 60 BPM (bradycardia range). This can be normal for athletes and physically active individuals. If you experience dizziness or fatigue, consult a doctor.'
                                            : 'above 100 BPM (tachycardia range). This may be due to stress, caffeine, or physical activity. If persistent, consult a healthcare provider.'}
                                </p>
                                <div className="insight-meter">
                                    <div className="meter-labels">
                                        <span>40</span><span>60</span><span>80</span><span>100</span><span>120+</span>
                                    </div>
                                    <div className="meter-bar">
                                        <div className="meter-zone zone-low" style={{ width: '20%' }}></div>
                                        <div className="meter-zone zone-normal" style={{ width: '40%' }}></div>
                                        <div className="meter-zone zone-high" style={{ width: '20%' }}></div>
                                        <div className="meter-zone zone-danger" style={{ width: '20%' }}></div>
                                        <div className="meter-pointer" style={{ left: `${Math.min(100, Math.max(0, ((vitals.bpm - 40) / 80) * 100))}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Stress & HRV */}
                            <div className="insight-block">
                                <h3>🧘 Stress & HRV Analysis</h3>
                                <p>
                                    Your HRV (SDNN) is <strong>{hrv} ms</strong> — {hrv > 50
                                        ? 'excellent! High HRV indicates strong parasympathetic activity and good stress resilience. Your body recovers well from physical and mental stress.'
                                        : hrv > 30
                                            ? 'moderate. This suggests balanced autonomic function. Regular deep breathing exercises and adequate sleep can help improve your HRV over time.'
                                            : 'low, which may indicate elevated stress or sympathetic dominance. Consider mindfulness practices, reducing caffeine, and improving sleep quality.'}
                                </p>
                                <div className="insight-tips">
                                    <h4>Stress Management Tips:</h4>
                                    <ul>
                                        <li>🫁 Practice 4-7-8 breathing: inhale 4s, hold 7s, exhale 8s</li>
                                        <li>🧘 10 minutes of daily meditation can increase HRV by 10-15%</li>
                                        <li>😴 Aim for 7-8 hours of consistent sleep</li>
                                        <li>🚶 Regular moderate exercise (30 min/day) improves autonomic balance</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Blood Pressure */}
                            <div className="insight-block">
                                <h3>🩺 Blood Pressure Insights</h3>
                                <p>
                                    Your estimated BP is <strong>{vitals.systolic}/{vitals.diastolic} mmHg</strong> — {vitals.systolic < 120
                                        ? 'normal! Maintain this through regular exercise, balanced diet, and stress management.'
                                        : vitals.systolic < 130
                                            ? 'slightly elevated. Consider reducing sodium intake, increasing potassium-rich foods, and regular cardiovascular exercise.'
                                            : 'in the high range. We strongly recommend consulting a healthcare professional for proper monitoring and guidance.'}
                                </p>
                                <div className="bp-chart">
                                    <div className={`bp-category ${vitals.systolic < 120 ? 'active' : ''}`}>
                                        <span className="bp-dot normal"></span>
                                        <span>Normal (&lt;120/80)</span>
                                    </div>
                                    <div className={`bp-category ${vitals.systolic >= 120 && vitals.systolic < 130 ? 'active' : ''}`}>
                                        <span className="bp-dot elevated"></span>
                                        <span>Elevated (120-129)</span>
                                    </div>
                                    <div className={`bp-category ${vitals.systolic >= 130 ? 'active' : ''}`}>
                                        <span className="bp-dot high"></span>
                                        <span>High (130+)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Weekly Trend */}
                            <div className="insight-block">
                                <h3>📈 Weekly Trend Tracking</h3>
                                <p>Track your heart health over time by scanning regularly. We recommend scanning at the same time each day for the most consistent readings.</p>
                                <Link to="/history" className="btn btn-secondary btn-sm" style={{ marginTop: '12px' }}>
                                    <Clock size={16} /> View Scan History
                                </Link>
                            </div>

                            {/* DNA Link */}
                            <div className="insight-block dna-block">
                                <h3>🧬 Genetic Risk Correlation</h3>
                                <p>Want to understand how your genetics influence your heart health? Get a comprehensive DNA analysis to uncover predispositions for cardiovascular conditions.</p>
                                <a href="https://vantiquity.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>
                                    Visit VantiQuity.com for DNA Analysis →
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* Detailed Insights — Locked / Paywall */}
                {!insightsUnlocked && (
                    <div className="insights-section animate-in animate-delay-3">
                        <div className="insights-card">
                            <div className="insights-locked">
                                <Lock size={32} />
                                <h3>Detailed Insights</h3>
                                <p>Unlock comprehensive analysis including heart rhythm patterns, stress trend analysis, and personalized health recommendations.</p>
                                <div className="insights-features">
                                    <span>📊 Weekly Trend Tracking</span>
                                    <span>🧬 Genetic Risk Correlation</span>
                                    <span>🧘 Stress Management Tips</span>
                                    <span>📋 Detailed PDF Report</span>
                                </div>
                                <div className="insights-pricing">
                                    <div className="insights-price-option">
                                        <span className="insights-price">₹199</span>
                                        <span className="insights-label">One-time unlock</span>
                                        <div className="payment-buttons">
                                            <button className="btn btn-primary btn-sm" onClick={() => handlePayment('scan')} disabled={paymentLoading}>
                                                {paymentLoading ? 'Processing...' : '💳 Pay with UPI / Razorpay'}
                                            </button>
                                            <button className="btn btn-stripe btn-sm" onClick={() => handleStripePayment('scan')} disabled={paymentLoading}>
                                                <CreditCard size={15} /> Pay with Card / Stripe
                                            </button>
                                        </div>
                                    </div>
                                    <div className="insights-divider">or</div>
                                    <div className="insights-price-option">
                                        <span className="insights-price">₹499<span className="per-month">/mo</span></span>
                                        <span className="insights-label">Unlimited scans + DNA</span>
                                        <Link to="/pricing" className="btn btn-outline btn-sm">
                                            View Pro Plan <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Disclaimer */}
                <div className="results-disclaimer animate-in animate-delay-4">
                    <AlertTriangle size={18} />
                    <p>
                        <strong>Medical Disclaimer:</strong> VantiQuity Pulse is a digital wellness tool. It is NOT an FDA/CDSCO approved medical device. Do not use for clinical diagnosis or treatment. If you feel chest pain, call emergency services immediately.
                    </p>
                </div>

                {/* Scan Again */}
                <div className="results-footer animate-in animate-delay-4">
                    <Link to="/scan" className="btn btn-secondary">
                        <Heart size={18} />
                        Scan Again
                    </Link>
                </div>
            </div>
        </div>
    )
}
