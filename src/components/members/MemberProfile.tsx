import React, { useState } from "react";
import { Member, TrainingArt } from "../../types/member";
import ProfileCard from "./ProfileCard";
import ConnectionsCard from "./ConnectionsCard";
import { useMember } from "../../hooks/useMember";

interface MemberProfileProps {
  currentUserId: string;
  member: Member;
  isOwnProfile: boolean;
}

interface EditableFields {
  username: string;
  bio: string;
  weight: {
    value: number;
    unit: "kg" | "lbs";
  };
  trainingArts: TrainingArt[];
}

const MemberProfile: React.FC<MemberProfileProps> = ({
  currentUserId,
  member,
  isOwnProfile,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableFields, setEditableFields] = useState<EditableFields>({
    username: member.username,
    bio: member.bio,
    weight: { ...member.weight },
    trainingArts: [...member.trainingArts],
  });

  const {
    handleFollow,
    handleUnfollow,
    handleBlock,
    handleUnblock,
    handleChat,
    getVisibleConnections,
    updateMember,
    getConnectionState,
  } = useMember(currentUserId);

  const { followers, following } = getVisibleConnections(member.id);
  const connectionState = getConnectionState(member.id);

  const handleEdit = () => {
    setIsEditing(!isEditing);
    // Reset editable fields when entering edit mode
    setEditableFields({
      username: member.username,
      bio: member.bio,
      weight: { ...member.weight },
      trainingArts: [...member.trainingArts],
    });
  };

  const handleSave = () => {
    updateMember(member.id, {
      ...member,
      username: editableFields.username,
      bio: editableFields.bio,
      weight: editableFields.weight,
      trainingArts: editableFields.trainingArts,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableFields({
      username: member.username,
      bio: member.bio,
      weight: { ...member.weight },
      trainingArts: [...member.trainingArts],
    });
    setIsEditing(false);
  };

  const handleFieldChange = (
    field: keyof EditableFields,
    value: string | number | TrainingArt[]
  ) => {
    setEditableFields((prev) => {
      if (field === "weight" && typeof value === "number") {
        return {
          ...prev,
          weight: {
            ...prev.weight,
            value: value,
          },
        };
      }
      if (field === "trainingArts" && Array.isArray(value)) {
        return {
          ...prev,
          trainingArts: value,
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handlePhotoUpload = (file: File) => {
    // In a real app, you would upload the file to a server
    // For now, we'll create a local URL
    const url = URL.createObjectURL(file);
    updateMember(member.id, {
      ...member,
      profilePhoto: url,
    });
  };

  const renderMemberActions = () => {
    if (isOwnProfile) return null;

    return (
      <div className="flex items-center gap-2">
        {/* Chat Button */}
        <button
          onClick={() => handleChat(member.id)}
          className="btn btn-ghost btn-sm btn-circle"
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
          onClick={() =>
            connectionState.isFollowing
              ? handleUnfollow(member.id)
              : handleFollow(member)
          }
          className="btn btn-ghost btn-sm btn-circle"
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
          onClick={() =>
            connectionState.isBlocked
              ? handleUnblock(member.id)
              : handleBlock(member)
          }
          className="btn btn-ghost btn-sm btn-circle"
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
    );
  };

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <ProfileCard
        member={
          isEditing
            ? { ...member, trainingArts: editableFields.trainingArts }
            : member
        }
        isOwnProfile={isOwnProfile}
        isEditable={isOwnProfile}
        onEdit={isOwnProfile ? handleEdit : undefined}
        onPhotoUpload={isOwnProfile ? handlePhotoUpload : undefined}
        onTrainingArtsChange={(arts) => handleFieldChange("trainingArts", arts)}
        actions={renderMemberActions()}
        isEditing={isEditing}
      />

      {/* Edit Form */}
      {isEditing && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Edit Profile</h3>
            <div className="form-control space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Username</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={editableFields.username}
                  onChange={(e) =>
                    handleFieldChange("username", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Bio</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  value={editableFields.bio}
                  onChange={(e) => handleFieldChange("bio", e.target.value)}
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">
                    Weight ({member.weight.unit})
                  </span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={editableFields.weight.value}
                  onChange={(e) =>
                    handleFieldChange("weight", Number(e.target.value))
                  }
                />
              </div>
              <div className="flex justify-end gap-2">
                <button className="btn btn-ghost" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connections Card */}
      <ConnectionsCard
        currentUserId={currentUserId}
        followers={followers}
        following={following}
        isVisible={member.privacySettings.connectionsVisibility}
      />
    </div>
  );
};

export default MemberProfile;
