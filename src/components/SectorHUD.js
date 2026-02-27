'use client';
import React, { useEffect, useState, useRef } from 'react';

const SECTORS = [
    { id: 'hero', label: 'VOID', color: '#00f2ff' },
    { id: 'pulse', label: 'PULSE', color: '#00ff66' },
    { id: 'timeline', label: 'CHRONOS', color: '#bc13fe' },
    { id: 'globe', label: 'ATLAS', color: '#bc13fe' },
    { id: 'chronicles', label: 'ARCHIVES', color: '#ff9d00' },
    { id: 'lab', label: 'LAB', color: '#ff00ea' },
    { id: 'forge', label: 'FORGE', color: '#ff6600' },
    { id: 'decoder', label: 'DECODE', color: '#ffcc00' },
    { id: 'datastream', label: 'DATA', color: '#00f2ff' },
    { id: 'cyberverse', label: 'VERSE', color: '#bc13fe' },
    { id: 'terminal', label: 'CLI', color: '#00ff41' },
    { id: 'countdown', label: 'COUNTDOWN', color: '#00f2ff' },
    { id: 'identity', label: 'IDENTITY', color: '#00f2ff' },
];

export default function SectorHUD() {
    const [active, setActive] = useState(null);
    const [visible, setVisible] = useState(false);
    const [xp, setXp] = useState(0);
    const [time, setTime] = useState('');
    const [visited, setVisited] = useState(new Set());
    const visitedRef = useRef(new Set());
    const obsRef = useRef([]);

    // Clock
    useEffect(() => {
        const tick = () => {
            const d = new Date();
            setTime(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`);
        };
        tick();
        const iv = setInterval(tick, 1000);
        return () => clearInterval(iv);
    }, []);

    // Intersection observers
    useEffect(() => {
        obsRef.current.forEach(o => o.disconnect());
        obsRef.current = [];

        SECTORS.forEach(sector => {
            const el = document.getElementById(sector.id);
            if (!el) return;
            const obs = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    setActive(sector);
                    setVisible(sector.id !== 'hero');

                    // XP progress based on order
                    const idx = SECTORS.findIndex(s => s.id === sector.id);
                    setXp(Math.round((idx / (SECTORS.length - 1)) * 100));

                    // Track visited sectors
                    visitedRef.current = new Set([...visitedRef.current, sector.id]);
                    setVisited(new Set(visitedRef.current));

                    // Dispatch SECTOR_GOD check
                    if (visitedRef.current.size >= SECTORS.length) {
                        window.dispatchEvent(new CustomEvent('gtech:all-sectors'));
                    }
                }
            }, { threshold: 0.3 });
            obs.observe(el);
            obsRef.current.push(obs);
        });

        return () => obsRef.current.forEach(o => o.disconnect());
    }, []);

    if (!visible || !active) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            right: '24px',
            transform: 'translateY(-50%)',
            zIndex: 1003,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '10px',
            pointerEvents: 'none',
            animation: 'hud-in 0.4s ease forwards',
        }}>
            {/* Sector label */}
            <div style={{
                background: 'rgba(0,0,0,0.85)',
                border: `1px solid ${active.color}55`,
                borderRadius: '8px',
                padding: '8px 14px',
                backdropFilter: 'blur(16px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '4px',
                boxShadow: `0 0 20px ${active.color}22`,
            }}>
                <div style={{ fontSize: '0.38rem', letterSpacing: '3px', color: '#444', fontWeight: 700 }}>CURRENT SECTOR</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 900, letterSpacing: '3px', color: active.color }}>
                    {active.label}
                </div>
            </div>

            {/* XP bar */}
            <div style={{
                background: 'rgba(0,0,0,0.85)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '8px',
                padding: '8px 14px',
                backdropFilter: 'blur(16px)',
                width: '120px',
            }}>
                <div style={{ fontSize: '0.38rem', letterSpacing: '3px', color: '#444', marginBottom: '6px', fontWeight: 700 }}>EXPLORE XP</div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.07)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                        height: '100%',
                        width: `${xp}%`,
                        background: `linear-gradient(90deg, ${active.color}, #bc13fe)`,
                        borderRadius: '2px',
                        boxShadow: `0 0 8px ${active.color}`,
                        transition: 'width 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
                    }} />
                </div>
                <div style={{ fontSize: '0.45rem', color: active.color, marginTop: '4px', textAlign: 'right', fontWeight: 700 }}>{xp}%</div>
            </div>

            {/* Clock */}
            <div style={{
                background: 'rgba(0,0,0,0.85)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '8px',
                padding: '6px 14px',
                backdropFilter: 'blur(16px)',
                fontFamily: "'Courier New', monospace",
                fontSize: '0.78rem',
                color: 'rgba(255,255,255,0.2)',
                fontWeight: 700,
                letterSpacing: '2px',
            }}>
                {time}
            </div>

            {/* Sector dots */}
            <div style={{
                background: 'rgba(0,0,0,0.85)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '8px',
                padding: '8px 14px',
                backdropFilter: 'blur(16px)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '5px',
                width: '120px',
                justifyContent: 'flex-end',
            }}>
                {SECTORS.filter(s => s.id !== 'hero').map(s => (
                    <div key={s.id} style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: visited.has(s.id) ? s.color : 'rgba(255,255,255,0.1)',
                        boxShadow: visited.has(s.id) ? `0 0 6px ${s.color}` : 'none',
                        transition: 'all 0.3s ease',
                    }} title={s.label} />
                ))}
            </div>

            <style jsx>{`
                @keyframes hud-in {
                    from { opacity: 0; transform: translateY(-50%) translateX(20px); }
                    to   { opacity: 1; transform: translateY(-50%) translateX(0); }
                }
            `}</style>
        </div>
    );
}
