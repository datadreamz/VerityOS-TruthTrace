import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiHome, HiMagnifyingGlass, HiDocumentText, HiClock, HiArrowRightOnRectangle, HiSun, HiMoon } from 'react-icons/hi2';
import './Navbar.css';

const links = [
    { to: '/dashboard', label: 'Home', icon: HiHome },
    { to: '/analyze', label: 'Analyze', icon: HiMagnifyingGlass },
    { to: '/reports', label: 'Reports', icon: HiDocumentText },
    { to: '/history', label: 'History', icon: HiClock },
];

export default function Navbar({ onLogout, theme, toggleTheme, hideLinks }) {
    const location = useLocation();

    return (
        <nav className="navbar glass-card">
            <div className="navbar-inner">
                <div className="navbar-brand">
                    <span className="brand-icon">✓</span>
                    <span className="brand-text">VerityOS</span>
                </div>

                {!hideLinks && (
                    <div className="navbar-links">
                        {links.map((link) => {
                            const isActive = location.pathname === link.to;
                            const Icon = link.icon;
                            return (
                                <NavLink key={link.to} to={link.to} className="nav-link-wrapper">
                                    {isActive && (
                                        <motion.div
                                            className="nav-active-bg"
                                            layoutId="activeTab"
                                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                    <span className={`nav-link ${isActive ? 'active' : ''}`}>
                                        <Icon size={16} />
                                        {link.label}
                                    </span>
                                </NavLink>
                            );
                        })}
                    </div>
                )}

                <div className="navbar-actions">
                    <button className="nav-theme-toggle" onClick={toggleTheme} title="Toggle Theme">
                        {theme === 'dark' ? <HiSun size={20} /> : <HiMoon size={20} />}
                    </button>
                    <button className="nav-logout" onClick={onLogout} title="Logout">
                        <HiArrowRightOnRectangle size={20} />
                    </button>
                </div>
            </div>
        </nav>
    );
}
