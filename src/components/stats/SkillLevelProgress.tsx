import React from 'react';

interface SkillLevelProgressProps {
  level: number;
  maxLevel: number;
  color: string;
}

const SkillLevelProgress: React.FC<SkillLevelProgressProps> = ({ level, maxLevel, color }) => {
  const percentage = (level / maxLevel) * 100;
  const size = 140;
  const strokeWidth = 8;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Progress Circle */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90">
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-base-300/30"
          />
          {/* Progress circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
            style={{ 
              filter: `drop-shadow(0 0 6px ${color}40)`,
            }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-base-content">
            Level {level}
          </span>
          <span className="text-sm text-base-content/70">
            {Math.round(percentage)}% Complete
          </span>
        </div>
      </div>

      {/* Level dots */}
      <div className="flex gap-3 mt-6 mb-2 px-4">
        {Array.from({ length: maxLevel }).map((_, i) => (
          <div
            key={i}
            className={`transition-all duration-300 rounded-full ${
              i < level ? 'scale-100' : 'scale-75 opacity-50'
            }`}
            style={{ 
              width: '8px',
              height: '8px',
              backgroundColor: i < level ? color : 'hsl(var(--b3))',
              boxShadow: i < level ? `0 0 8px ${color}60` : 'none',
              transform: i < level ? 'scale(1)' : 'scale(0.75)',
            }}
          />
        ))}
      </div>

      {/* Level info */}
      <div className="text-sm text-base-content/70 mt-2 text-center">
        <div className="font-medium text-base-content">
          {maxLevel - level} levels remaining
        </div>
        <div className="text-xs mt-1">
          Next level: {level + 1} / {maxLevel}
        </div>
      </div>

      {/* Requirements section */}
      <div className="mt-6 w-full">
        <div className="bg-base-300/10 rounded-lg p-4">
          <div className="font-medium text-base-content mb-3">
            Requirements for Level {level + 1}:
          </div>
          <div className="space-y-3">
            <RequirementItem
              color={color}
              text="Complete training sessions"
              progress={48}
              target={100}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <RequirementItem
              color={color}
              text="Achieve personal records"
              progress={15}
              target={30}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <RequirementItem
              color={color}
              text="Total training hours"
              progress={86}
              target={200}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface RequirementItemProps {
  color: string;
  text: string;
  progress: number;
  target: number;
  icon: React.ReactNode;
}

const RequirementItem: React.FC<RequirementItemProps> = ({ color, text, progress, target, icon }) => {
  const percentage = Math.min((progress / target) * 100, 100);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="text-base-content/70">{icon}</div>
          <span className="text-base-content/90">{text}</span>
        </div>
        <span className="text-base-content/70 font-medium">{progress} / {target}</span>
      </div>
      <div className="h-2 bg-base-300/30 rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}40`
          }}
        />
      </div>
    </div>
  );
};

export default SkillLevelProgress;
