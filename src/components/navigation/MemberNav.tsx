import React from "react";
import {
  ChartBarIcon,
  UserGroupIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

const MemberNav: React.FC = () => {
  return (
    <div className="flex space-x-8 items-center">
      <a href="/stats" className="flex items-center text-base-content hover:text-base-content/80">
        <ChartBarIcon className="h-6 w-6 mr-2" />
        <span>Stats</span>
      </a>
      <a href="/dojos" className="flex items-center text-base-content hover:text-base-content/80">
        <AcademicCapIcon className="h-6 w-6 mr-2" />
        <span>Dojos</span>
      </a>
      <a href="/community" className="flex items-center text-base-content hover:text-base-content/80">
        <UserGroupIcon className="h-6 w-6 mr-2" />
        <span>Community</span>
      </a>
    </div>
  );
};

export default MemberNav;
