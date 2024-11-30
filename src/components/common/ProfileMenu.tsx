import React, { useState } from "react";
import ProfileImage from "./ProfileImage";

interface ProfileMenuProps {
  username: string;
  profilePhoto: string;
  isOnline: boolean;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
  username,
  profilePhoto,
  isOnline,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle p-0" onClick={() => setIsOpen(!isOpen)}>
        <ProfileImage
          src={profilePhoto}
          alt={username}
          isOnline={isOnline}
          size="xs"
        />
      </label>
      {isOpen && (
        <ul tabIndex={0} className="mt-3 p-2 shadow-lg menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
          <li className="menu-title px-4 py-2">
            <div className="flex items-center gap-3">
              <ProfileImage
                src={profilePhoto}
                alt={username}
                isOnline={isOnline}
                size="sm"
              />
              <div>
                <div className="font-bold">{username}</div>
                <div className="text-xs opacity-50">Member</div>
              </div>
            </div>
          </li>
          <div className="divider my-0" />
          <li>
            <a href="/profile">Profile</a>
          </li>
          <li>
            <a href="/settings">Settings</a>
          </li>
          <div className="divider my-0" />
          <li>
            <a href="/logout" className="text-error">Logout</a>
          </li>
        </ul>
      )}
    </div>
  );
};

export default ProfileMenu;
