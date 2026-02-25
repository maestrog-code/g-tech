'use client';
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useAchievements } from './AchievementSystem';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function StructuralViz() {
  const meshRef = useRef();
  useFrame((state) => {
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
  });
  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[1.5, 0]} />
      <meshBasicMaterial color="#ff9d00" wireframe />
    </mesh>
  );
}

const COMMANDS = {
  HELP: () => ['> AVAILABLE COMMANDS:', '> RUN    — Execute current experiment', '> STATUS — Fetch system diagnostics', '> SCAN   — Run network sweep', '> TIME   — Query temporal uplink', '> CLEAR  — Flush terminal buffer'],
  STATUS: () => [
    '> SCANNING SYSTEM...',
    `> CPU: ${(Math.random() * 30 + 60).toFixed(1)}%  USAGE`,
    `> RAM: ${(Math.random() * 20 + 70).toFixed(1)}%  ALLOCATED`,
    `> NET: ${(Math.random() * 500 + 100).toFixed(0)} MB/s  UPLINK`,
    '> SECURITY: CIPHER_ACTIVE',
    '> STATUS: ALL_SYSTEMS_NOMINAL',
  ],
  SCAN: () => [
    '> INITIATING NETWORK SWEEP...',
    '> NODE_01: SECURE  [■■■■■■■■□□]',
    '> NODE_02: SECURE  [■■■■■■■□□□]',
    '> NODE_03: PENDING [■■■■□□□□□□]',
    '> ANOMALY DETECTED AT NODE_07',
    '> COUNTERMEASURES: DEPLOYED',
    '> SWEEP: COMPLETE',
  ],
  TIME: () => [
    `> TEMPORAL_UPLINK: ${new Date().toLocaleTimeString()}`,
    `> MISSION_ELAPSED: ${Math.floor(Math.random() * 999)}h ${Math.floor(Math.random() * 59)}m`,
    '> SYNC: UTC_CONFIRMED',
  ],
};

const METRICS = [
  { label: 'CPU', key: 'cpu', color: '#00f2ff', unit: '%' },
  { label: 'RAM', key: 'ram', color: '#bc13fe', unit: '%' },
  { label: 'NET', key: 'net', color: '#ff9d00', unit: 'Gb' },
];

export default function LiveLab() {
  const [role, setRole] = useState('universal');
  const [terminalOutput, setTerminalOutput] = useState(['> UPLINK ESTABLISHED.', '> ACCESSING EXPERIMENT CHAMBER...', '> TYPE "HELP" FOR COMMANDS.']);
  const [inputValue, setInputValue] = useState('');
  const [jsInput, setJsInput] = useState('// Enter Logic Here\nconsole.log("ANALYZING PULSE...");');
  const [experimentResult, setExperimentResult] = useState('');
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [metrics, setMetrics] = useState({ cpu: 65, ram: 72, net: 1.2 });
  const [missionLog, setMissionLog] = useState([]);
  const terminalEndRef = useRef(null);
  const sectionRef = useRef(null);
  const { unlock } = useAchievements() || {};

  useEffect(() => {
    if (!sectionRef.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { unlock?.('SIGNAL_LOCKED'); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, [unlock]);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      setWebGLSupported(!!(window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))));
    } catch (e) {
      setWebGLSupported(false);
    }

    const fetchRole = async () => {
      try {
        const res = await fetch('/api/citizen');
        if (res.ok) {
          const data = await res.json();
          if (data && data.specialization) setRole(data.specialization);
        }
      } catch (e) { }
    };
    fetchRole();

    // Live metrics animation
    const metricsInterval = setInterval(() => {
      setMetrics({
        cpu: Math.max(20, Math.min(99, 65 + (Math.random() - 0.5) * 20)),
        ram: Math.max(40, Math.min(99, 72 + (Math.random() - 0.5) * 15)),
        net: parseFloat((Math.random() * 2.5 + 0.5).toFixed(1)),
      });
    }, 2000);

    // Mission log auto-feed
    const logMessages = [
      'SECTOR_SCAN complete. 0 threats detected.',
      'ARCHIVE sync verified. 6 new entries loaded.',
      'CITIZEN registry heartbeat confirmed.',
      'AI model checkpoint saved.',
      'Quantum entanglement stable.',
      'Neural uplink at 99.8% efficiency.',
    ];
    let idx = 0;
    const logInterval = setInterval(() => {
      setMissionLog(prev => {
        const entry = `[${new Date().toLocaleTimeString()}] ${logMessages[idx % logMessages.length]}`;
        idx++;
        return [entry, ...prev].slice(0, 5);
      });
    }, 4000);

    return () => {
      clearInterval(metricsInterval);
      clearInterval(logInterval);
    };
  }, []);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = inputValue.trim().toUpperCase();
      if (cmd === 'CLEAR') {
        setTerminalOutput(['> SYSTEM REBOOTED.']);
      } else if (cmd === 'RUN') {
        runExperiment();
      } else if (COMMANDS[cmd]) {
        setTerminalOutput(prev => [...prev, `> ${cmd}`, ...COMMANDS[cmd]()]);
      } else if (cmd) {
        setTerminalOutput(prev => [...prev, `> ${cmd}`, `> UNKNOWN_CMD: "${cmd}" — TYPE "HELP"`]);
      }
      setInputValue('');
    }
  };

  const runExperiment = () => {
    setTerminalOutput(prev => [...prev, '> EXECUTING ROLE_EXPERIMENT...']);
    if (role === 'HACKER') {
      setExperimentResult(`LOG: ${new Date().toLocaleTimeString()} — DATA_PACKET_STABLE`);
      setTerminalOutput(prev => [...prev, '> HACKER LOGIC DEPLOYED.', '> RESULTS IN OVERLAY.']);
    } else {
      setTerminalOutput(prev => [...prev, '> STRESS_TEST INITIATED.', '> STRUCTURAL_INTEGRITY: 98.4%', '> SIMULATION: PASSED.']);
    }
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalOutput]);

  return (
    <section ref={sectionRef} id="lab" className="role-shift-transition" style={{ padding: '80px 20px', background: 'rgba(5,5,5,0.8)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h2 className="neon-text-blue glitch" data-text="EXPERIMENT CHAMBER">EXPERIMENT CHAMBER</h2>
          <div className="status-tag glass" style={{ padding: '5px 15px', fontSize: '0.7rem', color: 'var(--neon-blue)', border: '1px solid var(--neon-blue)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="live-dot" />
            {role.toUpperCase()} MODE: ACTIVE
          </div>
        </div>

        {/* System Metrics Row */}
        <div className="metrics-row">
          {METRICS.map(m => (
            <div key={m.key} className="metric-card glass">
              <div className="metric-label">{m.label}</div>
              <div className="metric-value" style={{ color: m.color }}>{typeof metrics[m.key] === 'number' ? (m.unit === '%' ? metrics[m.key].toFixed(0) : metrics[m.key]) : '--'}{m.unit}</div>
              <div className="metric-bar-bg">
                <div className="metric-bar-fill" style={{ width: m.unit === '%' ? `${metrics[m.key]}%` : `${Math.min(100, metrics[m.key] * 40)}%`, background: m.color }} />
              </div>
            </div>
          ))}
        </div>

        <div className="experiment-grid">
          {/* Main Console */}
          <div className="experiment-card glass neon-border-purple">
            <div className="label">NEURAL UPLINK CONSOLE</div>
            <div className="terminal-box">
              {terminalOutput.map((line, i) => (
                <div key={i} className="terminal-line">{line}</div>
              ))}
              <div ref={terminalEndRef} />
            </div>
            <div className="terminal-input-wrap">
              <span className="prompt">&gt;</span>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleCommand}
                placeholder="TYPE 'HELP' TO BEGIN..."
              />
            </div>
            {/* Mission Log */}
            <div className="mission-log">
              <div className="mission-log-label">MISSION LOG</div>
              {missionLog.map((entry, i) => (
                <div key={i} className="mission-entry" style={{ opacity: 1 - i * 0.18 }}>{entry}</div>
              ))}
            </div>
          </div>

          {/* Role-Specific Interactive Lab */}
          <div className="experiment-card glass">
            <div className="label">{role === 'HACKER' ? 'LOGIC SANDBOX' : 'STRUCTURAL SIMULATOR'}</div>
            <div className="sandbox-area" style={{ height: '250px', background: '#000', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
              {role === 'HACKER' ? (
                <div style={{ padding: '15px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <textarea
                    value={jsInput}
                    onChange={(e) => setJsInput(e.target.value)}
                    style={{ background: 'transparent', color: '#0f0', border: 'none', flex: 1, fontFamily: 'monospace', outline: 'none', resize: 'none', fontSize: '0.85rem' }}
                  />
                  <div style={{ fontSize: '0.7rem', color: '#0a0', borderTop: '1px solid #1a1a1a', paddingTop: '10px' }}>
                    {experimentResult || '> NO LOG DATA'}
                  </div>
                </div>
              ) : webGLSupported ? (
                <Canvas>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} />
                  <Suspense fallback={null}>
                    <StructuralViz />
                    <OrbitControls enableZoom={false} />
                  </Suspense>
                </Canvas>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#ff9d00', border: '1px dashed #ff9d0044', borderRadius: '4px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📐</div>
                    <div style={{ fontSize: '0.7rem', letterSpacing: '2px' }}>STATIC SCHEMATIC MODE</div>
                    <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>[WEBGL UPLINK OFFLINE]</div>
                  </div>
                </div>
              )}
            </div>
            <button className="run-btn" onClick={runExperiment}>INITIALIZE EXPERIMENT</button>
          </div>
        </div>
      </div>

      <style jsx>{`
                .metrics-row {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 15px;
                    margin-bottom: 20px;
                }
                .metric-card {
                    padding: 15px 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .metric-label {
                    font-size: 0.55rem;
                    color: #555;
                    letter-spacing: 3px;
                    font-weight: 700;
                }
                .metric-value {
                    font-size: 1.4rem;
                    font-weight: 900;
                    font-family: monospace;
                    transition: all 0.5s ease;
                }
                .metric-bar-bg {
                    height: 3px;
                    background: rgba(255,255,255,0.06);
                    border-radius: 2px;
                    overflow: hidden;
                }
                .metric-bar-fill {
                    height: 100%;
                    border-radius: 2px;
                    transition: width 1.5s ease;
                }
                .experiment-grid {
                    display: grid;
                    grid-template-columns: 1.5fr 1fr;
                    gap: 20px;
                }
                @media (max-width: 900px) {
                    .experiment-grid { grid-template-columns: 1fr; }
                    .metrics-row { grid-template-columns: 1fr; }
                }
                .experiment-card {
                    padding: 30px;
                    display: flex;
                    flex-direction: column;
                }
                .label {
                    font-size: 0.7rem;
                    color: var(--neon-purple);
                    margin-bottom: 20px;
                    letter-spacing: 2px;
                    font-weight: 700;
                }
                .terminal-box {
                    height: 200px;
                    overflow-y: auto;
                    background: rgba(0,0,0,0.5);
                    padding: 15px;
                    font-family: 'Courier New', monospace;
                    font-size: 0.8rem;
                    border-radius: 4px;
                    margin-bottom: 15px;
                }
                .terminal-line { margin-bottom: 5px; color: #0f0; opacity: 0.85; }
                .terminal-input-wrap {
                    display: flex;
                    align-items: center;
                    background: rgba(255,255,255,0.05);
                    padding: 12px;
                    border-radius: 4px;
                }
                .prompt { margin-right: 15px; color: #0f0; }
                input {
                    background: transparent;
                    border: none;
                    color: #fff;
                    width: 100%;
                    outline: none;
                    font-family: 'Courier New', monospace;
                    font-size: 0.9rem;
                }
                .mission-log {
                    margin-top: 15px;
                    padding: 12px;
                    background: rgba(0,0,0,0.3);
                    border-radius: 4px;
                    border-left: 2px solid rgba(0, 242, 255, 0.3);
                }
                .mission-log-label {
                    font-size: 0.5rem;
                    color: #444;
                    letter-spacing: 3px;
                    margin-bottom: 8px;
                }
                .mission-entry {
                    font-family: monospace;
                    font-size: 0.65rem;
                    color: #0f0;
                    margin-bottom: 4px;
                    transition: opacity 0.5s ease;
                }
                .run-btn {
                    margin-top: 20px;
                    padding: 15px;
                    background: transparent;
                    border: 1px solid var(--neon-blue);
                    color: var(--neon-blue);
                    font-weight: 700;
                    letter-spacing: 3px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 0.8rem;
                }
                .run-btn:hover {
                    background: var(--neon-blue);
                    color: #000;
                    box-shadow: 0 0 30px var(--neon-blue);
                }
            `}</style>
    </section>
  );
}
