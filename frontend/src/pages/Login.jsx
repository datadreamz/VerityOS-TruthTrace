import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiEnvelope, HiLockClosed, HiEye, HiEyeSlash } from 'react-icons/hi2';
import './Login.css';

export default function Login({ onLogin, minimal = false }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            onLogin();
        }, 800);
    };

    return (
        <div className={minimal ? 'login-minimal' : 'login-page'}>
            {!minimal && (
                <div className="login-left">
                    <motion.div
                        className="login-hero"
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="hero-illustration">
                            <div className="hero-grid">
                                {Array.from({ length: 9 }).map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="hero-node"
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }}
                                        transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                                    />
                                ))}
                            </div>
                            <div className="hero-connections">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="hero-line"
                                        style={{ '--angle': `${i * 60}deg` }}
                                        animate={{ opacity: [0.1, 0.5, 0.1] }}
                                        transition={{ duration: 3 + i * 0.5, repeat: Infinity }}
                                    />
                                ))}
                            </div>
                        </div>
                        <h2 className="hero-tagline">
                            <span className="gradient-text">Truth, verified by intelligence.</span>
                        </h2>
                        <p className="hero-sub">Multi-layer AI detection for news, images, and media credibility.</p>
                    </motion.div>
                </div>
            )}

            <div className={minimal ? 'login-center' : 'login-right'}>
                <motion.div
                    className="login-card glass-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {!minimal && (
                        <div className="login-brand">
                            <span className="brand-icon-lg">✓</span>
                            <h1>VerityOS</h1>
                        </div>
                    )}
                    <h2 className="login-title">{minimal ? 'Ready to Start?' : 'Welcome back'}</h2>
                    <p className="login-subtitle">{minimal ? 'Sign in to access the full analysis suite' : 'Sign in to continue your analysis'}</p>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="input-group">
                            <HiEnvelope className="input-icon" />
                            <input
                                type="email"
                                className="input-field"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <HiLockClosed className="input-icon" />
                            <input
                                type={showPw ? 'text' : 'password'}
                                className="input-field"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="pw-toggle"
                                onClick={() => setShowPw(!showPw)}
                            >
                                {showPw ? <HiEyeSlash size={18} /> : <HiEye size={18} />}
                            </button>
                        </div>

                        <button type="submit" className="btn-primary login-btn" disabled={loading}>
                            {loading ? (
                                <span className="btn-spinner" />
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="login-divider"><span>or</span></div>

                    <button className="btn-secondary google-btn" onClick={onLogin}>
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" width={18} />
                        Continue with Google
                    </button>

                    <p className="login-footer">
                        Don't have an account? <button className="link-btn" onClick={onLogin}>Sign up</button>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

