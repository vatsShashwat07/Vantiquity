"""
VantiQuity Pulse — PDF Report Generation

GET /api/scan/{scan_id}/report → Generate and return a styled PDF vitals report
"""

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from io import BytesIO
from datetime import datetime

from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.lib.enums import TA_CENTER, TA_LEFT

from database import get_db, Scan

router = APIRouter(prefix="/api/scan", tags=["Report"])

# Brand colors (purple palette matching VantiQuity.com)
ACCENT = HexColor("#8B5CF6")
ACCENT_LIGHT = HexColor("#A78BFA")
ACCENT_BG = HexColor("#F5F3FF")
DARK = HexColor("#212529")
GRAY = HexColor("#6B7280")
GREEN = HexColor("#2E7D32")
ORANGE = HexColor("#F57C00")
RED = HexColor("#E53935")


@router.get("/{scan_id}/report")
def generate_report(scan_id: int, db: Session = Depends(get_db)):
    """Generate a styled PDF report for a scan."""
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")

    buffer = BytesIO()
    width, height = A4
    c = canvas.Canvas(buffer, pagesize=A4)

    # -------- Header Bar --------
    c.setFillColor(ACCENT)
    c.rect(0, height - 50 * mm, width, 50 * mm, fill=1, stroke=0)
    
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 28)
    c.drawString(20 * mm, height - 25 * mm, "VantiQuity Pulse")
    
    c.setFont("Helvetica", 13)
    c.drawString(20 * mm, height - 35 * mm, "Vitals Scorecard Report")
    
    c.setFont("Helvetica", 10)
    scan_date = scan.created_at.strftime("%d %B %Y, %I:%M %p") if scan.created_at else "N/A"
    c.drawString(20 * mm, height - 44 * mm, f"Scan Date: {scan_date}")

    # -------- Signal Quality Badge --------
    y = height - 65 * mm
    quality_color = GREEN if scan.signal_quality == "Excellent" else (ORANGE if scan.signal_quality == "Good" else RED)
    c.setFillColor(quality_color)
    c.roundRect(20 * mm, y - 2 * mm, 50 * mm, 8 * mm, 3 * mm, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(24 * mm, y, f"Signal: {scan.signal_quality} ({int(scan.confidence * 100)}%)")

    # -------- Heart Rate Card --------
    y = height - 90 * mm
    _draw_vital_card(c, 20 * mm, y, "Heart Rate", f"{scan.bpm}", "BPM",
                     "Normal" if 60 <= scan.bpm <= 100 else "Review Needed",
                     GREEN if 60 <= scan.bpm <= 100 else ORANGE)

    # -------- Stress Level Card --------
    y = height - 135 * mm
    stress_color = GREEN if scan.stress_level == "Low" else (ORANGE if scan.stress_level == "Moderate" else RED)
    _draw_vital_card(c, 20 * mm, y, "Stress Level (HRV)", scan.stress_level, f"SDNN: {scan.hrv_sdnn} ms",
                     f"HRV: {scan.hrv_sdnn} ms", stress_color)

    # -------- Blood Pressure Card --------
    y = height - 180 * mm
    bp_color = GREEN if scan.systolic < 120 else (ORANGE if scan.systolic < 130 else RED)
    _draw_vital_card(c, 20 * mm, y, "Estimated Blood Pressure",
                     f"{scan.systolic}/{scan.diastolic}", "mmHg",
                     scan.bp_status, bp_color)

    # -------- Scan Metadata --------
    y = height - 215 * mm
    c.setFillColor(DARK)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(20 * mm, y, "Scan Details")
    
    c.setFont("Helvetica", 9)
    c.setFillColor(GRAY)
    details = [
        f"Duration: {scan.duration_seconds:.0f} seconds" if scan.duration_seconds else "Duration: N/A",
        f"FPS: {scan.fps:.0f}",
        f"Confidence: {scan.confidence * 100:.0f}%",
        f"Dominant Frequency: {scan.dominant_freq:.3f} Hz" if scan.dominant_freq else "",
    ]
    for i, detail in enumerate(details):
        if detail:
            c.drawString(20 * mm, y - (i + 1) * 5 * mm, detail)

    # -------- Disclaimer --------
    y = 35 * mm
    c.setFillColor(HexColor("#FFF3E0"))
    c.roundRect(15 * mm, y - 8 * mm, width - 30 * mm, 25 * mm, 3 * mm, fill=1, stroke=0)
    
    c.setFillColor(ORANGE)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(20 * mm, y + 10 * mm, "⚠ MEDICAL DISCLAIMER")
    
    c.setFillColor(GRAY)
    c.setFont("Helvetica", 7)
    disclaimer = (
        "VantiQuity Pulse is a digital wellness tool. It is NOT an FDA/CDSCO approved medical device. "
        "Do not use for clinical diagnosis or treatment. The readings provided are estimates based on "
        "remote photoplethysmography (rPPG) and should not replace professional medical advice. "
        "If you feel chest pain, call emergency services immediately."
    )
    # Word wrap
    words = disclaimer.split()
    lines = []
    line = ""
    for word in words:
        test = f"{line} {word}".strip()
        if c.stringWidth(test, "Helvetica", 7) < width - 45 * mm:
            line = test
        else:
            lines.append(line)
            line = word
    if line:
        lines.append(line)
    
    for i, l in enumerate(lines):
        c.drawString(20 * mm, y + 4 * mm - i * 3.5 * mm, l)

    # -------- Footer --------
    c.setFillColor(GRAY)
    c.setFont("Helvetica", 8)
    c.drawString(20 * mm, 15 * mm, f"© 2026 VantiQuity. Report ID: PULSE-{scan.id:06d}")
    c.drawRightString(width - 20 * mm, 15 * mm, "vantiquity.com/pulse")

    c.save()
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=VantiQuity_Pulse_Report_{scan.id}.pdf"
        }
    )


def _draw_vital_card(c, x, y, title, value, unit, status, status_color):
    """Draw a styled vital metric card on the PDF."""
    card_width = 170 * mm
    card_height = 35 * mm
    
    # Card background
    c.setFillColor(HexColor("#FAFAFA"))
    c.roundRect(x, y, card_width, card_height, 4 * mm, fill=1, stroke=0)
    
    # Border accent
    c.setStrokeColor(ACCENT_LIGHT)
    c.setLineWidth(0.5)
    c.roundRect(x, y, card_width, card_height, 4 * mm, fill=0, stroke=1)
    
    # Title
    c.setFillColor(GRAY)
    c.setFont("Helvetica", 10)
    c.drawString(x + 8 * mm, y + card_height - 10 * mm, title)
    
    # Value
    c.setFillColor(DARK)
    c.setFont("Helvetica-Bold", 28)
    c.drawString(x + 8 * mm, y + 6 * mm, str(value))
    
    # Unit
    c.setFillColor(GRAY)
    c.setFont("Helvetica", 12)
    value_width = c.stringWidth(str(value), "Helvetica-Bold", 28)
    c.drawString(x + 12 * mm + value_width, y + 8 * mm, unit)
    
    # Status badge
    c.setFillColor(status_color)
    badge_x = x + card_width - 50 * mm
    c.roundRect(badge_x, y + 8 * mm, 42 * mm, 7 * mm, 3 * mm, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 8)
    c.drawCentredString(badge_x + 21 * mm, y + 10 * mm, status)
