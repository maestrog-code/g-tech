'use client';
import React from 'react';

/**
 * BuddyBody — Advanced humanoid SVG avatar for CyberBuddy.
 * Featuring:
 * - Richer head & visor with hex panels and expressions
 * - Circuit board torso with animated data pulses
 * - Segmented robotic hands/claws
 * - Thruster exhaust jets (Tier 6+)
 * - Shoulder spike plating (Tier 5+)
 * - Shimmering holographic overlay
 */
export default function BuddyBody({
    moodColor = '#00f2ff',
    isGlitching = false,
    isTalking = false,
    isWalking = false,
    scale = 1,
    level = 1,
}) {
    const w = Math.round(90 * scale);
    const h = Math.round(144 * scale);

    // Tier flags
    const isElite = level >= 5;
    const isGold = level >= 6;
    const isFire = level >= 8;
    const isRainbow = level >= 10;

    const trimColor = isRainbow ? '#bc13fe' : isGold ? '#ffcc00' : moodColor;

    return (
        <div
            className={`buddy-body-root ${isGlitching ? 'glitch' : ''} ${isWalking ? 'walking' : 'idle'} ${isGold ? 'lvl-gold' : ''} ${isFire ? 'lvl-fire' : ''} ${isRainbow ? 'lvl-rainbow' : ''}`}
            style={{ width: w, height: h, position: 'relative' }}
            aria-label="CyberBuddy Avatar"
        >
            {/* Level badge */}
            {level > 1 && (
                <div className="lvl-badge" style={{ background: trimColor, boxShadow: `0 0 10px ${trimColor}` }}>
                    LVL {level}
                </div>
            )}

            <svg
                viewBox="0 -10 100 170"
                width={w}
                height={h + 10}
                xmlns="http://www.w3.org/2000/svg"
                style={{ overflow: 'visible' }}
            >
                <defs>
                    <linearGradient id="body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={moodColor} stopOpacity="0.25" />
                        <stop offset="100%" stopColor={moodColor} stopOpacity="0.05" />
                    </linearGradient>

                    <linearGradient id="visor-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={moodColor} stopOpacity="0.95" />
                        <stop offset="100%" stopColor={moodColor} stopOpacity="0.2" />
                    </linearGradient>

                    <filter id="glow">
                        <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    <pattern id="hex-grid" width="8" height="14" patternUnits="userSpaceOnUse" patternTransform="scale(0.5)">
                        <path d="M4 0 L8 2 L8 7 L4 9 L0 7 L0 2 Z" fill="none" stroke={moodColor} strokeWidth="0.5" strokeOpacity="0.3" />
                    </pattern>

                    {/* Mask for data pulses */}
                    <mask id="torso-mask">
                        <rect x="26" y="68" width="48" height="52" rx="8" fill="white" />
                    </mask>
                </defs>

                {/* === BACK LAYER (Wings/Thrusters) === */}
                {isGold && (
                    <g className="thrusters">
                        {/* Boosters behind legs */}
                        <path d="M30,146 L37,165 L44,146 Z" fill={moodColor} fillOpacity="0.6" className="jet-flame">
                            <animate attributeName="opacity" values="0.4;0.9;0.4" dur="0.1s" repeatCount="indefinite" />
                        </path>
                        <path d="M56,146 L63,165 L70,146 Z" fill={moodColor} fillOpacity="0.6" className="jet-flame">
                            <animate attributeName="opacity" values="0.4;0.9;0.4" dur="0.1s" repeatCount="indefinite" />
                        </path>
                    </g>
                )}

                {/* === LEGS === */}
                <g className={isWalking ? 'walk-legs' : 'idle-legs'}>
                    <g className="leg-l-group">
                        <rect x="30" y="118" width="14" height="28" rx="4" fill="url(#body-grad)" stroke={moodColor} strokeWidth="1.5" />
                        <rect x="25" y="142" width="22" height="6" rx="2" fill={moodColor} fillOpacity="0.4" />
                        {/* Circuit trace on leg */}
                        <path d="M37,118 V140" stroke={moodColor} strokeWidth="0.5" strokeOpacity="0.3" fill="none" />
                    </g>
                    <g className="leg-r-group">
                        <rect x="56" y="118" width="14" height="28" rx="4" fill="url(#body-grad)" stroke={moodColor} strokeWidth="1.5" />
                        <rect x="53" y="142" width="22" height="6" rx="2" fill={moodColor} fillOpacity="0.4" />
                        <path d="M63,118 V140" stroke={moodColor} strokeWidth="0.5" strokeOpacity="0.3" fill="none" />
                    </g>
                </g>

                {/* === TORSO === */}
                <rect x="26" y="68" width="48" height="52" rx="8" fill="url(#body-grad)" stroke={moodColor} strokeWidth="2" />

                {/* Circuit Traces */}
                <g className="circuit-traces" mask="url(#torso-mask)">
                    <path d="M26,80 H40 V96 H26" stroke={moodColor} strokeWidth="0.5" strokeOpacity="0.2" fill="none" />
                    <path d="M74,80 H60 V96 H74" stroke={moodColor} strokeWidth="0.5" strokeOpacity="0.2" fill="none" />
                    <path d="M50,68 V80" stroke={moodColor} strokeWidth="0.5" strokeOpacity="0.2" fill="none" />
                    <path d="M50,96 V120" stroke={moodColor} strokeWidth="0.5" strokeOpacity="0.2" fill="none" />

                    {/* Animated Pulses */}
                    <circle r="1" fill={moodColor} className="data-pulse-1">
                        <animateMotion path="M50,68 V80" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle r="1" fill={moodColor} className="data-pulse-2">
                        <animateMotion path="M74,80 H60 V96" dur="3s" repeatCount="indefinite" />
                    </circle>
                </g>

                {/* Elite Plating (Shoulder Spikes) */}
                {isElite && (
                    <g className="elite-plating">
                        <path d="M22,70 L14,60 L26,66 Z" fill={moodColor} stroke={moodColor} strokeWidth="1" />
                        <path d="M78,70 L86,60 L74,66 Z" fill={moodColor} stroke={moodColor} strokeWidth="1" />
                    </g>
                )}

                {/* Chest Core */}
                <circle cx="50" cy="88" r="9" fill="none" stroke={moodColor} strokeWidth="1" strokeDasharray="2,2" className="rotating-ring" />
                <circle cx="50" cy="88" r="5" fill={moodColor} className="core-glow" />

                {/* === ARMS === */}
                <g className={isWalking ? 'walk-arms' : 'idle-arms'}>
                    <g className="arm-l-group">
                        <rect x="10" y="72" width="14" height="36" rx="4" fill="url(#body-grad)" stroke={moodColor} strokeWidth="1.5" />
                        {/* Hands/Claws */}
                        <g className="hand-l" transform="translate(10, 108)">
                            <rect x="0" y="0" width="14" height="6" rx="2" fill={moodColor} fillOpacity="0.3" />
                            <rect x="1" y="6" width="3" height="6" rx="1.5" fill={moodColor} />
                            <rect x="5.5" y="7" width="3" height="6" rx="1.5" fill={moodColor} />
                            <rect x="10" y="6" width="3" height="6" rx="1.5" fill={moodColor} />
                        </g>
                    </g>
                    <g className="arm-r-group">
                        <rect x="76" y="72" width="14" height="36" rx="4" fill="url(#body-grad)" stroke={moodColor} strokeWidth="1.5" />
                        <g className="hand-r" transform="translate(76, 108)">
                            <rect x="0" y="0" width="14" height="6" rx="2" fill={moodColor} fillOpacity="0.3" />
                            <rect x="1" y="6" width="3" height="6" rx="1.5" fill={moodColor} />
                            <rect x="5.5" y="7" width="3" height="6" rx="1.5" fill={moodColor} />
                            <rect x="10" y="6" width="3" height="6" rx="1.5" fill={moodColor} />
                        </g>
                    </g>
                </g>

                {/* === NECK === */}
                <path d="M44,56 H56 V68 H44 Z" fill="url(#body-grad)" stroke={moodColor} strokeWidth="1" />
                <line x1="45" y1="60" x2="55" y2="60" stroke={moodColor} strokeWidth="0.5" strokeOpacity="0.3" />
                <line x1="45" y1="64" x2="55" y2="64" stroke={moodColor} strokeWidth="0.5" strokeOpacity="0.3" />

                {/* === HEAD === */}
                <g className="head-group">
                    <rect x="22" y="22" width="56" height="38" rx="12" fill="url(#body-grad)" stroke={moodColor} strokeWidth="2" className="head-bob" />

                    {/* VISOR */}
                    <rect x="26" y="26" width="48" height="18" rx="6" fill="#050a10" stroke={moodColor} strokeWidth="0.5" />
                    <rect x="26" y="26" width="48" height="18" rx="6" fill="url(#hex-grid)" opacity="0.6" />
                    <rect x="26" y="26" width="48" height="2" rx="1" fill={moodColor} fillOpacity="0.4" className="visor-scan" />

                    {/* Expressions Layer */}
                    <g className="visor-eyes" filter="url(#glow)">
                        {isTalking ? (
                            <path d="M30,35 Q35,30 40,35 M60,35 Q65,30 70,35" stroke={moodColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
                        ) : (
                            <>
                                <circle cx="37" cy="35" r="3" fill={moodColor} className="eye-pulse" />
                                <circle cx="63" cy="35" r="3" fill={moodColor} className="eye-pulse" />
                                <circle cx="38" cy="33.5" r="1" fill="white" fillOpacity="0.8" />
                                <circle cx="64" cy="33.5" r="1" fill="white" fillOpacity="0.8" />
                            </>
                        )}
                    </g>

                    <rect x="38" y="48" width="24" height="4" rx="2" fill={moodColor} fillOpacity="0.2" />
                    <path d="M40,50 H60" stroke={moodColor} strokeWidth="1" strokeOpacity="0.5" strokeDasharray="2,2" />

                    {/* Antenna */}
                    <line x1="38" y1="22" x2="32" y2="10" stroke={moodColor} strokeWidth="1.5" />
                    <circle cx="32" cy="10" r="2.5" fill={moodColor} className="antenna-glow" />
                </g>

                {/* === AURA LAYERS === */}
                <circle cx="50" cy="80" r="60" fill="none" stroke={moodColor} strokeWidth="0.5" strokeOpacity="0.05" className="aura-pulse" />
                {isRainbow && (
                    <circle cx="50" cy="80" r="70" fill="none" stroke="url(#rainbow-grad)" strokeWidth="1" strokeOpacity="0.3" className="rainbow-aura" />
                )}

                {/* Shimmer Overlay */}
                <rect x="20" y="20" width="60" height="130" fill="white" fillOpacity="0.03" className="shimmer-sweep" pointerEvents="none" />

                <defs>
                    <linearGradient id="rainbow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ff0000" />
                        <stop offset="20%" stopColor="#ffff00" />
                        <stop offset="40%" stopColor="#00ff00" />
                        <stop offset="60%" stopColor="#0000ff" />
                        <stop offset="80%" stopColor="#ff00ff" />
                        <stop offset="100%" stopColor="#ff0000" />
                    </linearGradient>
                </defs>
            </svg>

            <style jsx>{`
                .buddy-body-root { transition: all 0.3s ease; }
                
                /* Animations */
                .idle { animation: buddy-float 4s ease-in-out infinite; }
                @keyframes buddy-float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                .walking { animation: walk-bob 0.6s ease-in-out infinite alternate; }
                @keyframes walk-bob {
                    from { transform: translateY(0); }
                    to { transform: translateY(6px); }
                }

                .glitch { animation: glitch 0.2s steps(2) infinite; filter: hue-rotate(45deg); }
                @keyframes glitch {
                    0% { transform: translate(1px, 1px); }
                    100% { transform: translate(-1px, -1px); }
                }

                .walk-legs .leg-l-group { animation: leg-swing-l 0.6s ease-in-out infinite alternate; transform-origin: 37px 118px; }
                .walk-legs .leg-r-group { animation: leg-swing-r 0.6s ease-in-out infinite alternate; transform-origin: 63px 118px; }
                @keyframes leg-swing-l { from { transform: rotate(-25deg); } to { transform: rotate(25deg); } }
                @keyframes leg-swing-r { from { transform: rotate(25deg); } to { transform: rotate(-25deg); } }

                .walk-arms .arm-l-group { animation: arm-swing-l 0.6s ease-in-out infinite alternate; transform-origin: 17px 72px; }
                .walk-arms .arm-r-group { animation: arm-swing-r 0.6s ease-in-out infinite alternate; transform-origin: 83px 72px; }
                @keyframes arm-swing-l { from { transform: rotate(15deg); } to { transform: rotate(-15deg); } }
                @keyframes arm-swing-r { from { transform: rotate(-15deg); } to { transform: rotate(15deg); } }

                .visor-scan { animation: visor-scan 3s linear infinite; }
                @keyframes visor-scan { 0% { transform: translateY(0); opacity: 0; } 50% { opacity: 0.6; } 100% { transform: translateY(16px); opacity: 0; } }

                .eye-pulse { animation: eye-pulse 5s ease-in-out infinite; transform-origin: center; }
                @keyframes eye-pulse { 0%, 95%, 100% { transform: scaleY(1); } 97% { transform: scaleY(0.1); } }

                .rotating-ring { animation: rotate 8s linear infinite; transform-origin: 50px 88px; }
                @keyframes rotate { from { transform: rotate(0); } to { transform: rotate(360deg); } }

                .core-glow { animation: core-pulse 2s ease-in-out infinite; transform-origin: 50px 88px; }
                @keyframes core-pulse { 0%, 100% { r: 5; opacity: 0.8; } 50% { r: 7; opacity: 1; filter: blur(1px); } }

                .jet-flame { transform-origin: 50% 146px; animation: flame-burst 0.2s ease-in-out infinite alternate; }
                @keyframes flame-burst { from { transform: scaleY(1); } to { transform: scaleY(1.3); } }

                .shimmer-sweep { animation: shimmer 4s linear infinite; }
                @keyframes shimmer { 0% { transform: translateX(-100%) skewX(-20deg); } 100% { transform: translateX(200%) skewX(-20deg); } }

                .aura-pulse { animation: aura-pulse 3s ease-out infinite; transform-origin: 50px 80px; }
                @keyframes aura-pulse { 0% { transform: scale(1); opacity: 0.1; } 100% { transform: scale(1.3); opacity: 0; } }

                .antenna-glow { animation: blink 1s step-end infinite; }
                @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0.3; } }

                /* Tier Styles */
                .lvl-gold { filter: drop-shadow(0 0 4px #ffcc0066); }
                .lvl-fire { filter: drop-shadow(0 0 8px #ff660088); }
                .lvl-rainbow { filter: drop-shadow(0 0 10px #bc13fe88); }
                
                .lvl-badge {
                    position: absolute;
                    top: -24px;
                    left: 50%;
                    transform: translateX(-50%);
                    padding: 2px 10px;
                    border-radius: 4px;
                    font-size: 0.45rem;
                    font-weight: bold;
                    color: #000;
                    letter-spacing: 1px;
                }
            `}</style>
        </div>
    );
}
