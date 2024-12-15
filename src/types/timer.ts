import { RefObject } from 'react';

export interface TimerSettings {
  roundMinutes: number;
  roundSeconds: number;
  restMinutes: number;
}

export interface TimerControlsProps {
  direction: 'left' | 'right';
  onIncrement: () => void;
  onDecrement: () => void;
  disabled: boolean;
}

export interface TimerDisplayProps {
  value: number;
  isEditing: boolean;
  onEdit: (value: string) => void;
  onEditStart: () => void;
  onEditEnd: () => void;
  isRunning: boolean;
  inputRef: RefObject<HTMLInputElement>;
  max: number;
  isResting: boolean;
  isFlashing: boolean;
  isSeconds?: boolean;
}

export interface PresetTimesProps {
  presetTimes: number[];
  currentMinutes: number;
  isDisabled: boolean;
  onSelect: (minutes: number) => void;
}

export interface RestTimeControlsProps {
  value: number;
  isDisabled: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onChange: (value: string) => void;
}

export interface ControlButtonsProps {
  isRunning: boolean;
  time: number;
  onStartStop: () => void;
  onReset: () => void;
}

// Sound-related types
export interface OscillatorConfig {
  freq: number;
  type: OscillatorType;
  gain: number;
}

export type OscillatorDescription =
  | 'Deep bass'
  | 'Mid tone'
  | 'Sharp high'
  | 'Extra bite'
  | 'Base tone'
  | 'Harmonic'
  | 'High harmonic';

export interface BuzzerOscillatorConfig extends OscillatorConfig {
  description: OscillatorDescription;
}

export interface SoundHook {
  playBuzzerSound: () => void;
  playTickSound: () => void;
  playRestBeepSound: () => void;
  playRestRingSound: () => void;
}
