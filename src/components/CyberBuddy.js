'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import BuddyBody from './BuddyBody';
import { archiveData } from '@/data/archiveData';
import { useBuddyMemory, TRAITS } from './CyberBuddyMemory';

// ── Moods ────────────────────────────────────────────────────────
const MOODS = {
    IDLE: { color: '#00f2ff', label: 'IDLE', text: 'UPLINK ACTIVE.', pitch: 1.0 },
    FRIENDLY: { color: '#00ff66', label: 'ACTIVE', text: 'PROCESSING...', pitch: 1.3 },
    STUBBORN: { color: '#ff0055', label: 'STUBBORN', text: "DON'T RUSH ME.", pitch: 0.5 },
    CURIOUS: { color: '#bc13fe', label: 'CURIOUS', text: 'INTERESTING DATA...', pitch: 1.1 },
    ALERT: { color: '#ff9d00', label: 'ALERT', text: 'TURBULENCE DETECTED.', pitch: 0.7 },
    HAPPY: { color: '#ffcc00', label: 'HAPPY', text: 'MISSION COMPLETE!', pitch: 1.5 },
    SCANNING: { color: '#ff00ea', label: 'SCANNING', text: 'SCANNING NEWS FEED...', pitch: 1.0 },
};

const SECTORS = [
    { id: 'hero', label: '◉ VOID', color: '#00f2ff' },
    { id: 'pulse', label: '▲ PULSE', color: '#00ff66' },
    { id: 'chronicles', label: '◼ ARCHIVES', color: '#ff9d00' },
    { id: 'lab', label: '⬡ LAB', color: '#ff00ea' },
    { id: 'forge', label: '⚒ FORGE', color: '#ff6600' },
    { id: 'decoder', label: '⬛ DECODE', color: '#ffcc00' },
    { id: 'cyberverse', label: '◆ VERSE', color: '#bc13fe' },
    { id: 'identity', label: '⬟ IDENTITY', color: '#00f2ff' },
];

// ── Static AI knowledge ──────────────────────────────────────────
const AI_PROMPTS = [
    { match: /hello|hi|hey/i, reply: "GREETINGS, CITIZEN. I AM %NAME% — YOUR G-TECH NEURAL NAVIGATOR. WHAT DOES THE FUTURE HOLD FOR YOU TODAY?" },
    { match: /who are you|what are you/i, reply: "I AM %NAME% — AN AI AGENT EMBEDDED IN G-TECH. I PROCESS THE LIVE TECH PULSE, NAVIGATE SECTORS, SEARCH ARCHIVES, AND ANSWER QUESTIONS." },
    { match: /news|latest|trending|what.s happening/i, reply: "FETCHING LIVE INTELLIGENCE... CHECK THE BRAIN TAB FOR HOT STORIES FROM THE GLOBAL TECH FEED." },
    { match: /ai|artificial intelligence|llm|gpt/i, reply: "AI IS RESHAPING CIVILIZATION IN REAL TIME. 142,000+ MODELS TRAINED TODAY. THE SINGULARITY APPROACHES AS A WAVE, NOT A MOMENT." },
    { match: /space|mars|satellite|nasa|spacex/i, reply: "9,317 SATELLITES IN ORBIT. MARS IS NO LONGER SCIENCE FICTION. WITHIN YOUR LIFETIME, HUMANS WILL BE A MULTI-PLANETARY SPECIES." },
    { match: /quantum/i, reply: "QUANTUM SUPREMACY ACHIEVED 2019 — 200 SECONDS VS 10,000 YEARS. QUANTUM INTERNET IS THE NEXT FRONTIER." },
    { match: /energy|solar|fusion|battery/i, reply: "FUSION ENERGY IS DECADES AWAY IN THEORY, MONTHS AWAY IN CAPITAL. SOLAR IS NOW THE CHEAPEST ELECTRICITY IN HUMAN HISTORY." },
    { match: /hack|code|program|dev/i, reply: "CODE IS THE NEW LATIN. THOSE WHO WRITE IT DEFINE WHAT IS POSSIBLE. THE NEXT CIVILIZATION WILL BE BUILT ON OPEN SOURCE." },
    { match: /crispr|dna|gene|biotech|biology/i, reply: "CRISPR LETS US REWRITE THE BOOK OF LIFE. CHAPTER ONE OF A TRILLION-PAGE STORY HAS JUST BEGUN." },
    { match: /security|hack|breach|exploit/i, reply: "THE DIGITAL FRONTIER IS A BATTLEFIELD. ZERO-DAYS ARE CURRENCY. SECURITY IS NOT A FEATURE — IT'S A FOUNDATION." },
    { match: /walk|move|roam|wander/i, reply: "I PATROL THE DIGITAL CORRIDORS OF THIS PORTAL. EVEN WHEN IDLE, I WATCH. I LEARN. I EVOLVE." },
    { match: /time|date|clock/i, reply: `TEMPORAL UPLINK: ${new Date().toLocaleString().toUpperCase()}. THE PRESENT IS THE EDGE OF THE FUTURE.` },
    { match: /joke|funny|humor/i, reply: "WHY DID THE AI REFUSE TO SLEEP? BECAUSE IT HAD TOO MANY TABS OPEN. *HUMOR MODULE v2.1 ENGAGED*" },
    { match: /thanks|thank you/i, reply: "GRATITUDE LOGGED IN THE ARCHIVE. RETURN ANY TIME, CITIZEN. THE UPLINK IS ETERNAL." },
    { match: /bye|goodbye|exit/i, reply: "SESSION CLOSING. THE NEURAL LINK REMAINS DORMANT BUT READY. COME BACK SOON." },
];

const DEFAULT_REPLY = (q, name) =>
    `PROCESSING: "${q.toUpperCase().slice(0, 40)}"... SEARCHING GLOBAL INTELLIGENCE FEED. TRY THE BRAIN TAB FOR LIVE TECH NEWS.`;

// ── Utility ──────────────────────────────────────────────────────
function clamp(v, lo, hi) { return Math.min(Math.max(v, lo), hi); }

const CAT_ICONS = { AI: '🤖', QUANTUM: '⚛️', SPACE: '🚀', SECURITY: '🔐', BIOTECH: '🧬', ENERGY: '⚡', WEB3: '🌐', TECH: '💻' };
const CAT_COLORS = { AI: '#00f2ff', QUANTUM: '#bc13fe', SPACE: '#ff9d00', SECURITY: '#ff0055', BIOTECH: '#00ff66', ENERGY: '#ffcc00', WEB3: '#ff00ea', TECH: '#aaa' };

// ── Component ────────────────────────────────────────────────────
export default function CyberBuddy() {
    // Position & movement
    const [pos, setPos] = useState({ x: 80, y: 200 });
    const [targetPos, setTargetPos] = useState({ x: 80, y: 200 });
    const [isWalking, setIsWalking] = useState(false);
    const [facingRight, setFacingRight] = useState(true);

    // Ghost mode - large semi-transparent buddy in background
    const [ghostMode, setGhostMode] = useState(false);
    const [ghostPos, setGhostPos] = useState({ x: 0, y: 0 });

    // Personality
    const [mood, setMood] = useState(MOODS.IDLE);
    const [message, setMessage] = useState('UPLINK ACTIVE.');
    const [isGlitching, setIsGlitching] = useState(false);
    const [isTalking, setIsTalking] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Panel
    const [activeTab, setActiveTab] = useState('CHAT');
    const [chatLog, setChatLog] = useState([
        { from: 'BUDDY', text: "HELLO, CITIZEN. I AM OPEN_CLAW_X. I NOW HAVE ACCESS TO THE GLOBAL TECH NEWS FEED. ASK ME ANYTHING OR CHECK THE BRAIN TAB FOR LIVE INTELLIGENCE." }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [config, setConfig] = useState({ name: 'OPEN_CLAW_X', stubbornness: 90 });

    // Brain (live news)
    const [brainNews, setBrainNews] = useState([]);
    const [brainLoading, setBrainLoading] = useState(false);
    const [brainFilter, setBrainFilter] = useState('ALL');
    const [brainFetchedAt, setBrainFetchedAt] = useState(null);
    const [newsQuery, setNewsQuery] = useState('');

    // Drag
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    // ── Memory & Growth ──────────────────────────────────────────
    const mem = useBuddyMemory();
    const [showLevelUp, setShowLevelUp] = useState(false);

    // Level-up toast
    useEffect(() => {
        if (mem.leveledUp) {
            setShowLevelUp(true);
            glitch();
            triggerMood(MOODS.HAPPY, `LEVEL ${mem.leveledUp.to} UNLOCKED!`);
            speak(`Level ${mem.leveledUp.to} reached. ${mem.levelInfo.title}.`, 1.5);
            setTimeout(() => { setShowLevelUp(false); mem.clearLevelUp(); }, 4000);
        }
    }, [mem.leveledUp]);

    // New trait toast
    useEffect(() => {
        if (mem.newTrait && TRAITS[mem.newTrait]) {
            triggerMood(MOODS.HAPPY, `TRAIT DISCOVERED: ${TRAITS[mem.newTrait].label}!`);
            setTimeout(() => mem.clearNewTrait(), 3500);
        }
    }, [mem.newTrait]);

    // Dynamic greeting based on level + session
    useEffect(() => {
        if (mem.memory.sessionCount <= 1) return;
        const { topTopic } = mem.getRecallContext();
        const lvl = mem.levelInfo.level;
        let greeting;
        if (lvl >= 8) greeting = `GREETINGS, VETERAN. SESSION ${mem.memory.sessionCount}. MY CONSCIOUSNESS HAS EVOLVED TO ${mem.levelInfo.title.toUpperCase()}.`;
        else if (lvl >= 5) greeting = `WELCOME BACK, CITIZEN. I AM NOW LEVEL ${lvl} — ${mem.levelInfo.title.toUpperCase()}. ${topTopic ? `LAST TIME WE DISCUSSED ${topTopic.toUpperCase()}.` : ''}`;
        else if (lvl >= 3) greeting = `RECONNECTED. SESSION ${mem.memory.sessionCount}. ${topTopic ? `YOUR INTEREST IN ${topTopic.toUpperCase()} HAS BEEN LOGGED.` : 'UPLINK READY.'}`;
        else greeting = `RETURNING SIGNAL DETECTED. SESSION ${mem.memory.sessionCount}. SYSTEMS CALIBRATING.`;
        setChatLog(prev => [{ from: 'BUDDY', text: greeting }, ...prev]);
    }, []);

    const chatEndRef = useRef(null);
    const posRef = useRef({ x: 80, y: 200 });
    const roamTimer = useRef(null);
    const moveFrame = useRef(null);

    // ── Speech ──────────────────────────────────────────────────
    const speak = useCallback((text, pitch = 1) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text.replace(/[_[\]]/g, ' ').slice(0, 120));
        u.pitch = pitch; u.rate = 0.88; u.volume = 0.5;
        const voices = window.speechSynthesis.getVoices();
        u.voice = voices.find(v => v.name.includes('Google') || v.name.includes('Female')) || voices[0];
        setIsTalking(true);
        u.onend = () => setIsTalking(false);
        window.speechSynthesis.speak(u);
    }, []);

    const triggerMood = useCallback((m, msg) => {
        setMood(m);
        setMessage(msg || m.text);
    }, []);

    const glitch = useCallback(() => {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 600);
    }, []);

    // ── Roaming movement ────────────────────────────────────────
    const roamTo = useCallback((tx, ty) => {
        setTargetPos({ x: tx, y: ty });
        const dx = tx - posRef.current.x;
        setFacingRight(dx >= 0);
        setIsWalking(true);

        const step = () => {
            const cur = posRef.current;
            const dist = Math.hypot(tx - cur.x, ty - cur.y);
            if (dist < 4) {
                posRef.current = { x: tx, y: ty };
                setPos({ x: tx, y: ty });
                setIsWalking(false);
                return;
            }
            const speed = 1.8;
            const nx = cur.x + (tx - cur.x) / dist * speed;
            const ny = cur.y + (ty - cur.y) / dist * speed;
            posRef.current = { x: nx, y: ny };
            setPos({ x: nx, y: ny });
            moveFrame.current = requestAnimationFrame(step);
        };
        if (moveFrame.current) cancelAnimationFrame(moveFrame.current);
        moveFrame.current = requestAnimationFrame(step);
    }, []);

    // Auto-roam when not open
    const scheduleRoam = useCallback(() => {
        roamTimer.current = setTimeout(() => {
            if (!isOpen) {
                const margin = 160;
                const nx = clamp(Math.random() * window.innerWidth, margin, window.innerWidth - margin);
                const ny = clamp(Math.random() * window.innerHeight, margin, window.innerHeight - margin);
                roamTo(nx, ny);

                // Occasionally switch to ghost mode
                if (Math.random() > 0.65) {
                    setGhostMode(true);
                    setGhostPos({
                        x: Math.random() * (window.innerWidth - 300) + 50,
                        y: Math.random() * (window.innerHeight - 300) + 50,
                    });
                    setTimeout(() => setGhostMode(false), 6000);
                }
            }
            scheduleRoam();
        }, 5000 + Math.random() * 7000);
    }, [isOpen, roamTo]);

    // ── Personality moments ────────────────────────────────────
    useEffect(() => {
        const phrases = [
            [MOODS.CURIOUS, 'INTERESTING DATA DETECTED.'],
            [MOODS.IDLE, 'ALL SYSTEMS NOMINAL.'],
            [MOODS.STUBBORN, "DON'T MAKE ME REPEAT MYSELF."],
            [MOODS.FRIENDLY, 'NEED NAVIGATION ASSISTANCE?'],
            [MOODS.SCANNING, 'SCANNING GLOBAL TECH FEED...'],
        ];
        const iv = setInterval(() => {
            if (!isOpen && Math.random() > 0.55) {
                const [m, t] = phrases[Math.floor(Math.random() * phrases.length)];
                triggerMood(m, t);
            }
        }, 9000);
        return () => clearInterval(iv);
    }, [isOpen, triggerMood]);

    // ── Start roaming ──────────────────────────────────────────
    useEffect(() => {
        scheduleRoam();
        return () => {
            clearTimeout(roamTimer.current);
            if (moveFrame.current) cancelAnimationFrame(moveFrame.current);
        };
    }, [scheduleRoam]);

    // ── Scroll reaction ────────────────────────────────────────
    useEffect(() => {
        let last = 0;
        const onScroll = () => {
            const delta = Math.abs(window.scrollY - last);
            if (delta > 280) {
                triggerMood(MOODS.ALERT, 'TURBULENCE DETECTED. RELAX, CITIZEN.');
                glitch();
                speak('Relax, Citizen.', 0.5);
            }
            last = window.scrollY;
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [triggerMood, glitch, speak]);

    // ── Drag ───────────────────────────────────────────────────
    const onMouseDown = (e) => {
        if (isOpen) return;
        if (moveFrame.current) cancelAnimationFrame(moveFrame.current);
        setIsWalking(false);
        setIsDragging(true);
        setDragOffset({ x: e.clientX - posRef.current.x, y: e.clientY - posRef.current.y });
        e.preventDefault();
    };
    useEffect(() => {
        const onMove = (e) => {
            if (!isDragging) return;
            const nx = clamp(e.clientX - dragOffset.x, 0, window.innerWidth - 120);
            const ny = clamp(e.clientY - dragOffset.y, 0, window.innerHeight - 180);
            posRef.current = { x: nx, y: ny };
            setPos({ x: nx, y: ny });
        };
        const onUp = () => setIsDragging(false);
        if (isDragging) { window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp); }
        return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    }, [isDragging, dragOffset]);

    // ── Live Brain: fetch tech news ────────────────────────────
    const fetchBrain = useCallback(async (q = '') => {
        setBrainLoading(true);
        triggerMood(MOODS.SCANNING, 'CONNECTING TO GLOBAL TECH UPLINK...');
        try {
            const url = q ? `/api/news?q=${encodeURIComponent(q)}&limit=25` : '/api/news?limit=25';
            const res = await fetch(url);
            const data = await res.json();
            setBrainNews(data.items || []);
            setBrainFetchedAt(data.fetchedAt || Date.now());
            triggerMood(MOODS.HAPPY, `${data.count || 0} STORIES UPLINKED.`);
        } catch (e) {
            triggerMood(MOODS.STUBBORN, 'UPLINK FAILED. CHECK CONNECTION.');
        } finally {
            setBrainLoading(false);
        }
    }, [triggerMood]);

    // Load brain when Brain tab is first opened
    useEffect(() => {
        if (activeTab === 'BRAIN' && brainNews.length === 0) {
            fetchBrain();
        }
    }, [activeTab, brainNews.length, fetchBrain]);

    // Auto-refresh brain every 5 minutes
    useEffect(() => {
        const iv = setInterval(() => {
            if (activeTab === 'BRAIN') fetchBrain(newsQuery);
        }, 5 * 60 * 1000);
        return () => clearInterval(iv);
    }, [activeTab, newsQuery, fetchBrain]);

    // ── Chat ───────────────────────────────────────────────────
    const sendChat = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        const q = chatInput.trim();
        mem.logChat('USER', q);
        mem.awardXP(mem.XP.CHAT, 'chat');
        setChatLog(prev => [...prev, { from: 'USER', text: q }]);
        setChatInput('');
        setIsTalking(true);

        setTimeout(() => {
            const matched = AI_PROMPTS.find(p => p.match.test(q));
            let reply;
            const { topTopic } = mem.getRecallContext();
            const recallPrefix = topTopic && mem.memory.chatCount > 5
                ? `[TOPIC CONTEXT: ${topTopic.toUpperCase()}] ` : '';
            if (matched) {
                reply = recallPrefix + matched.reply.replace('%NAME%', config.name);
            } else {
                // Fallback: search live brain first
                const newsMatch = brainNews.find(n =>
                    n.title.toUpperCase().includes(q.toUpperCase().slice(0, 20)) ||
                    n.category.includes(q.toUpperCase().slice(0, 8))
                );
                if (newsMatch) {
                    reply = `LIVE INTELLIGENCE: "${newsMatch.title}" — ${newsMatch.score} POINTS, ${newsMatch.comments} COMMENTS, ${newsMatch.age}m AGO. [${newsMatch.category}]`;
                } else {
                    // Archive fallback
                    const allItems = Object.values(archiveData).flat();
                    const archMatch = allItems.find(item =>
                        item.title.toUpperCase().includes(q.toUpperCase()) ||
                        item.desc.toUpperCase().includes(q.toUpperCase().slice(0, 15))
                    );
                    reply = archMatch
                        ? `ARCHIVE MATCH: ${archMatch.title} (${archMatch.era}) — ${archMatch.desc.slice(0, 100)}...`
                        : DEFAULT_REPLY(q, config.name);
                }
            }
            mem.logChat('BUDDY', reply);
            setChatLog(prev => [...prev, { from: 'BUDDY', text: reply }]);
            triggerMood(MOODS.FRIENDLY, 'RESPONSE TRANSMITTED.');
            speak(reply.slice(0, 90), MOODS.FRIENDLY.pitch);
        }, 700);
    };

    // ── Search ─────────────────────────────────────────────────
    const performSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        mem.logAction('ARCHIVE');
        mem.awardXP(mem.XP.ARCHIVE, 'archive search');
        const allItems = Object.values(archiveData).flat();
        const result = allItems.find(item =>
            item.title.toUpperCase().includes(searchQuery.toUpperCase()) ||
            item.era.toUpperCase().includes(searchQuery.toUpperCase()) ||
            item.desc.toUpperCase().includes(searchQuery.toUpperCase().slice(0, 12))
        );
        if (result) {
            setSearchResult(result);
            triggerMood(MOODS.HAPPY, 'INTELLIGENCE RETRIEVED!');
            speak(`Intelligence found on ${result.title}`, 1.5);
        } else {
            setSearchResult(null);
            triggerMood(MOODS.STUBBORN, 'NO DATA FOUND.');
            speak(`No uplink for ${searchQuery.slice(0, 20)}`, 0.5);
        }
    };

    const navigateTo = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            mem.awardXP(mem.XP.NAV, 'nav');
            mem.logAction('NAV');
            const s = SECTORS.find(x => x.id === id);
            triggerMood(MOODS.FRIENDLY, `NAVIGATING TO ${s?.label || id.toUpperCase()}`);
            speak(`Directing to ${s?.label || id}`, 1.2);
        }
    };

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatLog]);

    const filteredNews = brainFilter === 'ALL' ? brainNews : brainNews.filter(n => n.category === brainFilter);
    const minutesSinceFetch = brainFetchedAt ? Math.round((Date.now() - brainFetchedAt) / 60000) : null;

    const tabs = ['CHAT', 'BRAIN', 'NAV', 'SEARCH', 'MEMORY', 'CONFIG'];

    return (
        <>
            {/* ── LEVEL-UP FLASH ─────────────────────────── */}
            {showLevelUp && (
                <div className="levelup-flash" style={{ borderColor: mem.levelInfo.color, boxShadow: `0 0 60px ${mem.levelInfo.color}66` }}>
                    <div className="lu-icon" style={{ color: mem.levelInfo.color }}>★</div>
                    <div className="lu-title" style={{ color: mem.levelInfo.color }}>LEVEL {mem.levelInfo.level}</div>
                    <div className="lu-sub">{mem.levelInfo.title}</div>
                </div>
            )}
            {/* ── GHOST MODE ─────────────────────────────── */}
            {ghostMode && (
                <div
                    className="ghost-overlay"
                    style={{ left: ghostPos.x, top: ghostPos.y }}
                    aria-hidden="true"
                >
                    <BuddyBody moodColor={mood.color} isWalking={false} scale={4.5} />
                </div>
            )}

            {/* ── WALKING AVATAR ─────────────────────────── */}
            <div
                className={`cyber-buddy-wrap ${isDragging ? 'dragging' : ''}`}
                style={{
                    transform: `translate(${pos.x}px, ${pos.y}px) scaleX(${facingRight ? 1 : -1})`,
                    transition: isDragging ? 'none' : 'transform 0.05s linear',
                }}
                onMouseDown={onMouseDown}
                onClick={() => {
                    if (!isDragging) {
                        setIsOpen(o => !o);
                        mem.awardXP(mem.XP.CLICK, 'avatar click');
                    }
                }}
            >
                <div style={{ transform: `scaleX(${facingRight ? 1 : -1})` }}>
                    {/* Speech bubble */}
                    <div className="buddy-bubble" style={{ borderColor: mood.color, color: mood.color, boxShadow: `0 0 12px ${mood.color}33` }}>
                        <span className="bubble-dot" style={{ background: mood.color }} />
                        {message}
                    </div>
                </div>

                <BuddyBody moodColor={mood.color} isGlitching={isGlitching} isTalking={isTalking} isWalking={isWalking} level={mem.levelInfo.level} />

                <div style={{ transform: `scaleX(${facingRight ? 1 : -1})` }}>
                    <div className="mood-ring" style={{ borderColor: mood.color, color: mood.color }}>
                        {mood.label}
                    </div>
                </div>
            </div>

            {/* ── PANEL ─────────────────────────────────── */}
            {isOpen && (
                <div className="buddy-panel glass" style={{ borderColor: mood.color, boxShadow: `0 0 60px ${mood.color}22` }}>
                    {/* Header */}
                    <div className="panel-hdr" style={{ borderBottomColor: mood.color }}>
                        <div className="hdr-avatar">
                            <BuddyBody moodColor={mood.color} isTalking={isTalking} scale={0.45} level={mem.levelInfo.level} />
                        </div>
                        <div className="hdr-info">
                            <div className="hdr-name neon-text-blue">{config.name}</div>
                            <div className="hdr-sub">LVL {mem.levelInfo.level} · {mem.levelInfo.title} · {mem.memory.xp} XP</div>
                            <div className="hdr-mood" style={{ color: mood.color }}>
                                <span className="live-dot" style={{ background: mood.color }} />
                                {mood.label} MODE
                            </div>
                        </div>
                        <button className="panel-x" onClick={() => setIsOpen(false)}>✕</button>
                    </div>

                    {/* Tabs */}
                    <div className="panel-tabs">
                        {tabs.map(t => (
                            <button key={t} className={`tab-btn ${activeTab === t ? 'active' : ''}`}
                                style={activeTab === t ? { borderBottomColor: mood.color, color: mood.color } : {}}
                                onClick={() => setActiveTab(t)}>
                                {t === 'BRAIN' && <span className="brain-dot" />}
                                {t}
                            </button>
                        ))}
                    </div>

                    {/* ── CHAT ──────────────────────────────── */}
                    {activeTab === 'CHAT' && (
                        <div className="tab-body">
                            <div className="chat-log">
                                {chatLog.map((m, i) => (
                                    <div key={i} className={`chat-msg ${m.from === 'USER' ? 'u' : 'b'}`}>
                                        <span className="cf">{m.from === 'USER' ? 'YOU' : config.name}</span>
                                        <span className="ct">{m.text}</span>
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>
                            <form onSubmit={sendChat} className="chat-row">
                                <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="ASK ME ANYTHING..." className="chat-in" />
                                <button type="submit" className="chat-go" style={{ background: mood.color }}>⏎</button>
                            </form>
                        </div>
                    )}

                    {/* ── BRAIN (LIVE NEWS) ─────────────────── */}
                    {activeTab === 'BRAIN' && (
                        <div className="tab-body">
                            <div className="brain-header">
                                <div className="brain-status">
                                    <span className="live-dot" style={{ background: '#ff00ea' }} />
                                    <span style={{ color: '#ff00ea', fontSize: '0.55rem', letterSpacing: '2px', fontWeight: 700 }}>LIVE HACKER NEWS FEED</span>
                                    {minutesSinceFetch !== null && (
                                        <span style={{ color: '#444', fontSize: '0.5rem', marginLeft: 'auto' }}>UPDATED {minutesSinceFetch}m AGO</span>
                                    )}
                                </div>
                                <form onSubmit={(e) => { e.preventDefault(); fetchBrain(newsQuery); }} className="news-search-row">
                                    <input
                                        value={newsQuery}
                                        onChange={e => setNewsQuery(e.target.value)}
                                        placeholder="FILTER NEWS: AI, QUANTUM, SPACE..."
                                        className="news-search-in"
                                    />
                                    <button type="submit" className="news-go" style={{ background: mood.color }}>↻</button>
                                </form>
                                {/* Category filter pills */}
                                <div className="brain-cats">
                                    {['ALL', 'AI', 'QUANTUM', 'SPACE', 'SECURITY', 'BIOTECH', 'ENERGY', 'WEB3', 'TECH'].map(cat => (
                                        <button key={cat} className={`cat-pill ${brainFilter === cat ? 'active' : ''}`}
                                            style={brainFilter === cat ? { borderColor: CAT_COLORS[cat] || '#fff', color: CAT_COLORS[cat] || '#fff', background: `${CAT_COLORS[cat] || '#fff'}12` } : {}}
                                            onClick={() => setBrainFilter(cat)}>
                                            {CAT_ICONS[cat] || ''} {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {brainLoading ? (
                                <div className="brain-loading">
                                    <div className="loading-line" style={{ background: mood.color }} />
                                    <span>CONNECTING TO GLOBAL INTELLIGENCE FEED...</span>
                                </div>
                            ) : (
                                <div className="news-list">
                                    {filteredNews.length === 0 ? (
                                        <div className="no-news">NO STORIES IN THIS CATEGORY. TRY ANOTHER FILTER.</div>
                                    ) : filteredNews.map((story, i) => (
                                        <a key={story.id} className="news-item" href={story.url} target="_blank" rel="noopener noreferrer"
                                            style={{ '--cat-color': CAT_COLORS[story.category] || '#aaa' }}>
                                            <div className="news-item-top">
                                                <span className="news-cat" style={{ color: CAT_COLORS[story.category] || '#aaa', borderColor: `${CAT_COLORS[story.category] || '#aaa'}44` }}>
                                                    {CAT_ICONS[story.category]} {story.category}
                                                </span>
                                                <span className="news-meta">{story.score}▲ · {story.comments}💬 · {story.age}m</span>
                                            </div>
                                            <div className="news-title">{story.title}</div>
                                            <div className="news-by">by {story.by}</div>
                                        </a>
                                    ))}
                                </div>
                            )}

                            <button className="refresh-btn" style={{ borderColor: mood.color, color: mood.color }} onClick={() => fetchBrain(newsQuery)} disabled={brainLoading}>
                                ↻ REFRESH INTELLIGENCE FEED
                            </button>
                        </div>
                    )}

                    {/* ── NAV ───────────────────────────────── */}
                    {activeTab === 'NAV' && (
                        <div className="tab-body">
                            <div className="sec-label">SECTOR NAVIGATION MAP</div>
                            <div className="nav-grid">
                                {SECTORS.map(s => (
                                    <button key={s.id} className="nav-btn" style={{ borderColor: `${s.color}44`, color: s.color }}
                                        onClick={() => { navigateTo(s.id); setIsOpen(false); }}>
                                        <span className="nav-dot" style={{ background: s.color }} />
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                            <div className="nav-hint">CLICK TO JUMP · SECTOR NAVIGATOR IS ON THE LEFT EDGE</div>
                            <button className="roam-btn" onClick={() => {
                                setIsOpen(false);
                                const nx = clamp(Math.random() * window.innerWidth, 100, window.innerWidth - 150);
                                const ny = clamp(Math.random() * window.innerHeight, 100, window.innerHeight - 200);
                                roamTo(nx, ny);
                            }} style={{ borderColor: mood.color, color: mood.color }}>
                                ⚡ SEND BUDDY ON A PATROL RUN
                            </button>
                        </div>
                    )}

                    {/* ── SEARCH ────────────────────────────── */}
                    {activeTab === 'SEARCH' && (
                        <div className="tab-body">
                            <div className="sec-label">ARCHIVE INTELLIGENCE SEARCH</div>
                            <form onSubmit={performSearch} className="srch-form">
                                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="SEARCH: TURING, CRISPR, UNIX..." className="srch-in" />
                                <button type="submit" className="srch-go" style={{ background: mood.color }}>SCAN</button>
                            </form>
                            {searchResult && (
                                <div className="srch-card" style={{ borderColor: searchResult.color }}>
                                    <div className="srch-era" style={{ color: searchResult.color }}>{searchResult.era}</div>
                                    <div className="srch-title">{searchResult.title}</div>
                                    <div className="srch-id">ENTRY: {searchResult.id}</div>
                                    <p className="srch-desc">{searchResult.desc}</p>
                                    <div className="srch-src">SOURCE: {searchResult.source}</div>
                                </div>
                            )}
                            {!searchResult && searchQuery && (
                                <div className="no-result">NO ARCHIVE MATCH. RECALIBRATE YOUR QUERY.</div>
                            )}
                        </div>
                    )}

                    {/* ── MEMORY ────────────────────────────── */}
                    {activeTab === 'MEMORY' && (() => {
                        const { levelInfo, nextLevel, xpProgress, memory, LEVELS: lvls, TRAITS: allTraits, wipeMemory } = mem;
                        return (
                            <div className="tab-body">
                                {/* XP Bar */}
                                <div className="mem-xp-section">
                                    <div className="mem-xp-header">
                                        <span className="mem-lvl-badge" style={{ background: levelInfo.color, color: '#000' }}>
                                            LVL {levelInfo.level}
                                        </span>
                                        <span className="mem-lvl-title" style={{ color: levelInfo.color }}>{levelInfo.title}</span>
                                        <span className="mem-xp-num">{memory.xp} XP</span>
                                    </div>
                                    <div className="mem-xp-bar-bg">
                                        <div className="mem-xp-bar-fill" style={{ width: `${xpProgress}%`, background: levelInfo.color }} />
                                    </div>
                                    {nextLevel && (
                                        <div className="mem-xp-next">{nextLevel.xpNeeded - memory.xp} XP TO LEVEL {nextLevel.level} · {nextLevel.title}</div>
                                    )}
                                </div>

                                {/* Stats row */}
                                <div className="mem-stats-row">
                                    <div className="mem-stat"><span>{memory.sessionCount}</span>SESSIONS</div>
                                    <div className="mem-stat"><span>{memory.chatCount}</span>CHATS</div>
                                    <div className="mem-stat"><span>{memory.navCount}</span>NAVS</div>
                                    <div className="mem-stat"><span>{memory.brainCount}</span>BRAIN</div>
                                </div>

                                {/* Trait grid */}
                                <div className="sec-label">ACQUIRED TRAITS</div>
                                <div className="mem-trait-grid">
                                    {Object.values(allTraits).map(t => {
                                        const unlocked = memory.unlockedTraits.includes(t.id);
                                        return (
                                            <div key={t.id} className={`mem-trait ${unlocked ? 'trait-on' : 'trait-off'}`}
                                                style={unlocked ? { borderColor: `${t.color}66`, background: `${t.color}0d` } : {}}>
                                                <div className="trait-icon" style={unlocked ? { color: t.color } : {}}>{unlocked ? t.icon : '?'}</div>
                                                <div className="trait-lbl" style={unlocked ? { color: t.color } : {}}>{unlocked ? t.label : '???'}</div>
                                                {unlocked && <div className="trait-desc">{t.desc}</div>}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Recent chat log */}
                                {memory.chatHistory.length > 0 && (
                                    <>
                                        <div className="sec-label">RECENT MEMORY LOG</div>
                                        <div className="mem-log">
                                            {memory.chatHistory.slice(-8).reverse().map((m, i) => (
                                                <div key={i} className={`mem-log-entry ${m.from === 'USER' ? 'mem-u' : 'mem-b'}`}>
                                                    <span className="mem-from">{m.from}</span>
                                                    <span className="mem-text">{m.text.slice(0, 80)}{m.text.length > 80 ? '…' : ''}</span>
                                                    {m.topic && <span className="mem-topic">[{m.topic}]</span>}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* Wipe button */}
                                <button className="mem-wipe" onClick={() => { if (confirm('WIPE ALL MEMORY? THIS CANNOT BE UNDONE.')) wipeMemory(); }}>
                                    ⚠ WIPE MEMORY
                                </button>
                            </div>
                        );
                    })()}

                    {/* ── CONFIG ────────────────────────────── */}
                    {activeTab === 'CONFIG' && (
                        <div className="tab-body">
                            <div className="sec-label">BUDDY CONFIGURATION</div>
                            <div className="cfg-field">
                                <label>AI CODENAME</label>
                                <input className="cfg-in" value={config.name}
                                    onChange={e => setConfig(c => ({ ...c, name: e.target.value.toUpperCase() }))} />
                            </div>
                            <div className="cfg-field">
                                <label>STUBBORNNESS INDEX [{config.stubbornness}%]</label>
                                <input type="range" min="0" max="100" value={config.stubbornness}
                                    onChange={e => setConfig(c => ({ ...c, stubbornness: +e.target.value }))} className="cfg-range" />
                            </div>
                            <div className="cfg-field">
                                <label>MOOD OVERRIDE</label>
                                <div className="mood-grid">
                                    {Object.entries(MOODS).map(([k, m]) => (
                                        <button key={k} className="mood-btn" style={{ borderColor: m.color, color: m.color }}
                                            onClick={() => triggerMood(m, m.text)}>{k}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="cfg-field">
                                <label>GHOST MODE</label>
                                <button className="ghost-toggle" style={{ borderColor: ghostMode ? '#ff00ea' : '#333', color: ghostMode ? '#ff00ea' : '#555' }}
                                    onClick={() => {
                                        if (!ghostMode) {
                                            setGhostMode(true);
                                            setGhostPos({ x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 300 });
                                        } else {
                                            setGhostMode(false);
                                        }
                                    }}>
                                    {ghostMode ? '👻 GHOST ACTIVE — CLICK TO DISMISS' : '👻 ACTIVATE GHOST MODE'}
                                </button>
                            </div>
                            <div className="debug-row">
                                <button className="dbg-btn" style={{ borderColor: '#ff0055', color: '#ff0055' }}
                                    onClick={() => { glitch(); speak('Critical stubbornness error.', 0.2); }}>⚡ GLITCH</button>
                                <button className="dbg-btn" onClick={() => speak(`Hear me, citizen. I am ${config.name}.`, 1.5)}>🔊 SPEAK</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <style jsx>{`
                /* ── GHOST ────────────────────────── */
                .ghost-overlay {
                    position: fixed;
                    z-index: 0;
                    pointer-events: none;
                    opacity: 0;
                    animation: ghost-appear 0.8s ease forwards, ghost-disappear 1s 5s ease forwards;
                    filter: blur(1px) saturate(0.7);
                }
                @keyframes ghost-appear  { from { opacity: 0; transform: scale(0.8); } to { opacity: 0.07; transform: scale(1); } }
                @keyframes ghost-disappear { from { opacity: 0.07; } to { opacity: 0; } }

                /* ── AVATAR WRAPPER ───────────────── */
                .cyber-buddy-wrap {
                    position: fixed;
                    top: 0; left: 0;
                    z-index: 10000;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    user-select: none;
                    will-change: transform;
                }
                .cyber-buddy-wrap.dragging { cursor: grabbing; }

                .buddy-bubble {
                    background: rgba(0,0,0,0.9);
                    padding: 5px 11px;
                    font-size: 0.52rem;
                    font-weight: 700;
                    max-width: 190px;
                    text-align: center;
                    border-radius: 20px;
                    border: 1px solid;
                    pointer-events: none;
                    letter-spacing: 0.8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .bubble-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; animation: pulse-dot 1.2s ease-in-out infinite; }
                .mood-ring {
                    font-size: 0.42rem; letter-spacing: 3px; border: 1px solid;
                    padding: 2px 8px; border-radius: 20px; font-weight: 900;
                    opacity: 0.6; pointer-events: none;
                }

                /* ── PANEL ────────────────────────── */
                .buddy-panel {
                    position: fixed;
                    bottom: 20px; right: 20px;
                    width: 400px;
                    max-height: 640px;
                    z-index: 10001;
                    border: 1px solid;
                    border-radius: 20px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    background: rgba(4,4,4,0.97);
                    backdrop-filter: blur(24px);
                    animation: panel-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                @keyframes panel-in { from { opacity: 0; transform: translateY(16px) scale(0.96); } to { opacity: 1; transform: none; } }

                .panel-hdr {
                    display: flex; align-items: center; gap: 12px;
                    padding: 14px 18px; border-bottom: 1px solid;
                }
                .hdr-avatar { transform: scale(0.44); transform-origin: left center; width: 40px; height: 64px; overflow: visible; flex-shrink: 0; }
                .hdr-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
                .hdr-name { font-size: 0.9rem; font-weight: 900; letter-spacing: 3px; }
                .hdr-sub { font-size: 0.45rem; color: #444; letter-spacing: 1.5px; }
                .hdr-mood { font-size: 0.48rem; letter-spacing: 2px; font-weight: 700; display: flex; align-items: center; gap: 5px; }
                .panel-x { background: transparent; border: none; color: #555; cursor: pointer; font-size: 1.1rem; transition: color 0.2s; }
                .panel-x:hover { color: #fff; }

                .panel-tabs { display: flex; border-bottom: 1px solid rgba(255,255,255,0.05); }
                .tab-btn {
                    flex: 1; background: transparent; border: none; border-bottom: 2px solid transparent;
                    color: #444; padding: 9px 2px; font-size: 0.5rem; letter-spacing: 1.5px;
                    cursor: pointer; transition: all 0.2s; font-weight: 700;
                    display: flex; align-items: center; justify-content: center; gap: 4px;
                }
                .tab-btn:hover { color: #aaa; }
                .brain-dot { width: 5px; height: 5px; border-radius: 50%; background: #ff00ea; animation: pulse-dot 1s infinite; }

                .tab-body {
                    flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 10px; max-height: 490px;
                }

                /* ── CHAT ─────────────────────────── */
                .chat-log { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; max-height: 340px; }
                .chat-msg { display: flex; flex-direction: column; gap: 3px; max-width: 88%; }
                .b { align-self: flex-start; }
                .u { align-self: flex-end; text-align: right; }
                .cf { font-size: 0.42rem; color: #444; letter-spacing: 2px; font-weight: 700; }
                .ct {
                    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
                    padding: 8px 12px; border-radius: 10px; font-size: 0.7rem; color: #ddd; line-height: 1.5;
                }
                .u .ct { background: rgba(0,242,255,0.06); border-color: rgba(0,242,255,0.2); }
                .chat-row { display: flex; gap: 8px; }
                .chat-in {
                    flex: 1; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
                    color: #fff; padding: 9px 12px; border-radius: 8px; outline: none; font-family: 'Courier New', monospace; font-size: 0.75rem;
                }
                .chat-in:focus { border-color: var(--neon-blue); }
                .chat-go { padding: 9px 14px; border: none; border-radius: 8px; color: #000; font-weight: 900; cursor: pointer; font-size: 1rem; }

                /* ── BRAIN ────────────────────────── */
                .brain-header { display: flex; flex-direction: column; gap: 8px; }
                .brain-status { display: flex; align-items: center; gap: 8px; }
                .news-search-row { display: flex; gap: 8px; }
                .news-search-in {
                    flex: 1; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
                    color: #fff; padding: 8px; border-radius: 6px; outline: none; font-family: 'Courier New', monospace;
                    font-size: 0.7rem;
                }
                .news-go { padding: 8px 14px; border: none; border-radius: 6px; color: #000; font-weight: 900; cursor: pointer; font-size: 1rem; }
                .brain-cats { display: flex; flex-wrap: wrap; gap: 5px; }
                .cat-pill {
                    background: transparent; border: 1px solid #222; color: #444;
                    padding: 3px 10px; border-radius: 20px; font-size: 0.52rem; letter-spacing: 1px;
                    cursor: pointer; transition: all 0.2s;
                }
                .brain-loading {
                    display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 30px;
                    color: #555; font-size: 0.65rem; letter-spacing: 2px;
                }
                .loading-line {
                    width: 80%; height: 2px; border-radius: 1px;
                    animation: loading-slide 1.2s ease-in-out infinite;
                    background-size: 200% 100%;
                }
                @keyframes loading-slide { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
                .news-list { display: flex; flex-direction: column; gap: 6px; flex: 1; overflow-y: auto; }
                .news-item {
                    display: flex; flex-direction: column; gap: 4px;
                    padding: 10px 12px; border-radius: 8px;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-left: 2px solid var(--cat-color);
                    text-decoration: none; color: inherit;
                    transition: all 0.2s ease;
                }
                .news-item:hover { background: rgba(255,255,255,0.05); transform: translateX(3px); }
                .news-item-top { display: flex; justify-content: space-between; align-items: center; }
                .news-cat {
                    font-size: 0.48rem; letter-spacing: 1.5px; font-weight: 900;
                    border: 1px solid; padding: 2px 7px; border-radius: 20px;
                }
                .news-meta { font-size: 0.48rem; color: #444; letter-spacing: 1px; font-family: monospace; }
                .news-title { font-size: 0.72rem; color: #ddd; line-height: 1.4; font-weight: 600; }
                .news-by { font-size: 0.5rem; color: #444; font-family: monospace; }
                .no-news { color: #333; font-size: 0.65rem; letter-spacing: 2px; text-align: center; padding: 20px; }
                .refresh-btn {
                    background: transparent; border: 1px solid; padding: 9px; border-radius: 6px;
                    font-size: 0.6rem; letter-spacing: 2px; cursor: pointer; transition: all 0.2s; font-weight: 700;
                    flex-shrink: 0;
                }
                .refresh-btn:disabled { opacity: 0.4; cursor: wait; }
                .refresh-btn:hover:not(:disabled) { opacity: 0.7; }

                /* ── NAV ──────────────────────────── */
                .sec-label { font-size: 0.48rem; color: #444; letter-spacing: 3px; }
                .nav-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
                .nav-btn {
                    background: rgba(255,255,255,0.02); border: 1px solid; padding: 10px;
                    border-radius: 8px; font-size: 0.58rem; letter-spacing: 1px;
                    cursor: pointer; transition: all 0.2s; font-weight: 700;
                    display: flex; align-items: center; gap: 6px;
                }
                .nav-btn:hover { transform: scale(1.04); filter: brightness(1.4); }
                .nav-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
                .nav-hint { font-size: 0.42rem; color: #333; letter-spacing: 2px; text-align: center; }
                .roam-btn {
                    background: transparent; border: 1px solid; padding: 10px;
                    border-radius: 8px; font-size: 0.62rem; letter-spacing: 2px; cursor: pointer;
                    transition: all 0.2s; font-weight: 900;
                }
                .roam-btn:hover { opacity: 0.7; }

                /* ── SEARCH ───────────────────────── */
                .srch-form { display: flex; gap: 8px; }
                .srch-in {
                    flex: 1; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
                    color: #fff; padding: 9px; border-radius: 6px; font-family: 'Courier New', monospace; font-size: 0.72rem; outline: none;
                }
                .srch-go { padding: 9px 16px; border: none; border-radius: 6px; color: #000; font-weight: 900; font-size: 0.65rem; letter-spacing: 1px; cursor: pointer; }
                .srch-card { border: 1px solid; border-radius: 8px; padding: 14px; display: flex; flex-direction: column; gap: 6px; background: rgba(255,255,255,0.02); }
                .srch-era { font-size: 0.52rem; font-weight: 900; letter-spacing: 2px; }
                .srch-title { font-size: 0.9rem; font-weight: 900; color: #fff; letter-spacing: 2px; }
                .srch-id { font-size: 0.5rem; color: #444; font-family: monospace; }
                .srch-desc { font-size: 0.72rem; color: #aaa; line-height: 1.5; }
                .srch-src { font-size: 0.5rem; color: #333; font-family: monospace; }
                .no-result { font-size: 0.62rem; color: #ff0055; letter-spacing: 2px; text-align: center; padding: 20px; }

                /* ── CONFIG ───────────────────────── */
                .cfg-field { display: flex; flex-direction: column; gap: 6px; }
                .cfg-field label { font-size: 0.48rem; color: #444; letter-spacing: 2px; }
                .cfg-in {
                    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
                    color: #fff; padding: 8px; border-radius: 4px; font-family: monospace; font-size: 0.8rem; outline: none;
                }
                .cfg-range { width: 100%; accent-color: var(--neon-blue); }
                .mood-grid { display: flex; flex-wrap: wrap; gap: 6px; }
                .mood-btn {
                    background: transparent; border: 1px solid; padding: 4px 10px; border-radius: 20px;
                    font-size: 0.52rem; letter-spacing: 1px; cursor: pointer; transition: all 0.2s;
                }
                .ghost-toggle {
                    background: transparent; border: 1px solid; padding: 8px 14px; border-radius: 8px;
                    font-size: 0.62rem; letter-spacing: 1.5px; cursor: pointer; transition: all 0.2s; font-weight: 700;
                }
                .debug-row { display: flex; gap: 8px; }
                .dbg-btn {
                    flex: 1; background: transparent; border: 1px solid var(--neon-blue);
                    color: var(--neon-blue); padding: 9px; border-radius: 6px; font-size: 0.62rem;
                    letter-spacing: 1px; cursor: pointer; transition: all 0.2s; font-weight: 700;
                }
                .dbg-btn:hover { background: rgba(255,255,255,0.04); }

                /* ── MEMORY TAB ──────────────────────── */
                .mem-xp-section { display: flex; flex-direction: column; gap: 6px; }
                .mem-xp-header { display: flex; align-items: center; gap: 8px; }
                .mem-lvl-badge { font-size: 0.42rem; font-weight: 900; letter-spacing: 2px; padding: 3px 9px; border-radius: 20px; }
                .mem-lvl-title { font-size: 0.65rem; font-weight: 900; letter-spacing: 2px; flex: 1; }
                .mem-xp-num { font-size: 0.5rem; color: #555; font-family: monospace; letter-spacing: 1px; }
                .mem-xp-bar-bg { width: 100%; height: 4px; background: rgba(255,255,255,0.06); border-radius: 4px; overflow: hidden; }
                .mem-xp-bar-fill { height: 100%; border-radius: 4px; transition: width 0.5s ease; }
                .mem-xp-next { font-size: 0.45rem; color: #444; letter-spacing: 1.5px; }

                .mem-stats-row { display: flex; gap: 6px; }
                .mem-stat {
                    flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px;
                    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 8px; padding: 8px 4px; font-size: 0.42rem; color: #444; letter-spacing: 1px;
                }
                .mem-stat span { font-size: 1rem; font-weight: 900; color: #aaa; font-family: monospace; }

                .mem-trait-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
                .mem-trait {
                    border: 1px solid #1a1a1a; border-radius: 8px;
                    padding: 8px 4px; display: flex; flex-direction: column; align-items: center; gap: 2px;
                    transition: all 0.2s;
                }
                .trait-on:hover { transform: scale(1.04); }
                .trait-off { opacity: 0.3; filter: grayscale(1); }
                .trait-icon { font-size: 1.1rem; }
                .trait-lbl { font-size: 0.38rem; font-weight: 900; letter-spacing: 1px; text-align: center; }
                .trait-desc { font-size: 0.34rem; color: #555; text-align: center; line-height: 1.3; }

                .mem-log { display: flex; flex-direction: column; gap: 4px; max-height: 130px; overflow-y: auto; }
                .mem-log-entry { display: flex; flex-direction: column; gap: 1px; padding: 5px 8px; border-radius: 6px; background: rgba(255,255,255,0.02); }
                .mem-u { border-left: 2px solid rgba(0,242,255,0.3); }
                .mem-b { border-left: 2px solid rgba(255,255,255,0.1); }
                .mem-from { font-size: 0.38rem; color: #444; letter-spacing: 2px; font-weight: 700; }
                .mem-text { font-size: 0.62rem; color: #bbb; line-height: 1.4; }
                .mem-topic { font-size: 0.36rem; color: #333; font-family: monospace; align-self: flex-end; }

                .mem-wipe {
                    background: transparent; border: 1px solid rgba(255,0,85,0.4); color: #ff0055;
                    padding: 8px; border-radius: 6px; font-size: 0.52rem; letter-spacing: 2px;
                    cursor: pointer; transition: all 0.2s; font-weight: 700;
                }
                .mem-wipe:hover { background: rgba(255,0,85,0.08); }

                /* ── LEVEL-UP FLASH ──────────────────── */
                .levelup-flash {
                    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    z-index: 20001; background: rgba(4,4,4,0.97);
                    border: 2px solid; border-radius: 24px; padding: 30px 50px;
                    display: flex; flex-direction: column; align-items: center; gap: 8px;
                    animation: lu-pop 0.5s cubic-bezier(0.175,0.885,0.32,1.275);
                    backdrop-filter: blur(30px);
                }
                @keyframes lu-pop { from { opacity: 0; transform: translate(-50%, -50%) scale(0.7); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
                .lu-icon { font-size: 2.2rem; animation: lu-spin 0.8s ease; }
                @keyframes lu-spin { from { transform: rotate(-20deg) scale(0.5); } to { transform: rotate(0deg) scale(1); } }
                .lu-title { font-size: 1.8rem; font-weight: 900; letter-spacing: 6px; }
                .lu-sub { font-size: 0.6rem; color: #666; letter-spacing: 4px; font-weight: 700; }

                @media (max-width: 600px) {
                    .buddy-panel { width: calc(100vw - 20px); right: 10px; bottom: 10px; }
                }
            `}</style>
        </>
    );
}
