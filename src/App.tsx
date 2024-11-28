import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ThemeProvider } from "./context/ThemeContext";
import { ConnectionsProvider } from "./context/ConnectionsContext";
import { useMember } from "./hooks/useMember";
import storageService from "./services/storage";
import RoleBasedRoutes from "./components/routing/RoleBasedRoutes";

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
      <div className="navbar bg-base-100 shadow-lg px-4">
        <div className="flex-1 flex items-center gap-2">
          <div className="flex items-center h-12">
            <img src="/DOJOLIBRE_LOGO2.svg" alt="DOJOLIBRE" className="h-8" />
            <span className="text-2xl font-extrabold italic ml-2">
              DOJOLIBRE
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Bell Icon with Notification Count */}
          <button className="btn btn-ghost h-12 w-12 flex items-center justify-center relative">
            <div className="relative flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                viewBox="0 0 24 24"
                fill={notificationCount > 0 ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={notificationCount > 0 ? "0" : "2"}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-error text-error-content w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full">
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
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-base-300">
                <img
                  src={currentMember.profilePhoto || "/default-avatar.png"}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a>Profile</a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a onClick={() => setUserRole(null)}>Switch Role</a>
              </li>
            </ul>
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
