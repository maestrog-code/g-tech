const audioContext = typeof window !== 'undefined' && window.AudioContext
    ? new (window.AudioContext || window.webkitAudioContext)()
    : null;

function playTone(frequency, duration, volume = 0.1) {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

export const sounds = {
    click: () => playTone(800, 0.05, 0.08),
    hover: () => playTone(600, 0.03, 0.05),
    success: () => {
        playTone(523, 0.1, 0.1);
        setTimeout(() => playTone(659, 0.15, 0.12), 100);
    },
    error: () => {
        playTone(200, 0.15, 0.15);
        setTimeout(() => playTone(150, 0.15, 0.15), 80);
    },
    notification: () => {
        playTone(880, 0.08, 0.08);
        setTimeout(() => playTone(1047, 0.12, 0.1), 80);
    },
    achievement: () => {
        playTone(523, 0.1, 0.1);
        setTimeout(() => playTone(659, 0.1, 0.1), 100);
        setTimeout(() => playTone(784, 0.15, 0.12), 200);
    },
    glitch: () => {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => playTone(Math.random() * 400 + 200, 0.05, 0.06), i * 30);
        }
    },
};

export function enableSounds() {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
}
