import React, { useState, useEffect, useRef } from "react";

interface TimerSettings {
  roundMinutes: number;
  roundSeconds: number;
  restMinutes: number;
}

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label: string;
  disabled?: boolean;
}

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min = 0,
  max = 59,
  label,
  disabled = false
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
    <div className={`text-center relative ${disabled ? 'opacity-50' : ''}`}>
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
          className="w-full text-6xl text-center px-4 py-2 bg-gray-900 border-2 border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:cursor-not-allowed"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col justify-between h-full py-2 px-1">
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
      <div className="text-lg font-semibold text-gray-400 mt-1">{label}</div>
    </div>
  );
};

const Timer: React.FC = () => {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [isResting, setIsResting] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
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

  useEffect(() => {
    audioRef.current = new Audio("/beep.mp3");
    audioRef.current.volume = 1.0;
    return () => {
      if (audioRef.current) {
        audioRef.current = null;
      }
    };
  }, []);

  const playBeep = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/beep.mp3");
      audioRef.current.volume = 1.0;
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(error => {
      console.error("Error playing beep:", error);
    });
  };

  const presetTimes = [5, 6, 7, 8, 10];

  useEffect(() => {
    localStorage.setItem("timerSettings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning && !isTransitioning) {
      intervalId = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 0) {
            playBeep();
            setIsTransitioning(true);
            setTimeout(() => {
              if (!isResting) {
                setIsResting(true);
                setTime(settings.restMinutes * 60);
              } else {
                setIsResting(false);
                setTime(settings.roundMinutes * 60 + settings.roundSeconds);
              }
              setIsTransitioning(false);
            }, 1000);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, isResting, settings, isTransitioning]);

  useEffect(() => {
    if (!isRunning) {
      setTime(settings.roundMinutes * 60 + settings.roundSeconds);
      setIsResting(false);
    }
  }, [settings, isRunning]);

  const handleStartStop = () => {
    if (!isRunning && time === 0) {
      setTime(settings.roundMinutes * 60 + settings.roundSeconds);
      setIsResting(false);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsTransitioning(false);
    setTime(settings.roundMinutes * 60 + settings.roundSeconds);
    setIsResting(false);
  };

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

  if (!isFullScreen) {
    return (
      <button
        onClick={() => setIsFullScreen(true)}
        className="px-6 py-2 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white"
      >
        Open Timer
      </button>
    );
  }

  const [minutes, seconds] = formatTime(time).split(":");

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex flex-col h-screen">
      <div className="w-full h-full p-4 flex flex-col">
        <div className="w-full flex-grow-0">
          <div className="flex justify-between items-center gap-1">
            {presetTimes.map((mins) => (
              <button
                key={mins}
                onClick={() => setPresetTime(mins)}
                disabled={isResting || isRunning}
                className={`flex-1 py-1 rounded-lg font-semibold text-xl transition-all ${
                  settings.roundMinutes === mins
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 hover:bg-blue-200 text-blue-800"
                } ${(isResting || isRunning) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {mins}min
              </button>
            ))}
            <button
              onClick={() => setIsFullScreen(false)}
              className="p-2 w-10 h-10 flex items-center justify-center text-xl font-bold text-white hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center gap-0 min-h-0">
          <h2
            className={`text-3xl font-bold flex-grow-0 mt-4 ${
              isResting ? "text-blue-400" : "text-white"
            }`}
          >
            {isResting ? "Rest Time" : "Round Time"}
          </h2>

          <div className="flex sm:flex-row flex-col items-center justify-center font-mono font-bold text-white leading-none flex-grow -mt-4">
            <div className="text-[min(108vh,48vw)] sm:text-[min(70vh,40vw)]">
              {minutes}
            </div>
            <div className="text-[min(25vh,20vw)] sm:text-[min(70vh,40vw)] sm:mx-4 mx-0 sm:rotate-0 rotate-90 sm:my-0 -my-4">
              :
            </div>
            <div className="text-[min(108vh,48vw)] sm:text-[min(70vh,40vw)]">
              {seconds}
            </div>
          </div>

          <div className="w-full flex-grow-0">
            <div className="grid grid-cols-2 gap-1 w-full max-w-xl mx-auto">
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

            <div className="flex items-stretch justify-between gap-1 w-full max-w-xl mx-auto h-14">
              <div className="flex items-center bg-gray-900 rounded-lg px-3">
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
                  className="w-16 text-2xl text-center bg-transparent text-white border-b-2 border-gray-700 focus:outline-none focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:cursor-not-allowed disabled:opacity-50"
                  min="0"
                />
                <span className="text-lg text-gray-500 ml-2">min rest</span>
              </div>

              <button
                onClick={handleStartStop}
                className={`flex-1 rounded-lg text-2xl font-semibold transition-all ${
                  isRunning
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {isRunning ? "Stop" : "Start"}
              </button>

              <button
                onClick={handleReset}
                className="px-8 rounded-lg text-2xl font-semibold bg-gray-700 hover:bg-gray-600 text-white transition-all"
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
