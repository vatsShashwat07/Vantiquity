import { Link, useLocation } from 'react-router-dom'
import { Heart, Menu, X, Sun, Moon } from 'lucide-react'
import { useState, useEffect } from 'react'
import './Navbar.css'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const location = useLocation()

    // Theme toggle
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('vp_theme')
        if (saved) return saved === 'dark'
        return window.matchMedia('(prefers-color-scheme: dark)').matches
    })

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
        localStorage.setItem('vp_theme', isDark ? 'dark' : 'light')
    }, [isDark])

    const toggleTheme = () => setIsDark(prev => !prev)

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/scan', label: 'Heart Scan' },
        { path: '/pricing', label: 'Pricing' },
    ]

    return (
        <nav className="navbar">
            <div className="container navbar-inner">
                <Link to="/" className="navbar-brand">
                    <div className="navbar-logo">
                        <Heart size={24} fill="var(--accent)" stroke="var(--accent)" />
                    </div>
                    <span className="navbar-title">VantiQuity<span className="navbar-title-accent">Pulse</span></span>
                </Link>

                <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
                            onClick={() => setIsOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link to="/scan" className="btn btn-primary btn-sm" onClick={() => setIsOpen(false)}>
                        Quick Scan
                    </Link>
                </div>

                <div className="navbar-actions">
                    {/* Theme Toggle */}
                    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme" title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                        <div className={`toggle-track ${isDark ? 'dark' : 'light'}`}>
                            <Sun size={14} className="toggle-sun" />
                            <Moon size={14} className="toggle-moon" />
                            <div className="toggle-thumb"></div>
                        </div>
                    </button>

                    <button className="navbar-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
        </nav>
    )
}
