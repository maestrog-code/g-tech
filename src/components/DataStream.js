'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useAchievements } from './AchievementSystem';

const HEX_CHARS = '0123456789ABCDEF';
const PALETTE = ['#00f2ff', '#bc13fe', '#00ff66', '#ff9d00', '#ff00ea', '#ffcc00'];

function randomHex(len = 8) {
    return Array.from({ length: len }, () => HEX_CHARS[Math.floor(Math.random() * 16)]).join('');
}

function generateRow() {
    const addr = `0x${randomHex(8)}`;
    const bytes = Array.from({ length: 16 }, () => randomHex(2)).join(' ');
    const ascii = Array.from({ length: 16 }, () => {
        const c = Math.floor(Math.random() * 95) + 32;
        return String.fromCharCode(c);
    }).join('');
    return { addr, bytes, ascii, color: PALETTE[Math.floor(Math.random() * PALETTE.length)] };
}

export default function DataStream() {
    const { unlock } = useAchievements() || {};
    const [rows, setRows] = useState([]);
    const [mounted, setMounted] = useState(false);
    const [intercepting, setIntercepting] = useState(false);
    const [signal, setSignal] = useState(94.7);
    const watchTimer = useRef(null);
    const achieved = useRef(false);
    const sectionRef = useRef(null);

    // Populate rows on client only (avoids SSR Math.random() hydration mismatch)
    useEffect(() => {
        setRows(Array.from({ length: 18 }, generateRow));
        setMounted(true);
    }, []);

    // Scroll-based 10s DATA_RUNNER watch timer
    useEffect(() => {
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !achieved.current) {
                watchTimer.current = setTimeout(() => {
                    if (unlock) unlock('DATA_RUNNER');
                    achieved.current = true;
                }, 10000);
            } else {
                if (watchTimer.current) clearTimeout(watchTimer.current);
            }
        }, { threshold: 0.4 });
        if (sectionRef.current) obs.observe(sectionRef.current);
        return () => { obs.disconnect(); if (watchTimer.current) clearTimeout(watchTimer.current); };
    }, [unlock]);

    // Stream update loop — only runs after mount since rows starts empty
    useEffect(() => {
        if (!mounted) return;
        const iv = setInterval(() => {
            setRows(prev => {
                const next = [...prev];
                // Replace 3 random rows
                for (let i = 0; i < 3; i++) {
                    const idx = Math.floor(Math.random() * next.length);
                    next[idx] = generateRow();
                }
                return next;
            });
            setSignal(s => Math.min(99.9, Math.max(85, s + (Math.random() - 0.5) * 2)));
        }, 300);
        return () => clearInterval(iv);
    }, []);

    const handleIntercept = () => {
        setIntercepting(true);
        setTimeout(() => setIntercepting(false), 2000);
    };

    return (
        <section id="datastream" ref={sectionRef} style={{ padding: '80px 20px', position: 'relative', overflow: 'hidden' }}>
            {/* Background grid */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'linear-gradient(rgba(0,242,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,242,255,0.03) 1px, transparent 1px)',
                backgroundSize: '40px 40px', pointerEvents: 'none'
            }} />

            <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ fontSize: '0.6rem', letterSpacing: '6px', color: 'var(--neon-blue)', marginBottom: '8px', opacity: 0.7 }}>
                        ◈ SECTOR /// DATA STREAM
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '4px', color: '#fff', margin: 0 }}>
                        INTERCEPTING <span style={{ color: 'var(--neon-blue)' }}>DATA</span>
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginTop: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.6rem', letterSpacing: '2px', color: '#555' }}>
                            <span className="live-dot" />
                            LIVE FEED
                        </div>
                        <div style={{ fontSize: '0.6rem', letterSpacing: '2px', color: '#555' }}>
                            SIGNAL: <span style={{ color: 'var(--neon-green)' }}>{signal.toFixed(1)}%</span>
                        </div>
                        <button onClick={handleIntercept} style={{
                            background: 'transparent', border: `1px solid var(--neon-blue)`,
                            color: 'var(--neon-blue)', padding: '4px 14px', borderRadius: '4px',
                            fontSize: '0.55rem', letterSpacing: '2px', cursor: 'pointer',
                            transition: 'all 0.2s', fontWeight: 700,
                            boxShadow: intercepting ? '0 0 20px var(--neon-blue)' : 'none',
                        }}>
                            {intercepting ? 'INTERCEPTING…' : 'INTERCEPT'}
                        </button>
                    </div>
                </div>

                {/* Hex dump table */}
                <div className="glass" style={{ padding: '20px', fontFamily: "'Courier New', monospace", overflow: 'hidden', position: 'relative' }}>
                    {/* Scan line overlay */}
                    <div style={{
                        position: 'absolute', inset: 0, pointerEvents: 'none',
                        background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.08) 50%)',
                        backgroundSize: '100% 4px',
                    }} />
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                        background: 'linear-gradient(90deg, transparent, var(--neon-blue), transparent)',
                        animation: 'stream-scan 2s linear infinite', pointerEvents: 'none'
                    }} />

                    {/* Column headers */}
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 140px', gap: '16px', marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontSize: '0.45rem', letterSpacing: '3px', color: '#333', fontWeight: 700 }}>ADDRESS</span>
                        <span style={{ fontSize: '0.45rem', letterSpacing: '3px', color: '#333', fontWeight: 700 }}>HEX DATA</span>
                        <span style={{ fontSize: '0.45rem', letterSpacing: '3px', color: '#333', fontWeight: 700 }}>ASCII</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {rows.map((row, i) => (
                            <div key={i} style={{
                                display: 'grid', gridTemplateColumns: '120px 1fr 140px', gap: '16px',
                                padding: '3px 0', transition: 'all 0.3s ease',
                                borderBottom: '1px solid rgba(255,255,255,0.02)',
                            }}>
                                <span style={{ fontSize: '0.6rem', color: row.color, opacity: 0.85 }}>{row.addr}</span>
                                <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', fontVariantNumeric: 'tabular-nums', overflowX: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.bytes}</span>
                                <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', overflowX: 'hidden' }}>{row.ascii}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer stats */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '24px' }}>
                    {[
                        { label: 'PACKETS/SEC', val: '4,096' },
                        { label: 'TOTAL CAPTURED', val: '1.2 TB' },
                        { label: 'CIPHER', val: 'AES-256' },
                        { label: 'PROTOCOL', val: 'G-NET/v9' },
                    ].map(s => (
                        <div key={s.label} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--neon-blue)', fontFamily: 'monospace' }}>{s.val}</div>
                            <div style={{ fontSize: '0.45rem', letterSpacing: '3px', color: '#444', marginTop: '4px' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes stream-scan {
                    from { transform: translateY(0); opacity: 0.6; }
                    to   { transform: translateY(100%); opacity: 0; }
                }
            `}</style>
        </section>
    );
}
