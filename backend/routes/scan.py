"""
VantiQuity Pulse — Scan Processing Routes

Handles the core rPPG pipeline:
  POST /api/scan/process   → Process RGB signals → return vitals
  GET  /api/scan/history   → User's scan history
  GET  /api/scan/{id}      → Single scan details
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import List, Optional
from database import get_db, Scan, User
from rppg_engine import RPPGEngine

router = APIRouter(prefix="/api/scan", tags=["Scan"])


# -------- Request/Response Schemas --------

class ScanRequest(BaseModel):
    red: List[float] = Field(..., description="Mean red channel values from ROI per frame")
    green: List[float] = Field(..., description="Mean green channel values from ROI per frame")
    blue: List[float] = Field(..., description="Mean blue channel values from ROI per frame")
    fps: float = Field(default=30.0, description="Camera frames per second")
    device_id: Optional[str] = Field(default=None, description="Anonymous device identifier")


class VitalsResponse(BaseModel):
    scan_id: int
    bpm: int
    hrv_sdnn: float
    stress_level: str
    systolic: int
    diastolic: int
    bp_status: str
    signal_quality: str
    confidence: float
    is_free_scan: bool
    insights_unlocked: bool
    timestamp: str


class ScanHistoryItem(BaseModel):
    id: int
    bpm: int
    stress_level: str
    systolic: int
    diastolic: int
    signal_quality: str
    created_at: str


# -------- Routes --------

@router.post("/process", response_model=VitalsResponse)
def process_scan(request: ScanRequest, db: Session = Depends(get_db)):
    """
    Process RGB signal data from the frontend camera scan.
    Runs the CHROM rPPG pipeline and returns computed vitals.
    """
    # Validate signal length
    n = len(request.red)
    if n != len(request.green) or n != len(request.blue):
        raise HTTPException(status_code=400, detail="RGB arrays must be the same length")

    min_samples = int(request.fps * 5)
    if n < min_samples:
        raise HTTPException(
            status_code=400,
            detail=f"Need at least 5 seconds of data ({min_samples} samples at {request.fps}fps). Got {n}."
        )

    # Find or create user by device_id
    user = None
    is_free_scan = False
    if request.device_id:
        user = db.query(User).filter(User.device_id == request.device_id).first()
        if not user:
            user = User(device_id=request.device_id, subscription_type="free")
            db.add(user)
            db.commit()
            db.refresh(user)

        # Check free scan eligibility
        if user.free_scans_used < 1:
            is_free_scan = True

    # Run rPPG engine
    engine = RPPGEngine(fps=request.fps)
    try:
        result = engine.process(request.red, request.green, request.blue)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Signal processing error: {str(e)}")

    # Save scan to database
    scan = Scan(
        user_id=user.id if user else None,
        bpm=result.bpm,
        hrv_sdnn=result.hrv_sdnn,
        stress_level=result.stress_level,
        systolic=result.systolic,
        diastolic=result.diastolic,
        bp_status=result.bp_status,
        signal_quality=result.signal_quality,
        confidence=result.confidence,
        raw_bpm=result.raw_bpm_float,
        dominant_freq=result.dominant_freq,
        fps=request.fps,
        duration_seconds=n / request.fps,
        insights_unlocked=is_free_scan,
    )
    db.add(scan)

    # Update user's free scan count
    if user and is_free_scan:
        user.free_scans_used += 1

    db.commit()
    db.refresh(scan)

    return VitalsResponse(
        scan_id=scan.id,
        bpm=result.bpm,
        hrv_sdnn=result.hrv_sdnn,
        stress_level=result.stress_level,
        systolic=result.systolic,
        diastolic=result.diastolic,
        bp_status=result.bp_status,
        signal_quality=result.signal_quality,
        confidence=result.confidence,
        is_free_scan=is_free_scan,
        insights_unlocked=scan.insights_unlocked,
        timestamp=scan.created_at.isoformat(),
    )


@router.get("/history")
def scan_history(device_id: str, db: Session = Depends(get_db)):
    """Get scan history for a device."""
    user = db.query(User).filter(User.device_id == device_id).first()
    if not user:
        return {"scans": []}

    scans = db.query(Scan).filter(Scan.user_id == user.id).order_by(Scan.created_at.desc()).limit(50).all()
    return {
        "scans": [
            ScanHistoryItem(
                id=s.id,
                bpm=s.bpm,
                stress_level=s.stress_level,
                systolic=s.systolic,
                diastolic=s.diastolic,
                signal_quality=s.signal_quality,
                created_at=s.created_at.isoformat(),
            )
            for s in scans
        ]
    }


@router.get("/{scan_id}")
def get_scan(scan_id: int, db: Session = Depends(get_db)):
    """Get a single scan's details."""
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")

    return {
        "id": scan.id,
        "bpm": scan.bpm,
        "hrv_sdnn": scan.hrv_sdnn,
        "stress_level": scan.stress_level,
        "systolic": scan.systolic,
        "diastolic": scan.diastolic,
        "bp_status": scan.bp_status,
        "signal_quality": scan.signal_quality,
        "confidence": scan.confidence,
        "insights_unlocked": scan.insights_unlocked,
        "fps": scan.fps,
        "duration_seconds": scan.duration_seconds,
        "created_at": scan.created_at.isoformat(),
    }
