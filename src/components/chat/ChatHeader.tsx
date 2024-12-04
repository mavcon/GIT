import React from 'react';
import { Member } from '../../types/member';
import ProfileImage from '../common/ProfileImage';

export interface ChatHeaderProps {
  member: Member;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ member }) => (
  <div className="p-4 border-b border-base-300 flex items-center gap-3">
    <ProfileImage
      src={member.profilePhoto}
      alt={member.username}
      isOnline={member.isOnline}
      size="sm"
    />
    <div>
      <h3 className="font-semibold">{member.username}</h3>
      <p className="text-xs text-base-content/70">
        {member.isOnline ? "Online" : "Offline"}
      </p>
    </div>
  </div>
);

export default ChatHeader;
