import { useState, useEffect } from 'react';
import { useSound } from './useSound';
import { TimerSettings } from '../types/timer';

interface UseTimerProps {
  initialSettings?: TimerSettings;
}

export const useTimer = ({ initialSettings }: UseTimerProps = {}) => {
  const [time, setTime] = useState<number>(0);
  const [isResting, setIsResting] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [settings, setSettings] = useState<TimerSettings>(() => {
    const savedSettings = localStorage.getItem("timerSettings");
    return savedSettings
      ? JSON.parse(savedSettings)
      : initialSettings ?? {
          roundMinutes: 5,
          roundSeconds: 0,
          restMinutes: 1
        };
  });

  const { playBuzzerSound, playTickSound, playRestBeepSound, playRestRingSound } = useSound();
  const isLastTenSeconds = time <= 10 && time > 0;

  useEffect(() => {
    localStorage.setItem("timerSettings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    let intervalId: number;

    if (isRunning && !isTransitioning) {
      intervalId = window.setInterval(() => {
        setTime((prevTime) => {
          // Play sounds for countdown
          if (!isResting && [11, 10, 9, 8, 7, 6, 5, 4, 3, 2].includes(prevTime)) {
            playTickSound();
          } else if (isResting && [11, 10, 9, 8, 7, 6, 5, 4, 3, 2].includes(prevTime)) {
            playRestBeepSound();
          }

          // Play end sounds
          if (prevTime === 1) {
            if (!isResting) {
              playBuzzerSound();
              setIsTransitioning(true);
              setTimeout(() => {
                // If rest time is 0, loop back to round time
                if (settings.restMinutes === 0) {
                  setTime(settings.roundMinutes * 60 + settings.roundSeconds);
                } else {
                  setIsResting(true);
                  setTime(Math.round(settings.restMinutes * 60));
                }
                setIsTransitioning(false);
              }, 950); // Just before buzzer ends
            } else {
              playRestRingSound();
              setIsTransitioning(true);
              setTimeout(() => {
                setIsResting(false);
                setTime(settings.roundMinutes * 60 + settings.roundSeconds);
                setIsTransitioning(false);
              }, 1500); // After rest ring sound ends
            }
          }

          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [isRunning, isResting, settings, isTransitioning, playBuzzerSound, playTickSound, playRestBeepSound, playRestRingSound]);

  // Only initialize time when settings change and we're not running
  useEffect(() => {
    if (!isRunning && !isResting && time === 0) {
      setTime(settings.roundMinutes * 60 + settings.roundSeconds);
    }
  }, [settings]);

  const start = () => {
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setIsTransitioning(false);
    setTime(settings.roundMinutes * 60 + settings.roundSeconds);
    setIsResting(false);
  };

  const setPresetTime = (minutes: number) => {
    setSettings(prev => ({
      ...prev,
      roundMinutes: minutes,
      roundSeconds: 0
    }));
    setTime(minutes * 60);
    setIsResting(false);
  };

  const adjustTime = (type: 'minutes' | 'seconds', increment: boolean) => {
    if (isRunning) return;

    setSettings(prev => {
      const newSettings = { ...prev };
      if (type === 'minutes') {
        newSettings.roundMinutes = Math.max(0, Math.min(99, prev.roundMinutes + (increment ? 1 : -1)));
      } else {
        newSettings.roundSeconds = Math.max(0, Math.min(59, prev.roundSeconds + (increment ? 1 : -1)));
      }
      return newSettings;
    });

    // Update time immediately when adjusting
    if (!isResting) {
      setTime(prev => {
        if (type === 'minutes') {
          const newMinutes = Math.max(0, Math.min(99, Math.floor(prev / 60) + (increment ? 1 : -1)));
          return newMinutes * 60 + (prev % 60);
        } else {
          const newSeconds = Math.max(0, Math.min(59, (prev % 60) + (increment ? 1 : -1)));
          return Math.floor(prev / 60) * 60 + newSeconds;
        }
      });
    }
  };

  const updateTime = (type: 'minutes' | 'seconds', value: string) => {
    if (isRunning) return;

    const numValue = parseInt(value) || 0;
    setSettings(prev => ({
      ...prev,
      [type === 'minutes' ? 'roundMinutes' : 'roundSeconds']:
        type === 'minutes' ? Math.min(99, Math.max(0, numValue)) : Math.min(59, Math.max(0, numValue))
    }));

    // Update time immediately when typing
    if (!isResting) {
      setTime(prev => {
        if (type === 'minutes') {
          return (Math.min(99, Math.max(0, numValue)) * 60) + (prev % 60);
        } else {
          return (Math.floor(prev / 60) * 60) + Math.min(59, Math.max(0, numValue));
        }
      });
    }
  };

  const adjustRestTime = (increment: boolean) => {
    if (isRunning) return;
    setSettings(prev => ({
      ...prev,
      restMinutes: Math.max(0, Math.round((prev.restMinutes + (increment ? 0.5 : -0.5)) * 2) / 2)
    }));
  };

  const updateRestTime = (value: string) => {
    if (isRunning) return;
    const numValue = parseFloat(value) || 0;
    setSettings(prev => ({
      ...prev,
      restMinutes: Math.max(0, Math.round(numValue * 2) / 2)
    }));
  };

  return {
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
  };
};
