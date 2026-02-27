'use client';
import React, { useState, useEffect, useRef } from 'react';

const EVENTS = [
    { name: 'CES 2027', date: '2027-01-05', icon: '🎪', color: '#00f2ff', desc: 'Consumer Electronics Show — Las Vegas' },
    { name: 'WWDC 2026', date: '2026-06-08', icon: '🍎', color: '#bc13fe', desc: 'Apple Worldwide Developers Conference' },
    { name: 'Google I/O 2026', date: '2026-05-20', icon: '🔍', color: '#00ff66', desc: 'Google Developer Conference — Mountain View' },
    { name: 'MWC 2027', date: '2027-02-22', icon: '📱', color: '#ff9d00', desc: 'Mobile World Congress — Barcelona' },
    { name: 'DEF CON 34', date: '2026-08-06', icon: '🔐', color: '#ff0055', desc: "World's Largest Cybersecurity Conference" },
    { name: 'AWS re:Invent 2026', date: '2026-11-30', icon: '☁️', color: '#ffcc00', desc: 'Amazon Web Services Annual Conference' },
];

function useCountdown(targetDate) {
    const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

    useEffect(() => {
        const tick = () => {
            const now = Date.now();
            const end = new Date(targetDate).getTime();
            const diff = Math.max(0, end - now);
            setTimeLeft({
                d: Math.floor(diff / 86400000),
                h: Math.floor((diff % 86400000) / 3600000),
                m: Math.floor((diff % 3600000) / 60000),
                s: Math.floor((diff % 60000) / 1000),
            });
        };
        tick();
        const iv = setInterval(tick, 1000);
        return () => clearInterval(iv);
    }, [targetDate]);

    return timeLeft;
}

function EventCard({ event, isActive }) {
    const t = useCountdown(event.date);
    const pad = n => String(n).padStart(2, '0');

    return (
        <div className={`event-card glass ${isActive ? 'active' : ''}`}
            style={{ borderTop: `2px solid ${event.color}`, boxShadow: isActive ? `0 0 40px ${event.color}22` : 'none' }}>
            <div className="ev-icon">{event.icon}</div>
            <div className="ev-name" style={{ color: event.color }}>{event.name}</div>
            <div className="ev-desc">{event.desc}</div>

            <div className="ev-countdown">
                {[['DAYS', t.d], ['HRS', t.h], ['MIN', t.m], ['SEC', t.s]].map(([label, val]) => (
                    <div key={label} className="ev-unit">
                        <span className="ev-num" style={{ color: event.color, textShadow: `0 0 12px ${event.color}66` }}>
                            {label === 'DAYS' ? t.d : pad(val)}
                        </span>
                        <span className="ev-label">{label}</span>
                    </div>
                ))}
            </div>

            <div className="ev-date" style={{ color: '#444' }}>
                {new Date(event.date).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>

            <style jsx>{`
                .event-card {
                    padding: 28px 22px;
                    border-radius: 14px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                .event-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.02), transparent);
                    pointer-events: none;
                }
                .event-card:hover { transform: translateY(-4px); }
                .event-card.active { border: 1px solid; border-top-width: 2px; border-color: ${event.color}33; }
                .ev-icon { font-size: 2rem; }
                .ev-name { font-size: 0.8rem; font-weight: 900; letter-spacing: 2px; }
                .ev-desc { font-size: 0.55rem; color: #555; letter-spacing: 1px; line-height: 1.5; }
                .ev-countdown {
                    display: flex;
                    gap: 12px;
                    margin: 10px 0 6px;
                }
                .ev-unit {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 3px;
                }
                .ev-num {
                    font-size: 1.8rem;
                    font-weight: 900;
                    font-family: 'Courier New', monospace;
                    letter-spacing: 2px;
                    line-height: 1;
                }
                .ev-label {
                    font-size: 0.38rem;
                    letter-spacing: 3px;
                    color: #444;
                    font-weight: 700;
                }
                .ev-date { font-size: 0.48rem; letter-spacing: 2px; }
            `}</style>
        </div>
    );
}

export default function TechCountdown() {
    const [mounted, setMounted] = useState(false);
    const [activeIdx, setActiveIdx] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        setMounted(true);
        // Find the next upcoming event
        const now = Date.now();
        const nextIdx = EVENTS.findIndex(e => new Date(e.date).getTime() > now);
        if (nextIdx !== -1) setActiveIdx(nextIdx);
    }, []);

    // Auto-cycle active card
    useEffect(() => {
        timerRef.current = setInterval(() => {
            setActiveIdx(i => (i + 1) % EVENTS.length);
        }, 8000);
        return () => clearInterval(timerRef.current);
    }, []);

    if (!mounted) return null;

    return (
        <section id="countdown" style={{ padding: '80px 20px', background: 'linear-gradient(180deg, transparent, rgba(0,242,255,0.02), transparent)' }}>
            <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
                <div className="cd-header">
                    <div className="cd-badge">
                        <span className="live-dot" style={{ background: '#00f2ff' }} />
                        UPCOMING EVENTS
                    </div>
                    <h2 className="neon-text-blue" style={{ fontSize: '2.5rem', letterSpacing: '10px' }}>TECH COUNTDOWN</h2>
                    <p style={{ fontSize: '0.65rem', color: '#555', letterSpacing: '4px' }}>MARK YOUR CALENDAR — THE FUTURE IS SCHEDULED</p>
                </div>

                <div className="cd-grid">
                    {EVENTS.map((event, i) => (
                        <div key={event.name} onClick={() => { setActiveIdx(i); clearInterval(timerRef.current); }}>
                            <EventCard event={event} isActive={i === activeIdx} />
                        </div>
                    ))}
                </div>

                <div className="cd-dots">
                    {EVENTS.map((e, i) => (
                        <button
                            key={i}
                            className={`cd-dot ${i === activeIdx ? 'active' : ''}`}
                            style={i === activeIdx ? { background: e.color, boxShadow: `0 0 8px ${e.color}` } : {}}
                            onClick={() => { setActiveIdx(i); clearInterval(timerRef.current); }}
                        />
                    ))}
                </div>
            </div>

            <style jsx>{`
                .cd-header {
                    text-align: center;
                    margin-bottom: 50px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                }
                .cd-badge {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.6rem;
                    letter-spacing: 4px;
                    color: var(--neon-blue);
                    font-weight: 900;
                    background: rgba(0,242,255,0.06);
                    border: 1px solid rgba(0,242,255,0.2);
                    padding: 6px 16px;
                    border-radius: 20px;
                }
                .cd-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                    margin-bottom: 30px;
                }
                @media (max-width: 1000px) { .cd-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (max-width: 600px) { .cd-grid { grid-template-columns: 1fr; } }
                .cd-dots {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 20px;
                }
                .cd-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #222;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .cd-dot.active { width: 24px; border-radius: 4px; }
            `}</style>
        </section>
    );
}
