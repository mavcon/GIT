import React from "react";
import { Link, useLocation } from "react-router-dom";

const MemberNav: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="tabs tabs-boxed bg-base-200 mb-6">
      <Link
        to="/member"
        className={`tab ${
          isActive("/member") && !isActive("/members") && !isActive("/settings")
            ? "tab-active"
            : ""
        }`}
      >
        Profile
      </Link>
      <Link
        to="/members"
        className={`tab ${isActive("/members") ? "tab-active" : ""}`}
      >
        Members
      </Link>
      <Link
        to="/settings"
        className={`tab ${isActive("/settings") ? "tab-active" : ""}`}
      >
        Settings
      </Link>
    </div>
  );
};

export default MemberNav;
