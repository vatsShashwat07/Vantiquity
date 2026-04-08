import { Link } from 'react-router-dom'
import { ShieldCheck, ArrowLeft } from 'lucide-react'
import './Legal.css'

export default function Privacy() {
    return (
        <div className="legal-page">
            <div className="container">
                <div className="legal-header animate-in">
                    <div className="legal-badge"><ShieldCheck size={14} /> Privacy Policy</div>
                    <h1>Privacy Policy</h1>
                    <p className="legal-updated">Last Updated: April 7, 2026</p>
                </div>

                <div className="legal-content animate-in animate-delay-1">
                    <h2>1. Introduction</h2>
                    <p>VantiQuity Pulse ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our browser-based heart health monitoring service.</p>

                    <div className="legal-highlight">
                        <p>🔒 <strong>Privacy by Design:</strong> VantiQuity Pulse processes your facial video data entirely in your browser's RAM. We never store, upload, or transmit video frames to our servers.</p>
                    </div>

                    <h2>2. Information We Collect</h2>
                    <h3>2.1 Data You Provide</h3>
                    <ul>
                        <li><strong>Device Identifier:</strong> An anonymous, randomly generated ID stored in your browser's localStorage to identify returning users.</li>
                        <li><strong>Payment Information:</strong> Processed securely by Razorpay. We do not store your card/UPI details.</li>
                    </ul>

                    <h3>2.2 Data We Generate</h3>
                    <ul>
                        <li><strong>Vital Signs:</strong> Heart rate (BPM), Heart Rate Variability (HRV), estimated blood pressure, stress level, and signal quality — derived from the rPPG analysis.</li>
                        <li><strong>Scan Metadata:</strong> Timestamp, scan duration, frames per second, and signal confidence score.</li>
                    </ul>

                    <h3>2.3 Data We Do NOT Collect</h3>
                    <ul>
                        <li>❌ Facial images or video recordings</li>
                        <li>❌ Personally identifiable information (name, email, phone)</li>
                        <li>❌ Location data</li>
                        <li>❌ Contacts or call logs</li>
                        <li>❌ Biometric templates (we extract only color channel means, not facial geometry)</li>
                    </ul>

                    <h2>3. How We Use Your Data</h2>
                    <ul>
                        <li>To compute and display your vitals scorecard</li>
                        <li>To generate downloadable PDF health reports</li>
                        <li>To show your scan history and health trends</li>
                        <li>To process payments for premium features</li>
                        <li>To improve our rPPG signal processing algorithms (aggregated, anonymized data only)</li>
                    </ul>

                    <h2>4. Data Processing & Security</h2>
                    <p><strong>Camera Processing:</strong> Your smartphone camera feed is processed frame-by-frame in your browser. Only the average Red, Green, and Blue color values from the forehead ROI (Region of Interest) are extracted. No facial recognition is performed.</p>
                    <p><strong>Backend Processing:</strong> The RGB signal arrays are sent to our secure backend for rPPG analysis using the CHROM method with FFT and bandpass filtering. The computed vitals are stored in an encrypted database.</p>
                    <p><strong>Data Retention:</strong> Scan results are retained for 12 months to enable trend tracking. You may request deletion at any time by contacting us.</p>

                    <h2>5. Third-Party Services</h2>
                    <ul>
                        <li><strong>Razorpay:</strong> Payment processing for UPI and Indian cards (governed by <a href="https://razorpay.com/privacy/" target="_blank" rel="noopener noreferrer">Razorpay's Privacy Policy</a>)</li>
                        <li><strong>Stripe:</strong> International card payment processing (governed by <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Stripe's Privacy Policy</a>)</li>
                    </ul>

                    <h2>6. Your Rights (DPDPA 2023)</h2>
                    <p>Under the Digital Personal Data Protection Act 2023 (India), you have the right to:</p>
                    <ul>
                        <li>Access your personal data</li>
                        <li>Request correction of inaccurate data</li>
                        <li>Request erasure of your data</li>
                        <li>Withdraw consent at any time</li>
                        <li>Nominate another person to exercise your rights</li>
                        <li>Lodge a grievance with the Data Protection Board of India</li>
                    </ul>

                    <h2>7. Children's Privacy</h2>
                    <p>VantiQuity Pulse is not intended for individuals under 18 years of age. We do not knowingly collect data from minors. If you are a parent and believe your child has used our service, please contact us for data deletion.</p>

                    <h2>8. Changes to This Policy</h2>
                    <p>We may update this Privacy Policy periodically. Changes will be posted on this page with the updated date. Your continued use constitutes acceptance of the revised policy.</p>

                    <h2>9. Contact Us</h2>
                    <p>For any privacy-related inquiries, data access requests, or complaints:</p>
                    <p>📧 <strong>Email:</strong> <a href="mailto:vantiquityai@gmail.com">vantiquityai@gmail.com</a></p>
                    <p>🏢 <strong>Data Protection Officer:</strong> VantiQuity Core Team</p>
                </div>

                <div className="legal-back">
                    <Link to="/" className="btn btn-secondary"><ArrowLeft size={18} /> Back to Home</Link>
                </div>
            </div>
        </div>
    )
}
