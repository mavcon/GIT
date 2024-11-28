import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Connection, Member } from "../../types/member";
import { useMember } from "../../hooks/useMember";

interface ConnectionsCardProps {
  currentUserId: string;
  followers: Connection[];
  following: Connection[];
  isVisible: boolean;
}

const ConnectionsCard: React.FC<ConnectionsCardProps> = ({
  currentUserId,
  followers,
  following,
  isVisible,
}) => {
  const [activeTab, setActiveTab] = useState<"followers" | "following">(
    "followers"
  );
  const navigate = useNavigate();
  const {
    getMemberById,
    handleFollow,
    handleUnfollow,
    handleBlock,
    handleUnblock,
    handleChat,
    getConnectionState,
  } = useMember(currentUserId);

  if (!isVisible) return null;

  // Get unique connections based on userId
  const uniqueFollowers = followers.filter(
    (conn, index, self) =>
      index === self.findIndex((c) => c.userId === conn.userId)
  );

  const uniqueFollowing = following.filter(
    (conn, index, self) =>
      index === self.findIndex((c) => c.targetUserId === conn.targetUserId)
  );

  const connections =
    activeTab === "followers" ? uniqueFollowers : uniqueFollowing;

  const handleMemberClick = (memberId: string) => {
    navigate(`/members/${memberId}`);
  };

  const handleChatClick = (memberId: string) => {
    if (memberId === currentUserId) return;
    handleChat(memberId);
  };

  const handleFollowClick = (member: Member) => {
    if (member.id === currentUserId) return;
    const state = getConnectionState(member.id);
    if (state.isFollowing) {
      handleUnfollow(member.id);
    } else {
      handleFollow(member);
    }
  };

  const handleBlockClick = (member: Member) => {
    if (member.id === currentUserId) return;
    const state = getConnectionState(member.id);
    if (state.isBlocked) {
      handleUnblock(member.id);
    } else {
      handleBlock(member);
    }
  };

  return (
    <div className="bg-base-100 rounded-lg">
      <div className="p-4">
        {/* Tabs */}
        <div className="tabs tabs-boxed">
          <button
            className={`tab flex-1 ${
              activeTab === "followers" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("followers")}
          >
            Followers ({uniqueFollowers.length})
          </button>
          <button
            className={`tab flex-1 ${
              activeTab === "following" ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab("following")}
          >
            Following ({uniqueFollowing.length})
          </button>
        </div>

        {/* Connection List */}
        <div className="mt-4">
          {connections.length > 0 ? (
            <div className="space-y-2">
              {connections.map((connection) => {
                const memberId =
                  activeTab === "followers"
                    ? connection.userId
                    : connection.targetUserId;
                const member = getMemberById(memberId);
                if (!member) return null;

                const connectionState = getConnectionState(member.id);

                return (
                  <div
                    key={connection.id}
                    className="flex items-center gap-4 p-2 rounded-lg hover:bg-base-200 transition-colors"
                  >
                    {/* Avatar */}
                    <div
                      onClick={() => handleMemberClick(member.id)}
                      className="avatar hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full relative">
                        <img
                          src={member.profilePhoto || "/default-avatar.png"}
                          alt={member.username}
                          className="object-cover"
                        />
                        {member.isOnline && (
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-base-100" />
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div
                      className="flex-grow cursor-pointer"
                      onClick={() => handleMemberClick(member.id)}
                    >
                      <div className="font-medium">{member.username}</div>
                      <p className="text-xs text-base-content/70">
                        {member.isOnline ? "Online" : "Offline"}
                      </p>
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
                          title={
                            connectionState.isBlocked ? "Unblock" : "Block"
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
                              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 text-base-content/70">
              No {activeTab} yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionsCard;
