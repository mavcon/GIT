import React from 'react';
import { Member } from '../../types/member';
import ProfileImage from '../common/ProfileImage';

export interface DialogHeaderProps {
  member: Member;
  onClose: () => void;
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({ member, onClose }) => (
  <div className="flex items-center justify-between p-4 border-b border-base-300">
    <div className="flex items-center gap-3">
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
    <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
);

export default DialogHeader;
