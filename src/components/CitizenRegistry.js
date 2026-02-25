'use client';
import React, { useState, useEffect } from 'react';

export default function CitizenRegistry() {
  const [citizen, setCitizen] = useState({ codename: '', specialization: 'EXPLORER' });
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedCitizen = localStorage.getItem('gtech_citizen');
    if (savedCitizen) {
      setCitizen(JSON.parse(savedCitizen));
      setIsRegistered(true);
    }
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch('/api/citizen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(citizen),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem('gtech_citizen', JSON.stringify(citizen));
        setIsRegistered(true);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Registry uplink failed.");
    }
  };

  if (isRegistered) {
    return (
      <div className="citizen-status glass neon-border-purple">
        <div className="label">CITIZEN VERIFIED [DB_SYNC: OK]</div>
        <div className="citizen-info">
          <span className="codename">{citizen.codename}</span>
          <span className="sep">|</span>
          <span className="spec">{citizen.specialization}</span>
        </div>
        <button onClick={() => setIsRegistered(false)} className="edit-btn">RE-CALIBRATE</button>

        <style jsx>{`
          .citizen-status {
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 15px 25px;
            z-index: 1001;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .label { font-size: 0.6rem; color: var(--neon-purple); letter-spacing: 2px; }
          .citizen-info { font-size: 1rem; font-weight: 700; color: #fff; letter-spacing: 1px; }
          .codename { color: var(--neon-blue); }
          .sep { margin: 0 10px; opacity: 0.3; }
          .spec { font-size: 0.8rem; opacity: 0.8; }
          .edit-btn { background: transparent; border: none; color: #555; font-size: 0.6rem; cursor: pointer; text-align: left; padding: 0;}
          .edit-btn:hover { color: #fff; }
        `}</style>
      </div>
    );
  }

  return (
    <section className="registry-container">
      <div className="glass neon-border-purple float-animation" style={{ padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
        <h2 className="neon-text-blue" style={{ marginBottom: '20px', letterSpacing: '4px' }}>CLAIM IDENTITY</h2>
        {error && <p style={{ color: 'var(--neon-pink)', fontSize: '0.8rem', marginBottom: '15px' }}>{error}</p>}
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label>CODENAME</label>
            <input
              type="text"
              required
              value={citizen.codename}
              onChange={(e) => setCitizen({ ...citizen, codename: e.target.value.toUpperCase() })}
              placeholder="ENTER ARCHITECT ID..."
            />
          </div>
          <div className="input-group">
            <label>SPECIALIZATION</label>
            <select
              value={citizen.specialization}
              onChange={(e) => setCitizen({ ...citizen, specialization: e.target.value })}
            >
              <option value="EXPLORER">EXPLORER</option>
              <option value="ARCHITECT">ARCHITECT</option>
              <option value="HACKER">HACKER</option>
              <option value="VOYAGER">VOYAGER</option>
            </select>
          </div>
          <button type="submit" className="claim-btn">INITIALIZE UPLINK</button>
        </form>
      </div>

      <style jsx>{`
        .registry-container {
          padding: 80px 20px;
          text-align: center;
        }
        .input-group {
          margin-bottom: 25px;
          text-align: left;
        }
        label {
          display: block;
          font-size: 0.7rem;
          color: var(--neon-purple);
          margin-bottom: 10px;
          letter-spacing: 2px;
        }
        input, select {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          padding: 12px;
          border-radius: 4px;
          outline: none;
          font-family: inherit;
        }
        input:focus, select:focus {
          border-color: var(--neon-blue);
        }
        .claim-btn {
          width: 100%;
          padding: 15px;
          background: transparent;
          border: 1px solid var(--neon-blue);
          color: var(--neon-blue);
          font-weight: 700;
          letter-spacing: 2px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .claim-btn:hover {
          background: var(--neon-blue);
          color: #000;
          box-shadow: 0 0 20px var(--neon-blue);
        }
        option { background: #111; color: #fff; }
      `}</style>
    </section>
  );
}
