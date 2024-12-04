import { useCallback } from "react";
import { Connection, Member } from "../types/member";
import { useConnectionsContext } from "../context/ConnectionsContext";

export const useConnections = (currentUserId: string) => {
  const {
    connections,
    addConnection,
    removeConnection,
    isFollowing: contextIsFollowing,
    isBlocked: contextIsBlocked,
    isBlockedBy: contextIsBlockedBy,
    getFollowers: contextGetFollowers,
    getFollowing: contextGetFollowing,
  } = useConnectionsContext();

  const createConnection = useCallback(
    (targetMember: Member, type: Connection["connectionType"]): Connection => ({
      id: `${currentUserId}-${targetMember.id}-${type}`,
      userId: currentUserId,
      targetUserId: targetMember.id,
      username: targetMember.username,
      profilePhoto: targetMember.profilePhoto,
      connectionType: type,
      isOnline: targetMember.isOnline,
      lastActive: targetMember.lastActive,
    }),
    [currentUserId]
  );

  const handleFollow = useCallback(
    (member: Member) => {
      addConnection(createConnection(member, "following"));
    },
    [addConnection, createConnection]
  );

  const handleUnfollow = useCallback(
    (memberId: string) => {
      removeConnection(currentUserId, memberId, "following");
    },
    [currentUserId, removeConnection]
  );

  const handleBlock = useCallback(
    (member: Member) => {
      // Remove any existing connections first
      removeConnection(currentUserId, member.id, "following");
      removeConnection(member.id, currentUserId, "following");
      // Add block connection
      addConnection(createConnection(member, "blocked"));
    },
    [currentUserId, addConnection, createConnection, removeConnection]
  );

  const handleUnblock = useCallback(
    (memberId: string) => {
      removeConnection(currentUserId, memberId, "blocked");
    },
    [currentUserId, removeConnection]
  );

  const getConnectionState = useCallback(
    (memberId: string) => ({
      isFollowing: contextIsFollowing(currentUserId, memberId),
      isBlocked: contextIsBlocked(currentUserId, memberId),
      isBlockedBy: contextIsBlockedBy(currentUserId, memberId),
    }),
    [currentUserId, contextIsFollowing, contextIsBlocked, contextIsBlockedBy]
  );

  const getConnectionStats = useCallback(
    (memberId: string) => ({
      followersCount: contextGetFollowers(memberId).length,
      followingCount: contextGetFollowing(memberId).length,
    }),
    [contextGetFollowers, contextGetFollowing]
  );

  const getVisibleConnections = useCallback(
    (memberId: string) => {
      const state = getConnectionState(memberId);
      if (state.isBlocked || state.isBlockedBy) {
        return {
          followers: [],
          following: [],
        };
      }

      return {
        followers: contextGetFollowers(memberId),
        following: contextGetFollowing(memberId),
      };
    },
    [getConnectionState, contextGetFollowers, contextGetFollowing]
  );

  return {
    connections,
    handleFollow,
    handleUnfollow,
    handleBlock,
    handleUnblock,
    getConnectionState,
    getConnectionStats,
    getVisibleConnections,
  };
};
