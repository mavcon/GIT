import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Members from '../../pages/Members';
import Settings from '../../pages/Settings';
import Dojos from '../../pages/Dojos';

interface RoleBasedRoutesProps {
  userRole: string;
  currentUserId: string;
}

const RoleBasedRoutes: React.FC<RoleBasedRoutesProps> = ({ userRole, currentUserId }) => {
  return (
    <Routes>
      <Route path="/" element={<Members currentUserId={currentUserId} />} />
      <Route path="/members/*" element={<Members currentUserId={currentUserId} />} />
      <Route path="/dojos" element={<Dojos currentUserId={currentUserId} />} />
      <Route path="/settings" element={<Settings currentUserId={currentUserId} />} />
    </Routes>
  );
};

export default RoleBasedRoutes;
