import { useConnectionState } from './useConnectionState';
import { useConnectionActions } from './useConnectionActions';

export const useMemberConnections = (currentUserId: string) => {
  const {
    getConnectionState,
    getVisibleConnections,
  } = useConnectionState(currentUserId);

  const {
    handleFollow,
    handleUnfollow,
    handleBlock,
    handleUnblock,
    handleChat,
  } = useConnectionActions(currentUserId);

  return {
    getConnectionState,
    getVisibleConnections,
    handleFollow,
    handleUnfollow,
    handleBlock,
    handleUnblock,
    handleChat,
  };
};
