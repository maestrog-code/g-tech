'use client';
import React, { useEffect, useRef, useState } from 'react';

const TRAIL_LENGTH = 12;

export default function CursorTrail() {
    const [trail, setTrail] = useState([]);
    const mousePos = useRef({ x: -200, y: -200 });
    const trailRef = useRef([]);
    const rafRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);

        let frame = 0;
        const animate = () => {
            frame++;
            if (frame % 2 === 0) { // update every other frame for perf
                const head = mousePos.current;
                trailRef.current = [head, ...trailRef.current].slice(0, TRAIL_LENGTH);
                setTrail([...trailRef.current]);
            }
            rafRef.current = requestAnimationFrame(animate);
        };
        rafRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99999 }}>
            {trail.map((point, i) => {
                const progress = 1 - i / TRAIL_LENGTH;
                const size = Math.max(2, 10 * progress);
                const opacity = progress * 0.6;
                // Color cycles from neon blue → purple
                const hue = 185 + i * 8;
                return (
                    <div
                        key={i}
                        style={{
                            position: 'fixed',
                            left: point.x - size / 2,
                            top: point.y - size / 2,
                            width: size,
                            height: size,
                            borderRadius: '50%',
                            background: `hsl(${hue}, 100%, 60%)`,
                            opacity,
                            boxShadow: i === 0 ? `0 0 10px hsl(${hue}, 100%, 60%)` : 'none',
                            transition: 'none',
                            pointerEvents: 'none',
                        }}
                    />
                );
            })}
        </div>
    );
}
