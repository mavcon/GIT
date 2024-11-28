import React, { useState } from "react";
import { Member, TrainingArt } from "../../types/member";
import ImageUpload from "../common/ImageUpload";

interface ProfileCardProps {
  member: Member;
  isOwnProfile: boolean;
  onEdit?: () => void;
  onPhotoUpload?: (file: File) => void;
  onTrainingArtsChange?: (arts: TrainingArt[]) => void;
  actions?: React.ReactNode;
  isEditing?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  member,
  isOwnProfile,
  onEdit,
  onPhotoUpload,
  onTrainingArtsChange,
  actions,
  isEditing = false,
}) => {
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);

  const calculateTrainingYears = (startDate: string): number => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
    return diffYears;
  };

  const calculateAge = (dateOfBirth: string): number => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handlePhotoClick = () => {
    if (isOwnProfile) {
      setShowPhotoUpload(true);
    }
  };

  const handlePhotoUpload = (file: File) => {
    setShowPhotoUpload(false);
    if (onPhotoUpload) {
      onPhotoUpload(file);
    }
  };

  const handleTrainingArtToggle = (e: React.MouseEvent, art: TrainingArt) => {
    e.preventDefault();
    e.stopPropagation();

    if (!onTrainingArtsChange || !isOwnProfile || !isEditing) return;

    const currentArts = new Set(member.trainingArts);
    if (currentArts.has(art)) {
      currentArts.delete(art);
    } else {
      currentArts.add(art);
    }
    onTrainingArtsChange(Array.from(currentArts));
  };

  const handlePublicPreview = () => {
    window.open(`/members/${member.id}?preview=true`, "_blank");
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        {/* Header */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="avatar" onClick={handlePhotoClick}>
            <div
              className={`w-24 h-24 rounded-full relative ${
                isOwnProfile ? "cursor-pointer hover:opacity-80" : ""
              }`}
            >
              <img
                src={member.profilePhoto || "/default-avatar.png"}
                alt={member.username}
                className="object-cover"
              />
              {member.isOnline && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-success rounded-full border-2 border-base-100" />
              )}
              {isOwnProfile && (
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white opacity-0 hover:opacity-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-grow">
            <h2 className="card-title text-2xl">{member.username}</h2>
            <p className="text-base-content/70">{member.bio}</p>
            <div className="flex gap-4 mt-2 text-sm text-base-content/70">
              {member.privacySettings.ageVisibility && (
                <span>Age: {calculateAge(member.dateOfBirth)}</span>
              )}
              {member.privacySettings.heightVisibility && (
                <span>
                  Height: {member.height.value}
                  {member.height.unit}
                </span>
              )}
              {member.privacySettings.weightVisibility && (
                <span>
                  Weight: {member.weight.value}
                  {member.weight.unit}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isOwnProfile ? (
              <>
                {/* Public Preview Button */}
                <button
                  onClick={handlePublicPreview}
                  className="btn btn-ghost btn-sm btn-circle"
                  title="Public Preview"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
                {/* Edit Button */}
                {onEdit && (
                  <button
                    onClick={onEdit}
                    className="btn btn-ghost btn-sm btn-circle"
                    title="Edit Profile"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
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
                  </button>
                )}
              </>
            ) : (
              actions
            )}
          </div>
        </div>

        {/* Training Years */}
        <div className="mt-6 bg-base-200 rounded-lg p-6">
          <div className="text-center">
            <div className="text-base-content/70">Training for</div>
            <div className="text-6xl font-bold">
              {calculateTrainingYears(member.trainingStartDate)}
            </div>
            <div className="text-base-content/70">Years</div>
          </div>
        </div>

        {/* Training Focus */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Training Focus</h3>
          <div className="flex flex-wrap gap-2">
            {["BJJ", "Wrestling", "Submission Grappling"].map((art) => {
              const isSelected = member.trainingArts.includes(
                art as TrainingArt
              );
              if (!isSelected && !isEditing) return null;

              return (
                <button
                  key={art}
                  className={`badge badge-lg ${
                    isSelected ? "badge-primary" : "badge-ghost"
                  } ${
                    isOwnProfile && isEditing
                      ? "cursor-pointer hover:badge-primary"
                      : "cursor-default"
                  }`}
                  onClick={(e) =>
                    handleTrainingArtToggle(e, art as TrainingArt)
                  }
                  disabled={!isOwnProfile || !isEditing}
                >
                  {art === "BJJ"
                    ? "BJJ (gi)"
                    : art === "Submission Grappling"
                    ? "Nogi"
                    : art}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Photo Upload Modal */}
      {showPhotoUpload && (
        <ImageUpload
          onUpload={handlePhotoUpload}
          onClose={() => setShowPhotoUpload(false)}
        />
      )}
    </div>
  );
};

export default ProfileCard;
