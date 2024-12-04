import React from "react";

export interface MemberActionsProps {
  isFollowing: boolean;
  isBlocked: boolean;
  onFollow: () => void;
  onUnfollow: () => void;
  onBlock: () => void;
  onUnblock: () => void;
  onChat: () => void;
}

const MemberActions: React.FC<MemberActionsProps> = ({
  isFollowing,
  isBlocked,
  onFollow,
  onUnfollow,
  onBlock,
  onUnblock,
  onChat,
}) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-center gap-4">
          {/* Chat Button */}
          <button
            onClick={onChat}
            className="btn btn-primary"
            disabled={isBlocked}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            Chat
          </button>

          {/* Follow/Unfollow Button */}
          <button
            onClick={isFollowing ? onUnfollow : onFollow}
            className={`btn ${isFollowing ? "btn-secondary" : "btn-primary"}`}
            disabled={isBlocked}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isFollowing
                    ? "M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"
                    : "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                }
              />
            </svg>
            {isFollowing ? "Unfollow" : "Follow"}
          </button>

          {/* Block/Unblock Button */}
          <button
            onClick={isBlocked ? onUnblock : onBlock}
            className={`btn ${isBlocked ? "btn-error" : "btn-ghost"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
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
            {isBlocked ? "Unblock" : "Block"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberActions;
