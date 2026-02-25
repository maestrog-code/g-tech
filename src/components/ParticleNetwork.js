'use client';
import { useEffect, useRef } from 'react';

const CONFIG = {
    count: 80,
    maxDist: 130,
    speed: 0.35,
    nodeRadius: 2,
    lineOpacity: 0.15,
    mouseRadius: 160,
    color: '0, 242, 255',   // neon blue
    accentColor: '188, 19, 254', // neon purple
};

export default function ParticleNetwork() {
    const canvasRef = useRef(null);
    const mouse = useRef({ x: -9999, y: -9999 });
    const animRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Initialise particles
        let particles = [];
        const init = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = Array.from({ length: CONFIG.count }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * CONFIG.speed,
                vy: (Math.random() - 0.5) * CONFIG.speed,
                r: Math.random() * CONFIG.nodeRadius + 1,
                // alternate between blue & purple nodes
                accent: Math.random() > 0.8,
            }));
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update & draw nodes
            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;

                // Wrap around
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                // Mouse repulsion
                const mdx = p.x - mouse.current.x;
                const mdy = p.y - mouse.current.y;
                const md = Math.hypot(mdx, mdy);
                if (md < CONFIG.mouseRadius) {
                    const force = (CONFIG.mouseRadius - md) / CONFIG.mouseRadius;
                    p.x += mdx / md * force * 1.5;
                    p.y += mdy / md * force * 1.5;
                }

                const col = p.accent ? CONFIG.accentColor : CONFIG.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${col}, 0.7)`;
                ctx.fill();
            }

            // Draw connecting lines
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i];
                    const b = particles[j];
                    const dist = Math.hypot(a.x - b.x, a.y - b.y);
                    if (dist < CONFIG.maxDist) {
                        const alpha = CONFIG.lineOpacity * (1 - dist / CONFIG.maxDist);
                        const col = (a.accent || b.accent) ? CONFIG.accentColor : CONFIG.color;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = `rgba(${col}, ${alpha})`;
                        ctx.lineWidth = 0.7;
                        ctx.stroke();
                    }
                }
            }

            animRef.current = requestAnimationFrame(draw);
        };

        init();
        draw();

        const onResize = () => { init(); };
        const onMouse = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
        const onLeave = () => { mouse.current = { x: -9999, y: -9999 }; };

        window.addEventListener('resize', onResize);
        window.addEventListener('mousemove', onMouse);
        window.addEventListener('mouseleave', onLeave);

        return () => {
            cancelAnimationFrame(animRef.current);
            window.removeEventListener('resize', onResize);
            window.removeEventListener('mousemove', onMouse);
            window.removeEventListener('mouseleave', onLeave);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 0,
                pointerEvents: 'none',
                opacity: 0.55,
            }}
            aria-hidden="true"
        />
    );
}
