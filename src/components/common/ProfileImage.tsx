import React from "react";
import styles from "./ProfileImage.module.css";

interface ProfileImageProps {
  src: string | null;
  alt: string;
  isOnline: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  isEditable?: boolean;
  onPhotoUpload?: (file: File) => void;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  src,
  alt,
  isOnline,
  size = "md",
  isEditable = false,
  onPhotoUpload,
}) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onPhotoUpload) {
      onPhotoUpload(file);
    }
  };

  const sizeClasses = {
    xs: "w-7 h-7",
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };

  return (
    <div className="relative shrink-0">
      <div className={`relative ${isOnline ? styles.onlineIndicator : ""}`}>
        <img
          src={src || "/default-avatar.png"}
          alt={alt}
          className={`${sizeClasses[size]} rounded-full object-cover ring-2 ${
            isOnline ? "ring-success" : "ring-base-300"
          }`}
        />
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

export default ProfileImage;
