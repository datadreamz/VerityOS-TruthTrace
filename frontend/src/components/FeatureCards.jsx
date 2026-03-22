import React from 'react';
import { HiCpuChip, HiShare, HiFire, HiShieldExclamation, HiBell } from 'react-icons/hi2';
import './FeatureCards.css';

const features = [
    {
        icon: <HiCpuChip size={32} />,
        title: 'Fake News Detection',
        description: 'AI-driven analysis to identify false narratives instantly before they gain traction.'
    },
    {
        icon: <HiShare size={32} />,
        title: 'Spread Visualization',
        description: 'Graph networks showing exactly how information flows from sources to main platforms.'
    },
    {
        icon: <HiFire size={32} style={{ color: 'var(--accent-alert)' }} />,
        title: 'Viral Risk Prediction 🔥',
        description: 'Predict the likelihood of dangerous content going viral using predictive pattern models.'
    },
    {
        icon: <HiShieldExclamation size={32} />,
        title: 'Source Trust Scoring',
        description: 'Assigns credibility scores to publishers and social profiles to gauge overall reliability.'
    },
    {
        icon: <HiBell size={32} />,
        title: 'Early Warning Alerts',
        description: 'Get notified immediately when high-risk misinformation triggers safety thresholds.'
    }
];

export default function FeatureCards() {
    return (
        <section id="features" className="container" style={{ padding: '100px 20px' }}>
            <div className="section-header text-center mb-10 animate-slide-up">
                <h2 className="text-gradient">Intelligence Capabilities</h2>
                <p className="subtitle">Everything you need to combat the spread of misinformation in real-time.</p>
            </div>

            <div className="features-grid">
                {features.map((feat, idx) => (
                    <div
                        key={idx}
                        className={`feature-card glass-panel animate-slide-up delay-${(idx % 4) + 1}`}
                    >
                        <div className="feature-icon-wrapper">
                            {feat.icon}
                        </div>
                        <h3>{feat.title}</h3>
                        <p>{feat.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
