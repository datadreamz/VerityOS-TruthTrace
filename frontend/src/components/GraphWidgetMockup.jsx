import React, { useEffect, useState } from 'react';
import { HiLink, HiChartBar, HiExclamationTriangle } from 'react-icons/hi2';
import './GraphWidgetMockup.css';

export default function GraphWidgetMockup() {
    const [nodes, setNodes] = useState([]);

    useEffect(() => {
        // Generate some random floating nodes for the mock graph
        const initialNodes = Array.from({ length: 12 }).map((_, i) => ({
            id: i,
            x: Math.random() * 80 + 10,
            y: Math.random() * 80 + 10,
            size: Math.random() * 10 + 5,
            delay: Math.random() * 2,
        }));
        setNodes(initialNodes);
    }, []);

    return (
        <section id="demo" className="container" style={{ paddingBottom: '100px' }}>
            <div className="graph-widget-container glass-panel animate-slide-up">

                <div className="widget-header flex-between">
                    <div className="flex-center" style={{ gap: '10px' }}>
                        <HiLink className="text-gradient" size={24} />
                        <h3 style={{ margin: 0 }}>Live Spread Visualization</h3>
                    </div>
                    <div className="status-badge pulse">
                        <HiChartBar size={16} /> Monitoring Active Nodes
                    </div>
                </div>

                <div className="graph-canvas">
                    {/* Mock Graph Network Background */}
                    <div className="graph-lines"></div>

                    {nodes.map(node => (
                        <div
                            key={node.id}
                            className="graph-node"
                            style={{
                                left: `${node.x}%`,
                                top: `${node.y}%`,
                                width: `${node.size}px`,
                                height: `${node.size}px`,
                                animationDelay: `${node.delay}s`
                            }}
                        ></div>
                    ))}

                    {/* Center Source Node */}
                    <div className="source-node pulse-icon">
                        <HiExclamationTriangle size={32} color="#fff" />
                    </div>
                </div>

                <div className="widget-footer flex-between">
                    <div className="stat">
                        <span className="text-muted">Origin Trust Score</span>
                        <div className="score danger">12/100</div>
                    </div>
                    <div className="stat">
                        <span className="text-muted">Impact Radius</span>
                        <div className="score warning">High Risk</div>
                    </div>
                    <div className="stat">
                        <span className="text-muted">Nodes Reached</span>
                        <div className="score primary">14,208</div>
                    </div>
                </div>

            </div>
        </section>
    );
}
