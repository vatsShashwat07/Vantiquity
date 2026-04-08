import './ConsentModal.css'
import { Shield, Camera, Trash2 } from 'lucide-react'

export default function ConsentModal({ onAccept, onDecline }) {
    return (
        <div className="consent-overlay">
            <div className="consent-modal">
                <div className="consent-icon">
                    <Shield size={32} />
                </div>
                <h2>Privacy Consent Required</h2>
                <p className="consent-subtitle">DPDPA 2023 Compliance</p>

                <div className="consent-body">
                    <div className="consent-item">
                        <Camera size={20} />
                        <div>
                            <strong>Camera Access</strong>
                            <p>VantiQuity will use your front-facing camera for 60 seconds to measure your vitals via rPPG technology.</p>
                        </div>
                    </div>
                    <div className="consent-item">
                        <Trash2 size={20} />
                        <div>
                            <strong>No Video Stored</strong>
                            <p>All video frames are processed in real-time in your browser's memory (RAM). No facial recording is saved on VantiQuity servers — ever.</p>
                        </div>
                    </div>
                </div>

                <div className="consent-legal">
                    <p>By clicking "I Agree", you consent to the temporary processing of your camera feed solely for the purpose of measuring your heart rate, HRV, and estimated blood pressure. This data is processed locally and is not transmitted to any server.</p>
                </div>

                <div className="consent-actions">
                    <button className="btn btn-secondary" onClick={onDecline}>
                        Decline
                    </button>
                    <button className="btn btn-primary" onClick={onAccept}>
                        I Agree — Start Scan
                    </button>
                </div>
            </div>
        </div>
    )
}
