import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiDocumentText, HiPhoto, HiSquares2X2, HiTrash, HiChevronDown, HiChevronUp } from 'react-icons/hi2';
import './History.css';

const typeIcons = {
    text: HiDocumentText,
    image: HiPhoto,
    combined: HiSquares2X2,
};

export default function History() {
    const [history, setHistory] = useState([]);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('verityos_history') || '[]');
        setHistory(data);
    }, []);

    const clearHistory = () => {
        localStorage.removeItem('verityos_history');
        setHistory([]);
        setExpanded(null);
    };

    const removeItem = (id) => {
        const updated = history.filter((h) => h.id !== id);
        localStorage.setItem('verityos_history', JSON.stringify(updated));
        setHistory(updated);
        if (expanded === id) setExpanded(null);
    };

    const getVerdict = (result) => {
        if (result.summary) return result.summary.verdict;
        return result.label || 'Unknown';
    };

    const getScore = (result) => {
        if (result.scores) return result.scores.final;
        return result.confidence || 0;
    };

    const getVerdictClass = (v) => {
        if (!v) return 'uncertain';
        const l = v.toLowerCase();
        if (l === 'real') return 'real';
        if (l === 'fake') return 'fake';
        return 'uncertain';
    };

    const formatTime = (ts) => {
        const d = new Date(ts);
        return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="page-container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="history-header">
                    <div>
                        <h1 className="history-title">Analysis History</h1>
                        <p className="history-subtitle">{history.length} past analyses stored locally</p>
                    </div>
                    {history.length > 0 && (
                        <button className="btn-secondary clear-btn" onClick={clearHistory}>
                            <HiTrash size={14} /> Clear All
                        </button>
                    )}
                </div>

                {history.length === 0 ? (
                    <div className="history-empty glass-card">
                        <p>No analysis history yet. Run your first analysis to see it here.</p>
                    </div>
                ) : (
                    <motion.div className="history-list"
                        initial="hidden" animate="show"
                        variants={{ show: { transition: { staggerChildren: 0.06 } } }}
                    >
                        {history.map((item) => {
                            const Icon = typeIcons[item.type] || HiDocumentText;
                            const verdict = getVerdict(item.result);
                            const score = getScore(item.result);
                            const isOpen = expanded === item.id;

                            return (
                                <motion.div
                                    key={item.id}
                                    className="history-item glass-card"
                                    variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                                    layout
                                >
                                    <div className="history-item-header" onClick={() => setExpanded(isOpen ? null : item.id)}>
                                        <div className="history-item-left">
                                            <div className="history-icon"><Icon size={18} /></div>
                                            <div className="history-info">
                                                <span className="history-type">{item.type} analysis</span>
                                                <span className="history-preview">{item.preview}</span>
                                            </div>
                                        </div>
                                        <div className="history-item-right">
                                            <span className={`verdict-badge ${getVerdictClass(verdict)}`}>{verdict}</span>
                                            <span className="history-score">{(score * 100).toFixed(0)}%</span>
                                            <span className="history-time">{formatTime(item.timestamp)}</span>
                                            {isOpen ? <HiChevronUp size={16} /> : <HiChevronDown size={16} />}
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                className="history-detail"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="detail-content">
                                                    {item.result.summary && (
                                                        <p className="detail-text">{item.result.summary.verdict_detail}</p>
                                                    )}
                                                    {item.result.explanation && !item.result.summary && (
                                                        <p className="detail-text">{item.result.explanation}</p>
                                                    )}
                                                    {item.result.text_analysis && (
                                                        <div className="detail-row">
                                                            <span>Text: {item.result.text_analysis.label}</span>
                                                            <span>{(item.result.text_analysis.confidence * 100).toFixed(1)}%</span>
                                                        </div>
                                                    )}
                                                    {item.result.image_analysis && (
                                                        <div className="detail-row">
                                                            <span>Image: {item.result.image_analysis.label}</span>
                                                            <span>{(item.result.image_analysis.confidence * 100).toFixed(1)}%</span>
                                                        </div>
                                                    )}
                                                    <button className="remove-btn" onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}>
                                                        <HiTrash size={14} /> Remove
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
