import { Link } from 'react-router-dom'
import { Shield, ArrowLeft } from 'lucide-react'
import './Legal.css'

export default function DpdpaNotice() {
    return (
        <div className="legal-page">
            <div className="container">
                <div className="legal-header animate-in">
                    <div className="legal-badge"><Shield size={14} /> DPDPA 2023</div>
                    <h1>DPDPA Notice</h1>
                    <p className="legal-updated">Digital Personal Data Protection Act 2023 Compliance Notice</p>
                </div>

                <div className="legal-content animate-in animate-delay-1">
                    <h2>Purpose of This Notice</h2>
                    <p>This notice is issued in compliance with the Digital Personal Data Protection Act, 2023 (DPDPA) enacted by the Government of India. It explains how VantiQuity Pulse processes your personal data, your rights as a Data Principal, and our obligations as a Data Fiduciary.</p>

                    <div className="legal-highlight">
                        <p>🇮🇳 <strong>Data Fiduciary:</strong> VantiQuity (registered in India) acts as the Data Fiduciary under DPDPA 2023 for all data processed through VantiQuity Pulse.</p>
                    </div>

                    <h2>Lawful Basis for Processing</h2>
                    <p>We process your personal data based on your <strong>explicit consent</strong>, obtained through the consent modal displayed before each scan. You may withdraw consent at any time.</p>
                    <h3>Data Processed:</h3>
                    <ul>
                        <li><strong>Health Data (Sensitive):</strong> Heart rate, HRV, stress level, estimated blood pressure — classified as sensitive personal data under DPDPA.</li>
                        <li><strong>Device Data:</strong> Anonymous device identifier (no PII association).</li>
                        <li><strong>Payment Data:</strong> Transaction records (processed by Razorpay as Data Processor).</li>
                    </ul>

                    <h2>Purpose Limitation</h2>
                    <p>Your data is processed solely for:</p>
                    <ol>
                        <li>Providing real-time health vitals via rPPG analysis</li>
                        <li>Generating downloadable health reports</li>
                        <li>Enabling scan history and trend tracking</li>
                        <li>Processing payments for premium features</li>
                    </ol>
                    <p>We do NOT use your data for advertising, profiling, or sale to third parties.</p>

                    <h2>Data Minimization</h2>
                    <ul>
                        <li>Camera frames are processed in-browser and never transmitted</li>
                        <li>Only aggregated RGB channel means are sent to the backend</li>
                        <li>No facial recognition or biometric identification is performed</li>
                        <li>No personally identifiable information is collected</li>
                    </ul>

                    <h2>Your Rights as Data Principal</h2>
                    <p>Under Section 11-14 of DPDPA 2023, you have the following rights:</p>
                    <ul>
                        <li><strong>Right to Access (Sec 11):</strong> Request a summary of your personal data being processed.</li>
                        <li><strong>Right to Correction (Sec 12):</strong> Request correction or completion of inaccurate data.</li>
                        <li><strong>Right to Erasure (Sec 12):</strong> Request deletion of your personal data.</li>
                        <li><strong>Right to Withdraw Consent (Sec 6):</strong> Withdraw your consent at any time; we will cease processing within 72 hours.</li>
                        <li><strong>Right to Grievance Redressal (Sec 13):</strong> Lodge a complaint with our Data Protection Officer or the Data Protection Board of India.</li>
                        <li><strong>Right to Nominate (Sec 14):</strong> Nominate another individual to exercise your rights in case of death or incapacity.</li>
                    </ul>

                    <h2>Data Breach Protocol</h2>
                    <p>In the event of a personal data breach, we will:</p>
                    <ol>
                        <li>Notify the Data Protection Board of India within 72 hours</li>
                        <li>Notify affected Data Principals as soon as reasonably possible</li>
                        <li>Take immediate remedial measures to contain the breach</li>
                        <li>Maintain a record of the breach and actions taken</li>
                    </ol>

                    <h2>Data Processor Information</h2>
                    <ul>
                        <li><strong>Razorpay Software Pvt. Ltd.</strong> — Payment processing via UPI, Indian cards, and NetBanking (processes payment data under contractual obligations with VantiQuity)</li>
                        <li><strong>Stripe, Inc.</strong> — International card payment processing (processes payment data under contractual obligations with VantiQuity)</li>
                    </ul>

                    <h2>Consent Withdrawal</h2>
                    <p>To withdraw consent or exercise any of your rights, you may:</p>
                    <ul>
                        <li>Email us at <a href="mailto:vantiquityai@gmail.com">vantiquityai@gmail.com</a> with subject "DPDPA Data Request"</li>
                        <li>Clear your browser localStorage (removes your device identifier)</li>
                    </ul>
                    <p>Upon withdrawal, we will delete all associated scan data within 72 hours.</p>

                    <h2>Grievance Officer</h2>
                    <p>📧 <strong>Email:</strong> <a href="mailto:vantiquityai@gmail.com">vantiquityai@gmail.com</a></p>
                    <p>📍 <strong>Organization:</strong> VantiQuity Core Team, India</p>
                    <p>We will acknowledge your grievance within 48 hours and resolve it within 30 days.</p>
                </div>

                <div className="legal-back">
                    <Link to="/" className="btn btn-secondary"><ArrowLeft size={18} /> Back to Home</Link>
                </div>
            </div>
        </div>
    )
}
