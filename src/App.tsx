import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import MemberProfile from "./components/members/MemberProfile";
import MembersPage from "./pages/Members";
import Settings from "./pages/Settings";
import MemberNav from "./components/navigation/MemberNav";
import { ThemeProvider, ThemeToggle } from "./context/ThemeContext";
import { ConnectionsProvider } from "./context/ConnectionsContext";
import { useMember } from "./hooks/useMember";
import storageService from "./services/storage";

// Role-based components
const SuperAdminDashboard = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="p-6 bg-base-200"
  >
    <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
    <p>Complete system control and management</p>
  </motion.div>
);

const AdminDashboard = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="p-6 bg-base-200"
  >
    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
    <p>System administration and oversight</p>
  </motion.div>
);

const PartnerDashboard = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="p-6 bg-base-200"
  >
    <h1 className="text-2xl font-bold">Partner Dashboard</h1>
    <p>Partnership management and collaboration tools</p>
  </motion.div>
);

interface MemberDashboardProps {
  currentUserId: string;
}

const MemberDashboard: React.FC<MemberDashboardProps> = ({ currentUserId }) => {
  const { getMemberById } = useMember(currentUserId);
  const member = getMemberById(currentUserId);

  if (!member) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 bg-base-200"
    >
      <h1 className="text-2xl font-bold mb-6">Member Dashboard</h1>
      <div className="mt-6">
        <MemberProfile
          currentUserId={currentUserId}
          member={member}
          isOwnProfile={true}
        />
      </div>
    </motion.div>
  );
};

const UserDashboard = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="p-6 bg-base-200"
  >
    <h1 className="text-2xl font-bold">User Dashboard</h1>
    <p>Basic user features and access</p>
  </motion.div>
);

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
  const currentUserId = "1"; // Using ID "1" to match dummy data

  // Reset storage and reinitialize on first load
  useEffect(() => {
    storageService.resetStorage();
  }, []);

  if (!userRole) {
    return <RoleSelector onRoleSelect={setUserRole} />;
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-lg">
        <div className="navbar-start">
          <span className="text-xl font-semibold">Role-Based App</span>
        </div>
        <div className="navbar-end">
          <span className="badge badge-lg mr-2">
            {userRole === "superadmin" ? "Super Admin" : userRole} Role
          </span>
          <ThemeToggle />
          <button
            onClick={() => setUserRole(null)}
            className="btn btn-ghost btn-sm ml-2"
          >
            Switch Role
          </button>
        </div>
      </div>

      <main className="container mx-auto py-6 px-4">
        {userRole === "member" && <MemberNav />}
        <Routes>
          {userRole === "superadmin" && (
            <Route path="/superadmin" element={<SuperAdminDashboard />} />
          )}
          {userRole === "admin" && (
            <Route path="/admin" element={<AdminDashboard />} />
          )}
          {userRole === "partner" && (
            <Route path="/partner" element={<PartnerDashboard />} />
          )}
          {userRole === "member" && (
            <>
              <Route
                path="/member"
                element={<MemberDashboard currentUserId={currentUserId} />}
              />
              <Route
                path="/members/*"
                element={<MembersPage currentUserId={currentUserId} />}
              />
              <Route
                path="/settings"
                element={<Settings currentUserId={currentUserId} />}
              />
            </>
          )}
          {userRole === "user" && (
            <Route path="/user" element={<UserDashboard />} />
          )}
          <Route path="*" element={<Navigate to={`/${userRole}`} replace />} />
        </Routes>
      </main>
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
