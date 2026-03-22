import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiDocumentText, HiPhoto, HiSquares2X2, HiArrowUpTray, HiXMark } from 'react-icons/hi2';
import { analyzeText, analyzeImage, analyzeCombined } from '../api/client';
import './Analyze.css';

const tabs = [
    { id: 'text', label: 'Text', icon: HiDocumentText },
    { id: 'image', label: 'Image', icon: HiPhoto },
    { id: 'combined', label: 'Combined', icon: HiSquares2X2 },
];

export default function Analyze() {
    const [activeTab, setActiveTab] = useState('text');
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files[0];
        if (f && f.type.startsWith('image/')) setFile(f);
    }, []);

    const handleFileSelect = (e) => {
        const f = e.target.files[0];
        if (f) setFile(f);
    };

    const handleSubmit = async () => {
        setError('');
        setResult(null);
        setLoading(true);

        try {
            let data;
            if (activeTab === 'text') {
                if (!text.trim()) { setError('Please enter text to analyze'); setLoading(false); return; }
                data = await analyzeText(text);
            } else if (activeTab === 'image') {
                if (!file) { setError('Please upload an image'); setLoading(false); return; }
                data = await analyzeImage(file);
            } else {
                if (!text.trim() && !file) { setError('Please provide text or an image'); setLoading(false); return; }
                data = await analyzeCombined(text, file);
            }
            setResult(data);

            // Save to localStorage history
            const history = JSON.parse(localStorage.getItem('verityos_history') || '[]');
            history.unshift({
                id: Date.now(),
                type: activeTab,
                preview: text.slice(0, 80) || (file ? file.name : 'Analysis'),
                result: data,
                timestamp: new Date().toISOString(),
            });
            localStorage.setItem('verityos_history', JSON.stringify(history.slice(0, 50)));

        } catch (err) {
            setError(err.response?.data?.detail || err.message || 'Analysis failed. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    const getVerdictClass = (label) => {
        if (!label) return 'uncertain';
        const l = label.toLowerCase();
        if (l === 'real') return 'real';
        if (l === 'fake') return 'fake';
        return 'uncertain';
    };

    return (
        <div className="page-container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="analyze-title">Content Analysis</h1>
                <p className="analyze-subtitle">Submit text, images, or both for multi-layer verification</p>

                {/* Tabs */}
                <div className="analyze-tabs">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                className={`analyze-tab ${isActive ? 'active' : ''}`}
                                onClick={() => { setActiveTab(tab.id); setResult(null); setError(''); }}
                            >
                                {isActive && (
                                    <motion.div className="tab-active-bg" layoutId="analyzeTab"
                                        transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                                )}
                                <span className="tab-content"><Icon size={16} />{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Input Area */}
                <div className="analyze-input-area glass-card">
                    {/* Text input for text & combined */}
                    {(activeTab === 'text' || activeTab === 'combined') && (
                        <div className="input-section">
                            <label className="input-label">Article / Claim Text</label>
                            <textarea
                                className="input-field analyze-textarea"
                                placeholder="Paste the article or claim you want to verify..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                rows={6}
                            />
                        </div>
                    )}

                    {/* File upload for image & combined */}
                    {(activeTab === 'image' || activeTab === 'combined') && (
                        <div className="input-section">
                            <label className="input-label">Upload Image</label>
                            <div
                                className={`drop-zone ${dragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById('file-input').click()}
                            >
                                {file ? (
                                    <div className="file-preview">
                                        <img src={URL.createObjectURL(file)} alt="Preview" className="file-thumb" />
                                        <div className="file-info">
                                            <span className="file-name">{file.name}</span>
                                            <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                                        </div>
                                        <button className="file-remove" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                                            <HiXMark size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="drop-content">
                                        <HiArrowUpTray size={32} className="drop-icon" />
                                        <p>Drag & drop an image here, or click to browse</p>
                                        <span className="drop-hint">PNG, JPG up to 10MB</span>
                                    </div>
                                )}
                                <input id="file-input" type="file" accept="image/*" hidden onChange={handleFileSelect} />
                            </div>
                        </div>
                    )}

                    {error && <div className="analyze-error">{error}</div>}

                    <button className="btn-primary analyze-submit" onClick={handleSubmit} disabled={loading}>
                        {loading ? (
                            <>
                                <span className="btn-spinner" />
                                Analyzing...
                            </>
                        ) : (
                            'Run Analysis'
                        )}
                    </button>
                </div>

                {/* Loading skeleton */}
                <AnimatePresence>
                    {loading && (
                        <motion.div
                            className="analyze-loading glass-card"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="scanning-bar">
                                <div className="scanning-fill" />
                            </div>
                            <p className="scanning-text">Scanning content through AI models...</p>
                            <div className="skeleton-rows">
                                <div className="skeleton" style={{ height: 20, width: '70%' }} />
                                <div className="skeleton" style={{ height: 20, width: '50%' }} />
                                <div className="skeleton" style={{ height: 20, width: '85%' }} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results */}
                <AnimatePresence>
                    {result && !loading && (
                        <motion.div
                            className="analyze-results glass-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="results-title">Analysis Results</h2>

                            {/* Combined report */}
                            {result.summary ? (
                                <>
                                    <div className="result-verdict-row">
                                        <span className={`verdict-badge ${getVerdictClass(result.summary.verdict)}`}>
                                            {result.summary.verdict}
                                        </span>
                                        <span className="result-score">
                                            Credibility: <strong>{(result.summary.final_score * 100).toFixed(1)}%</strong>
                                        </span>
                                    </div>
                                    <p className="result-detail">{result.summary.verdict_detail}</p>

                                    <div className="result-sections">
                                        {result.text_analysis && (
                                            <div className="result-section">
                                                <h3>📝 Text Analysis</h3>
                                                <div className="result-row">
                                                    <span className={`verdict-badge ${getVerdictClass(result.text_analysis.label)}`}>
                                                        {result.text_analysis.label}
                                                    </span>
                                                    <span className="conf-value">{(result.text_analysis.confidence * 100).toFixed(1)}%</span>
                                                </div>
                                                <div className="confidence-bar-track">
                                                    <div
                                                        className="confidence-bar-fill"
                                                        style={{
                                                            width: `${result.text_analysis.confidence * 100}%`,
                                                            background: result.text_analysis.label === 'Real' ? 'var(--accent-green)' : 'var(--accent-red)',
                                                        }}
                                                    />
                                                </div>
                                                <p className="result-explanation">{result.text_analysis.explanation}</p>
                                            </div>
                                        )}

                                        {result.image_analysis && (
                                            <div className="result-section">
                                                <h3>🖼️ Image Analysis</h3>
                                                <div className="result-row">
                                                    <span className={`verdict-badge ${getVerdictClass(result.image_analysis.label)}`}>
                                                        {result.image_analysis.label}
                                                    </span>
                                                    <span className="conf-value">{(result.image_analysis.confidence * 100).toFixed(1)}%</span>
                                                </div>
                                                <div className="confidence-bar-track">
                                                    <div
                                                        className="confidence-bar-fill"
                                                        style={{
                                                            width: `${result.image_analysis.confidence * 100}%`,
                                                            background: result.image_analysis.label === 'Real' ? 'var(--accent-green)' : 'var(--accent-red)',
                                                        }}
                                                    />
                                                </div>
                                                <p className="result-explanation">{result.image_analysis.explanation}</p>
                                            </div>
                                        )}

                                        {result.graph_insights && (
                                            <div className="result-section">
                                                <h3>🔗 Graph Insights</h3>
                                                <div className="result-row">
                                                    <span className="conf-label">Graph Score</span>
                                                    <span className="conf-value">{(result.graph_insights.graph_score * 100).toFixed(1)}%</span>
                                                </div>
                                                <div className="confidence-bar-track">
                                                    <div
                                                        className="confidence-bar-fill"
                                                        style={{
                                                            width: `${result.graph_insights.graph_score * 100}%`,
                                                            background: 'var(--accent-cyan)',
                                                        }}
                                                    />
                                                </div>
                                                {result.graph_insights.factors && (
                                                    <div className="graph-factors">
                                                        {Object.entries(result.graph_insights.factors).map(([k, v]) => (
                                                            <div key={k} className="factor-row">
                                                                <span>{k.replace(/_/g, ' ')}</span>
                                                                <span>{(v * 100).toFixed(0)}%</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                /* Single analysis result (text-only or image-only) */
                                <>
                                    <div className="result-verdict-row">
                                        <span className={`verdict-badge ${getVerdictClass(result.label)}`}>
                                            {result.label}
                                        </span>
                                        <span className="result-score">
                                            Confidence: <strong>{(result.confidence * 100).toFixed(1)}%</strong>
                                        </span>
                                    </div>
                                    <div className="confidence-bar-track" style={{ marginTop: 12 }}>
                                        <div
                                            className="confidence-bar-fill"
                                            style={{
                                                width: `${result.confidence * 100}%`,
                                                background: result.label === 'Real' ? 'var(--accent-green)' : 'var(--accent-red)',
                                            }}
                                        />
                                    </div>
                                    <p className="result-explanation" style={{ marginTop: 16 }}>{result.explanation}</p>
                                    {result.source && (
                                        <p className="result-source">Source: {result.source.replace(/_/g, ' ')}</p>
                                    )}

                                    {/* Show graph data if present */}
                                    {result.graph && (
                                        <div className="result-section" style={{ marginTop: 20 }}>
                                            <h3>🔗 Graph Score</h3>
                                            <div className="result-row">
                                                <span className="conf-label">Credibility</span>
                                                <span className="conf-value">{(result.graph.graph_score * 100).toFixed(1)}%</span>
                                            </div>
                                            <div className="confidence-bar-track">
                                                <div className="confidence-bar-fill"
                                                    style={{ width: `${result.graph.graph_score * 100}%`, background: 'var(--accent-cyan)' }} />
                                            </div>
                                            {result.graph.factors && (
                                                <div className="graph-factors">
                                                    {Object.entries(result.graph.factors).map(([k, v]) => (
                                                        <div key={k} className="factor-row">
                                                            <span>{k.replace(/_/g, ' ')}</span>
                                                            <span>{(v * 100).toFixed(0)}%</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
