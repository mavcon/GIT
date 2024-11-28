import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ThemeProvider } from "./context/ThemeContext";
import { ConnectionsProvider } from "./context/ConnectionsContext";
import { useMember } from "./hooks/useMember";
import storageService from "./services/storage";
import RoleBasedRoutes from "./components/routing/RoleBasedRoutes";
import ProfileImage from "./components/common/ProfileImage";
import MemberNav from "./components/navigation/MemberNav";
import { Link } from "react-router-dom";

// Role selection component
const RoleSelector = ({
  onRoleSelect,
}: {
  onRoleSelect: (role: string) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center min-h-screen bg-base-200"
  >
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h1 className="card-title text-2xl mb-6 text-center">
          Select Your Role
        </h1>
        <div className="grid grid-cols-2 gap-4">
          {["superadmin", "admin", "partner", "member", "user"].map((role) => (
            <motion.button
              key={role}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onRoleSelect(role)}
              className="btn btn-primary"
            >
              {role === "superadmin" ? "Super Admin" : role}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

const AppContent: React.FC = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const currentUserId = "1"; // Using ID "1" to match dummy data
  const notificationCount = 3; // Example notification count
  const { getMemberById } = useMember(currentUserId);
  const currentMember = getMemberById(currentUserId);

  // Reset storage and reinitialize on first load
  useEffect(() => {
    storageService.resetStorage();
  }, []);

  if (!userRole || !currentMember) {
    return <RoleSelector onRoleSelect={setUserRole} />;
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-lg">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex w-full justify-between items-center">
            <div className="flex items-center h-12">
              <img src="/DOJOLIBRE_LOGO2.svg" alt="DOJOLIBRE" className="h-8" />
              <span className="text-2xl font-extrabold italic ml-2">
                DOJOLIBRE
              </span>
            </div>
            
            {/* Center Navigation */}
            <div className="flex-1 flex justify-center">
              <MemberNav />
            </div>

            <div className="flex items-center gap-2">
              {/* Bell Icon with Notification Count */}
              <button className="btn btn-ghost h-12 w-12 flex items-center justify-center relative">
                <div className="relative flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                    />
                  </svg>
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-error text-error-content w-4 h-4 flex items-center justify-center text-xs font-bold rounded-full">
                      {notificationCount}
                    </span>
                  )}
                </div>
              </button>

              {/* Profile Dropdown */}
              <div className="dropdown dropdown-end">
                <label
                  tabIndex={0}
                  className="btn btn-ghost h-12 w-12 p-0"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <ProfileImage
                    src={currentMember.profilePhoto}
                    alt={currentMember.username}
                    isOnline={currentMember.isOnline}
                    size="sm"
                  />
                </label>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <Link to="/member">Profile</Link>
                  </li>
                  <li>
                    <Link to="/members">Members</Link>
                  </li>
                  <li>
                    <Link to="/settings">Settings</Link>
                  </li>
                  <li>
                    <button onClick={() => setUserRole(null)}>
                      Switch Role
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RoleBasedRoutes userRole={userRole} currentUserId={currentUserId} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ConnectionsProvider>
        <AppContent />
      </ConnectionsProvider>
    </ThemeProvider>
  );
};

export default App;
