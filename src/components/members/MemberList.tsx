import React from "react";
import { Member } from "../../types/member";
import { useMember } from "../../hooks/useMember";
import { useMemberActions } from "../../hooks/useMemberActions";
import MemberCard from "./MemberCard";
import ChatDialog from "../chat/ChatDialog";

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
  const { getConnectionState, getMemberById } = useMember(currentUserId);
  const {
    selectedMember,
    handleFollowClick,
    handleBlockClick,
    handleChatClick,
    handleCloseChat,
  } = useMemberActions(
    currentUserId,
    onFollow,
    onUnfollow,
    onBlock,
    onUnblock,
    onChat
  );

  // Filter out the current user and blocked members
  const visibleMembers = members.filter((member) => {
    if (member.id === currentUserId) return false;
    const state = getConnectionState(member.id);
    return !state.isBlocked && !state.isBlockedBy;
  });

  return (
    <>
      <div className="space-y-4">
        {visibleMembers.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            currentUserId={currentUserId}
            connectionState={getConnectionState(member.id)}
            onChatClick={handleChatClick}
            onFollowClick={handleFollowClick}
            onBlockClick={handleBlockClick}
          />
        ))}
        {visibleMembers.length === 0 && (
          <div className="text-center py-8 text-base-content/70">
            No members found
          </div>
        )}
      </div>

      {selectedMember && (
        <ChatDialog
          currentUser={getMemberById(currentUserId)!}
          otherMember={getMemberById(selectedMember)!}
          isOpen={true}
          onClose={handleCloseChat}
        />
      )}
    </>
  );
};

export default MemberList;
