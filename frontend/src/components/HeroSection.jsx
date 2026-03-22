import React from 'react';
import { HiMagnifyingGlass, HiArrowRight, HiSparkles } from 'react-icons/hi2';
import './HeroSection.css';

export default function HeroSection() {
    return (
        <section className="hero-section container flex-center">
            <div className="hero-content animate-slide-up delay-1">
                <div className="glass-pill mb-6 animate-pop-in delay-2">
                    <HiSparkles size={16} className="text-gradient" />
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Misinformation Spread Intelligence System</span>
                </div>

                <h1 className="hero-title animate-slide-up delay-3">
                    Stop Misinformation <br />
                    Before It Goes <span className="text-gradient">Viral</span>
                </h1>

                <p className="hero-subtitle animate-slide-up delay-4">
                    TruthTrace uses AI and Graph Networks to detect, visualize, and predict the spread of fake news in real-time. Protect your information ecosystem today.
                </p>

                <div className="hero-actions animate-fade-in delay-5">
                    <div className="search-box glass-panel flex-between">
                        <HiMagnifyingGlass size={20} className="text-muted" style={{ margin: '0 10px' }} />
                        <input
                            type="text"
                            placeholder="Paste a news article URL or snippet..."
                            className="search-input"
                        />
                        <button className="btn-primary analyze-btn" onClick={() => document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' })}>
                            Analyze <HiArrowRight size={18} />
                        </button>
                    </div>
                </div>

                <div className="mt-6 animate-fade-in delay-5">
                    <button className="btn-secondary" onClick={() => document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' })}>
                        Already a user? Sign In
                    </button>
                </div>

                <div className="hero-stats animate-fade-in delay-5">
                    <div className="stat-item">
                        <h4>99.8%</h4>
                        <p>Detection Accuracy</p>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <h4>Real-time</h4>
                        <p>Graph Visualization</p>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <h4>VerityOS</h4>
                        <p>Powered Core</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
