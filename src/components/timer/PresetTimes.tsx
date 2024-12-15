import React from 'react';
import { PresetTimesProps } from '../../types/timer';

export const PresetTimes: React.FC<PresetTimesProps> = ({
  presetTimes,
  currentMinutes,
  isDisabled,
  onSelect,
}) => {
  return (
    <div className="flex-1 flex justify-between items-center gap-[1vw]">
      {presetTimes.map((mins) => (
        <button
          key={mins}
          onClick={() => onSelect(mins)}
          disabled={isDisabled}
          className={`flex-1 h-[5vw] rounded-lg text-[2vw] font-medium transition-all ${
            currentMinutes === mins
              ? "bg-blue-600 text-white"
              : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
          } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {mins}m
        </button>
      ))}
    </div>
  );
};
