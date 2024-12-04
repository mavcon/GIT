import React from 'react';

const BlockedProfileCard: React.FC = () => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-error opacity-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        </div>
        <h2 className="text-center mt-4 text-lg font-semibold text-base-content/70">
          This profile is not available
        </h2>
        <p className="text-center text-sm text-base-content/50">
          You may have been blocked or the user may have blocked you
        </p>
      </div>
    </div>
  );
};

export default BlockedProfileCard;
