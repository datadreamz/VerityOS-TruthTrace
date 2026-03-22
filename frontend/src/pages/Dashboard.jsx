import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HiMagnifyingGlass, HiShieldCheck, HiChartBar, HiSparkles, HiArrowRight } from 'react-icons/hi2';
import './Dashboard.css';

const stats = [
    { value: '12.4M', label: 'Articles Verified', color: 'var(--primary)' },
    { value: '98.7%', label: 'Accuracy Rate', color: 'var(--accent-safe)' },
    { value: '45K+', label: 'Active Users', color: 'var(--secondary)' },
];

const features = [
    { icon: HiMagnifyingGlass, title: 'Text Analysis', desc: 'Deep semantic analysis of articles and claims', color: 'var(--primary)' },
    { icon: HiShieldCheck, title: 'Image Detection', desc: 'Identify AI-generated and manipulated images', color: 'var(--secondary)' },
    { icon: HiChartBar, title: 'Credibility Scoring', desc: 'Multi-factor trust assessment and source verification', color: 'var(--accent-warn)' },
    { icon: HiSparkles, title: 'AI Pattern Matching', desc: 'Detect synthetic content across 4.2M data points', color: 'var(--accent-safe)' },
];

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

import GraphWidgetMockup from '../components/GraphWidgetMockup';

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <div className="page-container">
            <motion.div
                className="dash-hero"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="dash-title">
                    Analyze Content <span className="gradient-text">Intelligence</span>
                </h1>
                <p className="dash-subtitle">
                    Detect fake news, AI-generated media & credibility patterns with multi-layer verification.
                </p>
                <button className="btn-primary dash-cta" onClick={() => navigate('/analyze')}>
                    Start Analysis <HiArrowRight />
                </button>
            </motion.div>

            <motion.div
                className="dash-stats"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {stats.map((s) => (
                    <motion.div key={s.label} className="stat-card glass-card" variants={item}>
                        <span className="stat-value" style={{ color: s.color }}>{s.value}</span>
                        <span className="stat-label">{s.label}</span>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                className="dash-features"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {features.map((f) => {
                    const Icon = f.icon;
                    return (
                        <motion.div
                            key={f.title}
                            className="feature-card glass-card"
                            variants={item}
                            whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        >
                            <div className="feature-icon" style={{ color: f.color }}>
                                <Icon size={28} />
                            </div>
                            <h3 className="feature-title">{f.title}</h3>
                            <p className="feature-desc">{f.desc}</p>
                        </motion.div>
                    );
                })}
            </motion.div>

            <div style={{ marginTop: '4rem' }}>
                <GraphWidgetMockup />
            </div>
        </div>
    );
}
