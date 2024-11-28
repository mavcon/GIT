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
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  member,
  isOwnProfile,
  onEdit,
  onPhotoUpload,
  onTrainingArtsChange,
  actions,
}) => {
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);

  const calculateTrainingYears = (startDate: string): number => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
    return diffYears;
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

  const handleTrainingArtToggle = (art: TrainingArt) => {
    if (!onTrainingArtsChange || !isOwnProfile) return;

    const currentArts = new Set(member.trainingArts);
    if (currentArts.has(art)) {
      currentArts.delete(art);
    } else {
      currentArts.add(art);
    }
    onTrainingArtsChange(Array.from(currentArts));
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
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isOwnProfile
              ? onEdit && (
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
                )
              : actions}
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
            {["BJJ", "Wrestling", "Submission Grappling"].map((art) => (
              <button
                key={art}
                className={`badge badge-lg ${
                  member.trainingArts.includes(art as TrainingArt)
                    ? "badge-primary"
                    : "badge-ghost"
                } ${isOwnProfile ? "cursor-pointer hover:badge-primary" : ""}`}
                onClick={() => handleTrainingArtToggle(art as TrainingArt)}
                disabled={!isOwnProfile}
              >
                {art === "BJJ"
                  ? "BJJ (gi)"
                  : art === "Submission Grappling"
                  ? "Nogi"
                  : art}
              </button>
            ))}
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
