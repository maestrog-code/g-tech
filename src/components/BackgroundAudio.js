'use client';
import React, { useEffect, useRef, useState } from 'react';

/**
 * G-Tech Background Audio Component
 * Optimized for a 110 BPM loop with automatic fading and user controls.
 */
export default function BackgroundAudio() {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.4);

    const toggleAudio = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(err => console.log("Audio play blocked by browser. User interaction required."));
        }
        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    return (
        <div className="audio-control glass">
            <audio
                ref={audioRef}
                loop
                src="https://www.orangefreesounds.com/wp-content/uploads/2022/02/Dark-ambient-synth-loop-110-bpm.mp3"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />

            <button onClick={toggleAudio} className="play-toggle">
                {isPlaying ? '▮▮ PAUSE' : '▶ PLAY AUDIO'}
            </button>

            <div className="bpm-pulse" style={{ animationDuration: `${60 / 110}s` }}></div>

            <style jsx>{`
        .audio-control {
          position: fixed;
          bottom: 30px;
          right: 30px;
          padding: 10px 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          z-index: 1000;
        }
        .play-toggle {
          background: transparent;
          border: none;
          color: var(--neon-blue);
          font-family: inherit;
          font-size: 0.8rem;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .play-toggle:hover {
          text-shadow: 0 0 10px var(--neon-blue);
        }
        .bpm-pulse {
          width: 8px;
          height: 8px;
          background: var(--neon-pink);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--neon-pink);
          animation: pulse infinite ease-in-out;
          opacity: ${isPlaying ? 1 : 0.3};
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.5); opacity: 1; }
        }
      `}</style>
        </div>
    );
}
