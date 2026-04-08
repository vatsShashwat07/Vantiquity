import { Link } from 'react-router-dom'
import { FileText, ArrowLeft } from 'lucide-react'
import './Legal.css'

export default function Terms() {
    return (
        <div className="legal-page">
            <div className="container">
                <div className="legal-header animate-in">
                    <div className="legal-badge"><FileText size={14} /> Terms of Use</div>
                    <h1>Terms of Use</h1>
                    <p className="legal-updated">Last Updated: April 7, 2026</p>
                </div>

                <div className="legal-content animate-in animate-delay-1">
                    <h2>1. Acceptance of Terms</h2>
                    <p>By accessing or using VantiQuity Pulse ("the Service"), you agree to be bound by these Terms of Use. If you do not agree, please do not use the Service.</p>

                    <h2>2. Service Description</h2>
                    <p>VantiQuity Pulse is a browser-based wellness tool that uses remote Photoplethysmography (rPPG) technology to estimate heart health vitals including heart rate, heart rate variability, stress level, and estimated blood pressure from your smartphone camera feed.</p>

                    <div className="legal-highlight">
                        <p>⚠️ <strong>Medical Disclaimer:</strong> VantiQuity Pulse is NOT a medical device. It is NOT approved by the FDA, CDSCO, or any medical regulatory body. It must NOT be used for clinical diagnosis, treatment, or monitoring of any medical condition.</p>
                    </div>

                    <h2>3. Eligibility</h2>
                    <ul>
                        <li>You must be at least 18 years old to use VantiQuity Pulse.</li>
                        <li>You must provide valid consent for camera access.</li>
                        <li>You must not use the service if you have photosensitive epilepsy or any condition triggered by screen light.</li>
                    </ul>

                    <h2>4. Acceptable Use</h2>
                    <p>You agree to use VantiQuity Pulse only for personal wellness purposes. You must NOT:</p>
                    <ul>
                        <li>Use results as a substitute for professional medical advice</li>
                        <li>Attempt to reverse-engineer, decompile, or extract source code from the rPPG engine</li>
                        <li>Use automated tools, bots, or scrapers to access the Service</li>
                        <li>Share manipulated or fraudulent scan results</li>
                        <li>Resell or redistribute access to the Service without authorization</li>
                    </ul>

                    <h2>5. Free & Paid Tiers</h2>
                    <h3>5.1 Free Tier</h3>
                    <p>Your first scan is completely free with basic vitals (BPM, Stress Level, Estimated BP). No signup required.</p>
                    <h3>5.2 Paid Features</h3>
                    <ul>
                        <li><strong>Scan Unlock (₹199):</strong> Detailed insights for a single scan — PDF report, weekly trend tracking, and health recommendations.</li>
                        <li><strong>Pro Plan (₹499/month):</strong> Unlimited scans, detailed insights, genetic risk correlation (with DNA upload), and priority support.</li>
                    </ul>

                    <h2>6. Payments & Refunds</h2>
                    <ul>
                        <li>All payments are processed securely through <strong>Razorpay</strong> (UPI, Indian cards, NetBanking) or <strong>Stripe</strong> (international cards, Google Pay, Apple Pay).</li>
                        <li>Prices are in Indian Rupees (INR) and include applicable taxes.</li>
                        <li>Refund requests may be made within 7 days of purchase by emailing <a href="mailto:vantiquityai@gmail.com">vantiquityai@gmail.com</a>.</li>
                        <li>Pro subscriptions can be cancelled at any time; access continues until the end of the billing period.</li>
                    </ul>

                    <h2>7. Accuracy & Limitations</h2>
                    <p>While VantiQuity Pulse strives for high accuracy (MAE &lt; 3 BPM in controlled conditions), results may be affected by:</p>
                    <ul>
                        <li>Poor lighting conditions</li>
                        <li>Excessive movement during scan</li>
                        <li>Device camera quality</li>
                        <li>Skin tone and makeup</li>
                        <li>Medical conditions affecting skin perfusion</li>
                    </ul>
                    <p>We provide a "Signal Quality" indicator to help you assess result reliability.</p>

                    <h2>8. Intellectual Property</h2>
                    <p>All content, algorithms, designs, and trademarks associated with VantiQuity Pulse are owned by VantiQuity. You may not reproduce, distribute, or create derivative works without prior written consent.</p>

                    <h2>9. Limitation of Liability</h2>
                    <p>To the maximum extent permitted by applicable law, VantiQuity shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. Our total liability shall not exceed the amount you paid to us in the 12 months preceding the claim.</p>

                    <h2>10. Governing Law</h2>
                    <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.</p>

                    <h2>11. Changes to Terms</h2>
                    <p>We reserve the right to modify these Terms at any time. Continued use after changes constitutes acceptance. Material changes will be notified via the Service.</p>

                    <h2>12. Contact</h2>
                    <p>📧 <strong>Email:</strong> <a href="mailto:vantiquityai@gmail.com">vantiquityai@gmail.com</a></p>
                </div>

                <div className="legal-back">
                    <Link to="/" className="btn btn-secondary"><ArrowLeft size={18} /> Back to Home</Link>
                </div>
            </div>
        </div>
    )
}
