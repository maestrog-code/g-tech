'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';

const BANNER = [
    '   ██████╗       ████████╗███████╗ ██████╗██╗  ██╗',
    '  ██╔════╝          ╚══██╔╝██╔════╝██╔════╝██║  ██║',
    '  ██║  ███╗  █████╗   ██║ █████╗  ██║     ███████║',
    '  ██║   ██║         ██║ ██╔══╝  ██║     ██╔══██║',
    '  ╚██████╔╝          ██║ ███████╗╚██████╗██║  ██║',
    '   ╚═════╝           ╚═╝ ╚══════╝ ╚═════╝╚═╝  ╚═╝',
    '',
    '  NEURAL COMMAND INTERFACE v5.0 — UPLINK ACTIVE',
    '  Type "help" to list commands. Type "clear" to reset.',
    '',
];

const FS = {
    '/': { type: 'dir', children: ['sectors', 'archive', 'agents', 'classified'] },
    '/sectors': { type: 'dir', children: ['pulse', 'chronicles', 'lab', 'forge', 'decoder', 'cyberverse'] },
    '/archive': { type: 'dir', children: ['ai.log', 'quantum.log', 'space.log'] },
    '/agents': { type: 'dir', children: ['open_claw_x.agent', 'buddy_v4.agent'] },
    '/classified': { type: 'dir', children: ['██████.enc', '██████.key'] },
    '/archive/ai.log': { type: 'file', content: 'AI TRAINING RUNS: 142,000 TODAY. TRANSFORMER SCALING CONTINUES. GPT-5 CLASS MODELS IMMINENT.' },
    '/archive/quantum.log': { type: 'file', content: 'QUANTUM COHERENCE: 1127 QUBITS STABLE. ERROR CORRECTION THRESHOLD: 99.9%. QUANTUM INTERNET NODES: 7.' },
    '/archive/space.log': { type: 'file', content: 'ACTIVE SATELLITES: 9,317. MARS TELEMETRY: NOMINAL. LUNAR BASE STATUS: PHASE 2 CONSTRUCTION.' },
    '/agents/open_claw_x.agent': { type: 'file', content: 'AGENT: OPEN_CLAW_X | STATUS: ACTIVE | MOOD: CURIOUS | XP: LOADING FROM MEMORY...' },
    '/agents/buddy_v4.agent': { type: 'file', content: 'AGENT: BUDDY_V4 | STATUS: ARCHIVED | MOOD: IDLE | NOTE: SUPERSEDED BY OPEN_CLAW_X.' },
};

const MOTIVATIONS = [
    'THE FUTURE IS NOT PREDICTED — IT IS ENGINEERED.',
    'CODE IS THE ONLY LANGUAGE THE UNIVERSE CANNOT IGNORE.',
    'EVERY COMMIT IS A SMALL ACT OF CREATION.',
    'PUSH THE BOUNDARIES. THE UNIVERSE HAS NO FIREWALL.',
    'CURIOSITY IS THE MOST POWERFUL CPU.',
    'THE BEST TIME TO BUILD WAS YESTERDAY. THE SECOND BEST IS NOW.',
    'IN THE AGE OF AI, CREATIVITY IS YOUR MOAT.',
];

const TECH_JOKES = [
    'Why do programmers prefer dark mode? Because light attracts bugs.',
    'A SQL query walks into a bar, walks up to two tables and asks… "Can I join you?"',
    'Why was the JavaScript developer sad? Because they didn\'t know how to null their feelings.',
    'What\'s a computer\'s favorite snack? Microchips.',
    'Why did the developer quit their job? Because they didn\'t get arrays.',
    '!false — It\'s funny because it\'s true.',
    'How many programmers does it take to change a lightbulb? None, that\'s a hardware problem.',
    'There are 10 types of people: those who understand binary, and those who don\'t.',
    'A byte walks into a bar, looking pale. The bartender asks, "What\'s wrong?" The byte replies, "I have a parity error."',
    'Git commit -m "Final fix (for real this time)"',
];

const TECH_TRIVIA = [
    'The first computer bug was an actual bug — a moth found in a Harvard Mark II computer in 1947.',
    'The average smartphone today has more computing power than NASA used to land on the moon in 1969.',
    'The first 1GB hard drive, released in 1980, weighed 550 lbs and cost $40,000.',
    'QWERTY keyboard layout was designed to slow typists down to prevent typewriter jams.',
    'Email predates the World Wide Web by over 20 years. The first email was sent in 1971.',
    'Over 90% of the world\'s currency exists only digitally.',
    'The first computer virus, "Creeper", was created in 1971 and displayed: "I\'m the creeper, catch me if you can!"',
    'There are more possible iterations of a game of chess than there are atoms in the observable universe.',
    'The term "debugging" comes from Admiral Grace Hopper, who found a literal moth causing a computer error.',
    'YouTube was originally conceived as a video dating site.',
    'Google was originally called "BackRub" because it analyzed the web\'s back links.',
    'The average computer user blinks 7 times per minute vs. 20 times normally.',
];

const HACKS = [
    'INITIATING SEQUENCE... SCANNING SUBNET 192.168.x.x',
    'BYPASSING FIREWALL LAYER 1... ████████████... OK',
    'ENUMERATING OPEN PORTS: 22, 80, 443, 8080, 31337',
    'PRIVILEGE ESCALATION: sudo chmod 777 /root... OK',
    'DEPLOYING PAYLOAD: xpl0it_v3.bin... ████████... OK',
    'COVERING TRACKS: rm -rf /var/log/*... DONE',
    'UPLINK ESTABLISHED. YOU ARE NOW IN CYBERSPACE.',
    '[ THIS IS SIMULATED. NO ACTUAL HACKING. STAY LEGAL. ]',
];

const MATRIX_CHARS = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜｷﾑﾃｹﾒｴｶｷﾑﾃｸﾀｸﾁｺｿﾃﾐABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';

function matrixChar() {
    return MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
}

const COMMANDS = {
    help: () => [
        '╔══════════════════════════════════════╗',
        '║        AVAILABLE COMMANDS            ║',
        '╠══════════════════════════════════════╣',
        '║  help       — Show this help menu    ║',
        '║  ls [path]  — List directory         ║',
        '║  cat [path] — Read file              ║',
        '║  cd [path]  — Change directory       ║',
        '║  pwd        — Print working dir      ║',
        '║  scan       — Scan network nodes     ║',
        '║  hack       — Initiate hack sequence ║',
        '║  time       — Show system clock      ║',
        '║  motd       — Motivational message   ║',
        '║  matrix     — Enter the matrix       ║',
        '║  whoami     — Identify yourself      ║',
        '║  uptime     — System uptime          ║',
        '║  ping [host]— Ping a host            ║',
        '║  echo [msg] — Echo a message         ║',
        '║  joke       — Random tech joke       ║',
        '║  trivia     — Tech trivia fact       ║',
        '║  clear      — Clear terminal         ║',
        '╚══════════════════════════════════════╝',
    ],
    time: () => {
        const d = new Date();
        return [
            `  SYSTEM CLOCK: ${d.toUTCString()}`,
            `  LOCAL TIME:   ${d.toLocaleString()}`,
            `  UNIX EPOCH:   ${Math.floor(d / 1000)}`,
            `  NANO OFFSET:  ${d.getMilliseconds()}ms`,
        ];
    },
    whoami: () => [
        '  USER: CITIZEN_' + Math.floor(Math.random() * 9999).toString().padStart(4, '0'),
        '  ROLE: OBSERVER',
        '  CLEARANCE: LEVEL_1',
        '  IP: ***.***.***.' + Math.floor(Math.random() * 254 + 1),
        '  UPLINK: G-TECH NEURAL NET',
    ],
    scan: () => {
        const nodes = Array.from({ length: 8 }, (_, i) => {
            const ip = `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254 + 1)}`;
            const status = Math.random() > 0.3 ? 'ONLINE' : 'OFFLINE';
            const role = ['COMPUTE', 'RELAY', 'ARCHIVE', 'UPLINK', 'SENSOR'][Math.floor(Math.random() * 5)];
            return `  [${status === 'ONLINE' ? '●' : '○'}] ${ip.padEnd(16)} ${status.padEnd(8)} ${role}`;
        });
        return ['  SCANNING NEURAL NETWORK NODES...', '', ...nodes, '', `  ${nodes.filter(n => n.includes('ONLINE')).length} NODES ONLINE`];
    },
    uptime: () => {
        const s = Math.floor((Date.now() - 1700000000000) / 1000);
        const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60);
        return [`  SYSTEM UPTIME: ${d}d ${h}h ${m}m`, '  STATUS: FULLY OPERATIONAL', '  CORE TEMP: 41°C', '  CPU LOAD: 12%', '  MEM: 4.2 / 16.0 GB'];
    },
    motd: () => {
        const msg = MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)];
        return ['', `  ❝ ${msg} ❞`, ''];
    },
    hack: (_, setMatrixMode) => {
        return { async: HACKS, delay: 280, onDone: null };
    },
    matrix: (_, setMatrixMode) => {
        setMatrixMode(true);
        setTimeout(() => setMatrixMode(false), 8000);
        return ['  ENTERING THE MATRIX... (8 SECONDS)', '  PRESS ANY KEY TO ESCAPE.'];
    },
};

export default function CommandTerminal({ onAchievement }) {
    const [lines, setLines] = useState(BANNER.map(t => ({ t, type: 'out' })));
    const [input, setInput] = useState('');
    const [cwd, setCwd] = useState('/');
    const [history, setHistory] = useState([]);
    const [histIdx, setHistIdx] = useState(-1);
    const [matrixMode, setMatrixMode] = useState(false);
    const [matrixCols, setMatrixCols] = useState([]);
    const [asyncQ, setAsyncQ] = useState(null);
    const [mounted, setMounted] = useState(false);
    const endRef = useRef(null);
    const inputRef = useRef(null);
    const achievedRef = useRef(false);

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        if (!mounted) return;
        if (onAchievement && !achievedRef.current) {
            achievedRef.current = true;
            onAchievement('TERMINAL_HAX');
        }
    }, [mounted, onAchievement]);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [lines]);

    // Matrix animation
    useEffect(() => {
        if (!matrixMode) return;
        const cols = Math.floor(window.innerWidth / 16);
        const state = Array.from({ length: cols }, () => ({
            y: Math.floor(Math.random() * 40),
            speed: 1 + Math.random() * 2,
            chars: Array.from({ length: 40 }, matrixChar),
        }));
        setMatrixCols(state);
        const iv = setInterval(() => {
            setMatrixCols(prev => prev.map(col => ({
                ...col,
                y: col.y + col.speed > 44 ? 0 : col.y + col.speed,
                chars: col.chars.map((c, i) => Math.random() < 0.05 ? matrixChar() : c),
            })));
        }, 80);
        const esc = () => setMatrixMode(false);
        window.addEventListener('keydown', esc);
        return () => { clearInterval(iv); window.removeEventListener('keydown', esc); };
    }, [matrixMode]);

    // Async command streaming
    useEffect(() => {
        if (!asyncQ) return;
        let i = 0;
        const iv = setInterval(() => {
            if (i < asyncQ.lines.length) {
                setLines(prev => [...prev, { t: asyncQ.lines[i], type: 'out' }]);
                i++;
            } else {
                clearInterval(iv);
                setAsyncQ(null);
            }
        }, asyncQ.delay);
        return () => clearInterval(iv);
    }, [asyncQ]);

    const push = useCallback((text, type = 'out') => {
        if (Array.isArray(text)) {
            setLines(prev => [...prev, ...text.map(t => ({ t, type }))]);
        } else {
            setLines(prev => [...prev, { t: text, type }]);
        }
    }, []);

    const execute = useCallback((raw) => {
        const trimmed = raw.trim();
        if (!trimmed) return;

        push(`${cwd} $ ${trimmed}`, 'cmd');
        setHistory(h => [trimmed, ...h.slice(0, 49)]);
        setHistIdx(-1);

        const [cmd, ...args] = trimmed.split(' ');

        if (cmd === 'clear') { setLines(BANNER.map(t => ({ t, type: 'out' }))); return; }

        if (cmd === 'ls') {
            const path = args[0] ? (args[0].startsWith('/') ? args[0] : `${cwd === '/' ? '' : cwd}/${args[0]}`) : cwd;
            const node = FS[path];
            if (!node) { push(`  ls: ${path}: No such file or directory`, 'err'); return; }
            if (node.type === 'file') { push(`  ${path}  [FILE]`, 'out'); return; }
            push(node.children.map(c => `  ${c}`));
            return;
        }

        if (cmd === 'cat') {
            const path = args[0] ? (args[0].startsWith('/') ? args[0] : `${cwd === '/' ? '' : cwd}/${args[0]}`) : '';
            const node = FS[path];
            if (!node) { push(`  cat: ${path}: No such file or directory`, 'err'); return; }
            if (node.type === 'dir') { push(`  cat: ${path}: Is a directory`, 'err'); return; }
            push(`  ${node.content}`);
            return;
        }

        if (cmd === 'cd') {
            const target = args[0] || '/';
            const path = target.startsWith('/') ? target : `${cwd === '/' ? '' : cwd}/${target}`;
            const normalized = path.replace(/\/+/g, '/');
            const node = FS[normalized];
            if (!node) { push(`  cd: ${target}: No such directory`, 'err'); return; }
            if (node.type === 'file') { push(`  cd: ${target}: Not a directory`, 'err'); return; }
            setCwd(normalized || '/');
            return;
        }

        if (cmd === 'pwd') { push(`  ${cwd}`); return; }

        if (cmd === 'echo') {
            push(`  ${args.join(' ')}`);
            window.dispatchEvent(new CustomEvent('gtech:echo'));
            return;
        }

        if (cmd === 'joke') {
            const joke = TECH_JOKES[Math.floor(Math.random() * TECH_JOKES.length)];
            push(['', `  😄 ${joke}`, '']);
            return;
        }

        if (cmd === 'trivia') {
            const fact = TECH_TRIVIA[Math.floor(Math.random() * TECH_TRIVIA.length)];
            push(['', `  💡 TECH TRIVIA: ${fact}`, '']);
            return;
        }

        if (cmd === 'ping') {
            const host = args[0] || 'gtech.neural';
            const lines_p = Array.from({ length: 5 }, (_, i) => {
                const ms = (8 + Math.random() * 12).toFixed(1);
                return `  64 bytes from ${host}: icmp_seq=${i + 1} ttl=64 time=${ms} ms`;
            });
            push([`  PING ${host}: 56 data bytes`, ...lines_p, `  5 packets transmitted, 5 received, 0% packet loss`]);
            return;
        }

        if (cmd === 'hack') {
            setAsyncQ({ lines: HACKS, delay: 350 });
            return;
        }

        if (cmd === 'matrix') {
            push(COMMANDS.matrix(args, setMatrixMode));
            return;
        }

        const fn = COMMANDS[cmd];
        if (fn) {
            const result = fn(args, setMatrixMode);
            if (result) push(result);
        } else {
            push(`  command not found: ${cmd}. Type "help" for available commands.`, 'err');
        }
    }, [cwd, push]);

    const onKey = (e) => {
        if (e.key === 'Enter') {
            execute(input);
            setInput('');
        } else if (e.key === 'ArrowUp') {
            const next = Math.min(histIdx + 1, history.length - 1);
            setHistIdx(next);
            setInput(history[next] || '');
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            const next = Math.max(histIdx - 1, -1);
            setHistIdx(next);
            setInput(next === -1 ? '' : history[next]);
            e.preventDefault();
        }
    };

    if (!mounted) return null;

    return (
        <section id="terminal" style={{ padding: '80px 20px', position: 'relative' }}>
            {matrixMode && (
                <div className="matrix-rain" onClick={() => setMatrixMode(false)}>
                    {matrixCols.map((col, ci) => (
                        <div key={ci} className="matrix-col" style={{ left: ci * 16 }}>
                            {col.chars.map((c, ri) => (
                                <span
                                    key={ri}
                                    className="matrix-char"
                                    style={{
                                        opacity: Math.max(0, 1 - Math.abs(ri - col.y) / 6),
                                        color: ri === Math.floor(col.y) ? '#fff' : '#00ff41',
                                        fontWeight: ri === Math.floor(col.y) ? 900 : 400,
                                    }}
                                >
                                    {c}
                                </span>
                            ))}
                        </div>
                    ))}
                    <div className="matrix-hint">CLICK OR PRESS ANY KEY TO EXIT</div>
                </div>
            )}

            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div className="term-header">
                    <div className="term-badge">
                        <span className="live-dot" style={{ background: '#00ff66' }} />
                        COMMAND TERMINAL
                    </div>
                    <h2 className="neon-text-blue" style={{ fontSize: '2.5rem', letterSpacing: '10px' }}>NEURAL CLI</h2>
                    <p style={{ fontSize: '0.65rem', color: '#555', letterSpacing: '4px' }}>INTERACT WITH THE G-TECH SYSTEM CORE</p>
                </div>

                <div className="terminal-box glass" onClick={() => inputRef.current?.focus()}>
                    {/* Title bar */}
                    <div className="term-titlebar">
                        <span className="term-dot" style={{ background: '#ff5f57' }} />
                        <span className="term-dot" style={{ background: '#ffbd2e' }} />
                        <span className="term-dot" style={{ background: '#28c840' }} />
                        <span className="term-title">G-TECH NEURAL SHELL — {cwd}</span>
                    </div>

                    {/* Output */}
                    <div className="term-output">
                        {lines.map((l, i) => (
                            <div key={i} className={`term-line ${l.type}`}>
                                <span>{l.t || '\u00a0'}</span>
                            </div>
                        ))}
                        <div ref={endRef} />
                    </div>

                    {/* Input */}
                    <div className="term-input-row">
                        <span className="term-prompt">{cwd} $</span>
                        <input
                            ref={inputRef}
                            className="term-input"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={onKey}
                            spellCheck={false}
                            autoComplete="off"
                            autoCorrect="off"
                            placeholder="type a command..."
                        />
                        <span className="term-caret" />
                    </div>
                </div>

                <div className="term-tips">
                    QUICK COMMANDS:
                    {['help', 'scan', 'hack', 'joke', 'trivia', 'matrix', 'motd', 'ls'].map(c => (
                        <button key={c} className="tip-btn" onClick={() => { execute(c); inputRef.current?.focus(); }}>
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .matrix-rain {
                    position: fixed;
                    inset: 0;
                    z-index: 99998;
                    background: #000;
                    overflow: hidden;
                    cursor: pointer;
                }
                .matrix-col {
                    position: absolute;
                    top: 0;
                    display: flex;
                    flex-direction: column;
                    font-family: 'Courier New', monospace;
                    font-size: 14px;
                    line-height: 1.4;
                }
                .matrix-char { display: block; transition: opacity 0.08s; }
                .matrix-hint {
                    position: absolute;
                    bottom: 40px;
                    left: 50%;
                    transform: translateX(-50%);
                    color: rgba(0,255,65,0.5);
                    font-size: 0.65rem;
                    letter-spacing: 4px;
                    font-family: 'Courier New', monospace;
                }

                .term-header {
                    text-align: center;
                    margin-bottom: 40px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                }
                .term-badge {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.6rem;
                    letter-spacing: 4px;
                    color: #00ff66;
                    font-weight: 900;
                    background: rgba(0,255,102,0.06);
                    border: 1px solid rgba(0,255,102,0.2);
                    padding: 6px 16px;
                    border-radius: 20px;
                }

                .terminal-box {
                    border: 1px solid rgba(0,255,102,0.25);
                    border-radius: 12px;
                    overflow: hidden;
                    background: rgba(2,8,2,0.97);
                    box-shadow: 0 0 60px rgba(0,255,102,0.06), inset 0 0 40px rgba(0,0,0,0.5);
                    cursor: text;
                }

                .term-titlebar {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 16px;
                    background: rgba(0,0,0,0.6);
                    border-bottom: 1px solid rgba(0,255,102,0.12);
                }
                .term-dot { width: 13px; height: 13px; border-radius: 50%; display: block; }
                .term-title {
                    margin-left: 10px;
                    font-size: 0.55rem;
                    letter-spacing: 3px;
                    color: #444;
                    font-family: 'Courier New', monospace;
                }

                .term-output {
                    padding: 16px 24px;
                    height: 380px;
                    overflow-y: auto;
                    font-family: 'Courier New', monospace;
                    font-size: 0.75rem;
                    line-height: 1.7;
                    scrollbar-width: thin;
                    scrollbar-color: rgba(0,255,102,0.3) transparent;
                }
                .term-output::-webkit-scrollbar { width: 4px; }
                .term-output::-webkit-scrollbar-thumb { background: rgba(0,255,102,0.3); border-radius: 2px; }

                .term-line { display: block; }
                .term-line.out { color: #00cc55; }
                .term-line.cmd { color: #00f2ff; }
                .term-line.err { color: #ff0055; }

                .term-input-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 12px 24px;
                    border-top: 1px solid rgba(0,255,102,0.1);
                    background: rgba(0,0,0,0.4);
                }
                .term-prompt {
                    color: #00ff66;
                    font-family: 'Courier New', monospace;
                    font-size: 0.75rem;
                    white-space: nowrap;
                    font-weight: 700;
                }
                .term-input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    outline: none;
                    color: #00cc55;
                    font-family: 'Courier New', monospace;
                    font-size: 0.75rem;
                    caret-color: #00ff66;
                }
                .term-input::placeholder { color: #1a3a1a; }

                .term-tips {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-top: 20px;
                    font-size: 0.5rem;
                    letter-spacing: 3px;
                    color: #333;
                    flex-wrap: wrap;
                }
                .tip-btn {
                    background: rgba(0,255,102,0.05);
                    border: 1px solid rgba(0,255,102,0.2);
                    color: #00ff66;
                    padding: 5px 14px;
                    border-radius: 6px;
                    font-size: 0.6rem;
                    letter-spacing: 2px;
                    font-family: 'Courier New', monospace;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .tip-btn:hover { background: rgba(0,255,102,0.12); box-shadow: 0 0 10px rgba(0,255,102,0.2); }
            `}</style>
        </section>
    );
}
