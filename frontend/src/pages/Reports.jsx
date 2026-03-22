import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
} from 'chart.js';
import { Radar, Doughnut, Bar } from 'react-chartjs-2';
import './Reports.css';

ChartJS.register(
    RadialLinearScale, PointElement, LineElement, Filler,
    Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement
);

export default function Reports() {
    const [history, setHistory] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('verityos_history') || '[]');
        setHistory(data);
        if (data.length > 0) setSelected(data[0]);
    }, []);

    const scores = useMemo(() => {
        if (!selected?.result) return null;
        const r = selected.result;
        if (r.scores) return r.scores;
        // single analysis
        return {
            text: r.confidence || 0,
            image: 0,
            graph: r.graph?.graph_score || 0,
            final: r.confidence || 0,
        };
    }, [selected]);

    const radarData = useMemo(() => ({
        labels: ['Text Analysis', 'Image Analysis', 'Graph Score', 'Source Trust', 'Pattern Match'],
        datasets: [{
            label: 'Credibility Scores',
            data: scores ? [
                scores.text * 100,
                scores.image * 100,
                scores.graph * 100,
                (selected?.result?.graph_insights?.factors?.source_credibility || scores.graph) * 100,
                (selected?.result?.graph_insights?.factors?.pattern_similarity || scores.graph) * 100,
            ] : [0, 0, 0, 0, 0],
            backgroundColor: 'var(--primary-glow)',
            borderColor: 'var(--primary)',
            borderWidth: 2,
            pointBackgroundColor: 'var(--primary)',
            pointBorderColor: '#fff',
            pointBorderWidth: 1,
            pointRadius: 4,
        }],
    }), [scores, selected]);

    const doughnutData = useMemo(() => ({
        labels: ['Text', 'Image', 'Graph'],
        datasets: [{
            data: scores ? [scores.text * 100, scores.image * 100, scores.graph * 100] : [0, 0, 0],
            backgroundColor: ['var(--primary)', 'var(--secondary)', 'var(--accent-warn)'],
            borderColor: ['var(--primary)', 'var(--secondary)', 'var(--accent-warn)'],
            borderWidth: 2,
        }],
    }), [scores]);

    const barData = useMemo(() => {
        const last5 = history.slice(0, 5).reverse();
        return {
            labels: last5.map((_, i) => `Analysis ${i + 1}`),
            datasets: [{
                label: 'Credibility Score',
                data: last5.map(h => {
                    const r = h.result;
                    return ((r.scores?.final || r.confidence || 0) * 100).toFixed(1);
                }),
                backgroundColor: last5.map(h => {
                    const s = h.result.scores?.final || h.result.confidence || 0;
                    return s > 0.6 ? 'var(--accent-safe)' : s > 0.4 ? 'var(--accent-warn)' : 'var(--accent-alert)';
                }),
                borderColor: last5.map(h => {
                    const s = h.result.scores?.final || h.result.confidence || 0;
                    return s > 0.6 ? 'var(--accent-safe)' : s > 0.4 ? 'var(--accent-warn)' : 'var(--accent-alert)';
                }),
                borderWidth: 1,
                borderRadius: 6,
            }],
        };
    }, [history]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: 'var(--text-muted)', font: { family: 'Inter' } } } },
    };

    const radarOptions = {
        ...chartOptions,
        scales: {
            r: {
                angleLines: { color: 'rgba(255,255,255,0.06)' },
                grid: { color: 'rgba(255,255,255,0.06)' },
                pointLabels: { color: 'var(--text-muted)', font: { size: 11, family: 'Inter' } },
                ticks: { display: false },
                suggestedMin: 0,
                suggestedMax: 100,
            },
        },
    };

    const barOptions = {
        ...chartOptions,
        scales: {
            x: { ticks: { color: '#a7a9be' }, grid: { color: 'rgba(255,255,255,0.04)' } },
            y: { ticks: { color: '#a7a9be' }, grid: { color: 'rgba(255,255,255,0.04)' }, suggestedMax: 100 },
        },
    };

    if (history.length === 0) {
        return (
            <div className="page-container">
                <h1 className="reports-title">Reports</h1>
                <div className="reports-empty glass-card">
                    <p>No analysis data yet. Run an analysis first to see reports here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="reports-title">Reports & Insights</h1>
                <p className="reports-subtitle">Visual breakdown of your latest analysis</p>

                {/* Report selector */}
                <div className="report-selector">
                    {history.slice(0, 8).map((h, i) => (
                        <button
                            key={h.id}
                            className={`report-chip ${selected?.id === h.id ? 'active' : ''}`}
                            onClick={() => setSelected(h)}
                        >
                            {h.type} #{i + 1}
                        </button>
                    ))}
                </div>

                {/* Charts grid */}
                <div className="charts-grid">
                    <motion.div className="chart-card glass-card" initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                        <h3>Credibility Radar</h3>
                        <div className="chart-wrapper">
                            <Radar data={radarData} options={radarOptions} />
                        </div>
                    </motion.div>

                    <motion.div className="chart-card glass-card" initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                        <h3>Score Breakdown</h3>
                        <div className="chart-wrapper doughnut-wrapper">
                            <Doughnut data={doughnutData} options={chartOptions} />
                        </div>
                        {scores && (
                            <div className="score-legend">
                                <div><span className="dot" style={{ background: 'var(--primary)' }} /> Text: {(scores.text * 100).toFixed(0)}%</div>
                                <div><span className="dot" style={{ background: 'var(--secondary)' }} /> Image: {(scores.image * 100).toFixed(0)}%</div>
                                <div><span className="dot" style={{ background: 'var(--accent-warn)' }} /> Graph: {(scores.graph * 100).toFixed(0)}%</div>
                            </div>
                        )}
                    </motion.div>

                    <motion.div className="chart-card glass-card chart-wide" initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                        <h3>Analysis History Trend</h3>
                        <div className="chart-wrapper bar-wrapper">
                            <Bar data={barData} options={barOptions} />
                        </div>
                    </motion.div>
                </div>

                {/* Selected report detail */}
                {selected?.result && (
                    <motion.div className="report-detail glass-card" initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <h3>Report Detail</h3>
                        {selected.result.summary && (
                            <>
                                <div className="report-row">
                                    <span>Verdict</span>
                                    <span className={`verdict-badge ${selected.result.summary.verdict?.toLowerCase()}`}>
                                        {selected.result.summary.verdict}
                                    </span>
                                </div>
                                <div className="report-row">
                                    <span>Final Score</span>
                                    <span className="report-value">{(selected.result.summary.final_score * 100).toFixed(1)}%</span>
                                </div>
                                <p className="report-conclusion">{selected.result.summary.verdict_detail}</p>
                            </>
                        )}
                        {selected.result.label && !selected.result.summary && (
                            <>
                                <div className="report-row">
                                    <span>Result</span>
                                    <span className={`verdict-badge ${selected.result.label?.toLowerCase() === 'real' ? 'real' : 'fake'}`}>
                                        {selected.result.label}
                                    </span>
                                </div>
                                <div className="report-row">
                                    <span>Confidence</span>
                                    <span className="report-value">{(selected.result.confidence * 100).toFixed(1)}%</span>
                                </div>
                                <p className="report-conclusion">{selected.result.explanation}</p>
                            </>
                        )}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
