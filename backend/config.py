import os
from dotenv import load_dotenv

load_dotenv()

# Database
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./vantiquity_pulse.db")

# Razorpay (India — UPI, Cards, NetBanking)
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "rzp_test_PLACEHOLDER")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "SECRET_PLACEHOLDER")

# Stripe (International — Cards, Google Pay, Apple Pay)
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "sk_test_PLACEHOLDER")
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY", "pk_test_PLACEHOLDER")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "whsec_PLACEHOLDER")

# CORS
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

# App
APP_NAME = "VantiQuity Pulse API"
APP_VERSION = "1.0.0"
FREE_SCAN_LIMIT = 1
SCAN_PRICE_INR = 19900  # ₹199 in paise
PRO_PRICE_INR = 49900   # ₹499 in paise

# Stripe prices in INR (smallest unit = paise)
STRIPE_SCAN_PRICE = 19900   # ₹199
STRIPE_PRO_PRICE = 49900    # ₹499

# Frontend URL (for Stripe success/cancel redirects)
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
