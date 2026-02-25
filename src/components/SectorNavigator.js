'use client';
import React, { useState } from 'react';

const sectors = [
  { id: 'hero', label: 'VOID', color: '#00f2ff', icon: '◉' },
  { id: 'pulse', label: 'PULSE', color: '#00ff66', icon: '▲' },
  { id: 'timeline', label: 'CHRONOS', color: '#bc13fe', icon: '◈' },
  { id: 'lab', label: 'LAB', color: '#ff00ea', icon: '⬡' },
  { id: 'chronicles', label: 'ARCHIVES', color: '#ff9d00', icon: '◼' },
  { id: 'forge', label: 'FORGE', color: '#ff6600', icon: '⚒' },
  { id: 'decoder', label: 'DECODE', color: '#ffcc00', icon: '⬛' },
  { id: 'cyberverse', label: 'VERSE', color: '#bc13fe', icon: '◆' },
  { id: 'identity', label: 'IDENTITY', color: '#00f2ff', icon: '⬟' },
];

export default function SectorNavigator() {
  const [activeId, setActiveId] = useState('hero');

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveId(id);
      const sector = sectors.find(s => s.id === id);
      if (sector) {
        document.documentElement.style.setProperty('--neon-blue', sector.color);
      }
    }
  };

  return (
    <nav className="sector-nav glass">
      <div className="logo-mini" onClick={() => scrollTo('hero')} style={{ cursor: 'pointer', marginBottom: '16px' }}>
        <img src="/assets/logo.png" alt="Logo" className="dynamic-logo" style={{ width: '28px', filter: 'drop-shadow(0 0 5px var(--neon-blue))' }} />
      </div>
      {sectors.map((sector) => (
        <button
          key={sector.id}
          onClick={() => scrollTo(sector.id)}
          className={`nav-item ${activeId === sector.id ? 'active' : ''}`}
          title={sector.label}
        >
          <span className="label">{sector.label}</span>
          <div className="indicator" style={{ background: sector.color, boxShadow: activeId === sector.id ? `0 0 12px ${sector.color}` : 'none' }}>
            <span className="icon">{sector.icon}</span>
          </div>
        </button>
      ))}

      <style jsx>{`
                .sector-nav {
                    position: fixed;
                    top: 50%;
                    left: 20px;
                    transform: translateY(-50%);
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                    padding: 20px 10px;
                    z-index: 1002;
                    border-radius: 40px;
                    align-items: center;
                }
                .nav-item {
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 4px;
                    transition: all 0.3s ease;
                    position: relative;
                }
                .nav-item.active .indicator {
                    transform: scale(1.4);
                }
                .label {
                    font-size: 0.55rem;
                    color: #555;
                    letter-spacing: 2px;
                    opacity: 0;
                    transform: translateX(-10px);
                    transition: all 0.3s ease;
                    position: absolute;
                    left: 36px;
                    white-space: nowrap;
                    font-weight: 700;
                    background: rgba(0,0,0,0.8);
                    padding: 3px 8px;
                    border-radius: 4px;
                }
                .nav-item:hover .label {
                    opacity: 1;
                    transform: translateX(0);
                    color: #fff;
                }
                .indicator {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }
                .icon {
                    font-size: 6px;
                    color: rgba(0,0,0,0.8);
                    line-height: 1;
                }
                .nav-item:hover .indicator {
                    transform: scale(1.6);
                    box-shadow: 0 0 25px currentColor;
                }
                .logo-mini {
                    transition: transform 0.3s ease;
                }
                .logo-mini:hover {
                    transform: scale(1.2) rotate(10deg);
                }
            `}</style>
    </nav>
  );
}
