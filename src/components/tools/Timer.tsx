import React, { useState, useEffect, useRef, useCallback } from "react";

interface TimerSettings {
  roundMinutes: number;
  roundSeconds: number;
  restMinutes: number;
}

const Timer: React.FC = () => {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isResting, setIsResting] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [settings, setSettings] = useState<TimerSettings>(() => {
    const savedSettings = localStorage.getItem("timerSettings");
    return savedSettings
      ? JSON.parse(savedSettings)
      : {
          roundMinutes: 5,
          roundSeconds: 0,
          restMinutes: 1,
        };
  });

  const rafIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number | null>(null);
  const totalPausedTimeRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const warningAudioRef = useRef<HTMLAudioElement | null>(null);

  const playBeep = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  }, []);

  const playWarning = useCallback(() => {
    if (warningAudioRef.current) {
      warningAudioRef.current.currentTime = 0;
      warningAudioRef.current.play();
    }
  }, []);

  useEffect(() => {
    audioRef.current = new Audio("/beep.mp3");
    warningAudioRef.current = new Audio("/cookedtimer.mp3");
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (warningAudioRef.current) {
        warningAudioRef.current.pause();
        warningAudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("timerSettings", JSON.stringify(settings));
  }, [settings]);

  const startTimer = useCallback(() => {
    if (!isRunning && !isPaused) {
      setIsRunning(true);
      startTimeRef.current = Date.now();
      totalPausedTimeRef.current = 0;
    } else if (isPaused) {
      setIsPaused(false);
      if (pausedTimeRef.current) {
        totalPausedTimeRef.current += Date.now() - pausedTimeRef.current;
      }
    }
  }, [isRunning, isPaused]);

  const pauseTimer = useCallback(() => {
    if (isRunning && !isPaused) {
      setIsPaused(true);
      pausedTimeRef.current = Date.now();
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (warningAudioRef.current) {
        warningAudioRef.current.pause();
      }
    }
  }, [isRunning, isPaused]);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setIsResting(false);
    setTime(0);
    startTimeRef.current = null;
    pausedTimeRef.current = null;
    totalPausedTimeRef.current = 0;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (warningAudioRef.current) {
      warningAudioRef.current.pause();
      warningAudioRef.current.currentTime = 0;
    }
  }, []);

  const updateTimer = useCallback(() => {
    if (startTimeRef.current === null) return;

    const currentTime = Date.now();
    const elapsedTime = currentTime - startTimeRef.current - totalPausedTimeRef.current;
    const totalSeconds = isResting
      ? settings.restMinutes * 60 * 1000
      : (settings.roundMinutes * 60 + settings.roundSeconds) * 1000;
    const remainingTime = Math.max(0, totalSeconds - elapsedTime);

    setTime(remainingTime);

    if (remainingTime <= 0) {
      playBeep();
      if (isResting || isTransitioning) {
        resetTimer();
      } else {
        setIsTransitioning(true);
        setTimeout(() => {
          setIsResting(true);
          setIsTransitioning(false);
          startTimeRef.current = Date.now();
          totalPausedTimeRef.current = 0;
        }, 1000);
      }
    } else if (remainingTime <= 10000 && remainingTime > 9900) {
      playWarning();
    }

    if (remainingTime > 0) {
      rafIdRef.current = requestAnimationFrame(updateTimer);
    }
  }, [isResting, settings, playBeep, playWarning, resetTimer, isTransitioning]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      rafIdRef.current = requestAnimationFrame(updateTimer);
    }
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isRunning, isPaused, updateTimer]);

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handlePresetClick = (minutes: number) => {
    setSettings((prev) => ({ ...prev, roundMinutes: minutes, roundSeconds: 0 }));
    resetTimer();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-6xl font-bold text-center mb-8 font-mono">
          {formatTime(time)}
        </div>
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={isRunning ? pauseTimer : startTimer}
            className={`px-6 py-2 rounded-lg text-white font-semibold ${
              isRunning && !isPaused
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isRunning && !isPaused ? "Pause" : "Start"}
          </button>
          <button
            onClick={resetTimer}
            className="px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold"
          >
            Reset
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Round Time
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={settings.roundMinutes}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    roundMinutes: Math.max(0, parseInt(e.target.value) || 0),
                  }))
                }
                className="w-20 px-3 py-2 border rounded-lg"
                min="0"
              />
              <span className="py-2">:</span>
              <input
                type="number"
                value={settings.roundSeconds}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    roundSeconds: Math.max(0, Math.min(59, parseInt(e.target.value) || 0)),
                  }))
                }
                className="w-20 px-3 py-2 border rounded-lg"
                min="0"
                max="59"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rest Time (minutes)
            </label>
            <input
              type="number"
              value={settings.restMinutes}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  restMinutes: Math.max(0, parseInt(e.target.value) || 0),
                }))
              }
              className="w-20 px-3 py-2 border rounded-lg"
              min="0"
            />
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Presets
          </label>
          <div className="flex flex-wrap gap-2">
            {[5, 6, 7, 8, 10].map((minutes) => (
              <button
                key={minutes}
                onClick={() => handlePresetClick(minutes)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                {minutes}:00
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;
