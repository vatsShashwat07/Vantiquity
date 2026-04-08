# VantiQuity Pulse 💚

**Browser-based contactless vital monitoring using rPPG technology.**

Scan your heart rate, stress level, HRV, and estimated blood pressure — all from your smartphone camera. No wearables needed.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 8, jsPDF, Lucide React |
| **Backend** | FastAPI, SQLAlchemy (SQLite), NumPy, SciPy |
| **rPPG Engine** | CHROM method + FFT + Butterworth bandpass filter |
| **Payments** | Razorpay (UPI/India) + Stripe (Cards/International) |
| **Reports** | ReportLab PDF generator |

---

## 📁 Project Structure

```
heart/
├── src/                    # React Frontend
│   ├── components/         # Navbar, Footer, VitalsCard, ConsentModal
│   ├── pages/              # Home, Scan, Results, Pricing, History
│   │   ├── Privacy.jsx     # Privacy Policy
│   │   ├── Terms.jsx       # Terms of Use
│   │   ├── DpdpaNotice.jsx # DPDPA 2023 Compliance
│   │   └── HelpCenter.jsx  # Help & FAQ
│   └── utils/api.js        # API client (Razorpay + Stripe)
├── backend/                # FastAPI Backend
│   ├── main.py             # App entry point
│   ├── config.py           # Environment config
│   ├── database.py         # SQLAlchemy models
│   ├── rppg_engine.py      # CHROM rPPG signal processing
│   ├── routes/
│   │   ├── scan.py         # Scan processing + history
│   │   ├── payment.py      # Razorpay + Stripe dual gateway
│   │   └── report.py       # PDF report generation
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment template
├── vercel.json             # Vercel deploy config
├── .gitignore              # Git ignore rules
└── package.json            # Node dependencies
```

---

## 🚀 Local Development

### Prerequisites
- Node.js 18+
- Python 3.10+

### 1. Frontend Setup
```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Copy environment template
copy .env.example .env     # Windows
# cp .env.example .env     # Mac/Linux

# Start API server (http://localhost:8000)
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Environment Variables

Edit `backend/.env` with your keys:

| Variable | Description | Get From |
|----------|-------------|----------|
| `RAZORPAY_KEY_ID` | Razorpay API Key | [dashboard.razorpay.com](https://dashboard.razorpay.com) |
| `RAZORPAY_KEY_SECRET` | Razorpay Secret | Same dashboard |
| `STRIPE_SECRET_KEY` | Stripe Secret Key | [dashboard.stripe.com](https://dashboard.stripe.com) |
| `STRIPE_PUBLISHABLE_KEY` | Stripe Public Key | Same dashboard |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook Secret | Stripe → Webhooks |
| `CORS_ORIGINS` | Allowed frontend URLs | Your deploy URL |
| `FRONTEND_URL` | Frontend URL for Stripe redirects | Your Vercel URL |

---

## 🌐 Production Deployment

### Frontend → Vercel
```bash
# 1. Push to GitHub
git init && git add . && git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/vantiquity-pulse.git
git push -u origin main

# 2. Go to vercel.com → Import GitHub repo
# 3. Set environment variable:
#    VITE_API_URL = https://your-backend-url.onrender.com
```

### Backend → Render
```bash
# 1. Go to render.com → New Web Service
# 2. Connect GitHub repo → Set root directory to "backend"
# 3. Build Command: pip install -r requirements.txt
# 4. Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
# 5. Add all environment variables from .env.example
# 6. Set CORS_ORIGINS to your Vercel frontend URL
# 7. Set FRONTEND_URL to your Vercel frontend URL
```

---

## 💳 Payment Gateways

| Gateway | Methods | Region | Status |
|---------|---------|--------|--------|
| **Razorpay** | UPI, Cards, NetBanking | India | ✅ Ready |
| **Stripe** | Cards, Google Pay, Apple Pay | International | ✅ Ready |

### Pricing
- **Free**: 1 scan (basic BPM)
- **Per-Scan**: ₹199 (detailed insights + PDF)
- **Pro**: ₹499/month (unlimited scans + DNA)

---

## 🔬 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `POST` | `/api/scan/process` | Process RGB signals → vitals |
| `GET` | `/api/scan/history?device_id=xxx` | User's scan history |
| `GET` | `/api/scan/{id}` | Single scan details |
| `GET` | `/api/scan/{id}/report` | Download PDF report |
| `POST` | `/api/payment/create-order` | Razorpay order |
| `POST` | `/api/payment/verify` | Razorpay verification |
| `POST` | `/api/payment/stripe/create-session` | Stripe checkout |
| `POST` | `/api/payment/stripe/webhook` | Stripe webhook |

Interactive docs: `http://localhost:8000/docs`

---

## 🔒 Privacy & Compliance

- **DPDPA 2023** compliant
- Camera frames processed **in-browser only** (never uploaded)
- Only RGB channel means sent to backend
- No facial recognition or biometric storage
- Contact: vantiquityai@gmail.com

---

## ⚠️ Disclaimer

VantiQuity Pulse is a **digital wellness tool**. It is NOT an FDA/CDSCO approved medical device. Do not use for clinical diagnosis or treatment.

---

© 2026 VantiQuity. All rights reserved.
