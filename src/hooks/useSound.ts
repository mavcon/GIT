import { useRef } from 'react';
import { BuzzerOscillatorConfig, SoundHook } from '../types/timer';

const BUZZER_CONFIGS: BuzzerOscillatorConfig[] = [
  { freq: 150, type: 'square', gain: 1.0, description: 'Deep bass' },
  { freq: 300, type: 'square', gain: 0.8, description: 'Mid tone' },
  { freq: 600, type: 'sawtooth', gain: 0.6, description: 'Sharp high' },
  { freq: 900, type: 'square', gain: 0.4, description: 'Extra bite' }
];

const REST_RING_CONFIGS: BuzzerOscillatorConfig[] = [
  { freq: 440, type: 'sine', gain: 0.8, description: 'Base tone' },
  { freq: 880, type: 'sine', gain: 0.4, description: 'Harmonic' },
  { freq: 1320, type: 'sine', gain: 0.2, description: 'High harmonic' }
];

const TICK_CONFIG = {
  freq: 1000,
  type: 'sine' as OscillatorType,
  gain: 0.1,
  duration: 0.05
};

const REST_BEEP_CONFIG = {
  freq: 700,
  type: 'sine' as OscillatorType,
  gain: 0.2,
  duration: 0.1
};

export const useSound = (): SoundHook => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const ensureContext = (): AudioContext => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  };

  const playBuzzerSound = () => {
    const context = ensureContext();
    const masterGain = context.createGain();
    masterGain.gain.setValueAtTime(3.0, context.currentTime);
    masterGain.connect(context.destination);

    BUZZER_CONFIGS.forEach(({ freq, type, gain }) => {
      const osc = context.createOscillator();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, context.currentTime);

      const gainNode = context.createGain();
      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(gain * 3.0, context.currentTime);
      gainNode.gain.setValueAtTime(gain * 3.0, context.currentTime + 0.8);
      gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.95);

      osc.connect(gainNode);
      gainNode.connect(masterGain);

      osc.start(context.currentTime);
      osc.stop(context.currentTime + 0.95);
    });
  };

  const playRestRingSound = () => {
    const context = ensureContext();
    const masterGain = context.createGain();
    masterGain.gain.setValueAtTime(2.0, context.currentTime);
    masterGain.connect(context.destination);

    REST_RING_CONFIGS.forEach(({ freq, type, gain }) => {
      const osc = context.createOscillator();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, context.currentTime);

      const gainNode = context.createGain();
      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(gain * 2.0, context.currentTime);
      gainNode.gain.setValueAtTime(gain * 2.0, context.currentTime + 1.2);
      gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 1.5);

      osc.connect(gainNode);
      gainNode.connect(masterGain);

      osc.start(context.currentTime);
      osc.stop(context.currentTime + 1.5);
    });
  };

  const playTickSound = () => {
    const context = ensureContext();

    const osc = context.createOscillator();
    osc.type = TICK_CONFIG.type;
    osc.frequency.setValueAtTime(TICK_CONFIG.freq, context.currentTime);

    const gainNode = context.createGain();
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(TICK_CONFIG.gain, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + TICK_CONFIG.duration);

    osc.connect(gainNode);
    gainNode.connect(context.destination);

    osc.start(context.currentTime);
    osc.stop(context.currentTime + TICK_CONFIG.duration);
  };

  const playRestBeepSound = () => {
    const context = ensureContext();

    const osc = context.createOscillator();
    osc.type = REST_BEEP_CONFIG.type;
    osc.frequency.setValueAtTime(REST_BEEP_CONFIG.freq, context.currentTime);

    const gainNode = context.createGain();
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(REST_BEEP_CONFIG.gain, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + REST_BEEP_CONFIG.duration);

    osc.connect(gainNode);
    gainNode.connect(context.destination);

    osc.start(context.currentTime);
    osc.stop(context.currentTime + REST_BEEP_CONFIG.duration);
  };

  return {
    playBuzzerSound,
    playTickSound,
    playRestBeepSound,
    playRestRingSound
  };
};
