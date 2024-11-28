import React from "react";
import { Link } from "react-router-dom";
import { Member } from "../../types/member";
import { useMember } from "../../hooks/useMember";

interface MemberListProps {
  currentUserId: string;
  members: Member[];
  onFollow: (member: Member) => void;
  onUnfollow: (memberId: string) => void;
  onBlock: (member: Member) => void;
  onUnblock: (memberId: string) => void;
  onChat: (memberId: string) => void;
}

const MemberList: React.FC<MemberListProps> = ({
  currentUserId,
  members,
  onFollow,
  onUnfollow,
  onBlock,
  onUnblock,
  onChat,
}) => {
  const { getConnectionState } = useMember(currentUserId);

  // Filter out the current user and blocked members
  const visibleMembers = members.filter((member) => {
    if (member.id === currentUserId) return false;
    const state = getConnectionState(member.id);
    return !state.isBlocked && !state.isBlockedBy;
  });

  const handleFollowClick = (member: Member) => {
    if (member.id === currentUserId) return;
    const state = getConnectionState(member.id);
    if (state.isFollowing) {
      onUnfollow(member.id);
    } else {
      onFollow(member);
    }
  };

  const handleBlockClick = (member: Member) => {
    if (member.id === currentUserId) return;
    const state = getConnectionState(member.id);
    if (state.isBlocked) {
      onUnblock(member.id);
    } else {
      onBlock(member);
    }
  };

  const handleChatClick = (memberId: string) => {
    if (memberId === currentUserId) return;
    onChat(memberId);
  };

  return (
    <div className="space-y-4">
      {visibleMembers.map((member) => {
        const connectionState = getConnectionState(member.id);

        return (
          <div
            key={member.id}
            className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="card-body p-4">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <Link
                  to={`/members/${member.id}`}
                  className="avatar hover:opacity-80 transition-opacity"
                >
                  <div className="w-12 h-12 rounded-full relative">
                    <img
                      src={member.profilePhoto || "/default-avatar.png"}
                      alt={member.username}
                      className="object-cover"
                    />
                    {member.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-base-100" />
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-grow">
                  <Link
                    to={`/members/${member.id}`}
                    className="font-semibold hover:text-primary transition-colors"
                  >
                    {member.username}
                  </Link>
                  {member.bio && (
                    <p className="text-sm text-base-content/70 line-clamp-1">
                      {member.bio}
                    </p>
                  )}
                </div>

                {/* Training Arts */}
                <div className="flex items-center gap-2">
                  {member.trainingArts.map((art) => (
                    <span
                      key={art}
                      className="badge badge-sm"
                      title={`Trains ${art}`}
                    >
                      {art === "BJJ"
                        ? "BJJ"
                        : art === "Submission Grappling"
                        ? "Nogi"
                        : art === "Wrestling"
                        ? "Wrestling"
                        : art}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                {member.id !== currentUserId && (
                  <div className="flex items-center gap-2">
                    {/* Chat Button */}
                    <button
                      onClick={() => handleChatClick(member.id)}
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
                      onClick={() => handleFollowClick(member)}
                      className={`btn btn-sm btn-circle transition-all ${
                        connectionState.isFollowing
                          ? "btn-primary hover:btn-ghost"
                          : "btn-ghost hover:btn-primary"
                      }`}
                      title={
                        connectionState.isFollowing ? "Unfollow" : "Follow"
                      }
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
                      onClick={() => handleBlockClick(member)}
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
                )}
              </div>
            </div>
          </div>
        );
      })}
      {visibleMembers.length === 0 && (
        <div className="text-center py-8 text-base-content/70">
          No members found
        </div>
      )}
    </div>
  );
};

export default MemberList;
