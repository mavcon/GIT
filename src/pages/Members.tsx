import React from "react";
import { Routes, Route, useParams } from "react-router-dom";
import MemberList from "../components/members/MemberList";
import MemberProfile from "../components/members/MemberProfile";
import { BlockedProfileCard } from "../context/ConnectionsContext";
import { useMember } from "../hooks/useMember";

interface MembersPageProps {
  currentUserId: string;
}

const MembersPage: React.FC<MembersPageProps> = ({ currentUserId }) => {
  const {
    getMemberById,
    getAllMembers,
    handleFollow,
    handleUnfollow,
    handleBlock,
    handleUnblock,
    handleChat,
    getConnectionState,
  } = useMember(currentUserId);

  const MemberProfileRoute = () => {
    const { memberId } = useParams();
    const member = memberId ? getMemberById(memberId) : null;

    if (!member) {
      return <div>Member not found</div>;
    }

    const connectionState = getConnectionState(member.id);

    // Show blocked profile card if either user has blocked the other
    if (connectionState.isBlocked || connectionState.isBlockedBy) {
      return <BlockedProfileCard />;
    }

    return (
      <MemberProfile
        currentUserId={currentUserId}
        member={member}
        isOwnProfile={member.id === currentUserId}
      />
    );
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-2xl">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <h1 className="text-xl font-bold mb-4">Members</h1>
              <MemberList
                currentUserId={currentUserId}
                members={getAllMembers()}
                onFollow={handleFollow}
                onUnfollow={handleUnfollow}
                onBlock={handleBlock}
                onUnblock={handleUnblock}
                onChat={handleChat}
              />
            </>
          }
        />
        <Route path=":memberId" element={<MemberProfileRoute />} />
      </Routes>
    </div>
  );
};

export default MembersPage;
