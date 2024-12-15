import React, { useState, useRef } from "react";
import { TimerControls } from "../../components/timer/TimerControls";
import { TimerDisplay } from "../../components/timer/TimerDisplay";
import { PresetTimes } from "../../components/timer/PresetTimes";
import { RestTimeControls } from "../../components/timer/RestTimeControls";
import { ControlButtons } from "../../components/timer/ControlButtons";
import { useTimer } from "../../hooks/useTimer";

const Timer: React.FC = () => {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [isEditingMinutes, setIsEditingMinutes] = useState<boolean>(false);
  const [isEditingSeconds, setIsEditingSeconds] = useState<boolean>(false);
  const minutesInputRef = useRef<HTMLInputElement>(null);
  const secondsInputRef = useRef<HTMLInputElement>(null);

  const {
    time,
    isResting,
    isRunning,
    isLastTenSeconds,
    settings,
    start,
    pause,
    reset,
    setPresetTime,
    adjustTime,
    updateTime,
    adjustRestTime,
    updateRestTime
  } = useTimer();

  const presetTimes = [4, 5, 6, 7, 8, 10];

  const handleStartStop = () => {
    if (isRunning) {
      pause();
    } else {
      start();
    }
  };

  if (!isFullScreen) {
    return (
      <button
        onClick={() => setIsFullScreen(true)}
        className="px-6 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all"
      >
        Open Timer
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#0F172A] z-[9999]">
      <div className="w-full h-full flex flex-col justify-between p-[1vw]">
        <div>
          <div className="flex justify-between items-center gap-[1vw]">
            <PresetTimes
              presetTimes={presetTimes}
              currentMinutes={settings.roundMinutes}
              isDisabled={isResting || isRunning}
              onSelect={setPresetTime}
            />
            <button
              onClick={() => setIsFullScreen(false)}
              className="h-[5vw] w-[5vw] text-lg font-bold text-white hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all bg-gray-800/50 flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          {/* Timer Display */}
          <div className="text-center animate-slide-up mb-2">
            <div className={`inline-block px-4 py-1 text-[3.4vw] font-medium mb-8 transition-colors ${
              isResting
                ? "text-blue-300"
                : "text-white"
            }`}>
              {isResting ? "REST TIME" : "ROUND TIME"}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col justify-between h-[22vw] my-1">
                <button
                  onClick={() => adjustTime('minutes', true)}
                  disabled={isRunning}
                  className="text-[3.4vw] text-gray-600 hover:text-white transition-colors disabled:opacity-50 leading-[0.6]"
                >
                  ▲
                </button>
                <button
                  onClick={() => adjustTime('minutes', false)}
                  disabled={isRunning}
                  className="text-[3.4vw] text-gray-600 hover:text-white transition-colors disabled:opacity-50 leading-[0.6]"
                >
                  ▼
                </button>
              </div>

              <div className="font-mono text-[34vw] font-bold leading-[0.6] flex items-center justify-center flex-grow">
                <div className="flex-grow flex justify-end">
                  {isEditingMinutes && !isRunning ? (
                    <input
                      ref={minutesInputRef}
                      type="number"
                      value={Math.floor(time / 60)}
                      onChange={(e) => updateTime('minutes', e.target.value)}
                      onBlur={() => setIsEditingMinutes(false)}
                      className={`bg-transparent text-right outline-none font-mono text-[34vw] font-bold leading-[0.6] p-0 m-0 box-content h-[1em] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
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
                <span className={`mx-[1vw] ${isResting ? 'text-blue-300' : 'text-white'}`}>:</span>
                <div className="flex-grow">
                  {isEditingSeconds && !isRunning ? (
                    <input
                      ref={secondsInputRef}
                      type="number"
                      value={time % 60}
                      onChange={(e) => updateTime('seconds', e.target.value)}
                      onBlur={() => setIsEditingSeconds(false)}
                      className={`bg-transparent text-left outline-none font-mono text-[34vw] font-bold leading-[0.6] p-0 m-0 box-content h-[1em] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
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

              <div className="flex flex-col justify-between h-[22vw] my-1">
                <button
                  onClick={() => adjustTime('seconds', true)}
                  disabled={isRunning}
                  className="text-[3.4vw] text-gray-600 hover:text-white transition-colors disabled:opacity-50 leading-[0.6]"
                >
                  ▲
                </button>
                <button
                  onClick={() => adjustTime('seconds', false)}
                  disabled={isRunning}
                  className="text-[3.4vw] text-gray-600 hover:text-white transition-colors disabled:opacity-50 leading-[0.6]"
                >
                  ▼
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Control Buttons and Rest Time Input */}
        <div className="flex gap-[1vw] animate-slide-up [animation-delay:300ms]">
          <RestTimeControls
            value={settings.restMinutes}
            isDisabled={isRunning}
            onIncrement={() => adjustRestTime(true)}
            onDecrement={() => adjustRestTime(false)}
            onChange={updateRestTime}
          />
          <ControlButtons
            isRunning={isRunning}
            time={time}
            onStartStop={handleStartStop}
            onReset={reset}
          />
        </div>
      </div>
    </div>
  );
};

export default Timer;
