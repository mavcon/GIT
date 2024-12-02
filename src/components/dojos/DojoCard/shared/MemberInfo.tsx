import React from 'react';
import ProfileImage from '../../../common/ProfileImage';

interface MemberInfoProps {
  username: string;
  profilePhoto: string | null;
  isOnline: boolean;
  onClick: () => void;
}

const MemberInfo: React.FC<MemberInfoProps> = ({
  username,
  profilePhoto,
  isOnline,
  onClick,
}) => (
  <div className="flex items-center gap-2">
    <div
      onClick={onClick}
      className="cursor-pointer"
    >
      <ProfileImage
        src={profilePhoto}
        alt={username}
        isOnline={isOnline}
        size="xxs"
      />
    </div>
    <span
      onClick={onClick}
      className="cursor-pointer font-medium text-sm"
    >
      {username}
    </span>
  </div>
);

export default MemberInfo;
