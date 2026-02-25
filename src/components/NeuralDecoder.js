'use client';
import React, { useState } from 'react';
import { useAchievements } from './AchievementSystem';

export default function NeuralDecoder() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState('BASE64');
    const [processing, setProcessing] = useState(false);
    const [copied, setCopied] = useState(false);
    const [progress, setProgress] = useState(0);
    const { unlock } = useAchievements() || {};

    const rot13 = (str) => str.replace(/[a-zA-Z]/g, (c) => {
        const base = c <= 'Z' ? 65 : 97;
        return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
    });

    const handleDecode = () => {
        if (!input.trim()) return;
        setProcessing(true);
        setProgress(0);
        setOutput('');

        // Simulate processing animation
        let p = 0;
        const interval = setInterval(() => {
            p += Math.random() * 25 + 10;
            if (p >= 100) {
                p = 100;
                clearInterval(interval);
                setProgress(100);
                setTimeout(() => {
                    try {
                        let result = '';
                        if (mode === 'BASE64') result = btoa(input);
                        else if (mode === 'BASE64_DECODE') result = atob(input);
                        else if (mode === 'BINARY') result = input.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
                        else if (mode === 'HEX') result = input.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
                        else if (mode === 'ROT13') result = rot13(input);
                        setOutput(result);
                        unlock?.('DECODER_RING');
                    } catch (e) {
                        setOutput('ERROR: INVALID SOURCE STRING — CHECK INPUT FORMAT.');
                    }
                    setProcessing(false);
                    setProgress(0);
                }, 200);
            } else {
                setProgress(p);
            }
        }, 60);
    };

    const handleCopy = () => {
        if (!output) return;
        navigator.clipboard.writeText(output).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <section id="decoder" className="decoder-container glass">
            <div className="decoder-header">
                <h2 className="neon-text-purple">NEURAL DECODER</h2>
                <p>HACKER UTILITY: ENCODE & DECODE ACROSS DIVERGENT PROTOCOLS</p>
            </div>

            <div className="decoder-grid">
                <div className="input-zone">
                    <label>SOURCE_DATA <span style={{ color: '#444', fontWeight: 'normal' }}>({input.length} chars)</span></label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="INPUT PLAIN TEXT..."
                    />
                </div>
                <div className="control-zone">
                    <select value={mode} onChange={(e) => setMode(e.target.value)} className="mode-select">
                        <option value="BASE64">BASE64_ENCODE</option>
                        <option value="BASE64_DECODE">BASE64_DECODE</option>
                        <option value="BINARY">BINARY_PULSE</option>
                        <option value="HEX">HEX_SCHEMA</option>
                        <option value="ROT13">ROT13_CIPHER</option>
                    </select>
                    <button onClick={handleDecode} className="decode-btn" disabled={processing || !input.trim()}>
                        {processing ? 'PROCESSING...' : 'EXECUTE'}
                    </button>
                    {processing && (
                        <div className="progress-wrap">
                            <div className="progress-fill" style={{ width: `${progress}%` }} />
                            <span className="progress-label">{Math.round(progress)}%</span>
                        </div>
                    )}
                    {!processing && output && (
                        <div className="mode-info">
                            <span className="mode-pill">{mode}</span>
                            <span className="mode-desc">ACTIVE PROTOCOL</span>
                        </div>
                    )}
                </div>
                <div className="output-zone">
                    <div className="output-label-row">
                        <label>OUTPUT_DATA <span style={{ color: '#444', fontWeight: 'normal' }}>({output.length} chars)</span></label>
                        <button onClick={handleCopy} className={`copy-btn ${copied ? 'copied' : ''}`} disabled={!output}>
                            {copied ? '✓ COPIED' : 'COPY'}
                        </button>
                    </div>
                    <textarea
                        value={processing ? '> PROCESSING...' : output}
                        readOnly
                        placeholder="RESULTS WILL MANIFEST HERE..."
                        style={{ color: processing ? '#555' : output.startsWith('ERROR') ? 'var(--neon-pink)' : '#0f0' }}
                    />
                </div>
            </div>

            <style jsx>{`
                .decoder-container {
                    padding: 80px 40px;
                    margin: 80px 20px;
                }
                .decoder-header { text-align: center; margin-bottom: 50px; }
                .decoder-header p { font-size: 0.7rem; color: #555; letter-spacing: 3px; margin-top: 10px; }
                .decoder-grid {
                    display: grid;
                    grid-template-columns: 1fr 180px 1fr;
                    gap: 30px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                label { display: block; font-size: 0.6rem; color: var(--neon-purple); margin-bottom: 10px; letter-spacing: 2px; font-weight: 700; }
                textarea {
                    width: 100%;
                    height: 200px;
                    background: rgba(0,0,0,0.5);
                    border: 1px solid rgba(188, 19, 254, 0.3);
                    color: #fff;
                    padding: 20px;
                    font-family: monospace;
                    outline: none;
                    resize: none;
                    border-radius: 4px;
                    font-size: 0.85rem;
                    transition: border-color 0.3s ease;
                }
                textarea:focus { border-color: var(--neon-purple); }
                .control-zone {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    gap: 15px;
                }
                .mode-select {
                    background: #000;
                    color: var(--neon-purple);
                    border: 1px solid var(--neon-purple);
                    padding: 10px 8px;
                    font-family: monospace;
                    font-size: 0.65rem;
                    outline: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .decode-btn {
                    background: var(--neon-purple);
                    color: #000;
                    border: none;
                    padding: 15px;
                    font-weight: 900;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    letter-spacing: 2px;
                    font-size: 0.75rem;
                    border-radius: 4px;
                }
                .decode-btn:hover:not(:disabled) { box-shadow: 0 0 30px var(--neon-purple); }
                .decode-btn:disabled { opacity: 0.5; cursor: not-allowed; }
                .progress-wrap {
                    height: 4px;
                    background: rgba(188, 19, 254, 0.15);
                    border-radius: 2px;
                    overflow: hidden;
                    position: relative;
                }
                .progress-fill {
                    height: 100%;
                    background: var(--neon-purple);
                    box-shadow: 0 0 8px var(--neon-purple);
                    border-radius: 2px;
                    transition: width 0.1s linear;
                }
                .progress-label {
                    position: absolute;
                    top: 6px;
                    right: 0;
                    font-size: 0.5rem;
                    color: var(--neon-purple);
                    font-family: monospace;
                }
                .mode-info {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    margin-top: 5px;
                }
                .mode-pill {
                    background: rgba(188, 19, 254, 0.15);
                    border: 1px solid rgba(188, 19, 254, 0.3);
                    color: var(--neon-purple);
                    padding: 3px 10px;
                    border-radius: 20px;
                    font-size: 0.6rem;
                    letter-spacing: 1px;
                }
                .mode-desc {
                    font-size: 0.45rem;
                    color: #444;
                    letter-spacing: 2px;
                }
                .output-zone { display: flex; flex-direction: column; }
                .output-label-row { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 10px; }
                .copy-btn {
                    background: transparent;
                    border: 1px solid #333;
                    color: #555;
                    padding: 4px 12px;
                    font-size: 0.6rem;
                    letter-spacing: 1px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border-radius: 4px;
                }
                .copy-btn:hover:not(:disabled) { border-color: var(--neon-blue); color: var(--neon-blue); }
                .copy-btn.copied { border-color: #00ff66; color: #00ff66; }
                .copy-btn:disabled { opacity: 0.3; cursor: not-allowed; }
                @media (max-width: 900px) {
                    .decoder-grid { grid-template-columns: 1fr; }
                    .control-zone { flex-direction: row; flex-wrap: wrap; }
                }
            `}</style>
        </section>
    );
}
