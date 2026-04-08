"""
VantiQuity Pulse — FastAPI Application Entry Point

Runs at: http://localhost:8000
Docs at: http://localhost:8000/docs
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import APP_NAME, APP_VERSION, CORS_ORIGINS
from database import init_db
from routes import scan, payment, report

# -------- App --------

app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description="Backend API for VantiQuity Pulse — rPPG Heart Health Monitor",
)

# -------- CORS --------

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------- Routes --------

app.include_router(scan.router)
app.include_router(payment.router)
app.include_router(report.router)


# -------- Events --------

@app.on_event("startup")
def startup():
    """Initialize database on startup."""
    init_db()
    print(f"✅ {APP_NAME} v{APP_VERSION} started")
    print(f"📊 Database initialized")
    print(f"🔗 CORS origins: {CORS_ORIGINS}")


# -------- Health Check --------

@app.get("/", tags=["Health"])
def root():
    return {
        "name": APP_NAME,
        "version": APP_VERSION,
        "status": "healthy",
        "endpoints": {
            "scan_process": "POST /api/scan/process",
            "scan_history": "GET /api/scan/history?device_id=xxx",
            "scan_detail": "GET /api/scan/{id}",
            "scan_report": "GET /api/scan/{id}/report",
            "payment_create": "POST /api/payment/create-order",
            "payment_verify": "POST /api/payment/verify",
            "docs": "GET /docs",
        }
    }


@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}
