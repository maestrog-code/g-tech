'use client';
import React from 'react';

/**
 * AvatarBody — Full humanoid SVG avatar for CyberBuddy.
 * Props:
 *   moodColor: string (hex)
 *   isGlitching: bool
 *   isTalking: bool
 *   isWalking: bool  ← NEW: triggers walking leg/arm animation
 *   scale: number    ← NEW: for ghost mode rendering
 */
export default function BuddyBody({
    moodColor = '#00f2ff',
    isGlitching = false,
    isTalking = false,
    isWalking = false,
    scale = 1,
}) {
    const w = Math.round(90 * scale);
    const h = Math.round(144 * scale);

    return (
        <div
            className={`avatar-root ${isGlitching ? 'glitch' : ''} ${isWalking ? 'walking' : 'idle'}`}
            style={{ width: w, height: h }}
            aria-label="CyberBuddy Avatar"
        >
            <svg
                viewBox="0 0 100 160"
                width={w}
                height={h}
                xmlns="http://www.w3.org/2000/svg"
                style={{ overflow: 'visible' }}
            >
                <defs>
                    <filter id={`gf-${moodColor.replace('#', '')}`}>
                        <feGaussianBlur stdDeviation="1.5" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <linearGradient id="body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={moodColor} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={moodColor} stopOpacity="0.05" />
                    </linearGradient>
                    <linearGradient id="visor-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={moodColor} stopOpacity="0.9" />
                        <stop offset="100%" stopColor={moodColor} stopOpacity="0.15" />
                    </linearGradient>
                </defs>

                {/* === LEGS === */}
                <g className={isWalking ? 'walk-legs' : 'idle-legs'}>
                    {/* Left leg */}
                    <g className="leg-l-group">
                        <rect x="30" y="118" width="14" height="28" rx="4"
                            fill="url(#body-grad)" stroke={moodColor} strokeWidth="1.5" />
                        <rect x="26" y="142" width="20" height="8" rx="3"
                            fill={moodColor} fillOpacity="0.5" stroke={moodColor} strokeWidth="1" />
                    </g>
                    {/* Right leg */}
                    <g className="leg-r-group">
                        <rect x="56" y="118" width="14" height="28" rx="4"
                            fill="url(#body-grad)" stroke={moodColor} strokeWidth="1.5" />
                        <rect x="54" y="142" width="20" height="8" rx="3"
                            fill={moodColor} fillOpacity="0.5" stroke={moodColor} strokeWidth="1" />
                    </g>
                </g>

                {/* === TORSO === */}
                <rect x="26" y="68" width="48" height="52" rx="8"
                    fill="url(#body-grad)" stroke={moodColor} strokeWidth="2" />
                {/* Grid lines */}
                <line x1="50" y1="70" x2="50" y2="118" stroke={moodColor} strokeWidth="0.5" strokeOpacity="0.25" />
                <line x1="27" y1="88" x2="73" y2="88" stroke={moodColor} strokeWidth="0.5" strokeOpacity="0.25" />
                <line x1="27" y1="104" x2="73" y2="104" stroke={moodColor} strokeWidth="0.5" strokeOpacity="0.25" />

                {/* Chest core */}
                <circle cx="50" cy="88" r="8" fill="none" stroke={moodColor} strokeWidth="1.5" className="chest-ring" />
                <circle cx="50" cy="88" r="4" fill={moodColor} fillOpacity="0.85" className="chest-core" />
                {/* Chest circuit dots */}
                <circle cx="36" cy="79" r="2" fill={moodColor} fillOpacity="0.5" />
                <circle cx="64" cy="79" r="2" fill={moodColor} fillOpacity="0.5" />
                <line x1="36" y1="79" x2="42" y2="88" stroke={moodColor} strokeWidth="0.5" strokeOpacity="0.4" />
                <line x1="64" y1="79" x2="58" y2="88" stroke={moodColor} strokeWidth="0.5" strokeOpacity="0.4" />
                {/* Belt */}
                <rect x="26" y="108" width="48" height="6" rx="2" fill={moodColor} fillOpacity="0.2" stroke={moodColor} strokeWidth="1" />
                <rect x="46" y="108" width="8" height="6" rx="1" fill={moodColor} fillOpacity="0.5" />

                {/* === ARMS === */}
                <g className={isWalking ? 'walk-arms' : 'idle-arms'}>
                    {/* Left arm */}
                    <g className="arm-l-group">
                        <rect x="10" y="70" width="14" height="40" rx="6"
                            fill="url(#body-grad)" stroke={moodColor} strokeWidth="1.5" />
                        <ellipse cx="17" cy="114" rx="7" ry="5" fill={moodColor} fillOpacity="0.4" stroke={moodColor} strokeWidth="1" />
                    </g>
                    {/* Right arm */}
                    <g className="arm-r-group">
                        <rect x="76" y="70" width="14" height="40" rx="6"
                            fill="url(#body-grad)" stroke={moodColor} strokeWidth="1.5" />
                        <ellipse cx="83" cy="114" rx="7" ry="5" fill={moodColor} fillOpacity="0.4" stroke={moodColor} strokeWidth="1" />
                    </g>
                </g>

                {/* Shoulder pads */}
                <ellipse cx="22" cy="70" rx="10" ry="6" fill={moodColor} fillOpacity="0.25" stroke={moodColor} strokeWidth="1.5" />
                <ellipse cx="78" cy="70" rx="10" ry="6" fill={moodColor} fillOpacity="0.25" stroke={moodColor} strokeWidth="1.5" />

                {/* === NECK === */}
                <rect x="43" y="56" width="14" height="14" rx="4" fill="url(#body-grad)" stroke={moodColor} strokeWidth="1.5" />

                {/* === HEAD === */}
                <rect x="22" y="22" width="56" height="38" rx="12"
                    fill="url(#body-grad)" stroke={moodColor} strokeWidth="2" className="head-bob" />
                <line x1="22" y1="38" x2="78" y2="38" stroke={moodColor} strokeWidth="0.5" strokeOpacity="0.15" />

                {/* Antenna */}
                <line x1="50" y1="22" x2="50" y2="8" stroke={moodColor} strokeWidth="1.5" strokeDasharray="2,2" />
                <circle cx="50" cy="6" r="3.5" fill={moodColor} className="antenna-tip" />
                <circle cx="50" cy="6" r="6" fill="none" stroke={moodColor} strokeWidth="0.5" strokeOpacity="0.5" className="antenna-ring" />

                {/* Ear vents */}
                <rect x="16" y="28" width="6" height="12" rx="2" fill={moodColor} fillOpacity="0.3" stroke={moodColor} strokeWidth="1" />
                <rect x="78" y="28" width="6" height="12" rx="2" fill={moodColor} fillOpacity="0.3" stroke={moodColor} strokeWidth="1" />

                {/* VISOR */}
                <rect x="26" y="26" width="48" height="16" rx="6" fill="url(#visor-grad)" />
                <rect x="26" y="26" width="48" height="3" rx="2" fill={moodColor} fillOpacity="0.3" className="visor-scan" />

                {/* Eyes */}
                <ellipse cx="38" cy="34" rx="6" ry={isTalking ? 2.5 : 4} fill={moodColor} fillOpacity="0.15" />
                <ellipse cx="62" cy="34" rx="6" ry={isTalking ? 2.5 : 4} fill={moodColor} fillOpacity="0.15" />
                <ellipse cx="38" cy="34" rx="3" ry={isTalking ? 1.5 : 3} fill={moodColor} className="eye-l" />
                <ellipse cx="62" cy="34" rx="3" ry={isTalking ? 1.5 : 3} fill={moodColor} className="eye-r" />
                <circle cx="40" cy="32" r="1" fill="#fff" fillOpacity="0.7" />
                <circle cx="64" cy="32" r="1" fill="#fff" fillOpacity="0.7" />

                {/* Mouth / speaker */}
                <rect x="34" y="46" width="32" height="8" rx="4" fill="none" stroke={moodColor} strokeWidth="1" strokeOpacity="0.4" />
                {[38, 42, 46, 50, 54, 58, 62].map((x, i) => (
                    <rect key={x} x={x} y="47" width="1.5"
                        height={isTalking ? (i % 2 === 0 ? 6 : 4) : 3}
                        rx="1" fill={moodColor}
                        fillOpacity={isTalking ? 0.9 : 0.35}
                        className={isTalking ? `mouth-bar-${i}` : ''}
                    />
                ))}

                {/* Aura rings */}
                <circle cx="50" cy="80" r="55" fill="none" stroke={moodColor} strokeWidth="0.5" strokeOpacity="0.06" className="aura-1" />
                <circle cx="50" cy="80" r="66" fill="none" stroke={moodColor} strokeWidth="0.3" strokeOpacity="0.04" className="aura-2" />
            </svg>

            <style jsx>{`
                .avatar-root {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                /* IDLE FLOAT */
                .avatar-root.idle {
                    animation: buddy-float 3s ease-in-out infinite;
                }
                @keyframes buddy-float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                /* GLITCH */
                .avatar-root.glitch svg {
                    animation: glitch-fx 0.12s infinite;
                    filter: hue-rotate(90deg) saturate(2);
                }
                @keyframes glitch-fx {
                    0% { transform: translate(0); }
                    25% { transform: translate(-4px, 2px) skewX(1.5deg); }
                    50% { transform: translate(4px, -2px) skewX(-1.5deg); }
                    75% { transform: translate(-2px, -1px); }
                    100% { transform: translate(0); }
                }

                /* === WALKING ANIMATIONS === */
                /* Leg walk */
                .walk-legs .leg-l-group {
                    animation: leg-walk-l 0.5s ease-in-out infinite alternate;
                    transform-origin: 37px 118px;
                }
                .walk-legs .leg-r-group {
                    animation: leg-walk-r 0.5s ease-in-out infinite alternate;
                    transform-origin: 63px 118px;
                }
                @keyframes leg-walk-l {
                    from { transform: rotate(-18deg); }
                    to { transform: rotate(18deg); }
                }
                @keyframes leg-walk-r {
                    from { transform: rotate(18deg); }
                    to { transform: rotate(-18deg); }
                }
                /* Arm swing (opposite to legs) */
                .walk-arms .arm-l-group {
                    animation: arm-swing-l 0.5s ease-in-out infinite alternate;
                    transform-origin: 17px 70px;
                }
                .walk-arms .arm-r-group {
                    animation: arm-swing-r 0.5s ease-in-out infinite alternate;
                    transform-origin: 83px 70px;
                }
                @keyframes arm-swing-l {
                    from { transform: rotate(12deg); }
                    to { transform: rotate(-12deg); }
                }
                @keyframes arm-swing-r {
                    from { transform: rotate(-12deg); }
                    to { transform: rotate(12deg); }
                }
                /* Torso bob when walking */
                .avatar-root.walking {
                    animation: walk-bob 0.5s ease-in-out infinite alternate;
                }
                @keyframes walk-bob {
                    from { transform: translateY(0px); }
                    to { transform: translateY(4px); }
                }

                /* === IDLE ANIMATIONS === */
                .idle-legs .leg-l-group { animation: leg-idle-l 3s ease-in-out infinite; transform-origin: 37px 118px; }
                .idle-legs .leg-r-group { animation: leg-idle-r 3s ease-in-out 0.2s infinite; transform-origin: 63px 118px; }
                @keyframes leg-idle-l { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(2deg); } }
                @keyframes leg-idle-r { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(-2deg); } }
                .idle-arms .arm-l-group { animation: arm-sway-l 3s ease-in-out infinite; transform-origin: 17px 70px; }
                .idle-arms .arm-r-group { animation: arm-sway-r 3s ease-in-out infinite; transform-origin: 83px 70px; }
                @keyframes arm-sway-l { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(-5deg); } }
                @keyframes arm-sway-r { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(5deg); } }

                /* Chest */
                .chest-core { animation: chest-pulse 2s ease-in-out infinite; transform-origin: 50px 88px; }
                .chest-ring { animation: chest-ring-spin 6s linear infinite; transform-origin: 50px 88px; }
                @keyframes chest-pulse { 0%, 100% { opacity: 0.85; transform: scale(1); } 50% { opacity: 1; transform: scale(1.4); } }
                @keyframes chest-ring-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                /* Eyes */
                .eye-l, .eye-r { animation: eye-blink 4.5s ease-in-out infinite; }
                .eye-r { animation-delay: 0.12s; }
                @keyframes eye-blink { 0%, 88%, 100% { ry: 3; } 93% { ry: 0.5; } }

                /* Antenna */
                .antenna-tip { animation: antenna-pulse 1.8s ease-in-out infinite; }
                .antenna-ring { animation: antenna-ring-pulse 1.8s ease-in-out infinite; }
                @keyframes antenna-pulse { 0%, 100% { r: 3.5; opacity: 1; } 50% { r: 5; opacity: 0.5; } }
                @keyframes antenna-ring-pulse { 0%, 100% { r: 6; opacity: 0.5; } 50% { r: 11; opacity: 0; } }

                /* Head bob */
                .head-bob { animation: head-tilt 4s ease-in-out infinite; transform-origin: 50px 41px; }
                @keyframes head-tilt { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-1.5deg); } 75% { transform: rotate(1.5deg); } }

                /* Visor scan */
                .visor-scan { animation: visor-scan 2.5s linear infinite; }
                @keyframes visor-scan { 0% { transform: translateY(0); opacity: 0.7; } 100% { transform: translateY(13px); opacity: 0; } }

                /* Mouth bars when talking */
                .mouth-bar-0 { animation: mb0 0.18s ease infinite alternate; }
                .mouth-bar-1 { animation: mb1 0.28s ease infinite alternate; }
                .mouth-bar-2 { animation: mb2 0.14s ease infinite alternate; }
                .mouth-bar-3 { animation: mb3 0.22s ease infinite alternate; }
                .mouth-bar-4 { animation: mb4 0.19s ease infinite alternate; }
                .mouth-bar-5 { animation: mb5 0.16s ease infinite alternate; }
                .mouth-bar-6 { animation: mb6 0.25s ease infinite alternate; }
                @keyframes mb0 { from { height: 1px; } to { height: 6px; } }
                @keyframes mb1 { from { height: 2px; } to { height: 5px; } }
                @keyframes mb2 { from { height: 1px; } to { height: 7px; } }
                @keyframes mb3 { from { height: 3px; } to { height: 6px; } }
                @keyframes mb4 { from { height: 1px; } to { height: 5px; } }
                @keyframes mb5 { from { height: 2px; } to { height: 6px; } }
                @keyframes mb6 { from { height: 1px; } to { height: 4px; } }

                /* Aura */
                .aura-1 { animation: aura-exp 4.5s ease-in-out infinite; transform-origin: 50px 80px; }
                .aura-2 { animation: aura-exp 4.5s ease-in-out 1.2s infinite; transform-origin: 50px 80px; }
                @keyframes aura-exp { 0%, 100% { opacity: 0.06; transform: scale(1); } 50% { opacity: 0; transform: scale(1.12); } }
            `}</style>
        </div>
    );
}
