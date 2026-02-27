'use client';
import React, { useState, useEffect, useRef } from 'react';
import Hero3D from './Hero3D';

const TAGLINES = [
    "EXPERIMENTING WITH THE FUTURE, TODAY.",
    "WHERE INNOVATION BECOMES REALITY.",
    "THE PULSE OF TOMORROW'S TECHNOLOGY.",
    "DECODING THE WORLD, ONE IDEA AT A TIME.",
    "THE DIGITAL FRONTIER STARTS HERE.",
];

export default function HeroSection() {
    const [taglineIndex, setTaglineIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [particles, setParticles] = useState([]);
    const [burstParticles, setBurstParticles] = useState([]);
    const [mounted, setMounted] = useState(false);
    const burstRef = useRef(null);

    // Typewriter effect
    useEffect(() => {
        setMounted(true);
        const fullText = TAGLINES[taglineIndex];
        let timeout;

        if (!isDeleting && displayText.length < fullText.length) {
            timeout = setTimeout(() => {
                setDisplayText(fullText.slice(0, displayText.length + 1));
            }, 50);
        } else if (!isDeleting && displayText.length === fullText.length) {
            timeout = setTimeout(() => setIsDeleting(true), 2500);
        } else if (isDeleting && displayText.length > 0) {
            timeout = setTimeout(() => {
                setDisplayText(fullText.slice(0, displayText.length - 1));
            }, 25);
        } else if (isDeleting && displayText.length === 0) {
            setIsDeleting(false);
            setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
        }

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, taglineIndex]);

    // Generate floating particles on client only
    useEffect(() => {
        const ps = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            left: `${(i * 5.3) % 100}%`,
            top: `${(i * 7.1) % 100}%`,
            size: `${(i % 4) + 2}px`,
            duration: `${6 + (i % 6)}s`,
            delay: `${(i * 0.3) % 4}s`,
            color: i % 3 === 0 ? 'var(--neon-blue)' : i % 3 === 1 ? 'var(--neon-purple)' : 'var(--neon-pink)',
        }));
        setParticles(ps);
    }, []);

    const handleEnterClick = (e) => {
        // Particle burst from button
        const rect = e.currentTarget.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const burst = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            x: cx,
            y: cy,
            angle: (i / 30) * 360 + (Math.random() - 0.5) * 12,
            speed: 80 + Math.random() * 140,
            size: 3 + Math.random() * 5,
            color: ['#00f2ff', '#bc13fe', '#ff00ea', '#00ff66', '#ff9d00'][i % 5],
        }));
        setBurstParticles(burst);
        setTimeout(() => setBurstParticles([]), 800);

        // Screen shake
        document.body.classList.add('screen-shake');
        setTimeout(() => document.body.classList.remove('screen-shake'), 400);

        const el = document.getElementById('chronicles');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id="hero" className="hero-container" style={{ padding: '60px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {/* Floating Particles */}
            {mounted && particles.map(p => (
                <div
                    key={p.id}
                    className="particle"
                    style={{
                        left: p.left,
                        top: p.top,
                        width: p.size,
                        height: p.size,
                        background: p.color,
                        boxShadow: `0 0 6px ${p.color}`,
                        animationDuration: p.duration,
                        animationDelay: p.delay,
                    }}
                />
            ))}

            <Hero3D />

            <div className="glass float-animation" style={{ maxWidth: '800px', margin: '-100px auto 0', padding: '60px', position: 'relative', zIndex: 10 }}>
                {/* Premium Logo + Wordmark */}
                <div className="logo-block">
                    <div className="logo-image-wrap">
                        <img src="/assets/logo_new.png" alt="G-Tech Logo" className="dynamic-logo-new" />
                        <div className="logo-glow-ring" />
                    </div>
                    <div className="wordmark-wrap">
                        <h1 className="wordmark-title">
                            {'G-TECH'.split('').map((ch, i) => (
                                <span key={i} className="wordmark-letter" style={{ animationDelay: `${i * 0.12}s` }}>
                                    {ch === '-' ? <span className="wordmark-dash">—</span> : ch}
                                </span>
                            ))}
                        </h1>
                        <div className="wordmark-sub">
                            <span className="sub-line" />
                            <span className="sub-text">PORTAL TO THE FUTURE</span>
                            <span className="sub-line" />
                        </div>
                    </div>
                </div>

                <div className="typewriter-wrap">
                    <p className="typewriter-text">
                        {displayText}
                        <span className="caret">|</span>
                    </p>
                </div>

                <div className="hero-actions">
                    <button className="neon-border-purple enter-btn" onClick={handleEnterClick}>
                        Enter The Verse
                    </button>
                    <div className="scroll-nudge">
                        <span>SCROLL TO EXPLORE</span>
                        <span className="scroll-arrow">↓</span>
                    </div>
                </div>
            </div>

            {/* Burst particles */}
            {burstParticles.map(p => (
                <div
                    key={p.id}
                    style={{
                        position: 'fixed',
                        left: p.x,
                        top: p.y,
                        width: p.size,
                        height: p.size,
                        borderRadius: '50%',
                        background: p.color,
                        boxShadow: `0 0 8px ${p.color}`,
                        pointerEvents: 'none',
                        zIndex: 99999,
                        animation: `burst-fly-${p.id % 5} 0.7s ease-out forwards`,
                        transform: `translate(-50%, -50%)`,
                    }}
                />
            ))}

            <style jsx>{`
                @keyframes burst-fly-0 { to { transform: translate(calc(-50% + ${Math.cos(0) * 120}px), calc(-50% + ${Math.sin(0) * 120}px)) scale(0); opacity: 0; } }
                @keyframes burst-fly-1 { to { transform: translate(calc(-50% + ${Math.cos(1.26) * 120}px), calc(-50% + ${Math.sin(1.26) * 120}px)) scale(0); opacity: 0; } }
                @keyframes burst-fly-2 { to { transform: translate(calc(-50% + ${Math.cos(2.51) * 120}px), calc(-50% + ${Math.sin(2.51) * 120}px)) scale(0); opacity: 0; } }
                @keyframes burst-fly-3 { to { transform: translate(calc(-50% + ${Math.cos(3.77) * 120}px), calc(-50% + ${Math.sin(3.77) * 120}px)) scale(0); opacity: 0; } }
                @keyframes burst-fly-4 { to { transform: translate(calc(-50% + ${Math.cos(5.03) * 120}px), calc(-50% + ${Math.sin(5.03) * 120}px)) scale(0); opacity: 0; } }
            `}</style>

            <style jsx>{`
                .hero-container {
                    position: relative;
                    overflow: hidden;
                }
                .typewriter-wrap {
                    min-height: 60px;
                    margin-bottom: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .typewriter-text {
                    font-size: 1rem;
                    color: #bbb;
                    letter-spacing: 2px;
                    font-family: 'Courier New', monospace;
                    text-transform: uppercase;
                }
                .caret {
                    display: inline-block;
                    color: var(--neon-blue);
                    animation: blink-caret 0.75s step-end infinite;
                    margin-left: 2px;
                    font-weight: 100;
                }
                .hero-actions {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                }
                .enter-btn {
                    background: transparent;
                    color: #fff;
                    padding: 14px 40px;
                    font-size: 1rem;
                    cursor: pointer;
                    border-radius: 4px;
                    text-transform: uppercase;
                    letter-spacing: 3px;
                    transition: all 0.3s ease;
                    font-weight: 700;
                }
                .enter-btn:hover {
                    background: var(--neon-purple);
                    box-shadow: 0 0 40px var(--neon-purple);
                    transform: scale(1.05);
                }
                .scroll-nudge {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    opacity: 0.4;
                    font-size: 0.55rem;
                    letter-spacing: 3px;
                    color: #fff;
                }
                .scroll-arrow {
                    animation: float 2s ease-in-out infinite;
                    font-size: 1.2rem;
                }
                .logo-block {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 28px;
                    margin-bottom: 30px;
                }
                .logo-image-wrap {
                    position: relative;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .dynamic-logo-new {
                    width: 110px;
                    height: 110px;
                    object-fit: contain;
                    filter: drop-shadow(0 0 20px rgba(0,242,255,0.6));
                    animation: logo-breathe 4s ease-in-out infinite;
                    position: relative;
                    z-index: 2;
                }
                @keyframes logo-breathe {
                    0%, 100% { filter: drop-shadow(0 0 15px #00f2ff88); transform: scale(1); }
                    50% { filter: drop-shadow(0 0 40px #00f2ffcc); transform: scale(1.05); }
                }
                .logo-glow-ring {
                    position: absolute;
                    width: 135px;
                    height: 135px;
                    border-radius: 50%;
                    border: 1px solid rgba(0,242,255,0.35);
                    animation: ring-pulse 2.5s ease-in-out infinite;
                    z-index: 1;
                }
                @keyframes ring-pulse {
                    0%, 100% { transform: scale(1); opacity: 0.6; }
                    50% { transform: scale(1.18); opacity: 0; }
                }
                .wordmark-wrap {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 10px;
                }
                .wordmark-title {
                    display: flex;
                    align-items: baseline;
                    font-size: 5rem;
                    font-weight: 900;
                    line-height: 1;
                    letter-spacing: 6px;
                    color: #fff;
                    text-shadow: 0 0 30px rgba(0,242,255,0.4);
                    margin: 0;
                }
                .wordmark-letter {
                    display: inline-block;
                    animation: letter-glow 3s ease-in-out infinite;
                }
                @keyframes letter-glow {
                    0%, 100% { text-shadow: 0 0 10px rgba(0,242,255,0.3); }
                    50% { text-shadow: 0 0 35px rgba(0,242,255,1), 0 0 70px rgba(0,242,255,0.3); }
                }
                .wordmark-dash {
                    font-size: 3rem;
                    color: var(--neon-blue);
                    padding: 0 4px;
                    opacity: 0.5;
                }
                .wordmark-sub {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .sub-line {
                    display: block;
                    height: 1px;
                    width: 60px;
                    background: linear-gradient(90deg, transparent, var(--neon-blue), transparent);
                    opacity: 0.35;
                }
                .sub-text {
                    font-size: 0.5rem;
                    letter-spacing: 6px;
                    color: var(--neon-blue);
                    font-weight: 700;
                    white-space: nowrap;
                    opacity: 0.6;
                }
            `}</style>
        </section>
    );
}
