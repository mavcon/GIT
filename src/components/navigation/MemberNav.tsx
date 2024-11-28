import React from "react";
import {
  ChartBarIcon,
  UserGroupIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../../context/ThemeContext";

const MemberNav: React.FC = () => {
  const { theme, currentTheme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && currentTheme === "dark");

  const linkClass = isDark ? "text-neutral-content hover:text-neutral-content/80" : "text-base-content hover:text-base-content/80";

  return (
    <div className="flex space-x-8 items-center">
      <a href="/stats" className={`flex items-center ${linkClass}`}>
        <ChartBarIcon className="h-6 w-6 mr-2" />
        <span>Stats</span>
      </a>
      <a href="/dojos" className={`flex items-center ${linkClass}`}>
        <AcademicCapIcon className="h-6 w-6 mr-2" />
        <span>Dojos</span>
      </a>
      <a href="/community" className={`flex items-center ${linkClass}`}>
        <UserGroupIcon className="h-6 w-6 mr-2" />
        <span>Community</span>
      </a>
    </div>
  );
};

export default MemberNav;
