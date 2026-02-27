'use client';
import React, { useState, useEffect, useRef } from 'react';

const COINS = [
    { id: 'BTC', name: 'BITCOIN', icon: '₿', base: 97420, vol: 180, color: '#ff9d00', decimals: 0 },
    { id: 'ETH', name: 'ETHEREUM', icon: 'Ξ', base: 3480, vol: 25, color: '#bc13fe', decimals: 0 },
    { id: 'SOL', name: 'SOLANA', icon: '◎', base: 185.4, vol: 3.2, color: '#00ff66', decimals: 2 },
    { id: 'BNB', name: 'BNB', icon: '◆', base: 605, vol: 8, color: '#ffcc00', decimals: 0 },
    { id: 'ADA', name: 'CARDANO', icon: '₳', base: 0.478, vol: 0.012, color: '#00f2ff', decimals: 3 },
    { id: 'AVAX', name: 'AVALANCHE', icon: '▲', base: 35.2, vol: 0.8, color: '#ff0055', decimals: 2 },
    { id: 'DOT', name: 'POLKADOT', icon: '●', base: 7.28, vol: 0.15, color: '#ff00ea', decimals: 2 },
    { id: 'LINK', name: 'CHAINLINK', icon: '⬡', base: 15.4, vol: 0.35, color: '#00f2ff', decimals: 2 },
    { id: 'MATIC', name: 'POLYGON', icon: '⬟', base: 0.892, vol: 0.018, color: '#bc13fe', decimals: 3 },
    { id: 'DOGE', name: 'DOGECOIN', icon: 'Ð', base: 0.1934, vol: 0.004, color: '#ffcc00', decimals: 4 },
];

// Stable deterministic seed-based price simulation (avoids hydration mismatch)
function useCryptoPrices() {
    const [prices, setPrices] = useState(() =>
        COINS.map(c => ({ id: c.id, price: c.base, change: 0, history: [c.base, c.base, c.base, c.base, c.base] }))
    );
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Assign initial small random changes
        setPrices(COINS.map(c => {
            const change = (Math.random() - 0.5) * c.vol * 0.1;
            return { id: c.id, price: c.base + change, change, history: [c.base, c.base, c.base, c.base, c.base + change] };
        }));

        const iv = setInterval(() => {
            setPrices(prev => prev.map((p, i) => {
                const coin = COINS[i];
                const drift = (Math.random() - 0.48) * coin.vol * 0.05;
                const newPrice = Math.max(coin.base * 0.85, p.price + drift);
                const change = newPrice - coin.base;
                const history = [...p.history.slice(-4), newPrice];
                return { id: coin.id, price: newPrice, change, history };
            }));
        }, 2500);
        return () => clearInterval(iv);
    }, []);

    return { prices, mounted };
}

export default function CryptoTicker() {
    const { prices, mounted } = useCryptoPrices();
    const trackRef = useRef(null);
    const [paused, setPaused] = useState(false);

    const fmt = (price, decimals) => {
        if (price >= 1000) return '$' + price.toLocaleString('en', { maximumFractionDigits: decimals });
        return '$' + price.toFixed(decimals);
    };

    // Double the list for seamless infinite scroll
    const items = [...COINS, ...COINS];

    return (
        <div
            className="crypto-ticker-wrap"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            title="Hover to pause"
        >
            <div className="ticker-label">
                <span className="live-dot" style={{ background: '#00ff66' }} />
                CRYPTO LIVE
            </div>
            <div className="ticker-track-outer">
                <div ref={trackRef} className={`ticker-track ${paused ? 'paused' : ''}`}>
                    {items.map((coin, idx) => {
                        const priceData = prices.find(p => p.id === coin.id);
                        const price = priceData?.price ?? coin.base;
                        const change = priceData?.change ?? 0;
                        const isUp = change >= 0;
                        const pct = mounted ? ((change / coin.base) * 100) : 0;
                        return (
                            <div key={`${coin.id}-${idx}`} className="ticker-item">
                                <span className="ticker-icon" style={{ color: coin.color }}>{coin.icon}</span>
                                <span className="ticker-id">{coin.id}</span>
                                <span className="ticker-price" style={{ color: coin.color }}>
                                    {fmt(price, coin.decimals)}
                                </span>
                                {mounted && priceData?.history && (
                                    <svg width="28" height="16" viewBox="0 0 28 16" style={{ flexShrink: 0 }}>
                                        {(() => {
                                            const h = priceData.history;
                                            const min = Math.min(...h);
                                            const max = Math.max(...h);
                                            const range = max - min || 1;
                                            const pts = h.map((v, i) => {
                                                const x = (i / (h.length - 1)) * 26 + 1;
                                                const y = 15 - ((v - min) / range) * 13;
                                                return `${x.toFixed(1)},${y.toFixed(1)}`;
                                            }).join(' ');
                                            return <polyline points={pts} fill="none" stroke={isUp ? '#00ff66' : '#ff0055'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />;
                                        })()}
                                    </svg>
                                )}
                                <span className={`ticker-change ${isUp ? 'up' : 'dn'}`}>
                                    {isUp ? '▲' : '▼'} {Math.abs(pct).toFixed(2)}%
                                </span>
                                <span className="ticker-sep">·</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style jsx>{`
                .crypto-ticker-wrap {
                    position: relative;
                    z-index: 100;
                    display: flex;
                    align-items: center;
                    background: rgba(0,0,0,0.92);
                    border-bottom: 1px solid rgba(0,255,102,0.2);
                    height: 40px;
                    overflow: hidden;
                    user-select: none;
                }
                .ticker-label {
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    padding: 0 16px;
                    font-size: 0.5rem;
                    letter-spacing: 3px;
                    font-weight: 900;
                    color: #00ff66;
                    border-right: 1px solid rgba(0,255,102,0.2);
                    height: 100%;
                    background: rgba(0,255,102,0.04);
                    white-space: nowrap;
                }
                .ticker-track-outer {
                    flex: 1;
                    overflow: hidden;
                    height: 100%;
                    display: flex;
                    align-items: center;
                }
                .ticker-track {
                    display: flex;
                    align-items: center;
                    gap: 0;
                    animation: ticker-scroll 55s linear infinite;
                    will-change: transform;
                }
                .ticker-track.paused {
                    animation-play-state: paused;
                }
                @keyframes ticker-scroll {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-50%); }
                }
                .ticker-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 0 20px;
                    white-space: nowrap;
                }
                .ticker-icon { font-size: 1rem; line-height: 1; }
                .ticker-id {
                    font-size: 0.52rem;
                    font-weight: 900;
                    letter-spacing: 2px;
                    color: #fff;
                }
                .ticker-price {
                    font-size: 0.62rem;
                    font-weight: 700;
                    font-family: 'Courier New', monospace;
                    letter-spacing: 1px;
                }
                .ticker-change {
                    font-size: 0.5rem;
                    font-weight: 700;
                    letter-spacing: 1px;
                    padding: 1px 6px;
                    border-radius: 4px;
                }
                .ticker-change.up  { color: #00ff66; background: rgba(0,255,102,0.1); }
                .ticker-change.dn  { color: #ff0055; background: rgba(255,0,85,0.1); }
                .ticker-sep { color: #222; font-size: 1.2rem; margin-left: 8px; }
            `}</style>
        </div>
    );
}
