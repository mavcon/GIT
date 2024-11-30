import React from "react";

interface NotificationBellProps {
  count: number;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ count }) => {
  return (
    <button className="btn btn-ghost btn-circle p-0 relative">
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          viewBox="0 0 24 24"
          fill={count > 0 ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {count > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span 
              className="text-base-100 font-bold"
              style={{ 
                fontSize: count > 9 ? '0.7rem' : '0.8rem',
                marginTop: '-4px'
              }}
            >
              {count}
            </span>
          </div>
        )}
      </div>
    </button>
  );
};

export default NotificationBell;
