import React from 'react';
import { HiShieldCheck, HiHeart } from 'react-icons/hi2';

export default function Footer() {
    return (
        <footer style={{
            borderTop: '1px solid var(--glass-border)',
            padding: '60px 0',
            marginTop: '80px',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(12px)',
            position: 'relative',
            zIndex: 10
        }}>
            <div className="container flex-between" style={{ flexWrap: 'wrap', gap: '30px' }}>
                <div className="flex-center" style={{ gap: '10px' }}>
                    <HiShieldCheck color="var(--primary)" size={32} />
                    <span style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.5px' }}>VerityOS</span>
                </div>

                <div className="flex-center text-muted" style={{ gap: '8px', fontSize: '1rem', fontWeight: 500 }}>
                    Built with <HiHeart size={18} color="var(--primary)" style={{ fill: 'var(--primary)' }} /> for DataDreamz
                </div>

                <div className="footer-links flex-center" style={{ gap: '30px', fontSize: '0.95rem' }}>
                    <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600 }}>Privacy</a>
                    <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600 }}>Terms</a>
                    <a href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600 }}>API Docs</a>
                </div>
            </div>
        </footer>
    );
}
