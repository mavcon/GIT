import { useCallback } from 'react';
import { Connection } from '../types/member';
import { useConnectionsContext } from '../context/ConnectionsContext';

export const useConnectionState = (currentUserId: string) => {
  const connections = useConnectionsContext();

  const getConnectionState = useCallback(
    (memberId: string) => ({
      isFollowing: connections.isFollowing(currentUserId, memberId),
      isBlocked: connections.isBlocked(currentUserId, memberId),
      isBlockedBy: connections.isBlockedBy(currentUserId, memberId),
    }),
    [currentUserId, connections]
  );

  const getVisibleConnections = useCallback(
    (memberId: string): { followers: Connection[]; following: Connection[] } => {
      const state = getConnectionState(memberId);
      if (state.isBlocked || state.isBlockedBy) {
        return { followers: [], following: [] };
      }

      return {
        followers: connections.getFollowers(memberId),
        following: connections.getFollowing(memberId),
      };
    },
    [connections, getConnectionState]
  );

  return {
    getConnectionState,
    getVisibleConnections,
  };
};
