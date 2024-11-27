import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { motion } from "framer-motion";

// Role-based components
const AdminDashboard = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="p-6 bg-gray-100"
  >
    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
    <p>Full system access and management</p>
  </motion.div>
);

const ManagerDashboard = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="p-6 bg-gray-100"
  >
    <h1 className="text-2xl font-bold">Manager Dashboard</h1>
    <p>Team and resource management</p>
  </motion.div>
);

const MemberDashboard = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="p-6 bg-gray-100"
  >
    <h1 className="text-2xl font-bold">Member Dashboard</h1>
    <p>Standard member access</p>
  </motion.div>
);

const GuestDashboard = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="p-6 bg-gray-100"
  >
    <h1 className="text-2xl font-bold">Guest Dashboard</h1>
    <p>Limited preview access</p>
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
    className="flex flex-col items-center justify-center min-h-screen bg-gray-50"
  >
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Select Your Role</h1>
      <div className="grid grid-cols-2 gap-4">
        {["admin", "manager", "member", "guest"].map((role) => (
          <motion.button
            key={role}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onRoleSelect(role)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg capitalize hover:bg-blue-600 transition-colors"
          >
            {role}
          </motion.button>
        ))}
      </div>
    </div>
  </motion.div>
);

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  const handleRoleSelect = (role: string) => {
    setUserRole(role);
  };

  if (!userRole) {
    return <RoleSelector onRoleSelect={handleRoleSelect} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-semibold">Role-Based App</span>
            </div>
            <div className="flex items-center">
              <span className="capitalize px-4 py-2 rounded-md bg-gray-100">
                {userRole} Role
              </span>
              <button
                onClick={() => setUserRole(null)}
                className="ml-4 px-4 py-2 text-sm text-red-600 hover:text-red-800"
              >
                Switch Role
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          {userRole === "admin" && (
            <Route path="/admin" element={<AdminDashboard />} />
          )}
          {userRole === "manager" && (
            <Route path="/manager" element={<ManagerDashboard />} />
          )}
          {userRole === "member" && (
            <Route path="/member" element={<MemberDashboard />} />
          )}
          {userRole === "guest" && (
            <Route path="/guest" element={<GuestDashboard />} />
          )}
          <Route path="*" element={<Navigate to={`/${userRole}`} replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
