"""
VantiQuity Pulse — Database Models (SQLAlchemy + SQLite)
"""

from sqlalchemy import create_engine, Column, Integer, Float, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime, timezone
from config import DATABASE_URL

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()


def get_db():
    """Dependency for FastAPI routes."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables."""
    Base.metadata.create_all(bind=engine)


# -------- Models --------

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=True, index=True)
    name = Column(String(255), nullable=True)
    device_id = Column(String(255), unique=True, nullable=True, index=True)
    free_scans_used = Column(Integer, default=0)
    subscription_type = Column(String(50), default="free")  # free / scan / pro
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    scans = relationship("Scan", back_populates="user")
    payments = relationship("Payment", back_populates="user")


class Scan(Base):
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Vitals
    bpm = Column(Integer, nullable=False)
    hrv_sdnn = Column(Float, nullable=False)
    stress_level = Column(String(20), nullable=False)
    systolic = Column(Integer, nullable=False)
    diastolic = Column(Integer, nullable=False)
    bp_status = Column(String(30), nullable=False)
    
    # Meta
    signal_quality = Column(String(20), nullable=False)
    confidence = Column(Float, nullable=False)
    raw_bpm = Column(Float, nullable=True)
    dominant_freq = Column(Float, nullable=True)
    fps = Column(Float, default=30.0)
    duration_seconds = Column(Float, nullable=True)
    
    # Detailed insights unlocked via payment
    insights_unlocked = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="scans")
    payment = relationship("Payment", back_populates="scan", uselist=False)


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    scan_id = Column(Integer, ForeignKey("scans.id"), nullable=True)
    
    # Gateway identifier
    payment_gateway = Column(String(20), default="razorpay")  # razorpay / stripe
    
    # Razorpay fields
    razorpay_order_id = Column(String(255), nullable=True)
    razorpay_payment_id = Column(String(255), nullable=True)
    razorpay_signature = Column(String(255), nullable=True)
    
    # Stripe fields
    stripe_session_id = Column(String(255), nullable=True)
    stripe_payment_id = Column(String(255), nullable=True)
    
    amount = Column(Integer, nullable=False)        # in paise
    currency = Column(String(10), default="INR")
    payment_type = Column(String(20), nullable=False)  # scan / pro
    status = Column(String(20), default="created")     # created / paid / failed
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="payments")
    scan = relationship("Scan", back_populates="payment")
