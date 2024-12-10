/**
 * Tournament Timer Component
 *
 * A precise timer component for tournament rounds with the following features:
 * - Accurate timing using requestAnimationFrame
 * - Audio cues at 10 seconds and 0 seconds
 * - Pause/resume functionality with exact timing
 * - Rest period support
 * - Configurable round and rest durations
 * - Preset time buttons for quick setup
 *
 * @requires React
 * @requires audio files: /public/cookedtimer.mp3 and /public/beep.mp3
 */

import React, { useState, useEffect, useRef, useCallback } from "react";

interface TimerSettings {
  /** Duration of round in minutes */
  roundMinutes: number;
  /** Additional seconds for round duration */
  roundSeconds: number;
  /** Duration of rest period in minutes */
  restMinutes: number;
}

interface NumberInputProps {
  /** Current value of the input */
  value: number;
  /** Callback when value changes */
  onChange: (value: number) => void;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Label displayed below the input */
  label: string;
  /** Whether the input is disabled */
  disabled?: boolean;
}

/**
 * Number input component with increment/decrement buttons
 */
const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min = 0,
  max = 59,
  label,
  disabled = false,
}) => {
  const increment = () => {
    if (!disabled) {
      onChange(Math.min(max, value + 1));
    }
  };

  const decrement = () => {
    if (!disabled) {
      onChange(Math.max(min, value - 1));
    }
  };

  return (
    <div className={`text-center relative ${disabled ? "opacity-50" : ""}`}>
      <div className="relative">
        <input
          type="text"
          value={value}
          disabled={disabled}
          onChange={(e) => {
            if (!disabled) {
              const val = parseInt(e.target.value) || 0;
              onChange(Math.min(max, Math.max(min, val)));
            }
          }}
          className="w-full text-6xl text-center px-3 py-1 bg-gray-900 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:cursor-not-allowed"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col justify-between h-full py-1">
          <button
            onClick={increment}
            disabled={disabled}
            className="text-gray-400 hover:text-white focus:outline-none text-lg disabled:cursor-not-allowed"
          >
            ▲
          </button>
          <button
            onClick={decrement}
            disabled={disabled}
            className="text-gray-400 hover:text-white focus:outline-none text-lg disabled:cursor-not-allowed"
          >
            ▼
          </button>
        </div>
      </div>
      <div className="text-lg font-semibold text-gray-400 mt-0.5">{label}</div>
    </div>
  );
};

/**
 * Main Timer component
 *
 * Features:
 * - Precise timing using requestAnimationFrame
 * - Audio cues at specific times
 * - Pause/resume functionality
 * - Rest period support
 * - Settings persistence in localStorage
 */
const Timer: React.FC = () => {
  // State for UI control
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [isResting, setIsResting] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Audio refs
  const beepRef = useRef<HTMLAudioElement>(null);
  const cookedTimerRef = useRef<HTMLAudioElement>(null);

  // Timer refs for precise timing
  const startTimeRef = useRef<number | null>(null);
  const pauseTimeRef = useRef<number | null>(null);
  const totalPausedTimeRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  // Audio state tracking
  const hasPlayedTenSecondBeepRef = useRef<boolean>(false);
  const hasPlayedFinalBeepRef = useRef<boolean>(false);

  // Timer settings with localStorage persistence
  const [settings, setSettings] = useState<TimerSettings>(() => {
    const savedSettings = localStorage.getItem("timerSettings");
    return savedSettings
      ? JSON.parse(savedSettings)
      : {
          roundMinutes: 0,
          roundSeconds: 15,
          restMinutes: 1,
        };
  });

  // Persist settings to localStorage
  useEffect(() => {
    localStorage.setItem("timerSettings", JSON.stringify(settings));
  }, [settings]);

  // Initialize audio elements
  const initializeAudio = useCallback(() => {
    if (cookedTimerRef.current) {
      cookedTimerRef.current.preload = "auto";
      cookedTimerRef.current.load();
    }
    if (beepRef.current) {
      beepRef.current.preload = "auto";
      beepRef.current.load();
    }
  }, []);

  useEffect(() => {
    initializeAudio();
  }, [initializeAudio]);

  // Audio control functions
  const playSound = useCallback((ref: React.RefObject<HTMLAudioElement>) => {
    if (ref.current) {
      ref.current.currentTime = 0;
      ref.current.play().catch(console.error);
    }
  }, []);

  const pauseSound = useCallback((ref: React.RefObject<HTMLAudioElement>) => {
    if (ref.current) {
      ref.current.pause();
    }
  }, []);

  const resumeSound = useCallback((ref: React.RefObject<HTMLAudioElement>) => {
    if (ref.current && ref.current.paused) {
      ref.current.play().catch(console.error);
    }
  }, []);

  const stopAllSounds = useCallback(() => {
    pauseSound(beepRef);
    pauseSound(cookedTimerRef);
  }, [pauseSound]);

  // Main timer update logic
  useEffect(() => {
    const updateTimer = () => {
      if (!isRunning || !startTimeRef.current || isPaused) return;

      const now = Date.now();
      const elapsed = (now - startTimeRef.current - totalPausedTimeRef.current) / 1000;
      const totalSeconds = settings.roundMinutes * 60 + settings.roundSeconds;
      const timeLeft = Math.max(0, totalSeconds - elapsed);

      setTime(Math.ceil(timeLeft));

      // Play cookedTimer.mp3 at 10 seconds
      if (timeLeft <= 10.05 && timeLeft > 9.95 && !hasPlayedTenSecondBeepRef.current) {
        playSound(cookedTimerRef);
        hasPlayedTenSecondBeepRef.current = true;
      }

      // Play final beep exactly at 00:00
      if (timeLeft <= 0.05 && !hasPlayedFinalBeepRef.current) {
        if (beepRef.current) {
          beepRef.current.currentTime = 0;
          beepRef.current.play().catch(console.error);
        }
        hasPlayedFinalBeepRef.current = true;
      }

      if (timeLeft > 0) {
        rafIdRef.current = requestAnimationFrame(updateTimer);
      }
    };

    if (isRunning && !isTransitioning) {
      startTimeRef.current = startTimeRef.current || Date.now();
      rafIdRef.current = requestAnimationFrame(updateTimer);
    }

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isRunning, isPaused, settings, playSound]);

  // Timer control functions
  const handleStartStop = () => {
    if (!isRunning) {
      // Start fresh
      setIsRunning(true);
      setIsPaused(false);
      startTimeRef.current = Date.now();
      totalPausedTimeRef.current = 0;
      hasPlayedTenSecondBeepRef.current = false;
      hasPlayedFinalBeepRef.current = false;
      setTime(settings.roundMinutes * 60 + settings.roundSeconds);
    } else if (!isPaused) {
      // Pause
      setIsPaused(true);
      pauseTimeRef.current = Date.now();
      stopAllSounds();
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    } else {
      // Resume
      setIsPaused(false);
      if (pauseTimeRef.current) {
        totalPausedTimeRef.current += Date.now() - pauseTimeRef.current;
        pauseTimeRef.current = null;
      }
      if (time <= 10) {
        resumeSound(cookedTimerRef); // Resume cookedTimer if paused in last 10 seconds
      }
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setIsTransitioning(false);
    setTime(settings.roundMinutes * 60 + settings.roundSeconds);
    setIsResting(false);
    startTimeRef.current = null;
    pauseTimeRef.current = null;
    totalPausedTimeRef.current = 0;
    hasPlayedTenSecondBeepRef.current = false;
    hasPlayedFinalBeepRef.current = false;
    stopAllSounds();
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }
  };

  // Utility functions
  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const setPresetTime = (minutes: number) => {
    setSettings({
      ...settings,
      roundMinutes: minutes,
      roundSeconds: 0,
    });
    handleReset();
  };

  const getStartButtonText = () => {
    if (!isRunning) return "Start";
    if (!isPaused) return "Pause";
    return "Resume";
  };

  const presetTimes = [5, 6, 7, 8, 10];

  // Render compact view
  if (!isFullScreen) {
    return (
      <>
        <audio id="beep" src="/beep.mp3" ref={beepRef} />
        <audio id="cookedTimer" src="/cookedtimer.mp3" ref={cookedTimerRef} />
        <button
          onClick={() => setIsFullScreen(true)}
          className="px-6 py-2 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white"
        >
          Open Timer
        </button>
      </>
    );
  }

  // Format time for display
  const [minutes, seconds] = formatTime(time).split(":");

  // Render full screen view
  return (
    <div className="fixed inset-0 bg-black z-[9999] flex flex-col h-screen">
      <audio id="beep" src="/beep.mp3" ref={beepRef} />
      <audio id="cookedTimer" src="/cookedtimer.mp3" ref={cookedTimerRef} />
      <div className="w-full h-full p-2 flex flex-col">
        <div className="w-full flex-grow-0">
          <div className="flex justify-between items-center gap-0.5">
            {presetTimes.map((mins) => (
              <button
                key={mins}
                onClick={() => setPresetTime(mins)}
                disabled={isResting || isRunning}
                className={`flex-1 py-0.5 rounded-lg font-semibold text-xl transition-all ${
                  settings.roundMinutes === mins
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 hover:bg-blue-200 text-blue-800"
                } ${
                  isResting || isRunning ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {mins}min
              </button>
            ))}
            <button
              onClick={() => setIsFullScreen(false)}
              className="p-1.5 w-8 h-8 flex items-center justify-center text-xl font-bold text-white hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center min-h-0">
          <div className="flex-1 flex flex-col justify-evenly items-center">
            <h2
              className={`text-3xl sm:text-[min(8vh,8vw)] font-bold ${
                isResting ? "text-blue-400" : "text-white"
              }`}
            >
              {isResting ? "Rest Time" : "Round Time"}
            </h2>

            <div className="flex sm:flex-row flex-col items-center justify-center font-mono font-bold text-white">
              <div className="text-[min(108vh,48vw)] sm:text-[min(70vh,40vw)] leading-[0.8]">
                {minutes}
              </div>
              <div className="text-[min(25vh,20vw)] sm:text-[min(70vh,40vw)] sm:mx-2 mx-0 sm:rotate-0 rotate-90 sm:my-0 -my-2 leading-[0.8]">
                :
              </div>
              <div className="text-[min(108vh,48vw)] sm:text-[min(70vh,40vw)] leading-[0.8]">
                {seconds}
              </div>
            </div>
          </div>

          <div className="w-full flex-grow-0">
            <div className="grid grid-cols-2 gap-0.5 w-full max-w-xl mx-auto mb-1">
              <NumberInput
                value={settings.roundMinutes}
                onChange={(value) =>
                  setSettings({
                    ...settings,
                    roundMinutes: value,
                  })
                }
                min={0}
                label="MIN"
                disabled={isResting || isRunning}
              />
              <NumberInput
                value={settings.roundSeconds}
                onChange={(value) =>
                  setSettings({
                    ...settings,
                    roundSeconds: value,
                  })
                }
                min={0}
                max={59}
                label="SEC"
                disabled={isResting || isRunning}
              />
            </div>

            <div className="flex items-stretch justify-between gap-0.5 w-full max-w-xl mx-auto h-[84px]">
              <div className="flex flex-col bg-gray-900 rounded-lg px-2 w-[180px]">
                <div className="text-lg font-semibold text-gray-400 text-center mt-1">Rest Interval (mins)</div>
                <div className="flex items-center justify-between flex-1">
                  <button
                    onClick={() => !isRunning && setSettings({
                      ...settings,
                      restMinutes: Math.max(0, settings.restMinutes - 1),
                    })}
                    disabled={isRunning}
                    className="text-gray-400 hover:text-white focus:outline-none text-xl disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {"<"}
                  </button>
                  <input
                    type="number"
                    value={settings.restMinutes}
                    disabled={isRunning}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        restMinutes: Math.max(0, parseInt(e.target.value) || 0),
                      })
                    }
                    className="w-14 text-2xl text-center bg-transparent text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:cursor-not-allowed disabled:opacity-50"
                    min="0"
                  />
                  <button
                    onClick={() => !isRunning && setSettings({
                      ...settings,
                      restMinutes: settings.restMinutes + 1,
                    })}
                    disabled={isRunning}
                    className="text-gray-400 hover:text-white focus:outline-none text-xl disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {">"}
                  </button>
                </div>
              </div>

              <button
                onClick={handleStartStop}
                className={`flex-1 rounded-lg text-2xl font-semibold transition-all ${
                  isRunning && !isPaused
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {getStartButtonText()}
              </button>

              <button
                onClick={handleReset}
                className="px-6 rounded-lg text-2xl font-semibold bg-gray-700 hover:bg-gray-600 text-white transition-all"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;
