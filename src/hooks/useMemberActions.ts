import { useState } from 'react';
import { Member } from '../types/member';
import { useMember } from './useMember';

export const useMemberActions = (
  currentUserId: string,
  onFollow: (member: Member) => void,
  onUnfollow: (memberId: string) => void,
  onBlock: (member: Member) => void,
  onUnblock: (memberId: string) => void,
  onChat: (memberId: string) => void,
) => {
  const { getConnectionState } = useMember(currentUserId);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

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
    setSelectedMember(memberId);
    onChat(memberId);
  };

  const handleCloseChat = () => {
    setSelectedMember(null);
  };

  return {
    selectedMember,
    handleFollowClick,
    handleBlockClick,
    handleChatClick,
    handleCloseChat,
  };
};
