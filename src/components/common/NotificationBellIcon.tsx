import React from 'react';

interface NotificationBellIconProps {
  unreadCount: number;
}

export const NotificationBellIcon: React.FC<NotificationBellIconProps> = ({ unreadCount }) => {
  const displayCount = unreadCount > 99 ? "99+" : unreadCount.toString();

  return (
    <div className="relative w-7 h-7">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
        viewBox="0 0 24 24"
        fill={unreadCount > 0 ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
      {unreadCount > 0 && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: "translateY(-1px)",
          }}
        >
          <span
            className="text-base-100 font-bold text-center"
            style={{
              fontSize: displayCount.length > 2 ? "0.65rem" : "0.75rem",
              lineHeight: 1,
              minWidth: displayCount.length > 1 ? "14px" : "12px",
              letterSpacing: "-0.5px",
            }}
          >
            {displayCount}
          </span>
        </div>
      )}
    </div>
  );
};

export default NotificationBellIcon;
