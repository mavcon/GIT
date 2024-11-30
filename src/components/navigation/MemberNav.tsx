import React from "react";
import {
  ChartBarIcon,
  UserGroupIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

const MemberNav: React.FC = () => {
  return (
    <nav className="flex items-center">
      <a href="/stats" className="flex items-center gap-2 text-base-content/70 hover:text-base-content transition-colors px-6">
        <ChartBarIcon className="h-5 w-5" />
        <span className="text-sm">Stats</span>
      </a>
      <a href="/dojos" className="flex items-center gap-2 text-base-content/70 hover:text-base-content transition-colors px-6">
        <AcademicCapIcon className="h-5 w-5" />
        <span className="text-sm">Dojos</span>
      </a>
      <a href="/community" className="flex items-center gap-2 text-base-content/70 hover:text-base-content transition-colors px-6">
        <UserGroupIcon className="h-5 w-5" />
        <span className="text-sm">Community</span>
      </a>
    </nav>
  );
};

export default MemberNav;
