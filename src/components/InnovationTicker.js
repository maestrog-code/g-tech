'use client';
import React, { useEffect, useState, useRef } from 'react';

const CATEGORIES = ['🤖 AI', '🚀 SPACE', '⚡ ENERGY', '🧬 BIOTECH', '💻 QUANTUM', '🌐 WEB3'];

export default function InnovationTicker() {
  const [innovations, setInnovations] = useState([
    { text: "Connecting to global intelligence network...", cat: '🌐 WEB3' },
    { text: "Extracting live tech signals...", cat: '🤖 AI' },
    { text: "Calibrating innovation feed...", cat: '⚡ ENERGY' },
  ]);
  const [mounted, setMounted] = useState(false);
  const [impacts, setImpacts] = useState([]);

  useEffect(() => {
    setMounted(true);
    async function fetchNews() {
      try {
        const res = await fetch('/api/news');
        const data = await res.json();
        if (data && data.length > 0) {
          const enriched = data.map((text, i) => ({
            text,
            cat: CATEGORIES[i % CATEGORIES.length],
          }));
          setInnovations(enriched);
        }
      } catch (err) {
        console.error("News extraction failed");
      }
    }
    fetchNews();
    const interval = setInterval(fetchNews, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (mounted) {
      setImpacts(innovations.map(() => Math.floor(Math.random() * 90) + 10));
    }
  }, [mounted, innovations]);

  if (!mounted) {
    return (
      <div className="ticker-wrap glass">
        <div className="ticker" style={{ opacity: 0 }}>
          <div className="ticker-item">CONNECTING...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="ticker-wrap glass">
      <div className="live-badge">
        <span className="live-dot" />
        <span className="live-label">LIVE</span>
      </div>
      <div className="ticker-overflow">
        <div className="ticker">
          {[...innovations, ...innovations].map((item, i) => (
            <div key={i} className="ticker-item">
              <span className="cat-badge">{item.cat}</span>
              <span className="dot">●</span>
              <span className="news-content">{item.text}</span>
              <span className="intel-tag">[IMPACT: {impacts[i % innovations.length] || 50}%]</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
                .ticker-wrap {
                    width: 100%;
                    overflow: hidden;
                    background: rgba(0, 242, 255, 0.04);
                    border-left: none;
                    border-right: none;
                    padding: 10px 0;
                    margin-bottom: 20px;
                    border-radius: 0;
                    display: flex;
                    align-items: center;
                    border-top: 1px solid rgba(0, 242, 255, 0.15);
                    border-bottom: 1px solid rgba(0, 242, 255, 0.15);
                    position: relative;
                }
                .live-badge {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 0 20px;
                    border-right: 1px solid rgba(0,242,255,0.2);
                    flex-shrink: 0;
                }
                .live-label {
                    font-size: 0.6rem;
                    font-weight: 900;
                    letter-spacing: 3px;
                    color: var(--neon-pink);
                }
                .ticker-overflow {
                    overflow: hidden;
                    flex: 1;
                }
                .ticker {
                    display: flex;
                    white-space: nowrap;
                    animation: ticker 60s linear infinite;
                }
                .ticker-item {
                    padding: 0 40px;
                    font-size: 0.8rem;
                    color: var(--neon-blue);
                    font-weight: 700;
                    letter-spacing: 2px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .cat-badge {
                    font-size: 0.65rem;
                    background: rgba(0, 242, 255, 0.1);
                    border: 1px solid rgba(0, 242, 255, 0.2);
                    border-radius: 20px;
                    padding: 2px 8px;
                    color: var(--neon-blue);
                    white-space: nowrap;
                }
                .dot {
                    color: var(--neon-pink);
                    text-shadow: 0 0 5px var(--neon-pink);
                    flex-shrink: 0;
                }
                .news-content {
                    color: var(--neon-blue);
                }
                .intel-tag {
                    font-size: 0.6rem;
                    color: var(--neon-purple);
                    opacity: 0.8;
                    font-family: monospace;
                    background: rgba(188, 19, 254, 0.1);
                    padding: 2px 6px;
                    border-radius: 4px;
                    flex-shrink: 0;
                }
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
    </div>
  );
}
