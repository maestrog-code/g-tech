'use client';
import React, { useEffect, useRef } from 'react';

const ERAS = [
  {
    year: '3500 BC – 200 AD',
    era: 'Ancient Innovation',
    icon: '📜',
    color: '#ff9d00',
    stat: '12',
    statLabel: 'FOUNDATIONAL TECHNOLOGIES',
    desc: 'The wheel, writing, mathematics, aqueducts, and early astronomy. Civilizations encoded knowledge for the first time — the seed of every technology that followed.',
    tags: ['Writing', 'Mathematics', 'Engineering'],
  },
  {
    year: '1760 – 1900',
    era: 'Industrial Revolution',
    icon: '⚙️',
    color: '#ff6600',
    stat: '847',
    statLabel: 'PATENTS REGISTERED (UK)',
    desc: 'Steam power mechanized production. Railways collapsed distance. The telegraph sent data at the speed of electricity for the first time. Machines became tools of civilization.',
    tags: ['Steam Power', 'Telegraph', 'Railways'],
  },
  {
    year: '1940 – 1990',
    era: 'Digital Genesis',
    icon: '💻',
    color: '#00f2ff',
    stat: '4,004',
    statLabel: 'TRANSISTORS ON INTEL 4004',
    desc: 'The transistor replaced the vacuum tube. ARPANET connected the first nodes. The microprocessor put a computer on every desk. The Internet was born in a university basement.',
    tags: ['Transistors', 'ARPANET', 'Microprocessor'],
  },
  {
    year: '1991 – 2020',
    era: 'The Web Era',
    icon: '🌐',
    color: '#00ff66',
    stat: '5.4B',
    statLabel: 'INTERNET USERS BY 2023',
    desc: 'The World Wide Web made information free. Smartphones put the internet in every pocket. Social networks rewired human communication. Cloud computing virtualized the world.',
    tags: ['World Wide Web', 'Smartphones', 'Cloud'],
  },
  {
    year: '2020 – NOW',
    era: 'The AI Epoch',
    icon: '🧠',
    color: '#bc13fe',
    stat: '142K+',
    statLabel: 'MODELS ON HUGGING FACE',
    desc: 'Large language models crossed a threshold. AI writes code, generates art, and reasons autonomously. Agents act on your behalf. The question is no longer if AI will transform everything — but how fast.',
    tags: ['LLMs', 'Multimodal AI', 'AI Agents'],
  },
  {
    year: '2030+',
    era: 'Post-AI Future',
    icon: '🚀',
    color: '#ff00ea',
    stat: '∞',
    statLabel: 'POSSIBLE FUTURES',
    desc: 'Quantum supremacy enables new cryptography. Fusion energy becomes viable. Autonomous AI agents collaborate with no human in the loop. Mars is colonized. Biology is rewritten with CRISPR.',
    tags: ['Quantum', 'Fusion Energy', 'Mars'],
  },
];

export default function TechTimeline() {
  const cardRefs = useRef([]);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );
    cardRefs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="timeline" className="timeline-section">
      <div className="timeline-header">
        <div className="timeline-label">◎ THE CHRONICLE</div>
        <h2 className="timeline-title neon-text-blue">HISTORY OF INNOVATION</h2>
        <p className="timeline-subtitle">SIX EPOCHS THAT REWIRED CIVILIZATION</p>
      </div>

      <div className="timeline-root">
        {/* Vertical center spine */}
        <div className="timeline-spine">
          <div className="spine-line" />
        </div>

        {ERAS.map((era, i) => {
          const isRight = i % 2 === 0;
          return (
            <div
              key={i}
              className={`era-row ${isRight ? 'right' : 'left'}`}
            >
              {/* Spacer on the opposite side */}
              <div className="era-spacer" />

              {/* Node on the spine */}
              <div className="era-node-wrap">
                <div className="era-node" style={{ background: era.color, boxShadow: `0 0 18px ${era.color}` }}>
                  <span className="era-node-icon">{era.icon}</span>
                </div>
                <div className="era-connector" style={{ background: `linear-gradient(${isRight ? '90deg' : '270deg'}, ${era.color}, transparent)` }} />
              </div>

              {/* Card */}
              <div
                className={`era-card glass ${isRight ? 'from-left' : 'from-right'}`}
                style={{ '--era-color': era.color }}
                ref={el => cardRefs.current[i] = el}
              >
                <div className="era-card-top">
                  <span className="era-year" style={{ color: era.color }}>{era.year}</span>
                  <div className="era-stat-block">
                    <span className="era-stat" style={{ color: era.color }}>{era.stat}</span>
                    <span className="era-stat-label">{era.statLabel}</span>
                  </div>
                </div>
                <h3 className="era-name">{era.era}</h3>
                <p className="era-desc">{era.desc}</p>
                <div className="era-tags">
                  {era.tags.map(tag => (
                    <span key={tag} className="era-tag" style={{ borderColor: `${era.color}55`, color: era.color }}>
                      {tag}
                    </span>
                  ))}
                </div>
                {/* Glow accent corner */}
                <div className="card-corner" style={{ background: `radial-gradient(circle at top right, ${era.color}18, transparent 70%)` }} />
              </div>

              <div className="era-spacer" />
            </div>
          );
        })}
      </div>

      <style jsx>{`
                .timeline-section {
                    padding: 100px 20px;
                    position: relative;
                    z-index: 2;
                }
                .timeline-header {
                    text-align: center;
                    margin-bottom: 80px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                }
                .timeline-label {
                    font-size: 0.58rem;
                    letter-spacing: 6px;
                    color: var(--neon-blue);
                    opacity: 0.6;
                    font-weight: 700;
                }
                .timeline-title {
                    font-size: clamp(1.8rem, 4vw, 3rem);
                    font-weight: 900;
                    letter-spacing: 6px;
                    margin: 0;
                }
                .timeline-subtitle {
                    font-size: 0.65rem;
                    color: #555;
                    letter-spacing: 4px;
                }

                /* ── SPINE ──────────────────── */
                .timeline-root {
                    max-width: 1100px;
                    margin: 0 auto;
                    position: relative;
                }
                .timeline-spine {
                    position: absolute;
                    left: 50%;
                    top: 0;
                    bottom: 0;
                    transform: translateX(-50%);
                    width: 2px;
                    z-index: 1;
                }
                .spine-line {
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(to bottom,
                        transparent,
                        var(--neon-blue) 10%,
                        rgba(0,242,255,0.3) 90%,
                        transparent
                    );
                }

                /* ── ERA ROWS ───────────────── */
                .era-row {
                    display: grid;
                    grid-template-columns: 1fr 60px 1fr;
                    align-items: center;
                    margin-bottom: 60px;
                    position: relative;
                }
                .era-spacer { /* occupies the opposite side */ }

                /* ── NODE ───────────────────── */
                .era-node-wrap {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    z-index: 2;
                }
                .era-node {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    z-index: 3;
                    position: relative;
                }
                .era-node-icon { font-size: 1.1rem; }
                .era-connector {
                    position: absolute;
                    height: 2px;
                    width: 40px;
                    top: 50%;
                    transform: translateY(-50%);
                }
                .right .era-connector { right: -20px; }
                .left  .era-connector { left: -20px; }

                /* ── CARDS ──────────────────── */
                .era-card {
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 16px;
                    padding: 28px 28px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    position: relative;
                    overflow: hidden;
                    opacity: 0;
                    transition: opacity 0.6s ease, transform 0.6s ease, border-color 0.3s ease;
                    border-left: 3px solid var(--era-color);
                }
                .era-card:hover {
                    border-color: var(--era-color);
                    box-shadow: 0 0 40px color-mix(in srgb, var(--era-color) 20%, transparent);
                    transform: translateY(-4px) !important;
                }
                .from-left  { transform: translateX(-40px); }
                .from-right { transform: translateX(40px); }
                .era-card.visible {
                    opacity: 1;
                    transform: translateX(0) !important;
                }

                /* When card is on the right side, put it in col 3 */
                .right .era-card { grid-column: 3; }
                .right .era-spacer:first-child { grid-column: 1; }
                .right .era-node-wrap { grid-column: 2; }

                .left .era-card { grid-column: 1; }
                .left .era-node-wrap { grid-column: 2; }
                .left .era-spacer:last-child { grid-column: 3; }

                .era-card-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }
                .era-year {
                    font-size: 0.55rem;
                    letter-spacing: 2px;
                    font-weight: 900;
                    font-family: monospace;
                }
                .era-stat-block { text-align: right; }
                .era-stat { font-size: 1.4rem; font-weight: 900; display: block; line-height: 1; }
                .era-stat-label { font-size: 0.4rem; color: #444; letter-spacing: 1.5px; }

                .era-name { font-size: 1.1rem; font-weight: 900; letter-spacing: 3px; color: #fff; margin: 0; }
                .era-desc { font-size: 0.72rem; color: #aaa; line-height: 1.7; margin: 0; }

                .era-tags { display: flex; flex-wrap: wrap; gap: 6px; }
                .era-tag {
                    border: 1px solid; padding: 3px 10px; border-radius: 20px;
                    font-size: 0.52rem; letter-spacing: 1px; font-weight: 700;
                }

                .card-corner {
                    position: absolute;
                    top: 0; right: 0;
                    width: 180px; height: 120px;
                    border-radius: 0 16px 0 0;
                    pointer-events: none;
                }

                /* ── MOBILE ─────────────────── */
                @media (max-width: 768px) {
                    .timeline-root { padding-left: 30px; }
                    .timeline-spine { left: 20px; }
                    .era-row {
                        grid-template-columns: 40px 1fr !important;
                        grid-template-rows: auto;
                    }
                    .era-spacer { display: none !important; }
                    .era-node-wrap { grid-column: 1 !important; }
                    .era-card { grid-column: 2 !important; }
                    .era-connector { display: none; }
                }
            `}</style>
    </section>
  );
}
