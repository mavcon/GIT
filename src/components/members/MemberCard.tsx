import React from 'react';
import { Link } from 'react-router-dom';
import { Member } from '../../types/member';
import ProfileImage from '../common/ProfileImage';
import TrainingArts from './TrainingArts';
import MemberCardActions from './MemberCardActions';

interface MemberCardProps {
  member: Member;
  currentUserId: string;
  connectionState: {
    isFollowing: boolean;
    isBlocked: boolean;
    isBlockedBy: boolean;
  };
  onChatClick: (memberId: string) => void;
  onFollowClick: (member: Member) => void;
  onBlockClick: (member: Member) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({
  member,
  currentUserId,
  connectionState,
  onChatClick,
  onFollowClick,
  onBlockClick,
}) => {
  return (
    <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <Link
            to={`/members/${member.id}`}
            className="hover:opacity-80 transition-opacity"
          >
            <ProfileImage
              src={member.profilePhoto}
              alt={member.username}
              isOnline={member.isOnline}
              size="sm"
            />
          </Link>

          {/* Info */}
          <div className="flex-grow">
            <Link
              to={`/members/${member.id}`}
              className="font-semibold hover:text-primary transition-colors"
            >
              {member.username}
            </Link>
            {member.bio && (
              <p className="text-sm text-base-content/70 line-clamp-1">
                {member.bio}
              </p>
            )}
          </div>

          {/* Training Arts */}
          <TrainingArts arts={member.trainingArts} />

          {/* Actions */}
          <MemberCardActions
            member={member}
            currentUserId={currentUserId}
            connectionState={connectionState}
            onChatClick={onChatClick}
            onFollowClick={onFollowClick}
            onBlockClick={onBlockClick}
          />
        </div>
      </div>
    </div>
  );
};

export default MemberCard;
