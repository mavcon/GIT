import React from "react";
import {
  ChartBarIcon,
  UserGroupIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

const MemberNav: React.FC = () => {
  return (
    <div className="flex space-x-8 items-center">
      <a href="/stats" className="flex items-center text-gray-700 hover:text-gray-900">
        <ChartBarIcon className="h-6 w-6 mr-2" />
        <span>Stats</span>
      </a>
      <a href="/dojos" className="flex items-center text-gray-700 hover:text-gray-900">
        <AcademicCapIcon className="h-6 w-6 mr-2" />
        <span>Dojos</span>
      </a>
      <a href="/community" className="flex items-center text-gray-700 hover:text-gray-900">
        <UserGroupIcon className="h-6 w-6 mr-2" />
        <span>Community</span>
      </a>
    </div>
  );
};

export default MemberNav;
