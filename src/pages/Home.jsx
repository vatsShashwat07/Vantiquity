import { Link } from 'react-router-dom'
import { Heart, Scan, ShieldCheck, Zap, Smartphone, Brain, Activity, ArrowRight } from 'lucide-react'
import './Home.css'

export default function Home() {
    return (
        <div className="home">
            {/* Hero */}
            <section className="hero">
                {/* Health Background Elements */}
                <div className="health-bg">
                    {/* ECG Waveform lines */}
                    <svg className="ecg-bg ecg-bg-1" viewBox="0 0 1200 100" preserveAspectRatio="none">
                        <path d="M0,50 L200,50 210,50 220,20 230,80 240,10 250,90 260,50 270,50 L500,50 510,50 520,20 530,80 540,10 550,90 560,50 570,50 L800,50 810,50 820,20 830,80 840,10 850,90 860,50 870,50 L1200,50" fill="none" stroke="var(--accent)" strokeWidth="1.5" opacity="0.08" />
                    </svg>
                    <svg className="ecg-bg ecg-bg-2" viewBox="0 0 1200 100" preserveAspectRatio="none">
                        <path d="M0,50 L300,50 310,50 320,25 330,75 340,15 350,85 360,50 370,50 L600,50 610,50 620,25 630,75 640,15 650,85 660,50 670,50 L1000,50 1010,50 1020,25 1030,75 1040,15 1050,85 1060,50 1070,50 L1200,50" fill="none" stroke="var(--accent)" strokeWidth="1.2" opacity="0.05" />
                    </svg>

                    {/* DNA Helix */}
                    <svg className="dna-helix" viewBox="0 0 60 400" fill="none">
                        <path d="M10,0 Q50,25 10,50 Q-30,75 10,100 Q50,125 10,150 Q-30,175 10,200 Q50,225 10,250 Q-30,275 10,300 Q50,325 10,350 Q-30,375 10,400" stroke="var(--accent)" strokeWidth="1.5" opacity="0.12" />
                        <path d="M50,0 Q10,25 50,50 Q90,75 50,100 Q10,125 50,150 Q90,175 50,200 Q10,225 50,250 Q90,275 50,300 Q10,325 50,350 Q90,375 50,400" stroke="var(--accent-light)" strokeWidth="1.5" opacity="0.1" />
                        {/* Connecting rungs */}
                        {[25, 75, 125, 175, 225, 275, 325, 375].map((y, i) => (
                            <line key={i} x1="15" y1={y} x2="45" y2={y} stroke="var(--accent)" strokeWidth="1" opacity="0.07" />
                        ))}
                    </svg>

                    {/* Floating health particles */}
                    <div className="health-particle particle-1">❤</div>
                    <div className="health-particle particle-2">🫀</div>
                    <div className="health-particle particle-3">🧬</div>
                    <div className="health-particle particle-4">🫁</div>
                    <div className="health-particle particle-5">🧠</div>
                    <div className="health-particle particle-6">💊</div>

                    {/* Pulse dots */}
                    <div className="pulse-dot dot-1"></div>
                    <div className="pulse-dot dot-2"></div>
                    <div className="pulse-dot dot-3"></div>
                    <div className="pulse-dot dot-4"></div>
                </div>

                <div className="container hero-inner">
                    <div className="hero-content animate-in">
                        <div className="hero-badge">
                            <Heart size={14} /> rPPG Technology
                        </div>
                        <h1>Your Heart Health<br /><span className="text-accent">In 60 Seconds</span></h1>
                        <p className="hero-desc">
                            Contactless vital monitoring powered by AI. No wearables. No clinic visits.
                            Just your smartphone camera and the science of remote photoplethysmography.
                        </p>
                        <div className="hero-actions">
                            <Link to="/scan" className="btn btn-primary btn-lg">
                                <Scan size={20} />
                                Quick Heart Scan
                            </Link>
                            <Link to="/pricing" className="btn btn-secondary btn-lg">
                                View Plans
                            </Link>
                        </div>
                        <div className="hero-trust">
                            <div className="hero-trust-item">
                                <ShieldCheck size={16} />
                                <span>DPDPA 2023 Compliant</span>
                            </div>
                            <div className="hero-trust-item">
                                <Zap size={16} />
                                <span>Results in 60s</span>
                            </div>
                            <div className="hero-trust-item">
                                <Heart size={16} />
                                <span>No VCF Needed</span>
                            </div>
                        </div>
                    </div>

                    <div className="hero-visual animate-in animate-delay-2">
                        <div className="hero-phone">
                            <div className="hero-phone-screen">
                                <div className="hero-pulse-ring"></div>
                                <Heart size={48} className="hero-heart-icon" />
                                <div className="hero-bpm">
                                    <span className="hero-bpm-value">72</span>
                                    <span className="hero-bpm-label">BPM</span>
                                </div>
                                <div className="hero-waveform">
                                    <svg viewBox="0 0 200 60" preserveAspectRatio="none">
                                        <path className="waveform-path" d="M0,30 Q10,30 15,30 T20,30 25,10 30,50 35,20 40,40 45,30 Q50,30 55,30 T60,30 65,30 70,10 75,50 80,20 85,40 90,30 Q95,30 100,30 T110,30 115,30 120,10 125,50 130,20 135,40 140,30 Q145,30 150,30 T160,30 165,30 170,10 175,50 180,20 185,40 190,30 200,30" fill="none" stroke="var(--accent)" strokeWidth="2" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="section features" id="features">
                {/* Body silhouette background */}
                <div className="body-bg-wrap">
                    <svg className="body-silhouette" viewBox="0 0 200 500" fill="none">
                        {/* Head */}
                        <circle cx="100" cy="40" r="28" stroke="var(--accent)" strokeWidth="0.8" opacity="0.08" />
                        {/* Neck */}
                        <line x1="100" y1="68" x2="100" y2="90" stroke="var(--accent)" strokeWidth="0.8" opacity="0.08" />
                        {/* Torso */}
                        <path d="M60,90 L60,250 Q60,280 80,290 L120,290 Q140,280 140,250 L140,90 Z" stroke="var(--accent)" strokeWidth="0.8" fill="none" opacity="0.06" />
                        {/* Arms */}
                        <path d="M60,100 L20,180 L10,250" stroke="var(--accent)" strokeWidth="0.8" opacity="0.06" />
                        <path d="M140,100 L180,180 L190,250" stroke="var(--accent)" strokeWidth="0.8" opacity="0.06" />
                        {/* Legs */}
                        <path d="M80,290 L70,400 L65,480" stroke="var(--accent)" strokeWidth="0.8" opacity="0.06" />
                        <path d="M120,290 L130,400 L135,480" stroke="var(--accent)" strokeWidth="0.8" opacity="0.06" />
                        {/* Heart glow */}
                        <circle cx="105" cy="155" r="12" fill="var(--accent)" opacity="0.06">
                            <animate attributeName="r" values="10;16;10" dur="2s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.06;0.12;0.06" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="105" cy="155" r="5" fill="var(--accent)" opacity="0.1" />
                        {/* Pulse points */}
                        <circle cx="20" cy="210" r="4" fill="var(--accent)" opacity="0.08">
                            <animate attributeName="opacity" values="0.05;0.15;0.05" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="100" cy="45" r="3" fill="var(--accent)" opacity="0.08">
                            <animate attributeName="opacity" values="0.05;0.15;0.05" dur="1.8s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="70" cy="380" r="3" fill="var(--accent)" opacity="0.06">
                            <animate attributeName="opacity" values="0.04;0.12;0.04" dur="2s" repeatCount="indefinite" />
                        </circle>
                    </svg>
                </div>

                <div className="container">
                    <h2 className="section-title">Why VantiQuity Pulse?</h2>
                    <p className="section-subtitle">
                        Cutting-edge rPPG technology meets beautiful design to give you actionable heart health insights.
                    </p>
                    <div className="features-grid">
                        {[
                            { icon: <Smartphone size={28} />, title: 'No Wearables', desc: 'Works with just your smartphone camera. No dongles, bands, or attachments needed.' },
                            { icon: <Brain size={28} />, title: 'AI-Powered Analysis', desc: 'Our rPPG engine detects micro-color changes in your skin to extract pulse wave data.' },
                            { icon: <ShieldCheck size={28} />, title: 'Privacy-First', desc: 'DPDPA 2023 compliant. Video frames processed in RAM only. Nothing ever leaves your device.' },
                            { icon: <Activity size={28} />, title: 'Clinical Accuracy', desc: 'Mean Absolute Error <3 BPM compared to clinical pulse oximeters.' },
                            { icon: <Zap size={28} />, title: '60-Second Scan', desc: 'Get your heart rate, stress level, and estimated blood pressure in under a minute.' },
                            { icon: <Heart size={28} />, title: 'Vitals Scorecard', desc: 'Beautiful, shareable health report with detailed insights and PDF download.' },
                        ].map((f, i) => (
                            <div className={`card feature-card animate-in animate-delay-${i % 4 + 1}`} key={i}>
                                <div className="feature-icon">{f.icon}</div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="section how-it-works">
                {/* ECG connector line */}
                <svg className="hiw-ecg-line" viewBox="0 0 1000 60" preserveAspectRatio="none">
                    <path d="M0,30 L150,30 160,30 170,5 180,55 190,15 200,45 210,30 220,30 L400,30 410,30 420,5 430,55 440,15 450,45 460,30 470,30 L650,30 660,30 670,5 680,55 690,15 700,45 710,30 720,30 L1000,30" fill="none" stroke="var(--accent)" strokeWidth="1.5" opacity="0.08" />
                </svg>

                <div className="container">
                    <h2 className="section-title">How It Works</h2>
                    <p className="section-subtitle">Three simple steps to check your heart health</p>

                    <div className="steps-grid">
                        <div className="step-card animate-in animate-delay-1">
                            <div className="step-number">1</div>
                            <div className="step-icon-wrap">
                                <Smartphone size={32} />
                            </div>
                            <h3>Open Your Camera</h3>
                            <p>Tap "Quick Heart Scan" and grant camera access. We'll guide your face positioning.</p>
                        </div>

                        <div className="step-arrow">
                            <ArrowRight size={24} />
                        </div>

                        <div className="step-card animate-in animate-delay-2">
                            <div className="step-number">2</div>
                            <div className="step-icon-wrap">
                                <Scan size={32} />
                            </div>
                            <h3>60-Second Scan</h3>
                            <p>Hold still for 60 seconds. Our AI extracts your pulse wave from micro skin-color changes.</p>
                        </div>

                        <div className="step-arrow">
                            <ArrowRight size={24} />
                        </div>

                        <div className="step-card animate-in animate-delay-3">
                            <div className="step-number">3</div>
                            <div className="step-icon-wrap">
                                <Activity size={32} />
                            </div>
                            <h3>Get Your Results</h3>
                            <p>View your Vitals Scorecard — Heart Rate, Stress Level, and Estimated Blood Pressure.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section cta-section">
                <div className="container">
                    <div className="cta-card">
                        {/* CTA heartbeat bg */}
                        <svg className="cta-ecg" viewBox="0 0 600 80" preserveAspectRatio="none">
                            <path d="M0,40 L100,40 110,40 120,10 130,70 140,5 150,75 160,40 170,40 L300,40 310,40 320,10 330,70 340,5 350,75 360,40 370,40 L500,40 510,40 520,10 530,70 540,5 550,75 560,40 600,40" fill="none" stroke="white" strokeWidth="1.5" opacity="0.06" />
                        </svg>
                        <h2>Ready to Check Your Heart?</h2>
                        <p>Your first scan is completely free. No signup required.</p>
                        <Link to="/scan" className="btn btn-primary btn-lg">
                            <Heart size={20} />
                            Start Free Scan
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
