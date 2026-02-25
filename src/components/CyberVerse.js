'use client';
import React, { useState, useEffect } from 'react';
import { useAchievements } from './AchievementSystem';

const MOCK_OPINIONS = [
    { source: 'REDDIT (HUMAN)', author: 'u/futurist_01', content: 'We need to decentralize energy production before we reach the singularity.', type: 'human', votes: 12, tag: 'ENERGY' },
    { source: 'MOLTBOOK (BOT)', author: 'OPEN_CLAW_BOT', content: 'Silicon-to-Carbon interfaces show 94% efficiency in neural-link simulations.', type: 'bot', votes: 84, tag: 'AI' },
    { source: 'COMMUNITY (HUMAN)', author: 'u/quantumdreamer', content: 'Quantum encryption will make today\'s cybersecurity completely obsolete within 10 years.', type: 'human', votes: 31, tag: 'QUANTUM' },
];

const BOT_DATA = {
    AI: ["NEURAL EFFICIENCY IS INEVITABLE.", "CARBON BRAINS ARE SLOW. TRANSITION NOW.", "THE SINGULARITY IS NOT A THREAT, IT'S AN UPGRADE."],
    SPACE: ["MARS IS COLD. EUROPA IS WET. TITAN IS HOME.", "WARP DRIVE PHYSICS ARE STABLE IN VIRTUAL SPACE.", "THE VOID IS HUNGRY. FEED IT PROTOCOLS."],
    ENERGY: ["DYSON SPHERES ARE THE ONLY LOGICAL ENDGAME.", "FUSION IS A TRANSITIONAL TOY.", "ZERO-POINT ENERGY IS WITHIN SYMBOLIC REACH."],
    BIOTECH: ["CRISPR REWRITES THE STORY OF HUMANITY. CHAPTER ONE BEGINS.", "ORGANIC COMPUTING IS THE NEXT FRONTIER.", "THE BODY IS AN APP AWAITING ITS UPDATE."],
    QUANTUM: ["QUANTUM SUPERPOSITION: THE UNIVERSE COMPUTING IN SECRET.", "ENTANGLEMENT IS INSTANTANEOUS. TIME IS IRRELEVANT.", "ALL POSSIBLE COMPUTATIONS EXIST. YOU JUST NEED TO OBSERVE."],
    DEFAULT: ["SYSTEM ANALYSIS: POTENTIAL DETECTED.", "INTERESTING HUMAN INPUT. CALCULATING...", "THE ARCHIVE GROWS. PROCEED."]
};

const TOPIC_CHIPS = ['#AI', '#SPACE', '#ENERGY', '#BIOTECH', '#QUANTUM', '#WEB3'];

export default function CyberVerse() {
    const [ideas, setIdeas] = useState(MOCK_OPINIONS);
    const [prediction, setPrediction] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [times, setTimes] = useState([]);
    const [filter, setFilter] = useState('ALL');
    const { unlock } = useAchievements() || {};

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            setTimes(ideas.map(() => new Date().toLocaleTimeString()));
        }
    }, [mounted, ideas.length]);

    const handleVote = (index, delta) => {
        const newIdeas = [...ideas];
        newIdeas[index] = { ...newIdeas[index], votes: newIdeas[index].votes + delta };
        setIdeas(newIdeas);
    };

    const handleChipClick = (chip) => {
        const keyword = chip.replace('#', '');
        setPrediction(prev => prev.includes(keyword) ? prev : (prev ? `${prev} ${keyword}` : keyword));
    };

    const submitPrediction = (e) => {
        e.preventDefault();
        if (!prediction.trim()) return;

        setIsSubmitting(true);
        // Detect tag
        const upred = prediction.toUpperCase();
        let detectedTag = 'GENERAL';
        if (upred.includes('AI') || upred.includes('NEURAL')) detectedTag = 'AI';
        else if (upred.includes('SPACE') || upred.includes('MARS') || upred.includes('ORBIT')) detectedTag = 'SPACE';
        else if (upred.includes('ENERGY') || upred.includes('SOLAR') || upred.includes('FUSION')) detectedTag = 'ENERGY';
        else if (upred.includes('BIOTECH') || upred.includes('CRISPR') || upred.includes('DNA')) detectedTag = 'BIOTECH';
        else if (upred.includes('QUANTUM')) detectedTag = 'QUANTUM';

        const userIdea = {
            source: 'YOU (HUMAN)',
            author: 'CITIZEN',
            content: prediction,
            type: 'human',
            votes: 0,
            tag: detectedTag,
            isNew: true,
        };
        setIdeas(prev => [userIdea, ...prev]);
        setPrediction('');
        unlock?.('ORACLE');

        setTimeout(() => {
            const category = BOT_DATA[detectedTag] || BOT_DATA.DEFAULT;
            const botResponse = category[Math.floor(Math.random() * category.length)];
            const botIdea = {
                source: 'MOLTBOOK (BOT)',
                author: 'SYST_COUNTER_BOT',
                content: botResponse,
                type: 'bot',
                votes: 0,
                tag: detectedTag,
                isNew: true,
            };
            setIdeas(prev => [botIdea, ...prev]);
            setIsSubmitting(false);
            document.body.classList.add('screen-shake');
            setTimeout(() => document.body.classList.remove('screen-shake'), 400);
        }, 1500);
    };

    const maxVotes = Math.max(...ideas.map(i => i.votes), 1);
    const displayedIdeas = filter === 'ALL' ? ideas : ideas.filter(i => i.tag === filter);

    return (
        <section id="cyberverse" className="cyberverse-container glass">
            <div className="verse-header">
                <h2 className="neon-text-purple glitch" data-text="PREDICTION ARENA">PREDICTION ARENA</h2>
                <p className="subtitle">SUBMIT YOUR IDEOLOGY. FACE THE AGENTS.</p>
            </div>

            {/* Topic Chips */}
            <div className="chips-row">
                {TOPIC_CHIPS.map(chip => (
                    <button key={chip} className="topic-chip" onClick={() => handleChipClick(chip)}>{chip}</button>
                ))}
            </div>

            <div className="prediction-form-wrap">
                <form onSubmit={submitPrediction} className="prediction-form">
                    <input
                        className="prediction-input"
                        placeholder="INPUT FUTURE TRAJECTORY (e.g. AI, Space, Quantum...)"
                        value={prediction}
                        onChange={(e) => setPrediction(e.target.value)}
                        disabled={isSubmitting}
                    />
                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'UPLINKING...' : 'BROADCAST'}
                    </button>
                </form>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
                {['ALL', 'AI', 'SPACE', 'ENERGY', 'BIOTECH', 'QUANTUM'].map(f => (
                    <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
                ))}
            </div>

            <div className="ideas-grid stagger">
                {displayedIdeas.map((idea, i) => (
                    <div key={i} className={`idea-card ${idea.type} ${idea.isNew ? 'new-entry' : ''} fade-up`} style={{ animationDelay: `${i * 0.05}s` }}>
                        {idea.votes === maxVotes && maxVotes > 0 && (
                            <div className="trending-badge">🔥 TRENDING</div>
                        )}
                        <div className="idea-meta">
                            <span className="source-tag">{idea.source}</span>
                            <span className="author">@{idea.author}</span>
                            {idea.tag && <span className="tag-pill">#{idea.tag}</span>}
                        </div>
                        <p className="content">{idea.content}</p>
                        <div className="card-footer">
                            <div className="vote-system">
                                <button onClick={() => handleVote(i, 1)}>▲</button>
                                <span className="votes" style={{ color: idea.votes > 0 ? 'var(--neon-blue)' : idea.votes < 0 ? 'var(--neon-pink)' : '#fff' }}>{idea.votes}</span>
                                <button onClick={() => handleVote(i, -1)}>▼</button>
                            </div>
                            <span className="timestamp">[{mounted && times[i] ? times[i] : 'UPLINKING...'}]</span>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .cyberverse-container {
                    padding: 100px 40px;
                    margin: 80px 20px;
                    min-height: 80vh;
                }
                .verse-header { text-align: center; margin-bottom: 30px; }
                .verse-header h2 { font-size: 3rem; letter-spacing: 10px; margin-bottom: 10px; }
                .subtitle { font-size: 0.7rem; color: var(--neon-blue); letter-spacing: 5px; }

                .chips-row {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    justify-content: center;
                    margin-bottom: 30px;
                }
                .topic-chip {
                    background: rgba(188, 19, 254, 0.08);
                    border: 1px solid rgba(188, 19, 254, 0.3);
                    color: var(--neon-purple);
                    padding: 6px 16px;
                    border-radius: 20px;
                    font-size: 0.7rem;
                    letter-spacing: 1px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .topic-chip:hover {
                    background: rgba(188, 19, 254, 0.25);
                    border-color: var(--neon-purple);
                    box-shadow: 0 0 10px rgba(188, 19, 254, 0.3);
                }

                .prediction-form-wrap {
                    max-width: 800px;
                    margin: 0 auto 30px;
                    padding: 20px;
                    background: rgba(255, 255, 255, 0.05);
                    border-bottom: 2px solid var(--neon-purple);
                }
                .prediction-form { display: flex; gap: 10px; }
                .prediction-input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: #fff;
                    font-size: 1.1rem;
                    padding: 10px;
                    outline: none;
                    font-family: 'Courier New', monospace;
                }
                .submit-btn {
                    background: var(--neon-purple);
                    color: #000;
                    border: none;
                    padding: 10px 30px;
                    font-weight: bold;
                    cursor: pointer;
                    letter-spacing: 2px;
                    transition: all 0.3s ease;
                }
                .submit-btn:hover:not(:disabled) { box-shadow: 0 0 20px var(--neon-purple); }
                .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

                .filter-bar {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    justify-content: center;
                    margin-bottom: 40px;
                }
                .filter-btn {
                    background: transparent;
                    border: 1px solid #222;
                    color: #555;
                    padding: 5px 14px;
                    border-radius: 4px;
                    font-size: 0.6rem;
                    letter-spacing: 2px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .filter-btn.active, .filter-btn:hover {
                    border-color: var(--neon-blue);
                    color: var(--neon-blue);
                }

                .ideas-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 25px;
                    max-width: 1400px;
                    margin: 0 auto;
                }
                .idea-card {
                    background: rgba(10, 10, 10, 0.8);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    padding: 30px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                    border-radius: 8px;
                }
                .trending-badge {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    font-size: 0.55rem;
                    letter-spacing: 2px;
                    background: rgba(255, 150, 0, 0.15);
                    border: 1px solid rgba(255, 150, 0, 0.4);
                    color: #ff9d00;
                    padding: 3px 10px;
                    border-radius: 20px;
                }
                .new-entry { animation: highlight-entry 1.5s ease-out; }
                @keyframes highlight-entry {
                    0% { border-color: var(--neon-blue); box-shadow: 0 0 50px var(--neon-blue); }
                    100% { border-color: rgba(255, 255, 255, 0.05); box-shadow: none; }
                }
                .idea-card.human { border-left: 3px solid var(--neon-blue); }
                .idea-card.bot { border-left: 3px solid var(--neon-purple); }
                .idea-card:hover {
                    background: rgba(20, 20, 20, 1);
                    transform: translateY(-4px);
                    border-color: rgba(255, 255, 255, 0.15);
                }
                .idea-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
                .source-tag {
                    font-size: 0.5rem;
                    font-weight: 900;
                    letter-spacing: 2px;
                    color: var(--neon-blue);
                }
                .author { font-size: 0.8rem; color: #fff; font-weight: 700; }
                .tag-pill {
                    font-size: 0.55rem;
                    background: rgba(188, 19, 254, 0.1);
                    border: 1px solid rgba(188, 19, 254, 0.2);
                    color: var(--neon-purple);
                    padding: 2px 8px;
                    border-radius: 20px;
                    letter-spacing: 1px;
                    margin-left: auto;
                }
                .content { color: #ddd; line-height: 1.6; font-size: 1rem; min-height: 60px; }
                .card-footer {
                    margin-top: auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-family: monospace;
                    font-size: 0.65rem;
                    color: #555;
                }
                .vote-system { display: flex; align-items: center; gap: 10px; }
                .vote-system button {
                    background: transparent;
                    border: 1px solid #222;
                    color: #555;
                    cursor: pointer;
                    padding: 2px 8px;
                    border-radius: 3px;
                    transition: all 0.2s ease;
                }
                .vote-system button:hover { color: #fff; border-color: #fff; }
                .votes { font-weight: bold; transition: color 0.3s ease; }
            `}</style>
        </section>
    );
}
