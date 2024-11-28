import React from "react";
import { motion } from "framer-motion";
import MemberProfile from "./MemberProfile";
import { useMember } from "../../hooks/useMember";

interface MemberProfilePageProps {
  currentUserId: string;
}

const MemberProfilePage: React.FC<MemberProfilePageProps> = ({
  currentUserId,
}) => {
  const { getMemberById } = useMember(currentUserId);
  const member = getMemberById(currentUserId);

  if (!member) return null;

  return (
    <div className="container mx-auto px-2 py-2 max-w-2xl">
      <h1 className="text-xl font-bold mb-2">Member Profile</h1>
      <div className="bg-base-100 rounded-lg p-4">
        <MemberProfile
          currentUserId={currentUserId}
          member={member}
          isOwnProfile={true}
        />
      </div>
    </div>
  );
};

export default MemberProfilePage;
