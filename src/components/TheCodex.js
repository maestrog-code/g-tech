'use client';
import React, { useState } from 'react';

const tutorials = [
  { id: '01', title: "VOID — HERO PORTAL", icon: '◉', content: "The hero portal is your gateway. The G-TECH logo pulses with your role's energy. The Enter The Verse button activates a quantum shift and transports you to the Chronicles." },
  { id: '02', title: "PULSE — LIVE STATS", icon: '▲', content: "The TechPulse sector tracks innovation in real-time. Watch counters tick upward tracking AI models trained, satellites in orbit, patents filed and more. The data never sleeps." },
  { id: '03', title: "ARCHIVES — TECH HISTORY", icon: '◼', content: "Scroll through the great library. Each Chronicle Level reveals a milestone as you scroll. SECURE INTEL REPORT opens a classified briefing on that entry. Your role determines which archives you access." },
  { id: '04', title: "LAB — EXPERIMENT CHAMBER", icon: '⬡', content: "The Live Lab is your sandbox. Use the terminal: TYPE 'HELP' to see commands. 'STATUS' shows system health. 'SCAN' runs a network sweep. 'RUN' executes the role experiment. Watch the Mission Log auto-feed." },
  { id: '05', title: "FORGE — IDEA FORGE", icon: '⚒', content: "Submit raw tech concepts to The Forge. Browse by category, upvote the most radical ideas. Your submission enters the community pool and can be tracked and voted on." },
  { id: '06', title: "DECODE — NEURAL DECODER", icon: '⬛', content: "Hacker utility. Encode plain text into BASE64, BINARY, HEX, or ROT13. Decode BASE64 strings. Copy your results instantly. Character counts update live." },
  { id: '07', title: "VERSE — PREDICTION ARENA", icon: '◆', content: "Post your future predictions. Type a concept and hit BROADCAST. The AI agent auto-detects your topic (AI, Space, Energy, Biotech, Quantum) and responds. Vote on the best predictions. Filter by topic." },
  { id: '08', title: "IDENTITY CLAIM", icon: '⬟', content: "Register your codename in the Citizen Registry. Choose your specialization: EXPLORER, ARCHITECT, HACKER, or VOYAGER. Your choice remaps the entire portal theme and unlocks role-specific archive entries." },
];

export default function TheCodex() {
  const [activeTab, setActiveTab] = useState(0);
  const [prevTab, setPrevTab] = useState(0);
  const [animating, setAnimating] = useState(false);

  const handleTabChange = (i) => {
    if (i === activeTab || animating) return;
    setAnimating(true);
    setPrevTab(activeTab);
    setTimeout(() => {
      setActiveTab(i);
      setAnimating(false);
    }, 220);
  };

  return (
    <section id="archives" style={{ padding: '80px 20px', minHeight: '600px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h2 className="neon-text-blue" style={{ textAlign: 'center', marginBottom: '10px', letterSpacing: '8px', fontSize: '2.5rem' }}>THE CODEX</h2>
        <p style={{ textAlign: 'center', fontSize: '0.65rem', color: '#555', letterSpacing: '4px', marginBottom: '40px' }}>PORTAL PROTOCOLS & USER DOCUMENTATION</p>

        <div className="codex-wrap glass hologram">
          <div className="codex-sidebar">
            {tutorials.map((t, i) => (
              <button
                key={i}
                onClick={() => handleTabChange(i)}
                className={`tab ${activeTab === i ? 'active' : ''}`}
              >
                <span className="tab-icon">{t.icon}</span>
                <span className="tab-text">{t.title}</span>
                {activeTab === i && <span className="tab-bar" />}
              </button>
            ))}
          </div>
          <div className="codex-content">
            <div className="label">PROTOCOL INFO — NODE {tutorials[activeTab].id}</div>
            <div className={`content-inner ${animating ? 'fade-out' : 'fade-in'}`}>
              <div className="content-icon">{tutorials[activeTab].icon}</div>
              <h3>{tutorials[activeTab].title}</h3>
              <p>{tutorials[activeTab].content}</p>
            </div>
            <div className="codex-shortcut">
              <span>PRO TIP: Use Sector Navigator on the left to jump between zones instantly.</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
                .codex-wrap {
                    display: flex;
                    min-height: 420px;
                    padding: 0;
                    overflow: hidden;
                }
                .codex-sidebar {
                    width: 35%;
                    border-right: 1px solid var(--glass-border);
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    overflow-y: auto;
                }
                .codex-content {
                    width: 65%;
                    padding: 40px;
                    background: rgba(0,0,0,0.3);
                    display: flex;
                    flex-direction: column;
                    position: relative;
                }
                .tab {
                    background: transparent;
                    border: none;
                    color: #555;
                    text-align: left;
                    padding: 10px 12px;
                    font-size: 0.65rem;
                    letter-spacing: 1px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    position: relative;
                }
                .tab-icon { font-size: 0.9rem; width: 18px; text-align: center; flex-shrink: 0; }
                .tab-text { flex: 1; }
                .tab.active {
                    color: var(--neon-blue);
                    text-shadow: 0 0 10px var(--neon-blue);
                    background: rgba(0, 242, 255, 0.06);
                }
                .tab:hover:not(.active) {
                    color: #aaa;
                    background: rgba(255,255,255,0.03);
                }
                .tab-bar {
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 3px;
                    height: 60%;
                    background: var(--neon-blue);
                    border-radius: 2px;
                    box-shadow: 0 0 8px var(--neon-blue);
                }
                .label {
                    font-size: 0.55rem;
                    color: var(--neon-purple);
                    margin-bottom: 20px;
                    letter-spacing: 3px;
                    font-weight: 700;
                }
                .content-inner {
                    flex: 1;
                }
                .content-inner.fade-out {
                    opacity: 0;
                    transform: translateY(8px);
                    transition: all 0.2s ease;
                }
                .content-inner.fade-in {
                    opacity: 1;
                    transform: translateY(0);
                    transition: all 0.3s ease;
                }
                .content-icon {
                    font-size: 2rem;
                    margin-bottom: 15px;
                    opacity: 0.4;
                }
                h3 { color: var(--neon-blue); margin-bottom: 20px; font-size: 1.1rem; letter-spacing: 2px; }
                p { line-height: 1.8; color: #aaa; font-size: 0.95rem; }
                .codex-shortcut {
                    margin-top: auto;
                    padding-top: 20px;
                    border-top: 1px solid rgba(255,255,255,0.05);
                    font-size: 0.55rem;
                    color: #333;
                    letter-spacing: 1px;
                }
                @media (max-width: 700px) {
                    .codex-wrap { flex-direction: column; }
                    .codex-sidebar { width: 100%; border-right: none; border-bottom: 1px solid var(--glass-border); flex-direction: row; flex-wrap: wrap; }
                    .codex-content { width: 100%; }
                }
            `}</style>
    </section>
  );
}
