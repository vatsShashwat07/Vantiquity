import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Activity, Clock, ChevronRight, BarChart3 } from 'lucide-react'
import { getScanHistory } from '../utils/api'
import './History.css'

export default function History() {
    const [scans, setScans] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getScanHistory()
                setScans(data.scans || [])
            } catch (e) {
                setError('Could not load scan history. Make sure the backend is running.')
            } finally {
                setLoading(false)
            }
        }
        fetchHistory()
    }, [])

    const getStressColor = (level) => {
        if (level === 'Low') return 'green'
        if (level === 'Moderate') return 'orange'
        return 'red'
    }

    return (
        <div className="history-page">
            <div className="container">
                <div className="history-header animate-in">
                    <div className="history-badge">
                        <BarChart3 size={14} /> Scan History
                    </div>
                    <h1>Your Health Timeline</h1>
                    <p className="history-subtitle">Track your vitals over time</p>
                </div>

                {loading && (
                    <div className="history-loading">
                        <div className="spinner"></div>
                        <p>Loading your scan history...</p>
                    </div>
                )}

                {error && (
                    <div className="history-empty">
                        <Activity size={48} />
                        <h3>Unable to Load History</h3>
                        <p>{error}</p>
                        <Link to="/scan" className="btn btn-primary">
                            <Heart size={18} /> Start a New Scan
                        </Link>
                    </div>
                )}

                {!loading && !error && scans.length === 0 && (
                    <div className="history-empty">
                        <Heart size={48} />
                        <h3>No Scans Yet</h3>
                        <p>Take your first heart scan to start tracking your health.</p>
                        <Link to="/scan" className="btn btn-primary">
                            <Heart size={18} /> Start Your First Scan
                        </Link>
                    </div>
                )}

                {!loading && scans.length > 0 && (
                    <div className="history-list">
                        {scans.map((scan, i) => (
                            <div className={`history-item animate-in animate-delay-${Math.min(i + 1, 4)}`} key={scan.id}>
                                <div className="history-item-date">
                                    <Clock size={14} />
                                    {new Date(scan.created_at).toLocaleDateString('en-IN', {
                                        day: 'numeric', month: 'short', year: 'numeric',
                                        hour: '2-digit', minute: '2-digit'
                                    })}
                                </div>
                                <div className="history-item-vitals">
                                    <div className="history-vital">
                                        <span className="history-vital-label">BPM</span>
                                        <span className="history-vital-value">{scan.bpm}</span>
                                    </div>
                                    <div className="history-vital">
                                        <span className="history-vital-label">Stress</span>
                                        <span className={`history-vital-value ${getStressColor(scan.stress_level)}`}>{scan.stress_level}</span>
                                    </div>
                                    <div className="history-vital">
                                        <span className="history-vital-label">BP</span>
                                        <span className="history-vital-value">{scan.systolic}/{scan.diastolic}</span>
                                    </div>
                                    <div className="history-vital">
                                        <span className="history-vital-label">Quality</span>
                                        <span className="history-vital-value">{scan.signal_quality}</span>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="history-item-arrow" />
                            </div>
                        ))}
                    </div>
                )}

                <div className="history-actions">
                    <Link to="/scan" className="btn btn-primary">
                        <Heart size={18} /> New Scan
                    </Link>
                    <Link to="/" className="btn btn-secondary">
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
