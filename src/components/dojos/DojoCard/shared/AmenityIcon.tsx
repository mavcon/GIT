import React from 'react';

type AmenityType = 'washroom' | 'changeRooms' | 'showers' | 'lockers';

interface AmenityIconProps {
  type: AmenityType;
  className?: string;
}

const AmenityIcon: React.FC<AmenityIconProps> = ({ type, className = "h-5 w-5" }) => {
  const icons = {
    washroom: (
      <path 
        fillRule="evenodd" 
        d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0h8v12H6V4z" 
        clipRule="evenodd" 
      />
    ),
    changeRooms: (
      <path 
        d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" 
      />
    ),
    showers: (
      <path 
        fillRule="evenodd" 
        d="M5.5 9a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0zM8 10.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" 
        clipRule="evenodd" 
      />
    ),
    lockers: (
      <path 
        fillRule="evenodd" 
        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" 
        clipRule="evenodd" 
      />
    ),
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      {icons[type]}
    </svg>
  );
};

export default AmenityIcon;
