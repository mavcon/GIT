import { useCallback } from "react";
import { Member } from "../types/member";
import { useMemberData } from "./useMemberData";
import { useMemberConnections } from "./useMemberConnections";

export const useMember = (currentUserId: string) => {
  const {
    members,
    getAllMembers,
    getMemberById,
    updateMember,
  } = useMemberData();

  const {
    getConnectionState,
    getVisibleConnections,
    handleFollow,
    handleUnfollow,
    handleBlock,
    handleUnblock,
    handleChat,
  } = useMemberConnections(currentUserId);

  const getVisibleMembers = useCallback(() => {
    return members.filter((member) => {
      const state = getConnectionState(member.id);
      return !state.isBlocked && !state.isBlockedBy;
    });
  }, [members, getConnectionState]);

  return {
    members,
    getAllMembers,
    getMemberById,
    getVisibleMembers,
    updateMember,
    getConnectionState,
    getVisibleConnections,
    handleFollow,
    handleUnfollow,
    handleBlock,
    handleUnblock,
    handleChat,
  };
};
