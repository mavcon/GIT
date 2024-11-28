import React from "react";
import { Member } from "../../../types/member";
import styles from "./ProfileHeader.module.css";

interface ProfilePhotoProps {
  member: Member;
  isEditable: boolean;
  onPhotoUpload?: (file: File) => void;
}

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({
  member,
  isEditable,
  onPhotoUpload,
}) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onPhotoUpload) {
      onPhotoUpload(file);
    }
  };

  const getStatusColor = (status: Member["accountStatus"]) => {
    switch (status) {
      case "active":
        return "ring-primary";
      case "suspended":
        return "ring-warning";
      case "banned":
        return "ring-error";
      default:
        return "ring-base-300";
    }
  };

  return (
    <div className="relative shrink-0">
      <div
        className={`relative ${member.isOnline ? styles.onlineIndicator : ""}`}
      >
        <img
          src={member.profilePhoto || "/default-avatar.png"}
          alt={member.username}
          className={`w-20 h-20 rounded-full object-cover ring-2 ${getStatusColor(
            member.accountStatus
          )}`}
        />
        {member.isOnline && (
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-success rounded-full border-2 border-base-100" />
        )}
      </div>
      {isEditable && onPhotoUpload && (
        <label className="absolute bottom-0 right-0 cursor-pointer">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
          <div className="bg-primary hover:bg-primary-focus text-primary-content rounded-full p-1 shadow-lg transition-colors">
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
        </label>
      )}
    </div>
  );
};

export default ProfilePhoto;