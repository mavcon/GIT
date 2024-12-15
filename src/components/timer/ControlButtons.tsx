import React from 'react';
import { ControlButtonsProps } from '../../types/timer';

export const ControlButtons: React.FC<ControlButtonsProps> = ({
  isRunning,
  time,
  onStartStop,
  onReset
}) => (
  <div className="flex gap-[1vw] flex-1">
    <button
      onClick={onStartStop}
      disabled={time === 0}
      className={`flex-1 h-[6vw] rounded-lg text-[2vw] font-medium uppercase tracking-wider transition-colors disabled:opacity-50 ${
        isRunning
          ? "bg-red-500 hover:bg-red-600 text-white"
          : "bg-[#22C55E] hover:bg-[#16A34A] text-white"
      }`}
    >
      {isRunning ? "STOP" : "START"}
    </button>
    <button
      onClick={onReset}
      disabled={time === 0}
      className="bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-lg w-[6vw] h-[6vw] transition-colors disabled:opacity-50 flex items-center justify-center"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-[3vw] h-[3vw]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
        <path d="M3 3v5h5"/>
      </svg>
    </button>
  </div>
);
