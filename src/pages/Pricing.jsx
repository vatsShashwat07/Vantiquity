import { Link } from 'react-router-dom'
import { Check, Heart, Scan, Star, Dna, BarChart3, Shield, Zap } from 'lucide-react'
import './Pricing.css'

const plans = [
    {
        id: 'free',
        name: 'Free Scan',
        price: '₹0',
        period: 'one-time',
        desc: 'Try your first heart scan for free. No signup needed.',
        features: [
            '1 Free Heart Scan',
            'Basic BPM Reading',
            'Signal Quality Feedback',
            'Privacy-Safe Processing',
        ],
        cta: 'Start Free Scan',
        ctaLink: '/scan',
        highlight: false,
    },
    {
        id: 'scan',
        name: 'Pay-per-Scan',
        price: '₹199',
        priceUsd: '$2.50',
        period: 'per scan',
        desc: 'Full vitals scorecard with detailed insights for each scan.',
        features: [
            'Full Vitals Scorecard',
            'Heart Rate + HRV Analysis',
            'Estimated Blood Pressure',
            'PDF Report Download',
            'Shareable Results Card',
            'Detailed Health Insights',
        ],
        cta: 'Buy a Scan',
        ctaLink: '/scan',
        highlight: true,
        badge: 'Most Popular',
    },
    {
        id: 'pro',
        name: 'VantiQuity Pro',
        price: '₹499',
        period: '/month',
        desc: 'Weekly tracking + DNA Ancestry analysis included yearly.',
        features: [
            'Unlimited Heart Scans',
            'Weekly Vitals Tracking',
            'Stress Trend Dashboard',
            'Personalized Recommendations',
            '1x DNA Ancestry Analysis/Year',
            'Priority Support',
            'Genetic Risk Correlations',
        ],
        cta: 'Subscribe to Pro',
        ctaLink: '/scan',
        highlight: false,
        badge: 'Best Value',
    },
]

export default function Pricing() {
    return (
        <div className="pricing-page">
            <div className="container">
                {/* Header */}
                <div className="pricing-header animate-in">
                    <div className="pricing-badge">
                        <Star size={14} /> Pricing Plans
                    </div>
                    <h1>Choose Your Health Plan</h1>
                    <p className="pricing-subtitle">Start free. Upgrade when you're ready for deeper insights.</p>
                </div>

                {/* Plans Grid */}
                <div className="plans-grid">
                    {plans.map((plan, i) => (
                        <div className={`plan-card ${plan.highlight ? 'highlighted' : ''} animate-in animate-delay-${i + 1}`} key={plan.id}>
                            {plan.badge && (
                                <div className="plan-badge">{plan.badge}</div>
                            )}
                            <div className="plan-header">
                                <h3>{plan.name}</h3>
                                <div className="plan-price">
                                    <span className="price-value">{plan.price}</span>
                                    <span className="price-period">{plan.period}</span>
                                </div>
                                {plan.priceUsd && (
                                    <span className="price-usd">{plan.priceUsd} USD</span>
                                )}
                                <p className="plan-desc">{plan.desc}</p>
                            </div>

                            <ul className="plan-features">
                                {plan.features.map((f, j) => (
                                    <li key={j}>
                                        <Check size={16} className="check-icon" />
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <Link to={plan.ctaLink} className={`btn ${plan.highlight ? 'btn-primary' : 'btn-secondary'} plan-cta`}>
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>

                {/* DNA Info Banner */}
                <div className="b2b-section animate-in">
                    <div className="b2b-card">
                        <div className="b2b-content">
                            <div className="b2b-icon">
                                <Dna size={28} />
                            </div>
                            <div>
                                <h3>Interested in DNA Analysis?</h3>
                                <p>For DNA information, genetic ancestry analysis, and health predisposition reports, visit our main platform.</p>
                            </div>
                        </div>
                        <div className="b2b-offer">
                            <a href="https://vantiquity.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                Visit VantiQuity.com →
                            </a>
                        </div>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="trust-section animate-in">
                    <div className="trust-grid">
                        <div className="trust-item">
                            <Shield size={24} />
                            <div>
                                <strong>DPDPA 2023 Compliant</strong>
                                <p>Your data never leaves your device</p>
                            </div>
                        </div>
                        <div className="trust-item">
                            <Zap size={24} />
                            <div>
                                <strong>Instant Results</strong>
                                <p>Get vitals in under 60 seconds</p>
                            </div>
                        </div>
                        <div className="trust-item">
                            <BarChart3 size={24} />
                            <div>
                                <strong>Clinical Accuracy</strong>
                                <p>MAE &lt;3 BPM vs pulse oximeters</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
