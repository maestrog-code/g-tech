'use client';
import React, { useRef, useEffect, useState } from 'react';

export default function CitizenIdentity() {
    const canvasRef = useRef(null);
    const [citizen, setCitizen] = useState({ codename: 'UNKNOWN', specialization: 'UNASSIGNED' });

    useEffect(() => {
        const stored = localStorage.getItem('gtech_citizen');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setCitizen({
                    codename: parsed.codename || parsed.name || 'UNKNOWN',
                    specialization: parsed.specialization || parsed.role || 'UNASSIGNED'
                });
            } catch (e) {
                console.error("Registry parsing failed.");
            }
        }
    }, []);

    const generateCard = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, 600, 350);

        // Grid Pattern
        ctx.strokeStyle = 'rgba(0, 242, 255, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 600; i += 20) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 350); ctx.stroke();
        }
        for (let i = 0; i < 350; i += 20) {
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(600, i); ctx.stroke();
        }

        // Borders
        ctx.strokeStyle = '#00f2ff';
        ctx.lineWidth = 4;
        ctx.strokeRect(10, 10, 580, 330);

        // Scanlines
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        for (let i = 0; i < 350; i += 4) ctx.fillRect(0, i, 600, 1);

        // Logo Space
        ctx.fillStyle = '#bc13fe';
        ctx.beginPath();
        ctx.moveTo(500, 50); ctx.lineTo(550, 75); ctx.lineTo(500, 100); ctx.closePath();
        ctx.fill();

        // Text
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px Courier New';
        ctx.fillText('G-TECH CITIZEN UPLINK', 40, 50);

        ctx.fillStyle = '#00f2ff';
        ctx.font = '14px Courier New';
        ctx.fillText('CODENAME:', 40, 120);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 32px Courier New';
        ctx.fillText((citizen.codename || 'UNKNOWN').toUpperCase(), 40, 160);

        ctx.fillStyle = '#bc13fe';
        ctx.font = '14px Courier New';
        ctx.fillText('SECTOR_ROLE:', 40, 220);
        ctx.fillStyle = '#fff';
        ctx.font = '24px Courier New';
        ctx.fillText((citizen.specialization || 'UNASSIGNED').toUpperCase(), 40, 250);

        // Footer
        ctx.fillStyle = 'rgba(0, 242, 255, 0.5)';
        ctx.font = '10px Courier New';
        ctx.fillText('AUTHORIZED BY G-TECH SOVEREIGN PROTOCOL // 2026.02.25', 40, 320);

        // QR Code Placeholder
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(480, 230, 80, 80);
        ctx.fillText('V_SECURE', 495, 300);
    };

    useEffect(() => {
        generateCard();
    }, [citizen]);

    const downloadCard = () => {
        const link = document.createElement('a');
        link.download = `CITIZEN_${citizen.name}.png`;
        link.href = canvasRef.current.toDataURL();
        link.click();
    };

    return (
        <section id="identity" className="identity-container glass neon-border-blue">
            <div className="id-header">
                <h2 className="neon-text-blue">SOVEREIGN IDENTITY</h2>
                <p>EXPORT YOUR CITIZEN STATUS TO THE GLOBAL GRID</p>
            </div>

            <div className="id-preview">
                <canvas ref={canvasRef} width="600" height="350" className="id-canvas" />
            </div>

            <div className="id-actions">
                <button onClick={downloadCard} className="export-btn">EXPORT_IDENTITY (PNG)</button>
            </div>

            <style jsx>{`
                .identity-container {
                    padding: 80px 40px;
                    margin: 80px auto;
                    max-width: 1000px;
                    text-align: center;
                }
                .id-header { margin-bottom: 50px; }
                .id-canvas {
                    max-width: 100%;
                    height: auto;
                    box-shadow: 0 0 50px rgba(0, 242, 255, 0.2);
                    border: 1px solid rgba(0, 242, 255, 0.3);
                }
                .export-btn {
                    margin-top: 40px;
                    background: var(--neon-blue);
                    color: #000;
                    border: none;
                    padding: 15px 40px;
                    font-weight: 900;
                    cursor: pointer;
                    letter-spacing: 2px;
                    transition: all 0.3s ease;
                }
                .export-btn:hover {
                    box-shadow: 0 0 30px var(--neon-blue);
                    transform: scale(1.05);
                }
            `}</style>
        </section>
    );
}
