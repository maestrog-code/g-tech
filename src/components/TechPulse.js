'use client';
import React, { useState, useEffect, useRef } from 'react';

const STATS = [
    {
        id: 'ai',
        label: 'AI MODELS TRAINED',
        subtitle: 'GLOBALLY TODAY',
        icon: '🤖',
        base: 142000,
        rate: 3, // per second
        color: '#00f2ff',
        unit: '',
        format: (n) => n.toLocaleString(),
    },
    {
        id: 'patents',
        label: 'TECH PATENTS FILED',
        subtitle: 'SINCE MIDNIGHT UTC',
        icon: '📋',
        base: 8420,
        rate: 0.02,
        color: '#bc13fe',
        unit: '',
        format: (n) => n.toLocaleString(),
    },
    {
        id: 'satellites',
        label: 'SATELLITES IN ORBIT',
        subtitle: 'ACTIVE CONSTELLATION',
        icon: '🛰️',
        base: 9317,
        rate: 0,
        color: '#ff9d00',
        unit: '',
        format: (n) => n.toLocaleString(),
    },
    {
        id: 'commits',
        label: 'CODE COMMITS',
        subtitle: 'GITHUB THIS HOUR',
        icon: '💻',
        base: 380000,
        rate: 28,
        color: '#00ff66',
        unit: '',
        format: (n) => n.toLocaleString(),
    },
    {
        id: 'startups',
        label: 'TECH STARTUPS',
        subtitle: 'FOUNDED THIS YEAR',
        icon: '🚀',
        base: 47381,
        rate: 0.005,
        color: '#ff00ea',
        unit: '',
        format: (n) => n.toLocaleString(),
    },
    {
        id: 'data',
        label: 'DATA GENERATED',
        subtitle: 'TERABYTES TODAY',
        icon: '📡',
        base: 2850000,
        rate: 120,
        color: '#ffcc00',
        unit: ' TB',
        format: (n) => n.toLocaleString(),
    },
];

function StatCard({ stat, elapsed }) {
    const value = Math.floor(stat.base + stat.rate * elapsed);
    const prevValue = Math.floor(stat.base + stat.rate * Math.max(0, elapsed - 1));
    const isChanging = value !== prevValue;

    // Generate mini sparkline heights (deterministic from stat.id)
    const bars = Array.from({ length: 12 }, (_, i) => {
        const seed = stat.id.charCodeAt(i % stat.id.length) + i;
        return 20 + ((seed * 7 + elapsed * (i + 1)) % 80);
    });

    return (
        <div className="stat-card glass" style={{ borderTop: `2px solid ${stat.color}`, boxShadow: `0 0 30px ${stat.color}0d` }}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-subtitle">{stat.subtitle}</div>
            <div className={`stat-value ${isChanging ? 'popping' : ''}`} style={{ color: stat.color, textShadow: `0 0 15px ${stat.color}66` }}>
                {stat.format(value)}{stat.unit}
            </div>
            {/* Mini sparkline */}
            <div className="sparkline">
                {bars.map((h, i) => (
                    <div key={i} className="spark-bar" style={{ height: `${h % 100}%`, background: stat.color, opacity: 0.4 + (i / 12) * 0.6 }} />
                ))}
            </div>
            <div className="stat-live" style={{ color: stat.color }}>
                <span className="live-dot" style={{ background: stat.color, boxShadow: `0 0 6px ${stat.color}` }} />
                LIVE
            </div>

            <style jsx>{`
                .stat-card {
                    padding: 30px 25px 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    border-radius: 12px;
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.3s ease;
                }
                .stat-card:hover {
                    transform: translateY(-4px);
                }
                .stat-icon { font-size: 1.8rem; }
                .stat-label { font-size: 0.6rem; letter-spacing: 3px; font-weight: 900; color: #fff; }
                .stat-subtitle { font-size: 0.5rem; color: #444; letter-spacing: 2px; text-transform: uppercase; }
                .stat-value {
                    font-size: 2rem;
                    font-weight: 900;
                    font-family: 'Courier New', monospace;
                    letter-spacing: 2px;
                    margin: 5px 0;
                    transition: all 0.3s ease;
                }
                .stat-value.popping {
                    animation: counter-pop 0.3s ease;
                }
                .sparkline {
                    display: flex;
                    align-items: flex-end;
                    gap: 2px;
                    height: 30px;
                    margin-top: 5px;
                }
                .spark-bar {
                    flex: 1;
                    border-radius: 1px;
                    min-height: 2px;
                    transition: height 1s ease;
                }
                .stat-live {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.5rem;
                    letter-spacing: 3px;
                    font-weight: 700;
                    opacity: 0.7;
                    margin-top: 5px;
                }
            `}</style>
        </div>
    );
}

export default function TechPulse() {
    const [elapsed, setElapsed] = useState(0);
    const [mounted, setMounted] = useState(false);
    const startRef = useRef(Date.now());

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => {
            setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!mounted) {
        return (
            <section id="pulse" style={{ padding: '80px 20px', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: '#333', letterSpacing: '4px', fontSize: '0.7rem' }}>CONNECTING TO GLOBAL FEED...</div>
            </section>
        );
    }

    return (
        <section id="pulse" style={{ padding: '80px 20px' }}>
            <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
                <div className="pulse-header">
                    <div className="pulse-badge">
                        <span className="live-dot" />
                        LIVE FEED
                    </div>
                    <h2 className="neon-text-blue" style={{ fontSize: '2.8rem', letterSpacing: '10px' }}>TECH PULSE</h2>
                    <p className="pulse-sub">GLOBAL INNOVATION METRICS — UPDATING IN REAL TIME</p>
                </div>

                <div className="stats-grid">
                    {STATS.map(stat => (
                        <StatCard key={stat.id} stat={stat} elapsed={elapsed} />
                    ))}
                </div>

                <div className="pulse-footer glass">
                    <span>⚡ DATA IS ESTIMATED BASED ON GLOBAL TREND MODELS</span>
                    <span>SESSION TIME: {Math.floor(elapsed / 60)}m {elapsed % 60}s</span>
                </div>
            </div>

            <style jsx>{`
                .pulse-header {
                    text-align: center;
                    margin-bottom: 60px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                }
                .pulse-badge {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.6rem;
                    letter-spacing: 4px;
                    color: var(--neon-pink);
                    font-weight: 900;
                    background: rgba(255, 0, 234, 0.08);
                    border: 1px solid rgba(255, 0, 234, 0.2);
                    padding: 6px 16px;
                    border-radius: 20px;
                }
                .pulse-sub {
                    font-size: 0.65rem;
                    color: #555;
                    letter-spacing: 4px;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                    margin-bottom: 30px;
                }
                @media (max-width: 1000px) {
                    .stats-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 600px) {
                    .stats-grid { grid-template-columns: 1fr; }
                }
                .pulse-footer {
                    display: flex;
                    justify-content: space-between;
                    padding: 12px 25px;
                    font-size: 0.55rem;
                    color: #444;
                    letter-spacing: 2px;
                    border-radius: 8px;
                }
            `}</style>
        </section>
    );
}
