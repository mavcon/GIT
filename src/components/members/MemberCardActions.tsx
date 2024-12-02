import React from 'react';
import { Member } from '../../types/member';

interface ConnectionState {
  isFollowing: boolean;
  isBlocked: boolean;
  isBlockedBy: boolean;
}

interface MemberCardActionsProps {
  member: Member;
  currentUserId: string;
  connectionState: ConnectionState;
  onChatClick: (memberId: string) => void;
  onFollowClick: (member: Member) => void;
  onBlockClick: (member: Member) => void;
}

const MemberCardActions: React.FC<MemberCardActionsProps> = ({
  member,
  currentUserId,
  connectionState,
  onChatClick,
  onFollowClick,
  onBlockClick,
}) => {
  if (member.id === currentUserId) return null;

  return (
    <div className="flex items-center gap-2">
      {/* Chat Button */}
      <button
        onClick={() => onChatClick(member.id)}
        className="btn btn-ghost btn-sm btn-circle hover:scale-110 transition-transform"
        title="Chat"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
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
      </button>

      {/* Follow/Unfollow Button */}
      <button
        onClick={() => onFollowClick(member)}
        className={`btn btn-sm btn-circle transition-all ${
          connectionState.isFollowing
            ? "btn-primary hover:btn-ghost"
            : "btn-ghost hover:btn-primary"
        }`}
        title={connectionState.isFollowing ? "Unfollow" : "Follow"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={
              connectionState.isFollowing
                ? "M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"
                : "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            }
          />
        </svg>
      </button>

      {/* Block/Unblock Button */}
      <button
        onClick={() => onBlockClick(member)}
        className={`btn btn-sm btn-circle transition-all ${
          connectionState.isBlocked
            ? "btn-error hover:btn-ghost"
            : "btn-ghost hover:btn-error"
        }`}
        title={connectionState.isBlocked ? "Unblock" : "Block"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
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
      </button>
    </div>
  );
};

export default MemberCardActions;
