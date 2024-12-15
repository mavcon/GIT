import React from 'react';

interface TimerDisplayProps {
  isResting: boolean;
  isRunning: boolean;
  isLastTenSeconds: boolean;
  time: number;
  isEditingMinutes: boolean;
  isEditingSeconds: boolean;
  minutesInputRef: React.RefObject<HTMLInputElement>;
  secondsInputRef: React.RefObject<HTMLInputElement>;
  onMinutesEdit: (value: string) => void;
  onSecondsEdit: (value: string) => void;
  setIsEditingMinutes: (value: boolean) => void;
  setIsEditingSeconds: (value: boolean) => void;
  onAdjustTime: (type: 'minutes' | 'seconds', increase: boolean) => void;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  isResting,
  isRunning,
  isLastTenSeconds,
  time,
  isEditingMinutes,
  isEditingSeconds,
  minutesInputRef,
  secondsInputRef,
  onMinutesEdit,
  onSecondsEdit,
  setIsEditingMinutes,
  setIsEditingSeconds,
  onAdjustTime,
}) => {
  return (
    <div className="text-center mb-2">
      <div className={`text-center uppercase tracking-wider text-sm font-medium mb-4 ${
        isResting ? "text-blue-300" : "text-white"
      }`}>
        {isResting ? "Rest Time" : "Round Time"}
      </div>
      <div className="relative flex items-center justify-center px-12">
        {/* Left arrows */}
        <div className="absolute left-0 flex flex-col justify-between h-full py-8">
          <button
            onClick={() => onAdjustTime('minutes', true)}
            disabled={isRunning}
            className="text-2xl text-gray-600 hover:text-white transition-colors disabled:opacity-50 leading-none"
          >
            ▲
          </button>
          <button
            onClick={() => onAdjustTime('minutes', false)}
            disabled={isRunning}
            className="text-2xl text-gray-600 hover:text-white transition-colors disabled:opacity-50 leading-none"
          >
            ▼
          </button>
        </div>

        {/* Timer Display */}
        <div className="font-mono text-[25vh] font-light leading-none flex items-center tracking-[0.3em] -mr-[0.3em]">
          <div className="flex items-center">
            {isEditingMinutes && !isRunning ? (
              <input
                ref={minutesInputRef}
                type="number"
                value={Math.floor(time / 60)}
                onChange={(e) => onMinutesEdit(e.target.value)}
                onBlur={() => setIsEditingMinutes(false)}
                className={`w-[25vh] bg-transparent text-center outline-none font-mono text-[25vh] font-light leading-none p-0 m-0 box-content h-[1em] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                  isResting ? 'text-blue-300' : 'text-white'
                }`}
                min="0"
                max={99}
                autoFocus
              />
            ) : (
              <span
                onClick={() => !isRunning && setIsEditingMinutes(true)}
                className={`cursor-pointer select-none ${
                  isResting ? 'text-blue-300' : 'text-white'
                }`}
              >
                {Math.floor(time / 60).toString().padStart(2, '0')}
              </span>
            )}
          </div>
          <span className={`flex items-center self-center mx-4 -mt-8 ${isResting ? 'text-blue-300' : 'text-white'}`}>:</span>
          <div className="flex items-center">
            {isEditingSeconds && !isRunning ? (
              <input
                ref={secondsInputRef}
                type="number"
                value={time % 60}
                onChange={(e) => onSecondsEdit(e.target.value)}
                onBlur={() => setIsEditingSeconds(false)}
                className={`w-[25vh] bg-transparent text-center outline-none font-mono text-[25vh] font-light leading-none p-0 m-0 box-content h-[1em] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                  isResting ? 'text-blue-300' : 'text-white'
                }`}
                min="0"
                max={59}
                autoFocus
              />
            ) : (
              <span
                onClick={() => !isRunning && setIsEditingSeconds(true)}
                className={`cursor-pointer select-none ${
                  isLastTenSeconds ? 'animate-flash' : ''
                } ${isResting ? 'text-blue-300' : 'text-white'}`}
              >
                {(time % 60).toString().padStart(2, '0')}
              </span>
            )}
          </div>
        </div>

        {/* Right arrows */}
        <div className="absolute right-0 flex flex-col justify-between h-full py-8">
          <button
            onClick={() => onAdjustTime('seconds', true)}
            disabled={isRunning}
            className="text-2xl text-gray-600 hover:text-white transition-colors disabled:opacity-50 leading-none"
          >
            ▲
          </button>
          <button
            onClick={() => onAdjustTime('seconds', false)}
            disabled={isRunning}
            className="text-2xl text-gray-600 hover:text-white transition-colors disabled:opacity-50 leading-none"
          >
            ▼
          </button>
        </div>
      </div>
    </div>
  );
};
