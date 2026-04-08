import './VitalsCard.css'

export default function VitalsCard({ icon, label, value, unit, status, statusColor, children }) {
    return (
        <div className="vitals-card">
            <div className="vitals-card-header">
                <div className={`vitals-card-icon ${statusColor || ''}`}>
                    {icon}
                </div>
                <span className="vitals-card-label">{label}</span>
            </div>
            <div className="vitals-card-value">
                <span className="vitals-value-number">{value}</span>
                {unit && <span className="vitals-value-unit">{unit}</span>}
            </div>
            {status && (
                <div className={`vitals-card-status ${statusColor || ''}`}>
                    {status}
                </div>
            )}
            {children}
        </div>
    )
}
