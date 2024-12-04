import React from 'react';
import { Member } from '../../../types/member';
import ActionButton from './shared/ActionButton';
import MemberInfo from './shared/MemberInfo';

interface ConnectionState {
  isFollowing: boolean;
  isBlocked: boolean;
  isBlockedBy: boolean;
}

interface DojoAttendeeItemProps {
  member: Member;
  currentUserId: string;
  connectionState: ConnectionState;
  onMemberClick: (memberId: string) => void;
  onChat: (memberId: string) => void;
  onFollow: (member: Member) => void;
  onUnfollow: (memberId: string) => void;
  onBlock: (member: Member) => void;
  onUnblock: (memberId: string) => void;
}

const DojoAttendeeItem: React.FC<DojoAttendeeItemProps> = ({
  member,
  currentUserId,
  connectionState,
  onMemberClick,
  onChat,
  onFollow,
  onUnfollow,
  onBlock,
  onUnblock,
}) => {
  if (member.id === currentUserId) return null;

  const handleAction = (
    e: React.MouseEvent,
    action: () => void
  ) => {
    e.stopPropagation();
    action();
  };

  return (
    <div className="flex items-center justify-between py-1">
      <MemberInfo
        username={member.username}
        profilePhoto={member.profilePhoto}
        isOnline={member.isOnline}
        onClick={() => onMemberClick(member.id)}
      />

      <div className="flex items-center gap-1">
        <ActionButton
          onClick={(e) => handleAction(e, () => onChat(member.id))}
          title="Chat"
          icon="chat"
        />
        <ActionButton
          onClick={(e) => handleAction(e, () => 
            connectionState.isFollowing
              ? onUnfollow(member.id)
              : onFollow(member)
          )}
          title={connectionState.isFollowing ? "Unfollow" : "Follow"}
          icon={connectionState.isFollowing ? "unfollow" : "follow"}
          variant="primary"
          isActive={connectionState.isFollowing}
        />
        <ActionButton
          onClick={(e) => handleAction(e, () =>
            connectionState.isBlocked
              ? onUnblock(member.id)
              : onBlock(member)
          )}
          title={connectionState.isBlocked ? "Unblock" : "Block"}
          icon="block"
          variant="error"
          isActive={connectionState.isBlocked}
        />
      </div>
    </div>
  );
};

export default DojoAttendeeItem;
