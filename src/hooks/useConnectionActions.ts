import { useCallback } from "react";
import { Member } from "../types/member";
import { useConnectionsContext } from "../context/ConnectionsContext";
import { useChat } from "../context/ChatContext";

export const useConnectionActions = (currentUserId: string) => {
  const connections = useConnectionsContext();
  const { setActiveChat } = useChat();

  const handleFollow = useCallback(
    (member: Member) => {
      connections.addConnection({
        id: `${currentUserId}-${member.id}-following`,
        userId: currentUserId,
        targetUserId: member.id,
        username: member.username,
        profilePhoto: member.profilePhoto,
        connectionType: "following",
        isOnline: member.isOnline,
        lastActive: member.lastActive,
      });
    },
    [currentUserId, connections]
  );

  const handleUnfollow = useCallback(
    (memberId: string) => {
      connections.removeConnection(currentUserId, memberId, "following");
    },
    [currentUserId, connections]
  );

  const handleBlock = useCallback(
    (member: Member) => {
      // Remove any existing connections first
      connections.removeConnection(currentUserId, member.id, "following");
      connections.removeConnection(member.id, currentUserId, "following");
      // Add block connection
      connections.addConnection({
        id: `${currentUserId}-${member.id}-blocked`,
        userId: currentUserId,
        targetUserId: member.id,
        username: member.username,
        profilePhoto: member.profilePhoto,
        connectionType: "blocked",
        isOnline: member.isOnline,
        lastActive: member.lastActive,
      });
    },
    [currentUserId, connections]
  );

  const handleUnblock = useCallback(
    (memberId: string) => {
      connections.removeConnection(currentUserId, memberId, "blocked");
    },
    [currentUserId, connections]
  );

  const handleChat = useCallback(
    (memberId: string) => {
      const chatId = [currentUserId, memberId].sort().join("-");
      setActiveChat(chatId);
    },
    [currentUserId, setActiveChat]
  );

  return {
    handleFollow,
    handleUnfollow,
    handleBlock,
    handleUnblock,
    handleChat,
  };
};
