'use client';
import React, { useState, useEffect } from 'react';
import { useAchievements } from './AchievementSystem';

function getMoodFromHour(hour) {
    if (hour >= 5 && hour < 9) return { label: 'DAWN PROTOCOL', color: '#ff9d00', pulse: '2s', glow: '#ff6600' };
    if (hour >= 9 && hour < 17) return { label: 'SOLAR FREQUENCY', color: '#00f2ff', pulse: '3s', glow: '#00ccff' };
    if (hour >= 17 && hour < 21) return { label: 'DUSK SIGNAL', color: '#bc13fe', pulse: '2.5s', glow: '#9900cc' };
    return { label: 'NIGHT CORE', color: '#ff0055', pulse: '4s', glow: '#660022' };
}

export default function MoodOrb() {
    const { unlock } = useAchievements() || {};
    const [mood, setMood] = useState(null);
    const [hovered, setHovered] = useState(false);
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        const hour = new Date().getHours();
        setMood(getMoodFromHour(hour));
    }, []);

    const handleClick = () => {
        if (unlock) unlock('MOOD_READER');
        setClicked(true);
        setTimeout(() => setClicked(false), 800);
    };

    if (!mood) return null;

    return (
        <div
            onClick={handleClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: 'fixed',
                bottom: '90px',
                right: '24px',
                zIndex: 10003,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
            }}
            title="G-Tech Frequency Orb"
        >
            {/* Label */}
            <div style={{
                fontSize: '0.42rem',
                letterSpacing: '2px',
                color: mood.color,
                fontWeight: 700,
                background: 'rgba(0,0,0,0.8)',
                padding: '4px 10px',
                borderRadius: '20px',
                border: `1px solid ${mood.color}44`,
                whiteSpace: 'nowrap',
                opacity: hovered ? 1 : 0,
                transform: hovered ? 'translateY(0)' : 'translateY(4px)',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
            }}>
                G-TECH /// {mood.label}
            </div>

            {/* Orb */}
            <div style={{ position: 'relative', width: '48px', height: '48px', flexShrink: 0 }}>
                {/* Outer ripple ring */}
                <div style={{
                    position: 'absolute',
                    inset: '-8px',
                    borderRadius: '50%',
                    border: `1px solid ${mood.color}`,
                    animation: `orb-ripple ${mood.pulse} ease-in-out infinite`,
                    opacity: 0.4,
                }} />
                {/* Second ring */}
                <div style={{
                    position: 'absolute',
                    inset: '-16px',
                    borderRadius: '50%',
                    border: `1px solid ${mood.color}`,
                    animation: `orb-ripple ${mood.pulse} ease-in-out infinite`,
                    animationDelay: `calc(${mood.pulse} / 2)`,
                    opacity: 0.2,
                }} />
                {/* Core orb */}
                <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: `radial-gradient(circle at 35% 35%, ${mood.color}cc, ${mood.glow}88, #000)`,
                    boxShadow: `0 0 ${hovered ? 30 : 16}px ${mood.color}99, 0 0 ${hovered ? 60 : 30}px ${mood.glow}44`,
                    transition: 'box-shadow 0.3s ease',
                    transform: clicked ? 'scale(1.4)' : hovered ? 'scale(1.15)' : 'scale(1)',
                    transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease',
                    animation: `orb-breathe ${mood.pulse} ease-in-out infinite`,
                }} />
                {/* Inner sparkle */}
                <div style={{
                    position: 'absolute',
                    top: '25%',
                    left: '30%',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.7)',
                    filter: 'blur(2px)',
                    pointerEvents: 'none',
                }} />
            </div>

            <style jsx>{`
                @keyframes orb-ripple {
                    0%, 100% { transform: scale(1); opacity: 0.4; }
                    50% { transform: scale(1.4); opacity: 0; }
                }
                @keyframes orb-breathe {
                    0%, 100% { filter: brightness(1); }
                    50% { filter: brightness(1.3); }
                }
            `}</style>
        </div>
    );
}
