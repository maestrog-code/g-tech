'use client';
import { useState, useEffect, useRef } from 'react';

const BOOT_LINES = [
    '> INITIALIZING G-TECH NEURAL CORE v5.0...',
    '> LOADING QUANTUM UPLINK PROTOCOLS...',
    '> SYNCING ARCHIVE DATABASE: 847 ENTRIES FOUND.',
    '> DEPLOYING CYBERBUDDY AGENT: OPEN_CLAW_X',
    '> CALIBRATING PARTICLE NETWORK: 80 NODES ACTIVE.',
    '> CONNECTING TO HACKER NEWS API FEED...',
    '> ENABLING HOLO-SECTORS: ALL 9 ONLINE.',
    '> CITIZEN REGISTRY UPLINK READY.',
    '> SECURITY PROTOCOLS ENGAGED.',
    '> ALL SYSTEMS: ✓ — UPLINK ESTABLISHED.',
];

const SKIP_KEY = 'gtech_booted_v3';

export default function BootSequence() {
    const [phase, setPhase] = useState('LOGO');   // LOGO → LINES → DONE
    const [lines, setLines] = useState([]);
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(true);
    const [logoOpacity, setLogoOpacity] = useState(0);
    const hasBooted = useRef(false);

    useEffect(() => {
        // Only run once per session
        if (sessionStorage.getItem(SKIP_KEY)) {
            setVisible(false);
            return;
        }
        sessionStorage.setItem(SKIP_KEY, '1');

        let raf;
        // Phase 1 — Logo fade in
        let start = performance.now();
        const fadeLogo = (ts) => {
            const t = Math.min((ts - start) / 800, 1);
            setLogoOpacity(t);
            if (t < 1) raf = requestAnimationFrame(fadeLogo);
            else {
                setTimeout(() => setPhase('LINES'), 300);
            }
        };
        raf = requestAnimationFrame(fadeLogo);
        return () => cancelAnimationFrame(raf);
    }, []);

    // Phase 2 — stream lines
    useEffect(() => {
        if (phase !== 'LINES') return;
        let i = 0;
        const interval = setInterval(() => {
            if (i < BOOT_LINES.length) {
                setLines(prev => [...prev, BOOT_LINES[i]]);
                setProgress(Math.round(((i + 1) / BOOT_LINES.length) * 100));
                i++;
            } else {
                clearInterval(interval);
                setTimeout(() => setPhase('FLASH'), 400);
            }
        }, 200);
        return () => clearInterval(interval);
    }, [phase]);

    // Phase 3 — flash then dissolve
    useEffect(() => {
        if (phase !== 'FLASH') return;
        const timer = setTimeout(() => {
            setPhase('DISSOLVE');
            setTimeout(() => setVisible(false), 800);
        }, 500);
        return () => clearTimeout(timer);
    }, [phase]);

    if (!visible) return null;

    return (
        <div className={`boot-overlay ${phase === 'DISSOLVE' ? 'dissolve' : ''}`}>
            {/* Scanline effect */}
            <div className="boot-scanlines" />

            {/* Logo */}
            <div className="boot-logo-wrap" style={{ opacity: logoOpacity }}>
                <img src="/assets/logo_new.png" alt="G-Tech" className="boot-logo-img" />
                <div className="boot-brand">G-TECH</div>
                <div className="boot-tagline">PORTAL TO THE FUTURE</div>
            </div>

            {/* Terminal lines */}
            {phase !== 'LOGO' && (
                <div className="boot-terminal">
                    {lines.map((l, i) => (
                        <div key={i} className="boot-line" style={{ animationDelay: `${i * 0.05}s` }}>
                            {l}
                        </div>
                    ))}
                    {phase === 'FLASH' && (
                        <div className="boot-line flash-line">{'> UPLINK ESTABLISHED. WELCOME, CITIZEN.'}</div>
                    )}
                </div>
            )}

            {/* Progress bar */}
            {phase !== 'LOGO' && (
                <div className="boot-progress-wrap">
                    <div className="boot-progress-bar" style={{ width: `${progress}%` }} />
                    <div className="boot-progress-label">{progress}%</div>
                </div>
            )}

            {/* Skip */}
            <button className="boot-skip" onClick={() => setVisible(false)}>SKIP →</button>

            <style jsx>{`
                .boot-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 99999;
                    background: #000;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 40px;
                    transition: opacity 0.8s ease;
                }
                .boot-overlay.dissolve { opacity: 0; pointer-events: none; }

                .boot-scanlines {
                    position: absolute;
                    inset: 0;
                    background: repeating-linear-gradient(
                        to bottom,
                        transparent 0,
                        transparent 2px,
                        rgba(0,0,0,0.15) 2px,
                        rgba(0,0,0,0.15) 4px
                    );
                    pointer-events: none;
                    animation: scanline-move 8s linear infinite;
                }
                @keyframes scanline-move {
                    from { background-position: 0 0; }
                    to   { background-position: 0 100vh; }
                }

                .boot-logo-wrap {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    transition: opacity 0.8s ease;
                }
                .boot-logo-img {
                    width: 120px;
                    height: 120px;
                    filter: drop-shadow(0 0 40px rgba(0,242,255,0.8));
                    animation: logo-pulse 2s ease-in-out infinite;
                }
                @keyframes logo-pulse {
                    0%,100% { filter: drop-shadow(0 0 30px rgba(0,242,255,0.6)); }
                    50%     { filter: drop-shadow(0 0 60px rgba(0,242,255,1)); }
                }
                .boot-brand {
                    font-size: 3.5rem;
                    font-weight: 900;
                    letter-spacing: 12px;
                    color: #fff;
                    text-shadow: 0 0 40px rgba(0,242,255,0.6);
                }
                .boot-tagline {
                    font-size: 0.6rem;
                    letter-spacing: 8px;
                    color: var(--neon-blue);
                    opacity: 0.6;
                }

                .boot-terminal {
                    width: 580px;
                    max-width: 92vw;
                    background: rgba(0,242,255,0.03);
                    border: 1px solid rgba(0,242,255,0.15);
                    border-radius: 8px;
                    padding: 20px 24px;
                    font-family: 'Courier New', monospace;
                    font-size: 0.72rem;
                    color: var(--neon-blue);
                    letter-spacing: 0.5px;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    max-height: 280px;
                    overflow: hidden;
                }
                .boot-line {
                    opacity: 0;
                    animation: line-appear 0.2s ease forwards;
                }
                @keyframes line-appear { to { opacity: 1; } }
                .flash-line {
                    color: #fff;
                    font-weight: 700;
                    animation: flash-pulse 0.5s ease infinite alternate;
                }
                @keyframes flash-pulse { from { opacity: 0.5; } to { opacity: 1; } }

                .boot-progress-wrap {
                    width: 580px;
                    max-width: 92vw;
                    position: relative;
                    height: 4px;
                    background: rgba(0,242,255,0.1);
                    border-radius: 2px;
                    overflow: visible;
                }
                .boot-progress-bar {
                    height: 100%;
                    background: var(--neon-blue);
                    border-radius: 2px;
                    box-shadow: 0 0 12px var(--neon-blue);
                    transition: width 0.2s ease;
                }
                .boot-progress-label {
                    position: absolute;
                    right: 0;
                    top: -20px;
                    font-size: 0.6rem;
                    color: var(--neon-blue);
                    letter-spacing: 2px;
                    font-family: monospace;
                }

                .boot-skip {
                    position: absolute;
                    bottom: 30px;
                    right: 30px;
                    background: transparent;
                    border: 1px solid rgba(255,255,255,0.15);
                    color: rgba(255,255,255,0.3);
                    padding: 6px 16px;
                    border-radius: 4px;
                    font-size: 0.6rem;
                    letter-spacing: 2px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .boot-skip:hover { color: #fff; border-color: rgba(255,255,255,0.5); }
            `}</style>
        </div>
    );
}
