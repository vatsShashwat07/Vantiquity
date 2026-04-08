import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <Heart size={20} fill="var(--accent)" stroke="var(--accent)" />
                            <span>VantiQuity<span className="text-accent">Pulse</span></span>
                        </div>
                        <p className="footer-desc">
                            Browser-based contactless vital monitoring using rPPG technology. Your heart health, simplified.
                        </p>
                    </div>

                    <div className="footer-col">
                        <h4>Product</h4>
                        <Link to="/scan">Heart Scan</Link>
                        <Link to="/pricing">Pricing</Link>
                        <Link to="/history">Scan History</Link>
                    </div>

                    <div className="footer-col">
                        <h4>Legal</h4>
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Use</Link>
                        <Link to="/dpdpa">DPDPA Notice</Link>
                    </div>

                    <div className="footer-col">
                        <h4>Support</h4>
                        <Link to="/help">Help Center</Link>
                        <a href="mailto:vantiquityai@gmail.com">Contact Us</a>
                        <Link to="/help">FAQ</Link>
                    </div>
                </div>

                <div className="footer-disclaimer">
                    <p>⚠️ VantiQuity Pulse is a digital wellness tool. It is NOT an FDA/CDSCO approved medical device. Do not use for clinical diagnosis or treatment. If you feel chest pain, call emergency services immediately.</p>
                </div>

                <div className="footer-bottom">
                    <p>© 2026 VantiQuity. All rights reserved. | <a href="mailto:vantiquityai@gmail.com" style={{ color: 'var(--accent)' }}>vantiquityai@gmail.com</a></p>
                </div>
            </div>
        </footer>
    )
}
