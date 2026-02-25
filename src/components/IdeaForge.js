'use client';
import React, { useState } from 'react';
import { useAchievements } from './AchievementSystem';

const SEED_IDEAS = [
    {
        id: 'f001',
        title: 'QUANTUM INTERNET BACKBONE',
        category: 'QUANTUM',
        desc: 'A global network using quantum entanglement for unhackable, instantaneous communication between every device on earth.',
        author: 'u/quantumleap_99',
        flames: 247,
    },
    {
        id: 'f002',
        title: 'BRAIN-COMPUTER PASSPORTS',
        category: 'AI',
        desc: 'Neural identity verification replaces physical IDs. Your unique brainwave signature becomes your passport, bank login, and front door key.',
        author: 'u/neuro_citizen',
        flames: 189,
    },
    {
        id: 'f003',
        title: 'SOLAR DESALINATION MEGA-GRID',
        category: 'ENERGY',
        desc: 'Coastal mega-plants powered entirely by solar that convert seawater into fresh water at continental scale, solving global water scarcity by 2040.',
        author: 'u/terraformer_x',
        flames: 312,
    },
    {
        id: 'f004',
        title: 'CRISPR CROP UPLINK',
        category: 'BIOTECH',
        desc: 'Engineering crops that can absorb 10x more CO2 while producing 5x more yield, solving both climate change and food security simultaneously.',
        author: 'u/bio_architect',
        flames: 155,
    },
    {
        id: 'f005',
        title: 'AUTONOMOUS ORBITAL FACTORIES',
        category: 'SPACE',
        desc: 'Self-replicating robotic factories in Earth orbit that mine asteroids and produce materials in microgravity — feeding infinite raw materials back to Earth.',
        author: 'u/void_engineer',
        flames: 421,
    },
    {
        id: 'f006',
        title: 'LIVING ARCHITECTURE SKIN',
        category: 'AI',
        desc: 'Buildings coated in AI-driven photovoltaic skin that morphs to maximise solar capture, adapts to weather, and harvests energy from rain and wind simultaneously.',
        author: 'u/smart_struct',
        flames: 98,
    },
];

const CATEGORIES = ['ALL', 'AI', 'SPACE', 'ENERGY', 'BIOTECH', 'QUANTUM', 'WEB3'];
const CAT_COLORS = { AI: '#00f2ff', SPACE: '#ff9d00', ENERGY: '#ffcc00', BIOTECH: '#00ff66', QUANTUM: '#bc13fe', WEB3: '#ff00ea', GENERAL: '#fff' };

export default function IdeaForge() {
    const [ideas, setIdeas] = useState(SEED_IDEAS);
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [form, setForm] = useState({ title: '', category: 'AI', desc: '' });
    const [submitting, setSubmitting] = useState(false);
    const [newId, setNewId] = useState(null);
    const { unlock } = useAchievements() || {};

    const handleVote = (id) => {
        setIdeas(prev => prev.map(i => i.id === id ? { ...i, flames: i.flames + 1 } : i));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.desc.trim()) return;
        setSubmitting(true);
        setTimeout(() => {
            const id = `u_${Date.now()}`;
            const idea = {
                id,
                title: form.title.toUpperCase(),
                category: form.category,
                desc: form.desc,
                author: 'u/you',
                flames: 0,
                isNew: true,
            };
            setIdeas(prev => [idea, ...prev]);
            setForm({ title: '', category: 'AI', desc: '' });
            setNewId(id);
            setSubmitting(false);
            unlock?.('IDEA_SPARK');
            setTimeout(() => setNewId(null), 2000);
        }, 800);
    };

    const display = activeFilter === 'ALL' ? ideas : ideas.filter(i => i.category === activeFilter);
    const sorted = [...display].sort((a, b) => b.flames - a.flames);

    return (
        <section id="forge" className="forge-section">
            <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 20px' }}>
                <div className="forge-header">
                    <div className="forge-badge">⚒ THE IDEA FORGE</div>
                    <h2 className="neon-text-blue" style={{ fontSize: '2.8rem', letterSpacing: '10px' }}>RAW CONCEPTS.</h2>
                    <p className="forge-sub">UNFILTERED FUTURES. SUBMIT YOUR TECH VISION TO THE COLLECTIVE.</p>
                </div>

                {/* Submission Form */}
                <div className="forge-form-wrap glass">
                    <div className="form-label">FORGE A NEW IDEA</div>
                    <form onSubmit={handleSubmit} className="forge-form">
                        <div className="form-row">
                            <div className="form-group" style={{ flex: 2 }}>
                                <label>CONCEPT TITLE</label>
                                <input
                                    type="text"
                                    placeholder="E.G. QUANTUM TELEPORTATION MESH..."
                                    value={form.title}
                                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>CATEGORY</label>
                                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                                    {CATEGORIES.filter(c => c !== 'ALL').map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>CONCEPT DESCRIPTION</label>
                            <textarea
                                placeholder="DESCRIBE YOUR VISION FOR THE FUTURE..."
                                value={form.desc}
                                onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                                required
                                rows={3}
                            />
                        </div>
                        <button type="submit" className="forge-btn" disabled={submitting}>
                            {submitting ? '⚒ FORGING...' : '⚒ SUBMIT TO THE FORGE'}
                        </button>
                    </form>
                </div>

                {/* Filter */}
                <div className="filter-row">
                    {CATEGORIES.map(cat => (
                        <button key={cat} className={`filter-chip ${activeFilter === cat ? 'active' : ''}`} style={activeFilter === cat ? { borderColor: CAT_COLORS[cat] || '#fff', color: CAT_COLORS[cat] || '#fff', background: `${CAT_COLORS[cat]}14` } : {}} onClick={() => setActiveFilter(cat)}>
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Ideas Grid */}
                <div className="ideas-grid">
                    {sorted.map((idea, i) => {
                        const color = CAT_COLORS[idea.category] || '#fff';
                        const isTop = i === 0 && idea.flames > 0;
                        return (
                            <div key={idea.id} className={`idea-card glass ${idea.id === newId ? 'forge-entrance' : ''}`} style={{ borderTop: `2px solid ${color}`, boxShadow: isTop ? `0 0 40px ${color}22` : 'none' }}>
                                {isTop && <div className="top-badge" style={{ background: `${color}22`, borderColor: `${color}66`, color }}>🏆 TOP CONCEPT</div>}
                                <div className="card-top">
                                    <div className="cat-tag" style={{ background: `${color}14`, borderColor: `${color}44`, color }}>{idea.category}</div>
                                    <div className="card-author">{idea.author}</div>
                                </div>
                                <h3 className="card-title">{idea.title}</h3>
                                <p className="card-desc">{idea.desc}</p>
                                <div className="card-footer">
                                    <button className="flame-btn" onClick={() => handleVote(idea.id)} style={{ borderColor: `${color}44`, color }} title="Upvote this idea">
                                        🔥 {idea.flames}
                                    </button>
                                    <span className="card-meta">CONCEPT #{idea.id.slice(-4)}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style jsx>{`
                .forge-section {
                    padding: 80px 0;
                    background: linear-gradient(180deg, rgba(5,5,5,0) 0%, rgba(20,5,0,0.4) 50%, rgba(5,5,5,0) 100%);
                }
                .forge-header {
                    text-align: center;
                    margin-bottom: 50px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                }
                .forge-badge {
                    font-size: 0.65rem;
                    letter-spacing: 4px;
                    color: var(--neon-amber, #ff9d00);
                    font-weight: 900;
                    background: rgba(255, 157, 0, 0.08);
                    border: 1px solid rgba(255, 157, 0, 0.25);
                    padding: 6px 18px;
                    border-radius: 20px;
                }
                .forge-sub {
                    font-size: 0.65rem;
                    color: #555;
                    letter-spacing: 3px;
                    max-width: 500px;
                    text-align: center;
                }

                .forge-form-wrap {
                    max-width: 900px;
                    margin: 0 auto 40px;
                    padding: 30px 35px;
                    border-radius: 12px;
                }
                .form-label {
                    font-size: 0.6rem;
                    color: var(--neon-blue);
                    letter-spacing: 3px;
                    font-weight: 700;
                    margin-bottom: 20px;
                }
                .forge-form {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .form-row {
                    display: flex;
                    gap: 16px;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                label {
                    font-size: 0.55rem;
                    color: #555;
                    letter-spacing: 2px;
                    font-weight: 700;
                }
                input, select, textarea {
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    color: #fff;
                    padding: 12px;
                    border-radius: 6px;
                    outline: none;
                    font-family: inherit;
                    font-size: 0.9rem;
                    transition: border-color 0.3s ease;
                }
                input:focus, select:focus, textarea:focus {
                    border-color: var(--neon-blue);
                }
                select option { background: #111; }
                textarea { resize: vertical; min-height: 80px; }
                .forge-btn {
                    background: transparent;
                    border: 1px solid var(--neon-blue);
                    color: var(--neon-blue);
                    padding: 14px 30px;
                    font-weight: 900;
                    letter-spacing: 3px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border-radius: 6px;
                    font-size: 0.8rem;
                    align-self: flex-start;
                }
                .forge-btn:hover:not(:disabled) {
                    background: var(--neon-blue);
                    color: #000;
                    box-shadow: 0 0 30px var(--neon-blue);
                }
                .forge-btn:disabled { opacity: 0.5; cursor: not-allowed; }

                .filter-row {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    justify-content: center;
                    margin-bottom: 40px;
                }
                .filter-chip {
                    background: transparent;
                    border: 1px solid #222;
                    color: #555;
                    padding: 6px 16px;
                    border-radius: 20px;
                    font-size: 0.6rem;
                    letter-spacing: 2px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .filter-chip:hover {
                    border-color: #555;
                    color: #aaa;
                }

                .ideas-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 22px;
                }
                @media (max-width: 1000px) {
                    .ideas-grid { grid-template-columns: repeat(2, 1fr); }
                }
                @media (max-width: 640px) {
                    .ideas-grid { grid-template-columns: 1fr; }
                    .form-row { flex-direction: column; }
                }

                .idea-card {
                    padding: 25px;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                .idea-card:hover { transform: translateY(-5px); }
                .top-badge {
                    font-size: 0.5rem;
                    letter-spacing: 2px;
                    border: 1px solid;
                    padding: 3px 10px;
                    border-radius: 20px;
                    align-self: flex-start;
                    font-weight: 900;
                }
                .card-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .cat-tag {
                    font-size: 0.55rem;
                    letter-spacing: 2px;
                    font-weight: 900;
                    padding: 3px 10px;
                    border-radius: 20px;
                    border: 1px solid;
                }
                .card-author { font-size: 0.6rem; color: #444; letter-spacing: 1px; }
                .card-title {
                    font-size: 1rem;
                    font-weight: 900;
                    letter-spacing: 2px;
                    color: #fff;
                    line-height: 1.3;
                }
                .card-desc { color: #888; line-height: 1.7; font-size: 0.9rem; flex: 1; }
                .card-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: auto;
                    padding-top: 12px;
                    border-top: 1px solid rgba(255,255,255,0.04);
                }
                .flame-btn {
                    background: transparent;
                    border: 1px solid;
                    padding: 6px 14px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-weight: 700;
                }
                .flame-btn:hover { transform: scale(1.08); box-shadow: 0 0 15px currentColor; }
                .card-meta { font-size: 0.5rem; color: #333; letter-spacing: 1px; font-family: monospace; }
            `}</style>
        </section>
    );
}
