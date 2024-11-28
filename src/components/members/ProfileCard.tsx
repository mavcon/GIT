import React from "react";
import { Member } from "../../types/member";
import { calculateAge } from "../../utils/dateUtils";
import ProfileHeader from "./profile-sections/ProfileHeader";
import TrainingFocus from "./profile-sections/TrainingFocus";

interface ProfileCardProps {
  member: Member;
  isEditable?: boolean;
  onEdit?: () => void;
  isOwnProfile?: boolean;
  onPhotoUpload?: (file: File) => void;
  onTrainingArtsChange?: (arts: Member["trainingArts"]) => void;
  actions?: React.ReactNode;
  isEditing?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  member,
  isEditable = false,
  onEdit,
  isOwnProfile = false,
  onPhotoUpload,
  onTrainingArtsChange,
  actions,
  isEditing = false,
}) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <ProfileHeader
              member={member}
              isEditable={isEditable}
              onPhotoUpload={onPhotoUpload}
            />
          </div>
          <div className="flex gap-2">
            {isEditable && onEdit && (
              <button onClick={onEdit} className="btn btn-primary btn-sm gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Edit Profile
              </button>
            )}
            {actions}
          </div>
        </div>

        <TrainingFocus
          trainingArts={member.trainingArts}
          onTrainingArtsChange={isEditing ? onTrainingArtsChange : undefined}
          trainingStartDate={member.trainingStartDate}
        />
      </div>
    </div>
  );
};

export default ProfileCard;
