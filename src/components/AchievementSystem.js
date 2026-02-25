'use client';
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

// ── Achievement definitions ───────────────────────────────────────
export const ACHIEVEMENTS = {
    VOID_WALKER: { id: 'VOID_WALKER', title: 'VOID WALKER', desc: 'Entered the Portal.', icon: '◉', color: '#00f2ff' },
    CHRONO_DIVER: { id: 'CHRONO_DIVER', title: 'CHRONO DIVER', desc: 'Opened an Archive Intel Report.', icon: '◼', color: '#ff9d00' },
    SIGNAL_LOCKED: { id: 'SIGNAL_LOCKED', title: 'SIGNAL LOCKED', desc: 'Entered the Live Lab.', icon: '⬡', color: '#ff00ea' },
    IDEA_SPARK: { id: 'IDEA_SPARK', title: 'IDEA SPARK', desc: 'Submitted an Idea to the Forge.', icon: '⚒', color: '#ff6600' },
    DECODER_RING: { id: 'DECODER_RING', title: 'DECODER RING', desc: 'Decoded something in NeuralDecoder.', icon: '⬛', color: '#ffcc00' },
    ORACLE: { id: 'ORACLE', title: 'ORACLE', desc: 'Cast a Prediction in CyberVerse.', icon: '◆', color: '#bc13fe' },
    CITIZEN_ZERO: { id: 'CITIZEN_ZERO', title: 'CITIZEN ZERO', desc: 'Registered a Citizen Identity.', icon: '⬟', color: '#00f2ff' },
    BRAIN_ONLINE: { id: 'BRAIN_ONLINE', title: 'BRAIN ONLINE', desc: 'Accessed the Live Tech Feed.', icon: '🧠', color: '#00ff66' },
    PULSE_READER: { id: 'PULSE_READER', title: 'PULSE READER', desc: 'Watched the Tech Pulse metrics.', icon: '▲', color: '#00ff66' },
    FULL_CITIZEN: { id: 'FULL_CITIZEN', title: 'FULL CITIZEN', desc: 'Unlocked 5 or more achievements.', icon: '★', color: '#ffcc00' },
};

// ── Context ───────────────────────────────────────────────────────
const AchievementCtx = createContext(null);

export function useAchievements() {
    return useContext(AchievementCtx);
}

// ── Provider ──────────────────────────────────────────────────────
export function AchievementProvider({ children }) {
    const STORAGE_KEY = 'gtech_achievements_v2';
    // Always start empty — hydrate from localStorage in useEffect to avoid SSR mismatch
    const [unlocked, setUnlocked] = useState({});
    const [toasts, setToasts] = useState([]);
    const [trayOpen, setTrayOpen] = useState(false);
    const toastId = useRef(0);

    // Hydrate from localStorage after mount (client-only)
    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            if (Object.keys(saved).length > 0) setUnlocked(saved);
        } catch { }
    }, []);

    const unlock = useCallback((id) => {
        if (!ACHIEVEMENTS[id]) return;
        setUnlocked(prev => {
            if (prev[id]) return prev; // already unlocked
            const next = { ...prev, [id]: Date.now() };
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { }

            // Fire toast
            const tid = ++toastId.current;
            setToasts(t => [...t, { tid, ...ACHIEVEMENTS[id] }]);
            setTimeout(() => setToasts(t => t.filter(x => x.tid !== tid)), 4500);

            // Check FULL_CITIZEN
            if (Object.keys(next).length >= 5 && !next.FULL_CITIZEN) {
                setTimeout(() => unlock('FULL_CITIZEN'), 600);
            }
            return next;
        });
    }, []);

    const removeToast = (tid) => setToasts(t => t.filter(x => x.tid !== tid));

    // VOID_WALKER: fire after 2s on load
    useEffect(() => {
        const t = setTimeout(() => unlock('VOID_WALKER'), 2000);
        return () => clearTimeout(t);
    }, [unlock]);

    const unlockedList = Object.keys(unlocked).map(id => ACHIEVEMENTS[id]).filter(Boolean);
    const totalCount = Object.keys(ACHIEVEMENTS).length;

    return (
        <AchievementCtx.Provider value={{ unlock, unlocked }}>
            {children}

            {/* ── TOAST STACK ──────────────────────── */}
            <div className="toast-stack" aria-live="polite">
                {toasts.map(toast => (
                    <div key={toast.tid} className="ach-toast" style={{ borderColor: toast.color, boxShadow: `0 0 30px ${toast.color}44` }}>
                        <div className="toast-icon" style={{ color: toast.color, background: `${toast.color}18` }}>{toast.icon}</div>
                        <div className="toast-body">
                            <div className="toast-label">ACHIEVEMENT UNLOCKED</div>
                            <div className="toast-title" style={{ color: toast.color }}>{toast.title}</div>
                            <div className="toast-desc">{toast.desc}</div>
                        </div>
                        <button className="toast-close" onClick={() => removeToast(toast.tid)}>✕</button>
                    </div>
                ))}
            </div>

            {/* ── TRAY TOGGLE ─────────────────────── */}
            <button
                className="tray-toggle"
                onClick={() => setTrayOpen(o => !o)}
                title="Achievements"
            >
                ★ <span className="tray-count">{unlockedList.length}/{totalCount}</span>
            </button>

            {/* ── BADGE TRAY ──────────────────────── */}
            {trayOpen && (
                <div className="ach-tray glass">
                    <div className="tray-hdr">
                        <span>ACHIEVEMENTS</span>
                        <span className="tray-prog">{unlockedList.length} / {totalCount}</span>
                        <button className="tray-x" onClick={() => setTrayOpen(false)}>✕</button>
                    </div>
                    <div className="tray-grid">
                        {Object.values(ACHIEVEMENTS).map(a => {
                            const done = !!unlocked[a.id];
                            return (
                                <div key={a.id} className={`tray-badge ${done ? 'done' : 'locked'}`}
                                    style={done ? { borderColor: `${a.color}55`, background: `${a.color}0a` } : {}}>
                                    <div className="badge-icon" style={done ? { color: a.color } : {}}>{done ? a.icon : '?'}</div>
                                    <div className="badge-title" style={done ? { color: a.color } : {}}>{done ? a.title : '???'}</div>
                                    <div className="badge-desc">{done ? a.desc : 'KEEP EXPLORING...'}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <style jsx>{`
                /* ── TOASTS ─────────────────── */
                .toast-stack {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 20000;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    pointer-events: none;
                }
                .ach-toast {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    background: rgba(4,4,4,0.96);
                    border: 1px solid;
                    border-radius: 14px;
                    padding: 14px 16px;
                    width: 320px;
                    pointer-events: all;
                    animation: toast-slide-in 0.4s cubic-bezier(0.175,0.885,0.32,1.275) forwards;
                    backdrop-filter: blur(20px);
                }
                @keyframes toast-slide-in {
                    from { opacity: 0; transform: translateX(40px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                .toast-icon {
                    font-size: 1.5rem;
                    width: 46px;
                    height: 46px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .toast-body { flex: 1; display: flex; flex-direction: column; gap: 2px; }
                .toast-label { font-size: 0.42rem; letter-spacing: 3px; color: #555; font-weight: 700; }
                .toast-title { font-size: 0.85rem; font-weight: 900; letter-spacing: 2px; }
                .toast-desc  { font-size: 0.62rem; color: #888; }
                .toast-close {
                    background: transparent; border: none; color: #444;
                    cursor: pointer; font-size: 0.9rem; align-self: flex-start;
                    pointer-events: all;
                }
                .toast-close:hover { color: #fff; }

                /* ── TRAY TOGGLE ─────────────────── */
                .tray-toggle {
                    position: fixed;
                    bottom: 24px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 10002;
                    background: rgba(0,0,0,0.85);
                    border: 1px solid rgba(255,204,0,0.4);
                    color: #ffcc00;
                    padding: 7px 18px;
                    border-radius: 30px;
                    font-size: 0.62rem;
                    letter-spacing: 3px;
                    font-weight: 900;
                    cursor: pointer;
                    transition: all 0.2s;
                    backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .tray-toggle:hover { box-shadow: 0 0 20px rgba(255,204,0,0.4); }
                .tray-count { font-size: 0.55rem; opacity: 0.7; }

                /* ── BADGE TRAY ──────────────────── */
                .ach-tray {
                    position: fixed;
                    bottom: 70px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 10001;
                    width: 560px;
                    max-width: calc(100vw - 40px);
                    background: rgba(4,4,4,0.97);
                    border: 1px solid rgba(255,204,0,0.25);
                    border-radius: 20px;
                    padding: 20px;
                    backdrop-filter: blur(24px);
                    animation: tray-in 0.3s cubic-bezier(0.175,0.885,0.32,1.275);
                    box-shadow: 0 0 60px rgba(255,204,0,0.1);
                }
                @keyframes tray-in { from { opacity: 0; transform: translateX(-50%) translateY(10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
                .tray-hdr {
                    display: flex; align-items: center; gap: 10px;
                    font-size: 0.6rem; letter-spacing: 3px; color: #ffcc00;
                    font-weight: 900; margin-bottom: 16px;
                }
                .tray-prog { font-size: 0.55rem; color: #555; margin-left: auto; }
                .tray-x { background: transparent; border: none; color: #444; cursor: pointer; font-size: 1rem; }
                .tray-x:hover { color: #fff; }
                .tray-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
                .tray-badge {
                    border: 1px solid #222;
                    border-radius: 10px;
                    padding: 10px 8px;
                    display: flex; flex-direction: column; align-items: center; gap: 4px;
                    transition: all 0.2s;
                }
                .tray-badge.locked { opacity: 0.35; filter: grayscale(1); }
                .tray-badge.done:hover { transform: scale(1.05); }
                .badge-icon { font-size: 1.3rem; }
                .badge-title { font-size: 0.42rem; letter-spacing: 1px; font-weight: 900; text-align: center; }
                .badge-desc { font-size: 0.38rem; color: #555; text-align: center; line-height: 1.3; }
            `}</style>
        </AchievementCtx.Provider>
    );
}
