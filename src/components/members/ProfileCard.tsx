import React, { useState } from "react";
import { Member } from "../../types/member";
import ImageUpload from "../common/ImageUpload";
import { useMember } from "../../hooks/useMember";

interface ProfileCardProps {
  currentUserId: string;
  member: Member;
  isEditable?: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
  onBlock?: () => void;
  onUnblock?: () => void;
  onChat?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  currentUserId,
  member,
  isEditable = false,
  onFollow,
  onUnfollow,
  onBlock,
  onUnblock,
  onChat,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableFields, setEditableFields] = useState({
    username: member.username,
    bio: member.bio || "",
    trainingArts: member.trainingArts,
    weight: member.weight,
    height: member.height,
  });

  const { getConnectionState } = useMember(currentUserId);
  const connectionState = getConnectionState(member.id);

  const handleImageUpload = (file: File) => {
    // In a real application, this would handle the file upload to a server
    console.log("Image upload:", file);
  };

  const handleSave = () => {
    console.log("Saving changes:", editableFields);
    setIsEditing(false);
  };

  const getTrainingDuration = (): { value: number; unit: string } => {
    const startDate = new Date(member.trainingStartDate);
    const today = new Date();
    const months =
      today.getMonth() -
      startDate.getMonth() +
      12 * (today.getFullYear() - startDate.getFullYear());

    if (months < 12) {
      return { value: months, unit: "months" };
    }
    return { value: Math.floor(months / 12), unit: "years" };
  };

  const trainingDuration = getTrainingDuration();

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body p-6">
        {/* Header */}
        <div className="flex gap-6">
          <div className="w-32 h-32 flex-shrink-0">
            {isEditable ? (
              <ImageUpload
                currentImage={member.profilePhoto}
                onImageUpload={handleImageUpload}
                className="w-full h-full"
              />
            ) : (
              <div className="avatar">
                <div className="w-full h-full rounded-full">
                  <img
                    src={member.profilePhoto || "/default-avatar.png"}
                    alt={member.username}
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={editableFields.username}
                    onChange={(e) =>
                      setEditableFields({
                        ...editableFields,
                        username: e.target.value,
                      })
                    }
                    className="input input-bordered w-full max-w-xs"
                  />
                ) : (
                  <h2 className="text-2xl font-bold">{member.username}</h2>
                )}
                {isEditing ? (
                  <textarea
                    value={editableFields.bio}
                    onChange={(e) =>
                      setEditableFields({
                        ...editableFields,
                        bio: e.target.value,
                      })
                    }
                    className="textarea textarea-bordered w-full"
                    rows={2}
                    placeholder="Write your bio..."
                  />
                ) : (
                  member.bio && (
                    <p className="text-base-content/70">{member.bio}</p>
                  )
                )}
              </div>

              {/* Action Buttons */}
              {isEditable ? (
                // Edit button for own profile
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="btn btn-ghost btn-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="btn btn-primary btn-sm"
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn btn-ghost btn-sm btn-circle"
                      title="Edit profile"
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
                </div>
              ) : (
                // Action buttons for other members' profiles
                <div className="flex items-center gap-2">
                  {/* Chat Button */}
                  <button
                    onClick={onChat}
                    className="btn btn-ghost btn-sm btn-circle hover:scale-110 transition-transform"
                    title="Chat"
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
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </button>

                  {/* Follow/Unfollow Button */}
                  <button
                    onClick={
                      connectionState.isFollowing ? onUnfollow : onFollow
                    }
                    className={`btn btn-sm btn-circle transition-all ${
                      connectionState.isFollowing
                        ? "btn-primary hover:btn-ghost"
                        : "btn-ghost hover:btn-primary"
                    }`}
                    title={connectionState.isFollowing ? "Unfollow" : "Follow"}
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
                        d={
                          connectionState.isFollowing
                            ? "M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"
                            : "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        }
                      />
                    </svg>
                  </button>

                  {/* Block/Unblock Button */}
                  <button
                    onClick={connectionState.isBlocked ? onUnblock : onBlock}
                    className={`btn btn-sm btn-circle transition-all ${
                      connectionState.isBlocked
                        ? "btn-error hover:btn-ghost"
                        : "btn-ghost hover:btn-error"
                    }`}
                    title={connectionState.isBlocked ? "Unblock" : "Block"}
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
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Training Duration Box */}
        <div className="stats shadow bg-base-200 mt-8">
          <div className="stat text-center px-8">
            <div className="stat-title text-base-content/70">Training for</div>
            <div className="stat-value text-6xl text-primary py-2">
              {trainingDuration.value}
            </div>
            <div className="stat-desc text-lg capitalize">
              {trainingDuration.unit}
            </div>
          </div>
        </div>

        {/* Training Focus */}
        <div className="mt-8">
          <h3 className="font-bold text-lg mb-4">Training Focus</h3>
          <div className="flex flex-wrap gap-3">
            {member.trainingArts.map((art) => (
              <span
                key={art}
                className="badge badge-primary p-4 text-base hover:scale-105 transition-transform"
              >
                {art === "BJJ"
                  ? "BJJ (gi)"
                  : art === "Submission Grappling"
                  ? "Submission Grappling (nogi)"
                  : art}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        {(member.privacySettings.ageVisibility ||
          member.privacySettings.weightVisibility ||
          member.privacySettings.heightVisibility) && (
          <>
            <div className="divider my-8"></div>
            <div className="flex flex-wrap gap-4">
              {member.privacySettings.weightVisibility && (
                <div className="badge badge-ghost gap-2 p-4">
                  <span className="opacity-70">Weight:</span>
                  <span>
                    {member.weight.value} {member.weight.unit}
                  </span>
                </div>
              )}
              {member.privacySettings.heightVisibility && (
                <div className="badge badge-ghost gap-2 p-4">
                  <span className="opacity-70">Height:</span>
                  <span>
                    {member.height.value} {member.height.unit}
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
