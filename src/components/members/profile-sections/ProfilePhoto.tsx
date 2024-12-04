import React from "react";
import { Member } from "../../../types/member";
import ProfileImage from "../../common/ProfileImage";
import { useTheme } from "../../../context/ThemeContext";

interface ProfilePhotoProps {
  member: Member;
  isEditable: boolean;
  onPhotoUpload?: (file: File) => void;
}

const getStatusColor = (status: Member["accountStatus"]): string => {
  const statusColors = {
    active: "ring-primary",
    suspended: "ring-warning",
    banned: "ring-error",
    default: "ring-base-300"
  };
  return statusColors[status] || statusColors.default;
};

const CameraIcon: React.FC = () => {
  const { theme, currentTheme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && currentTheme === "dark");

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-4 w-4" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke={isDark ? "#fff" : "#000"}
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
  );
};

const UploadButton: React.FC<{
  onPhotoUpload: (file: File) => void;
}> = ({ onPhotoUpload }) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onPhotoUpload(file);
    }
  };

  return (
    <label className="absolute bottom-0 right-0 cursor-pointer">
      <input
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />
      <div className="bg-primary hover:bg-primary-focus text-primary-content rounded-full p-1 shadow-lg transition-colors">
        <CameraIcon />
      </div>
    </label>
  );
};

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({
  member,
  isEditable,
  onPhotoUpload,
}) => (
  <div className="relative shrink-0">
    <div className={`relative ${getStatusColor(member.accountStatus)}`}>
      <ProfileImage
        src={member.profilePhoto}
        alt={member.username}
        isOnline={member.isOnline}
        size="lg"
        isEditable={isEditable}
        onPhotoUpload={onPhotoUpload}
      />
    </div>
  </div>
);

export default ProfilePhoto;
