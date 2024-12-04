import React, { useState } from "react";
import { Link } from "react-router-dom";
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
        <ul tabIndex={0} className="mt-3 p-2 shadow-lg menu menu-compact dropdown-content bg-base-100 rounded-box w-40">
          <li>
            <Link to="/members/1" onClick={() => setIsOpen(false)}>Profile</Link>
          </li>
          <li>
            <Link to="/settings" onClick={() => setIsOpen(false)}>Settings</Link>
          </li>
          <li>
            <Link to="/logout" onClick={() => setIsOpen(false)} className="text-error">Logout</Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default ProfileMenu;
