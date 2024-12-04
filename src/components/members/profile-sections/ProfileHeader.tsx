import React from "react";
import { Member } from "../../../types/member";
import ProfileStats from "./ProfileStats";
import ProfileImage from "../../common/ProfileImage";
import { calculateAge } from "../../../utils/dateUtils";

interface ProfileHeaderProps {
  member: Member;
  isEditable: boolean;
  onPhotoUpload?: (file: File) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  member,
  isEditable,
  onPhotoUpload,
}) => {
  return (
    <div>
      <div className="flex items-start space-x-4">
        <ProfileImage
          src={member.profilePhoto}
          alt={member.username}
          isOnline={member.isOnline}
          size="lg"
          isEditable={isEditable}
          onPhotoUpload={onPhotoUpload}
        />
        <div className="flex-grow h-20 flex flex-col justify-between py-0">
          <div className="-mt-1">
            <h2 className="text-2xl font-bold text-base-content leading-none">
              {member.username}
            </h2>
          </div>
          <div className="flex-grow flex items-center">
            <p className="text-base-content/80 text-sm line-clamp-2">
              {member.bio}
            </p>
          </div>
          <div>
            <ProfileStats member={member} calculateAge={calculateAge} />
          </div>
        </div>
      </div>
      <div className="mt-4 border-t border-base-300" />
    </div>
  );
};

export default ProfileHeader;
