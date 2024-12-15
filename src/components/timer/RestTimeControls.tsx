import React from 'react';
import { RestTimeControlsProps } from '../../types/timer';

const formatRestTime = (minutes: number): string => {
  if (minutes < 1) {
    return `${minutes * 60}s`;
  }
  return minutes % 1 === 0 ? `${minutes}m` : `${minutes}m`;
};

const parseRestTime = (value: string): string => {
  const numericValue = value.replace(/[ms]/g, '');
  if (value.endsWith('s')) {
    return (parseInt(numericValue) / 60).toString();
  }
  return numericValue;
};

export const RestTimeControls: React.FC<RestTimeControlsProps> = ({
  value,
  isDisabled,
  onIncrement,
  onDecrement,
  onChange,
}) => {
  const handleIncrement = () => {
    const newValue = Math.round((value + 0.5) * 2) / 2;
    onChange(newValue.toString());
  };

  const handleDecrement = () => {
    const newValue = Math.max(0.5, Math.round((value - 0.5) * 2) / 2);
    onChange(newValue.toString());
  };

  return (
    <div className="bg-gray-800/50 rounded-lg flex items-center h-[6vw] gap-[1vw] px-[1vw]">
      <button
        onClick={handleIncrement}
        disabled={isDisabled}
        className="text-xl text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed leading-none"
      >
        ▲
      </button>
      <input
        type="text"
        value={formatRestTime(value)}
        disabled={isDisabled}
        onChange={(e) => onChange(parseRestTime(e.target.value))}
        className="w-12 text-lg text-center bg-transparent text-white focus:outline-none transition-colors disabled:opacity-50 leading-none"
      />
      <button
        onClick={handleDecrement}
        disabled={isDisabled}
        className="text-xl text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed leading-none"
      >
        ▼
      </button>
    </div>
  );
};
