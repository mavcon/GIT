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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 bg-base-200"
    >
      <h1 className="text-2xl font-bold mb-6">Member Profile</h1>
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

export default MemberProfilePage;
