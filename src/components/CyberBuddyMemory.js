'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

// ── Level Definitions ─────────────────────────────────────────────
export const LEVELS = [
    { level: 1, title: 'PROTOTYPE', xpNeeded: 0, color: '#336677', glow: '#00f2ff33' },
    { level: 2, title: 'NOVICE', xpNeeded: 100, color: '#00b8cc', glow: '#00f2ff44' },
    { level: 3, title: 'SCOUT', xpNeeded: 250, color: '#00f2ff', glow: '#00f2ff66' },
    { level: 4, title: 'ANALYST', xpNeeded: 500, color: '#00f2ff', glow: '#00f2ffaa' },
    { level: 5, title: 'SPECIALIST', xpNeeded: 900, color: '#7b61ff', glow: '#7b61ff88' },
    { level: 6, title: 'AGENT', xpNeeded: 1400, color: '#ffcc00', glow: '#ffcc0066' },
    { level: 7, title: 'SENTINEL', xpNeeded: 2100, color: '#ffcc00', glow: '#ffcc00aa' },
    { level: 8, title: 'GUARDIAN', xpNeeded: 3000, color: '#ff6600', glow: '#ff660088' },
    { level: 9, title: 'ORACLE', xpNeeded: 4200, color: '#bc13fe', glow: '#bc13fe88' },
    { level: 10, title: 'TRANSCENDENT', xpNeeded: 6000, color: '#ffffff', glow: '#ffffff66' },
];

// ── Trait Definitions ─────────────────────────────────────────────
export const TRAITS = {
    CURIOUS: { id: 'CURIOUS', label: 'CURIOUS', desc: 'Asked 10+ questions', icon: '❓', color: '#bc13fe' },
    NEWS_JUNKIE: { id: 'NEWS_JUNKIE', label: 'NEWS JUNKIE', desc: 'Opened Brain tab 5+ times', icon: '📡', color: '#ff00ea' },
    NAVIGATOR: { id: 'NAVIGATOR', label: 'NAVIGATOR', desc: 'Navigated 10+ sector jumps', icon: '🧭', color: '#00f2ff' },
    ARCHIVIST: { id: 'ARCHIVIST', label: 'ARCHIVIST', desc: 'Searched archives 5+ times', icon: '🗄️', color: '#ff9d00' },
    PHILOSOPHER: { id: 'PHILOSOPHER', label: 'PHILOSOPHER', desc: 'Discussed deep topics 15+ times', icon: '⚛️', color: '#7b61ff' },
    LOYAL: { id: 'LOYAL', label: 'LOYAL', desc: 'Returned for 10+ sessions', icon: '⭐', color: '#ffcc00' },
    VETERAN: { id: 'VETERAN', label: 'VETERAN', desc: 'Reached Level 5', icon: '🎖️', color: '#00ff66' },
    GHOST_WHISPERER: { id: 'GHOST_WHISPERER', label: 'GHOST WHISPERER', desc: 'Activated Ghost Mode', icon: '👻', color: '#ff00ea' },
};

// ── XP Award amounts ──────────────────────────────────────────────
export const XP = {
    CHAT: 5,
    ARCHIVE: 8,
    BRAIN_OPEN: 10,
    NEWS_READ: 3,
    NAV: 6,
    DRAG: 2,
    CLICK: 1,
    ACHIEVEMENT: 15,
};

// ── Topic detection ───────────────────────────────────────────────
const TOPIC_PATTERNS = [
    { topic: 'ai', regex: /ai|neural|llm|gpt|machine learning|model/i },
    { topic: 'space', regex: /space|mars|orbit|satellite|nasa|rocket/i },
    { topic: 'quantum', regex: /quantum|entangle|superposition/i },
    { topic: 'energy', regex: /energy|solar|fusion|battery|power/i },
    { topic: 'biotech', regex: /crispr|gene|dna|bio|biology/i },
    { topic: 'security', regex: /hack|security|breach|exploit|cyber/i },
    { topic: 'web3', regex: /web3|crypto|blockchain|nft/i },
    { topic: 'general', regex: /./ },
];

function detectTopic(text) {
    for (const p of TOPIC_PATTERNS) {
        if (p.regex.test(text)) return p.topic;
    }
    return 'general';
}

function getLevelFromXP(xp) {
    let lvl = LEVELS[0];
    for (const l of LEVELS) {
        if (xp >= l.xpNeeded) lvl = l;
    }
    return lvl;
}

function getNextLevel(currentLevel) {
    const idx = LEVELS.findIndex(l => l.level === currentLevel);
    return LEVELS[idx + 1] || null;
}

// ── Memory Store defaults ─────────────────────────────────────────
const DEFAULT_MEMORY = {
    xp: 0,
    sessionCount: 1,
    totalActions: 0,
    chatCount: 0,
    navCount: 0,
    brainCount: 0,
    archiveCount: 0,
    questionCount: 0,
    topicCounts: {},
    unlockedTraits: [],
    chatHistory: [],  // [{ from, text, ts, topic }]
    lastSeen: null,
};

const STORAGE_KEY = 'gtech_buddy_memory_v1';

function loadMemory() {
    if (typeof window === 'undefined') return DEFAULT_MEMORY;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return DEFAULT_MEMORY;
        return { ...DEFAULT_MEMORY, ...JSON.parse(raw) };
    } catch { return DEFAULT_MEMORY; }
}

function saveMemory(mem) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(mem)); } catch { }
}

// ── Hook ──────────────────────────────────────────────────────────
export function useBuddyMemory() {
    const [memory, setMemory] = useState(DEFAULT_MEMORY);
    const [leveledUp, setLeveledUp] = useState(null); // { from, to } when leveling up
    const [newTrait, setNewTrait] = useState(null);  // trait id when new trait unlocked

    // Hydrate from localStorage after mount
    useEffect(() => {
        const mem = loadMemory();
        // Increment session count on each load
        const updated = {
            ...mem,
            sessionCount: (mem.sessionCount || 0) + 1,
            lastSeen: Date.now(),
        };
        setMemory(updated);
        saveMemory(updated);
    }, []);

    // ── Check and award traits ─────────────────────────────────────
    const checkTraits = useCallback((mem) => {
        const toUnlock = [];
        const has = (id) => mem.unlockedTraits.includes(id);

        if (!has('CURIOUS') && mem.questionCount >= 10) toUnlock.push('CURIOUS');
        if (!has('NEWS_JUNKIE') && mem.brainCount >= 5) toUnlock.push('NEWS_JUNKIE');
        if (!has('NAVIGATOR') && mem.navCount >= 10) toUnlock.push('NAVIGATOR');
        if (!has('ARCHIVIST') && mem.archiveCount >= 5) toUnlock.push('ARCHIVIST');
        if (!has('PHILOSOPHER') && Object.values(mem.topicCounts).reduce((a, b) => a + b, 0) >= 15) toUnlock.push('PHILOSOPHER');
        if (!has('LOYAL') && mem.sessionCount >= 10) toUnlock.push('LOYAL');
        if (!has('VETERAN') && getLevelFromXP(mem.xp).level >= 5) toUnlock.push('VETERAN');

        if (toUnlock.length === 0) return mem;

        const next = { ...mem, unlockedTraits: [...mem.unlockedTraits, ...toUnlock] };
        setNewTrait(toUnlock[0]); // announce first new trait
        return next;
    }, []);

    // ── Main XP award function ─────────────────────────────────────
    const awardXP = useCallback((amount, reason = '') => {
        setMemory(prev => {
            const oldLevel = getLevelFromXP(prev.xp).level;
            const newXP = prev.xp + amount;
            const newLevel = getLevelFromXP(newXP).level;
            let next = { ...prev, xp: newXP, totalActions: prev.totalActions + 1 };

            if (newLevel > oldLevel) {
                setLeveledUp({ from: oldLevel, to: newLevel });
            }

            next = checkTraits(next);
            saveMemory(next);
            return next;
        });
    }, [checkTraits]);

    // ── Log a chat message ─────────────────────────────────────────
    const logChat = useCallback((from, text) => {
        const topic = detectTopic(text);
        const isQuestion = text.includes('?');
        setMemory(prev => {
            const topicCounts = { ...prev.topicCounts, [topic]: (prev.topicCounts[topic] || 0) + 1 };
            const history = [...prev.chatHistory, { from, text: text.slice(0, 200), ts: Date.now(), topic }].slice(-50);
            let next = {
                ...prev,
                chatCount: prev.chatCount + (from === 'USER' ? 1 : 0),
                questionCount: prev.questionCount + (isQuestion && from === 'USER' ? 1 : 0),
                topicCounts,
                chatHistory: history,
            };
            next = checkTraits(next);
            saveMemory(next);
            return next;
        });
    }, [checkTraits]);

    // ── Log non-chat actions ───────────────────────────────────────
    const logAction = useCallback((type) => {
        setMemory(prev => {
            let updates = {};
            if (type === 'BRAIN') updates = { brainCount: prev.brainCount + 1 };
            if (type === 'NAV') updates = { navCount: prev.navCount + 1 };
            if (type === 'ARCHIVE') updates = { archiveCount: prev.archiveCount + 1 };
            if (type === 'GHOST') updates = {};
            let next = { ...prev, ...updates, totalActions: prev.totalActions + 1 };
            if (type === 'GHOST' && !prev.unlockedTraits.includes('GHOST_WHISPERER')) {
                next = { ...next, unlockedTraits: [...prev.unlockedTraits, 'GHOST_WHISPERER'] };
                setNewTrait('GHOST_WHISPERER');
            }
            next = checkTraits(next);
            saveMemory(next);
            return next;
        });
    }, [checkTraits]);

    // ── Wipe memory ───────────────────────────────────────────────
    const wipeMemory = useCallback(() => {
        const fresh = { ...DEFAULT_MEMORY, lastSeen: Date.now() };
        setMemory(fresh);
        saveMemory(fresh);
        setLeveledUp(null);
        setNewTrait(null);
    }, []);

    // ── Recall — get relevant past chat context ────────────────────
    const getRecallContext = useCallback(() => {
        const recent = memory.chatHistory
            .filter(m => m.from === 'USER')
            .slice(-3)
            .map(m => m.text.slice(0, 60))
            .join(', ');

        const topTopic = Object.entries(memory.topicCounts)
            .sort((a, b) => b[1] - a[1])[0];

        return { recent, topTopic: topTopic ? topTopic[0] : null };
    }, [memory]);

    const clearLevelUp = useCallback(() => setLeveledUp(null), []);
    const clearNewTrait = useCallback(() => setNewTrait(null), []);

    const levelInfo = getLevelFromXP(memory.xp);
    const nextLevel = getNextLevel(levelInfo.level);
    const xpProgress = nextLevel
        ? ((memory.xp - levelInfo.xpNeeded) / (nextLevel.xpNeeded - levelInfo.xpNeeded)) * 100
        : 100;

    return {
        memory,
        levelInfo,
        nextLevel,
        xpProgress,
        leveledUp,
        newTrait,
        awardXP,
        logChat,
        logAction,
        wipeMemory,
        getRecallContext,
        clearLevelUp,
        clearNewTrait,
        LEVELS,
        TRAITS,
        XP,
    };
}
