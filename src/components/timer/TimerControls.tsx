import React from 'react';
import { TimerControlsProps } from '../../types/timer';

export const TimerControls: React.FC<TimerControlsProps> = ({
  direction,
  onIncrement,
  onDecrement,
  disabled
}) => (
  <div className="flex flex-col justify-between h-[18.2vw] sm:h-[20.8vw] my-2">
    <button
      onClick={onIncrement}
      disabled={disabled}
      className="text-[3vw] sm:text-[3.5vw] text-gray-700 hover:text-gray-400 transition-colors disabled:opacity-50 leading-none"
    >
      ▲
    </button>
    <button
      onClick={onDecrement}
      disabled={disabled}
      className="text-[3vw] sm:text-[3.5vw] text-gray-700 hover:text-gray-400 transition-colors disabled:opacity-50 leading-none"
    >
      ▼
    </button>
  </div>
);
