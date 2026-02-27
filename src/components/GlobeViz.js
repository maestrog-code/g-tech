'use client';
import React, { useEffect, useRef, useState } from 'react';

// Major tech city hotspots { lat, lng, name, highlight }
const HOTSPOTS = [
    { lat: 37.4, lng: -122.1, name: 'SILICON VALLEY', color: '#00f2ff', size: 14 },
    { lat: 51.5, lng: -0.1, name: 'LONDON', color: '#bc13fe', size: 10 },
    { lat: 35.7, lng: 139.7, name: 'TOKYO', color: '#ff9d00', size: 12 },
    { lat: 22.3, lng: 114.2, name: 'HONG KONG', color: '#00ff66', size: 9 },
    { lat: 48.9, lng: 2.35, name: 'PARIS', color: '#ff00ea', size: 9 },
    { lat: 52.5, lng: 13.4, name: 'BERLIN', color: '#ffcc00', size: 9 },
    { lat: 12.9, lng: 77.6, name: 'BANGALORE', color: '#00f2ff', size: 11 },
    { lat: 37.6, lng: 55.8, name: 'MOSCOW', color: '#ff0055', size: 8 },
    { lat: 31.2, lng: 121.5, name: 'SHANGHAI', color: '#ff9d00', size: 11 },
    { lat: -33.9, lng: 151.2, name: 'SYDNEY', color: '#00ff66', size: 8 },
    { lat: 40.7, lng: -74.0, name: 'NEW YORK', color: '#bc13fe', size: 11 },
    { lat: 55.8, lng: 37.6, name: 'MOSCOW', color: '#ff0055', size: 8 },
    { lat: 1.35, lng: 103.8, name: 'SINGAPORE', color: '#00f2ff', size: 9 },
    { lat: -23.5, lng: -46.6, name: 'SÃO PAULO', color: '#ffcc00', size: 8 },
    { lat: 19.4, lng: -99.1, name: 'MEXICO CITY', color: '#ff00ea', size: 8 },
];

function latLngToXY(lat, lng, cx, cy, r) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = cx + r * Math.sin(phi) * Math.cos(theta);
    const y = cy + r * Math.cos(phi);
    const z = r * Math.sin(phi) * Math.sin(theta);
    return { x, y, z };
}

export default function GlobeViz({ onAchievement }) {
    const [angle, setAngle] = useState(0);
    const [tooltip, setTooltip] = useState(null);
    const [mounted, setMounted] = useState(false);
    const [activeArcs, setActiveArcs] = useState([]);
    const rafRef = useRef(null);
    const lastRef = useRef(0);
    const achievedRef = useRef(false);

    // Arc pairs (indices into HOTSPOTS)
    const ARC_PAIRS = [
        [0, 2], [0, 10], [1, 4], [2, 8], [6, 8],
        [1, 11], [10, 1], [0, 12], [6, 12], [3, 7],
    ];

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        if (!mounted) return;
        const animate = (ts) => {
            if (ts - lastRef.current > 16) {
                setAngle(a => (a + 0.25) % 360);
                lastRef.current = ts;
            }
            rafRef.current = requestAnimationFrame(animate);
        };
        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, [mounted]);

    // Cycle active arc pairs
    useEffect(() => {
        if (!mounted) return;
        const cycle = () => {
            const count = 2 + Math.floor(Math.random() * 2);
            const shuffled = [...ARC_PAIRS].sort(() => Math.random() - 0.5).slice(0, count);
            setActiveArcs(shuffled);
        };
        cycle();
        const iv = setInterval(cycle, 3000);
        return () => clearInterval(iv);
    }, [mounted]);

    const cx = 250, cy = 250, r = 200;
    const rad = angle * (Math.PI / 180);

    // Project hotspots with current rotation
    const projectedSpots = HOTSPOTS.map(h => {
        const adjustedLng = h.lng + angle;
        const { x, y, z } = latLngToXY(h.lat, adjustedLng, cx, cy, r);
        return { ...h, px: x, py: y, pz: z, visible: z > -20 };
    }).sort((a, b) => a.pz - b.pz);

    // Latitude lines
    const latLines = [-60, -30, 0, 30, 60].map(lat => {
        const pts = Array.from({ length: 73 }, (_, i) => {
            const lng = i * 5 + angle;
            const p = latLngToXY(lat, lng, cx, cy, r);
            return p;
        });
        return { lat, pts };
    });

    // Longitude lines (meridians), rotating
    const lngLines = [0, 30, 60, 90, 120, 150].map(base => {
        const lng = base + angle;
        const pts = Array.from({ length: 37 }, (_, i) => {
            const lat = i * 5 - 90;
            return latLngToXY(lat, lng, cx, cy, r);
        });
        return { lng, pts };
    });

    const pathD = (pts, closed = false) => {
        const vis = pts.filter(p => p.z > 0);
        if (vis.length < 2) return '';
        return vis.reduce((acc, p, i) => {
            return acc + (i === 0 ? `M${p.x.toFixed(1)},${p.y.toFixed(1)}` : ` L${p.x.toFixed(1)},${p.y.toFixed(1)}`);
        }, '') + (closed ? 'Z' : '');
    };

    return (
        <section id="globe" style={{ padding: '80px 20px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div className="globe-header">
                    <div className="globe-badge">
                        <span className="live-dot" />
                        GLOBAL NETWORK
                    </div>
                    <h2 className="neon-text-purple" style={{ fontSize: '2.5rem', letterSpacing: '10px' }}>TECH ATLAS</h2>
                    <p style={{ fontSize: '0.65rem', color: '#555', letterSpacing: '4px' }}>LIVE INNOVATION HOTSPOTS — 15 MAJOR TECH HUBS</p>
                </div>

                <div className="globe-layout">
                    <div className="globe-wrap">
                        {mounted && (
                            <svg width="500" height="500" viewBox="0 0 500 500" className="globe-svg">
                                <defs>
                                    <radialGradient id="globeGrad" cx="35%" cy="35%">
                                        <stop offset="0%" stopColor="#0a0a1a" />
                                        <stop offset="100%" stopColor="#030308" />
                                    </radialGradient>
                                    <radialGradient id="glowGrad" cx="50%" cy="50%">
                                        <stop offset="60%" stopColor="transparent" />
                                        <stop offset="100%" stopColor="rgba(188,19,254,0.15)" />
                                    </radialGradient>
                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="3" result="blur" />
                                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                                    </filter>
                                </defs>

                                {/* Globe sphere */}
                                <circle cx={cx} cy={cy} r={r} fill="url(#globeGrad)" />
                                <circle cx={cx} cy={cy} r={r} fill="url(#glowGrad)" />

                                {/* Grid lines */}
                                {latLines.map(({ lat, pts }) => (
                                    <path key={`lat${lat}`} d={pathD(pts)} stroke="rgba(188,19,254,0.15)" strokeWidth="0.7" fill="none" />
                                ))}
                                {lngLines.map(({ lng, pts }) => (
                                    <path key={`lng${lng}`} d={pathD(pts)} stroke="rgba(188,19,254,0.15)" strokeWidth="0.7" fill="none" />
                                ))}

                                {/* Equator highlight */}
                                {(() => {
                                    const eq = Array.from({ length: 73 }, (_, i) => latLngToXY(0, i * 5 + angle, cx, cy, r));
                                    return <path d={pathD(eq)} stroke="rgba(0,242,255,0.3)" strokeWidth="1.2" fill="none" />;
                                })()}

                                {/* Hotspots */}
                                {projectedSpots.filter(h => h.visible).map((h, i) => (
                                    <g key={i} style={{ cursor: 'pointer' }}
                                        onMouseEnter={() => setTooltip(h.name)}
                                        onMouseLeave={() => setTooltip(null)}
                                        onClick={() => { if (onAchievement && !achievedRef.current) { achievedRef.current = true; onAchievement('GLOBE_TROTTER'); } }}>
                                        {/* Ping ring */}
                                        <circle cx={h.px} cy={h.py} r={h.size * 1.8}
                                            fill="none" stroke={h.color} strokeWidth="1"
                                            opacity="0.3">
                                            <animate attributeName="r" values={`${h.size * 1.2};${h.size * 3};${h.size * 1.2}`} dur="2s" repeatCount="indefinite" />
                                            <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
                                        </circle>
                                        {/* Core dot */}
                                        <circle cx={h.px} cy={h.py} r={h.size / 2 + 2}
                                            fill={h.color}
                                            filter="url(#glow)"
                                            opacity={0.7 + h.pz / r * 0.3}>
                                        </circle>
                                        {tooltip === h.name && (
                                            <text x={h.px + 10} y={h.py - 5}
                                                fill="#fff" fontSize="10"
                                                fontFamily="monospace"
                                                fontWeight="700"
                                                letterSpacing="1">
                                                {h.name}
                                            </text>
                                        )}
                                    </g>
                                ))}

                                {/* Globe rim */}
                                <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(188,19,254,0.4)" strokeWidth="1.5" />
                                {/* Light gleam */}
                                <ellipse cx={cx - 60} cy={cy - 60} rx="50" ry="30"
                                    fill="rgba(255,255,255,0.03)" transform="rotate(-30, 250, 250)" />

                                {/* Connection arcs */}
                                {activeArcs.map(([ai, bi], idx) => {
                                    const a = projectedSpots.find(s => s.name === HOTSPOTS[ai]?.name) || projectedSpots[ai];
                                    const b = projectedSpots.find(s => s.name === HOTSPOTS[bi]?.name) || projectedSpots[bi];
                                    if (!a || !b || !a.visible || !b.visible) return null;
                                    const mx = (a.px + b.px) / 2;
                                    const my = Math.min(a.py, b.py) - 60 - Math.abs(a.px - b.px) * 0.15;
                                    const color = idx % 2 === 0 ? '#00f2ff' : '#bc13fe';
                                    return (
                                        <g key={`${ai}-${bi}-${idx}`}>
                                            <path
                                                d={`M${a.px.toFixed(1)},${a.py.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${b.px.toFixed(1)},${b.py.toFixed(1)}`}
                                                fill="none"
                                                stroke={color}
                                                strokeWidth="1"
                                                strokeDasharray="4 3"
                                                opacity="0.5"
                                            >
                                                <animate attributeName="stroke-dashoffset" from="0" to="-14" dur="0.8s" repeatCount="indefinite" />
                                                <animate attributeName="opacity" values="0;0.6;0.6;0" dur="3s" fill="freeze" />
                                            </path>
                                            {/* Moving packet dot */}
                                            <circle r="2" fill={color} opacity="0.8">
                                                <animateMotion
                                                    path={`M${a.px.toFixed(1)},${a.py.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${b.px.toFixed(1)},${b.py.toFixed(1)}`}
                                                    dur="1.5s"
                                                    repeatCount="indefinite"
                                                />
                                            </circle>
                                        </g>
                                    );
                                })}
                            </svg>
                        )}
                        {!mounted && <div style={{ width: 500, height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: '0.7rem', letterSpacing: '4px' }}>LOADING ATLAS...</div>}
                    </div>

                    <div className="globe-legend">
                        <div className="legend-title">ACTIVE TECH HUBS</div>
                        {HOTSPOTS.filter((h, i, a) => a.findIndex(x => x.name === h.name) === i).map((h, i) => (
                            <div key={i} className="legend-item">
                                <span className="legend-dot" style={{ background: h.color, boxShadow: `0 0 6px ${h.color}` }} />
                                <span className="legend-name">{h.name}</span>
                                <span className="legend-live" style={{ color: h.color }}>●</span>
                            </div>
                        ))}
                        <div className="globe-stat-row">
                            <div className="globe-stat">
                                <span>15</span>TECH HUBS
                            </div>
                            <div className="globe-stat">
                                <span>24/7</span>UPTIME
                            </div>
                            <div className="globe-stat">
                                <span>{Math.round(angle)}°</span>ROTATION
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .globe-header {
                    text-align: center;
                    margin-bottom: 50px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                }
                .globe-badge {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.6rem;
                    letter-spacing: 4px;
                    color: var(--neon-purple);
                    font-weight: 900;
                    background: rgba(188,19,254,0.06);
                    border: 1px solid rgba(188,19,254,0.2);
                    padding: 6px 16px;
                    border-radius: 20px;
                }
                .globe-layout {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 60px;
                    flex-wrap: wrap;
                }
                .globe-wrap {
                    position: relative;
                    filter: drop-shadow(0 0 40px rgba(188,19,254,0.3));
                }
                .globe-svg {
                    display: block;
                    border-radius: 50%;
                    cursor: grab;
                }
                .globe-legend {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    min-width: 220px;
                }
                .legend-title {
                    font-size: 0.5rem;
                    letter-spacing: 4px;
                    color: #444;
                    font-weight: 900;
                    margin-bottom: 8px;
                    border-bottom: 1px solid #1a1a1a;
                    padding-bottom: 8px;
                }
                .legend-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 0.58rem;
                    letter-spacing: 2px;
                }
                .legend-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    flex-shrink: 0;
                }
                .legend-name { flex: 1; color: #888; }
                .legend-live { font-size: 0.4rem; animation: pulse-dot 1.5s ease-in-out infinite; }
                .globe-stat-row {
                    display: flex;
                    gap: 14px;
                    margin-top: 20px;
                    border-top: 1px solid #1a1a1a;
                    padding-top: 16px;
                }
                .globe-stat {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 3px;
                    font-size: 0.44rem;
                    letter-spacing: 2px;
                    color: #444;
                }
                .globe-stat span {
                    font-size: 1.1rem;
                    font-weight: 900;
                    font-family: 'Courier New', monospace;
                    color: var(--neon-purple);
                }
                @media (max-width: 800px) {
                    .globe-layout { flex-direction: column; }
                    .globe-svg { width: 300px; height: 300px; }
                }
            `}</style>
        </section>
    );
}
