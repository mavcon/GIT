import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MemberNav from "../navigation/MemberNav";
import MemberProfilePage from "../members/MemberProfilePage";
import MembersPage from "../../pages/Members";
import Settings from "../../pages/Settings";
import { motion } from "framer-motion";

// Role-based components
const SuperAdminProfile = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="p-6 bg-base-200"
  >
    <h1 className="text-2xl font-bold">Super Admin Profile</h1>
    <p>Complete system control and management</p>
  </motion.div>
);

const AdminProfile = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="p-6 bg-base-200"
  >
    <h1 className="text-2xl font-bold">Admin Profile</h1>
    <p>System administration and oversight</p>
  </motion.div>
);

const PartnerProfile = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="p-6 bg-base-200"
  >
    <h1 className="text-2xl font-bold">Partner Profile</h1>
    <p>Partnership management and collaboration tools</p>
  </motion.div>
);

const UserProfile = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="p-6 bg-base-200"
  >
    <h1 className="text-2xl font-bold">User Profile</h1>
    <p>Basic user features and access</p>
  </motion.div>
);

interface RoleBasedRoutesProps {
  userRole: string;
  currentUserId: string;
}

const RoleBasedRoutes: React.FC<RoleBasedRoutesProps> = ({
  userRole,
  currentUserId,
}) => {
  const renderRoutes = () => {
    switch (userRole) {
      case "superadmin":
        return <Route path="/superadmin" element={<SuperAdminProfile />} />;
      case "admin":
        return <Route path="/admin" element={<AdminProfile />} />;
      case "partner":
        return <Route path="/partner" element={<PartnerProfile />} />;
      case "member":
        return (
          <>
            <Route
              path="/member"
              element={<MemberProfilePage currentUserId={currentUserId} />}
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
        );
      case "user":
        return <Route path="/user" element={<UserProfile />} />;
      default:
        return null;
    }
  };

  return (
    <main className="container mx-auto py-6 px-4">
      {userRole === "member" && <MemberNav />}
      <Routes>
        {renderRoutes()}
        <Route path="*" element={<Navigate to={`/${userRole}`} replace />} />
      </Routes>
    </main>
  );
};

export default RoleBasedRoutes;
