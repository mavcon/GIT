import React from 'react';
import { NavLink } from 'react-router-dom';

const MemberNav: React.FC = () => {
  return (
    <nav className="flex items-center space-x-4">
      <NavLink
        to="/stats"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-lg transition-colors ${
            isActive ? 'dark:text-[#38bdf8] text-primary-content' : 'hover:bg-base-200'
          }`
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
        Stats
      </NavLink>

      <NavLink
        to="/dojos"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-lg transition-colors ${
            isActive ? 'dark:text-[#38bdf8] text-primary-content' : 'hover:bg-base-200'
          }`
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0h8v12H6V4z" clipRule="evenodd" />
        </svg>
        Dojos
      </NavLink>

      <NavLink
        to="/members"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-lg transition-colors ${
            isActive ? 'dark:text-[#38bdf8] text-primary-content' : 'hover:bg-base-200'
          }`
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
        Community
      </NavLink>
    </nav>
  );
};

export default MemberNav;
