import React from 'react';

interface ActionButtonProps {
  onClick: (e: React.MouseEvent) => void;
  title: string;
  icon: string;
  variant?: 'primary' | 'error' | 'ghost';
  isActive?: boolean;
}

const icons = {
  chat: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
  follow: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
  unfollow: "M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6",
  block: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
};

const getButtonClass = (variant: string, isActive: boolean) => {
  const baseClass = 'btn h-7 w-7 min-h-0 p-0';
  const variantClass = isActive
    ? `btn-${variant} hover:btn-ghost`
    : `btn-ghost hover:btn-${variant}`;
  return `${baseClass} ${variantClass}`;
};

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  title,
  icon,
  variant = 'ghost',
  isActive = false,
}) => (
  <button
    onClick={onClick}
    className={getButtonClass(variant, isActive)}
    title={title}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-3.5 w-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={icons[icon as keyof typeof icons]}
      />
    </svg>
  </button>
);

export default ActionButton;
