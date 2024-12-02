import React from 'react';

interface AchievementGridProps {
  count: number;
  color: string;
}

const AchievementGrid: React.FC<AchievementGridProps> = ({ count, color }) => {
  return (
    <div className="grid grid-cols-3 gap-3 p-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="aspect-square rounded-lg flex items-center justify-center relative group"
          style={{ backgroundColor: `${color}20` }}
        >
          <div 
            className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ backgroundColor: `${color}30` }}
          />
          <svg 
            className="w-6 h-6 transition-transform group-hover:scale-110"
            style={{ color: color }}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" 
            />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default AchievementGrid;
