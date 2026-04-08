import { Link } from 'react-router-dom'
import { HelpCircle, Heart, Camera, CreditCard, FileText, ShieldCheck, Mail, ArrowLeft, MessageCircle, ChevronRight } from 'lucide-react'
import './Legal.css'

export default function HelpCenter() {
    return (
        <div className="legal-page">
            <div className="container">
                <div className="legal-header animate-in">
                    <div className="legal-badge"><HelpCircle size={14} /> Help Center</div>
                    <h1>Help Center</h1>
                    <p className="legal-updated">Everything you need to know about VantiQuity Pulse</p>
                </div>

                {/* Quick Actions */}
                <div className="help-grid animate-in animate-delay-1">
                    <div className="help-card">
                        <div className="help-card-icon"><Camera size={22} /></div>
                        <h3>How to Take a Scan</h3>
                        <p>Tap "Quick Heart Scan", allow camera access, position your face in the oval guide, and hold still for 60 seconds. Ensure good lighting and minimal movement.</p>
                    </div>
                    <div className="help-card">
                        <div className="help-card-icon"><Heart size={22} /></div>
                        <h3>Understanding Your Results</h3>
                        <p><strong>BPM:</strong> Normal is 60-100. <strong>Stress:</strong> Based on HRV (higher = calmer). <strong>BP:</strong> Normal is below 120/80 mmHg. Results are estimates, not clinical measurements.</p>
                    </div>
                    <div className="help-card">
                        <div className="help-card-icon"><CreditCard size={22} /></div>
                        <h3>Payment & Pricing</h3>
                        <p>First scan is free. Unlock detailed insights for ₹199/scan or get unlimited with Pro at ₹499/month. All payments via Razorpay (UPI, Cards, NetBanking).</p>
                    </div>
                    <div className="help-card">
                        <div className="help-card-icon"><FileText size={22} /></div>
                        <h3>PDF Reports</h3>
                        <p>Download your branded vitals report from the Results page. It includes BPM, stress level, blood pressure, signal quality, and medical disclaimer.</p>
                    </div>
                    <div className="help-card">
                        <div className="help-card-icon"><ShieldCheck size={22} /></div>
                        <h3>Privacy & Data</h3>
                        <p>Your camera feed is processed in-browser only. We never store video. Only computed vitals are saved. DPDPA 2023 compliant. <Link to="/privacy">Read full policy →</Link></p>
                    </div>
                    <div className="help-card">
                        <div className="help-card-icon"><MessageCircle size={22} /></div>
                        <h3>Refund Policy</h3>
                        <p>Request a refund within 7 days of purchase by emailing us. Pro subscriptions can be cancelled anytime — access continues until billing period ends.</p>
                    </div>
                </div>

                {/* FAQ */}
                <div className="legal-content animate-in animate-delay-2">
                    <h2>Frequently Asked Questions</h2>

                    <div className="faq-item">
                        <div className="faq-q"><ChevronRight size={18} /> Is VantiQuity Pulse a medical device?</div>
                        <p className="faq-a">No. VantiQuity Pulse is a digital wellness tool for informational purposes only. It is NOT approved by the FDA, CDSCO, or any regulatory body. Do not use it for clinical diagnosis. Always consult a doctor for medical concerns.</p>
                    </div>

                    <div className="faq-item">
                        <div className="faq-q"><ChevronRight size={18} /> How accurate is the heart rate measurement?</div>
                        <p className="faq-a">In controlled conditions (good lighting, steady position), our CHROM rPPG engine achieves a Mean Absolute Error (MAE) of less than 3 BPM compared to clinical pulse oximeters. Accuracy depends on lighting, camera quality, and movement.</p>
                    </div>

                    <div className="faq-item">
                        <div className="faq-q"><ChevronRight size={18} /> Does my face video get uploaded to your servers?</div>
                        <p className="faq-a">Absolutely not. Your camera feed is processed frame-by-frame entirely inside your browser. Only the averaged RGB color values (numbers, not images) from the forehead region are sent to our server for signal analysis.</p>
                    </div>

                    <div className="faq-item">
                        <div className="faq-q"><ChevronRight size={18} /> Why do I need to hold still for 60 seconds?</div>
                        <p className="faq-a">The rPPG algorithm needs enough data points to perform accurate Fourier Transform (FFT) analysis. 60 seconds at 30fps gives us ~1800 samples — enough to reliably detect your pulse frequency while filtering out noise.</p>
                    </div>

                    <div className="faq-item">
                        <div className="faq-q"><ChevronRight size={18} /> What does "Signal Quality" mean?</div>
                        <p className="faq-a"><strong>Excellent:</strong> Strong pulse signal, high confidence. <strong>Good:</strong> Reliable results with minor noise. <strong>Poor:</strong> Results may be less accurate — try improving lighting and staying still.</p>
                    </div>

                    <div className="faq-item">
                        <div className="faq-q"><ChevronRight size={18} /> Can I get a refund?</div>
                        <p className="faq-a">Yes. Contact us within 7 days of purchase at <a href="mailto:vantiquityai@gmail.com">vantiquityai@gmail.com</a> with your payment details. Refunds are processed within 5-7 business days.</p>
                    </div>

                    <div className="faq-item">
                        <div className="faq-q"><ChevronRight size={18} /> How do I delete my data?</div>
                        <p className="faq-a">Email us at <a href="mailto:vantiquityai@gmail.com">vantiquityai@gmail.com</a> with subject "Delete My Data". We'll erase all your scan records within 72 hours as required by DPDPA 2023. You can also clear your browser localStorage to remove your device identifier.</p>
                    </div>
                </div>

                {/* Contact Support */}
                <div className="help-contact-box animate-in animate-delay-3">
                    <h2>Still Need Help?</h2>
                    <p>Our support team is here for you. Reach us anytime.</p>
                    <div className="help-email">
                        <Mail size={22} />
                        <a href="mailto:vantiquityai@gmail.com">vantiquityai@gmail.com</a>
                    </div>
                    <p>We typically respond within 24 hours.</p>
                    <Link to="/" className="btn btn-primary">
                        <ArrowLeft size={18} /> Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
