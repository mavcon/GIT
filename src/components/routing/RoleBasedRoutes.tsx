import React from "react";
import { Routes, Route } from "react-router-dom";
import Members from "../../pages/Members";
import Settings from "../../pages/Settings";
import Dojos from "../../pages/Dojos";
import Stats from "../../pages/Stats";
import Chat from "../../pages/Chat";
import Tools from "../../pages/Tools";

interface RoleBasedRoutesProps {
  userRole: string;
  currentUserId: string;
}

const RoleBasedRoutes: React.FC<RoleBasedRoutesProps> = ({
  userRole,
  currentUserId,
}) => {
  return (
    <Routes>
      <Route path="/" element={<Members currentUserId={currentUserId} />} />
      <Route path="/stats" element={<Stats currentUserId={currentUserId} />} />
      <Route
        path="/members/*"
        element={<Members currentUserId={currentUserId} />}
      />
      <Route path="/dojos" element={<Dojos currentUserId={currentUserId} />} />
      <Route path="/tools" element={<Tools />} />
      <Route
        path="/settings"
        element={<Settings currentUserId={currentUserId} />}
      />
      <Route
        path="/chat/:memberId"
        element={<Chat currentUserId={currentUserId} />}
      />
      <Route
        path="/chat/group/:groupId"
        element={<Chat currentUserId={currentUserId} />}
      />
    </Routes>
  );
};

export default RoleBasedRoutes;
