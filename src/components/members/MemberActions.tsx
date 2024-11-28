import React, { useState } from "react";
import { Member, Connection } from "../../types/member";
import Toast from "../common/Toast";

interface MemberActionsProps {
  currentUserId: string;
  member: Member;
  connections: Connection[];
  onFollow: () => void;
  onUnfollow: () => void;
  onBlock: () => void;
  onUnblock: () => void;
  onChat: () => void;
}

const MemberActions: React.FC<MemberActionsProps> = ({
  currentUserId,
  member,
  connections,
  onFollow,
  onUnfollow,
  onBlock,
  onUnblock,
  onChat,
}) => {
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isBlockLoading, setIsBlockLoading] = useState(false);

  const isFollowing = connections.some(
    (conn) => conn.userId === member.id && conn.connectionType === "following"
  );

  const isBlocked = connections.some(
    (conn) => conn.userId === member.id && conn.connectionType === "blocked"
  );

  const handleFollow = async () => {
    setIsFollowLoading(true);
    try {
      if (isFollowing) {
        await onUnfollow();
        setToast({
          message: `Unfollowed ${member.username}`,
          type: "info",
        });
      } else {
        await onFollow();
        setToast({
          message: `Now following ${member.username}`,
          type: "success",
        });
      }
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleBlock = async () => {
    setIsBlockLoading(true);
    try {
      if (isBlocked) {
        await onUnblock();
        setToast({
          message: `Unblocked ${member.username}`,
          type: "info",
        });
      } else {
        await onBlock();
        setToast({
          message: `Blocked ${member.username}`,
          type: "error",
        });
      }
    } finally {
      setIsBlockLoading(false);
    }
  };

  const handleChat = () => {
    onChat();
    setToast({
      message: `Opening chat with ${member.username}`,
      type: "info",
    });
  };

  return (
    <div className="flex items-center gap-2">
      {/* Chat Button */}
      <button
        onClick={handleChat}
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
        onClick={handleFollow}
        disabled={isFollowLoading}
        className={`btn btn-sm btn-circle transition-all ${
          isFollowing
            ? "btn-primary hover:btn-ghost"
            : "btn-ghost hover:btn-primary"
        } ${isFollowLoading ? "loading" : ""}`}
        title={isFollowing ? "Unfollow" : "Follow"}
      >
        {!isFollowLoading && (
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
                isFollowing
                  ? "M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"
                  : "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              }
            />
          </svg>
        )}
      </button>

      {/* Block/Unblock Button */}
      <button
        onClick={handleBlock}
        disabled={isBlockLoading}
        className={`btn btn-sm btn-circle transition-all ${
          isBlocked ? "btn-error hover:btn-ghost" : "btn-ghost hover:btn-error"
        } ${isBlockLoading ? "loading" : ""}`}
        title={isBlocked ? "Unblock" : "Block"}
      >
        {!isBlockLoading && (
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
        )}
      </button>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default MemberActions;
