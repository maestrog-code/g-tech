'use client';
import React, { useEffect, useRef, useState } from 'react';
import { archiveData } from '@/data/archiveData';

export default function TechChronicles() {
  const containerRef = useRef(null);
  const [role, setRole] = useState('universal');
  const [citizenInfo, setCitizenInfo] = useState(null);
  const [dateStr, setDateStr] = useState('');
  const [intelModal, setIntelModal] = useState(null);

  useEffect(() => {
    // Set date only on client to avoid hydration mismatch
    const now = new Date();
    setDateStr(`${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`);

    const checkCitizen = async () => {
      try {
        const res = await fetch('/api/citizen');
        if (res.ok) {
          const data = await res.json();
          if (data && data.specialization) {
            setRole(data.specialization);
            setCitizenInfo(data);
            document.documentElement.setAttribute('data-role', data.specialization);
          }
        }
      } catch (e) {
        console.error("Archive Link Failed", e);
      }
    };
    checkCitizen();
  }, []);

  useEffect(() => {
    const observerOptions = { threshold: 0.2 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, observerOptions);

    if (containerRef.current) {
      const levels = containerRef.current.querySelectorAll('.chronicle-level');
      levels.forEach(level => observer.observe(level));
    }
    return () => observer.disconnect();
  }, [role]);

  const milestones = archiveData[role] || archiveData.universal;

  const handleIntelClick = (m) => {
    document.body.classList.add('screen-shake');
    setTimeout(() => document.body.classList.remove('screen-shake'), 400);
    for (let k = 0; k < 15; k++) {
      const p = document.createElement('div');
      p.className = 'spark';
      p.style.cssText = `position:fixed;left:${Math.random() * 100}%;top:${Math.random() * 100}%;width:4px;height:4px;border-radius:50%;background:${m.color};box-shadow:0 0 8px ${m.color};pointer-events:none;z-index:9999;animation:particle-float 1s ease forwards;`;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1000);
    }
    setIntelModal(m);
  };

  return (
    <section id="chronicles" ref={containerRef} className="chronicles-container">
      <div className="archive-header">
        <div className="line" style={{ background: role !== 'universal' ? 'var(--neon-blue)' : '#444' }}></div>
        <h2 className="neon-text-blue glitch" data-text={role.toUpperCase() + " ARCHIVE"}>
          {role.toUpperCase()} ARCHIVE
        </h2>
        <div className="line" style={{ background: role !== 'universal' ? 'var(--neon-blue)' : '#444' }}></div>
        <p className="subtitle">
          {citizenInfo ? `ACCESSING UPLINK FOR CITIZEN: ${citizenInfo.codename}` : "THE GREAT LIBRARY OF UNIVERSAL INNOVATION"}
        </p>
      </div>

      {milestones.map((m, i) => (
        <div key={`${role}-${i}`} className="chronicle-level">
          <div className="panel-wrap glass hologram">
            <div className="archive-id">ENTRY: {m.id}</div>
            <div
              className="image-panel ken-burns"
              style={{ backgroundImage: `url(${m.image})` }}
            >
              <div className="era-tag" style={{ background: m.color }}>{m.era}</div>
              <div className="image-overlay" style={{ background: `linear-gradient(to right, transparent, ${m.color}22)` }} />
            </div>
            <div className="content-panel">
              <div className="progress-bar-wrap">
                <div className="progress-bar" style={{ background: m.color }} />
              </div>
              <div className="source">OFFICIAL SOURCE: {m.source}</div>
              <div className="label" style={{ color: m.color }}>MILESTONE DETECTED</div>
              <h3 style={{ textShadow: `0 0 10px ${m.color}88` }}>{m.title}</h3>
              <p>{m.desc}</p>
              <button
                className="intel-btn"
                style={{ borderColor: m.color, color: m.color }}
                onClick={() => handleIntelClick(m)}
              >
                SECURE INTEL REPORT
              </button>
              <div className="archive-footer">
                <span className="timestamp">[{dateStr || '----.--.--'}]</span>
                <span className="checksum">ACCESS LEVEL: {role === 'universal' ? 'PUBLIC' : 'OATH-BOUND'}</span>
              </div>
            </div>
          </div>
          <div className="scroll-hint">▼</div>
        </div>
      ))}

      {/* Intel Modal */}
      {intelModal && (
        <div className="intel-modal-overlay" onClick={() => setIntelModal(null)}>
          <div className="intel-modal glass" onClick={e => e.stopPropagation()} style={{ borderColor: intelModal.color, boxShadow: `0 0 40px ${intelModal.color}44` }}>
            <div className="modal-header" style={{ borderBottomColor: intelModal.color }}>
              <div className="modal-label" style={{ color: intelModal.color }}>INTELLIGENCE REPORT /// SECURED</div>
              <button className="modal-close" onClick={() => setIntelModal(null)}>✕</button>
            </div>
            <div className="modal-entry-id">ENTRY: {intelModal.id} | ERA: {intelModal.era}</div>
            <h3 className="modal-title" style={{ color: intelModal.color }}>{intelModal.title}</h3>
            <p className="modal-desc">{intelModal.desc}</p>
            <div className="modal-footer">
              <span>SOURCE: {intelModal.source}</span>
              <span>STATUS: DOWNLOAD_COMPLETE</span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
                .chronicles-container {
                    background: #000;
                    padding: 100px 0;
                    transition: background 1s ease;
                }
                .archive-header {
                    text-align: center;
                    margin-bottom: 120px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .archive-header h2 {
                    font-size: 3.5rem;
                    letter-spacing: 15px;
                    margin: 20px 0;
                }
                .line {
                    width: 300px;
                    height: 1px;
                    opacity: 0.5;
                    transition: all 1s ease;
                }
                .subtitle {
                    font-size: 0.7rem;
                    color: #666;
                    letter-spacing: 5px;
                    text-transform: uppercase;
                }
                .chronicle-level {
                    height: 95vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transform: translateY(80px);
                    transition: all 1.2s cubic-bezier(0.165, 0.84, 0.44, 1);
                    position: relative;
                    padding: 0 40px;
                }
                .chronicle-level.visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                .panel-wrap {
                    display: flex;
                    max-width: 1200px;
                    width: 100%;
                    height: 600px;
                    padding: 0;
                    overflow: hidden;
                    box-shadow: 0 50px 100px rgba(0,0,0,0.8);
                    position: relative;
                }
                .archive-id {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    font-family: monospace;
                    font-size: 0.6rem;
                    color: rgba(255,255,255,0.2);
                    z-index: 10;
                }
                .image-panel {
                    width: 60%;
                    background-size: cover;
                    background-position: center;
                    position: relative;
                    border-right: 1px solid rgba(255,255,255,0.05);
                    overflow: hidden;
                }
                .ken-burns {
                    animation: ken-burns 14s ease-in-out infinite alternate;
                }
                @keyframes ken-burns {
                    0% { background-size: 100%; background-position: center center; }
                    100% { background-size: 110%; background-position: 60% 40%; }
                }
                .image-overlay {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                }
                .era-tag {
                    position: absolute;
                    bottom: 30px;
                    left: 30px;
                    padding: 8px 20px;
                    font-size: 0.8rem;
                    font-weight: 900;
                    color: #000;
                    letter-spacing: 2px;
                    z-index: 2;
                }
                .content-panel {
                    width: 40%;
                    padding: 50px;
                    background: rgba(8,8,8,0.95);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    position: relative;
                }
                .progress-bar-wrap {
                    height: 2px;
                    background: rgba(255,255,255,0.05);
                    margin-bottom: 40px;
                    border-radius: 1px;
                    overflow: hidden;
                }
                .chronicle-level.visible .progress-bar {
                    animation: bar-grow-x 1.5s 0.5s ease forwards;
                    transform-origin: left;
                }
                .progress-bar {
                    height: 100%;
                    width: 100%;
                    transform: scaleX(0);
                    transform-origin: left;
                }
                @keyframes bar-grow-x {
                    from { transform: scaleX(0); }
                    to { transform: scaleX(1); }
                }
                .source {
                    font-size: 0.5rem;
                    color: #444;
                    margin-bottom: 30px;
                    letter-spacing: 1px;
                    font-family: monospace;
                }
                .label {
                    font-size: 0.6rem;
                    margin-bottom: 15px;
                    letter-spacing: 3px;
                    font-weight: 700;
                    text-transform: uppercase;
                }
                h3 {
                    font-size: 2rem;
                    margin-bottom: 25px;
                    color: #fff;
                    letter-spacing: 3px;
                    font-weight: 900;
                }
                p {
                    color: #999;
                    line-height: 1.8;
                    font-size: 1rem;
                    margin-bottom: 30px;
                }
                .intel-btn {
                    align-self: flex-start;
                    background: transparent;
                    border: 1px solid;
                    padding: 8px 15px;
                    font-size: 0.6rem;
                    font-weight: 700;
                    letter-spacing: 2px;
                    cursor: pointer;
                    margin-bottom: 25px;
                    transition: all 0.3s ease;
                }
                .intel-btn:hover {
                    opacity: 0.7;
                    transform: translateX(4px);
                }
                .archive-footer {
                    margin-top: auto;
                    display: flex;
                    justify-content: space-between;
                    font-family: monospace;
                    font-size: 0.6rem;
                    color: #333;
                }
                .scroll-hint {
                    margin-top: 50px;
                    color: #222;
                    font-size: 1.5rem;
                    animation: bounce 3s infinite;
                }
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
                    40% {transform: translateY(-15px);}
                    60% {transform: translateY(-7px);}
                }

                /* Intel Modal */
                .intel-modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.85);
                    z-index: 9998;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(8px);
                    animation: fade-up 0.3s ease;
                }
                .intel-modal {
                    max-width: 600px;
                    width: 90%;
                    padding: 40px;
                    border: 1px solid;
                    border-radius: 12px;
                    position: relative;
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid;
                    padding-bottom: 15px;
                    margin-bottom: 20px;
                }
                .modal-label {
                    font-size: 0.55rem;
                    letter-spacing: 3px;
                    font-weight: 900;
                }
                .modal-close {
                    background: transparent;
                    border: none;
                    color: #fff;
                    cursor: pointer;
                    font-size: 1rem;
                    opacity: 0.5;
                    transition: opacity 0.2s;
                }
                .modal-close:hover { opacity: 1; }
                .modal-entry-id {
                    font-family: monospace;
                    font-size: 0.6rem;
                    color: #555;
                    margin-bottom: 15px;
                    letter-spacing: 2px;
                }
                .modal-title {
                    font-size: 1.8rem;
                    font-weight: 900;
                    letter-spacing: 3px;
                    margin-bottom: 20px;
                }
                .modal-desc {
                    color: #ccc;
                    line-height: 1.8;
                    margin-bottom: 30px;
                }
                .modal-footer {
                    display: flex;
                    justify-content: space-between;
                    font-family: monospace;
                    font-size: 0.55rem;
                    color: #444;
                    letter-spacing: 1px;
                }

                @media (max-width: 1000px) {
                    .panel-wrap { flex-direction: column; height: auto; }
                    .image-panel { width: 100%; height: 300px; }
                    .content-panel { width: 100%; padding: 30px; }
                    .chronicle-level { height: auto; margin-bottom: 100px; }
                }
            `}</style>
    </section>
  );
}
