import React from "react";
import { Member } from "../../types/member";
import ProfileCard from "./ProfileCard";
import ConnectionsCard from "./ConnectionsCard";
import { useMember } from "../../hooks/useMember";

interface MemberProfileProps {
  currentUserId: string;
  member: Member;
  isOwnProfile: boolean;
}

const MemberProfile: React.FC<MemberProfileProps> = ({
  currentUserId,
  member,
  isOwnProfile,
}) => {
  const {
    getVisibleConnections,
    handleFollow,
    handleUnfollow,
    handleBlock,
    handleUnblock,
    handleChat,
  } = useMember(currentUserId);

  const { followers, following } = getVisibleConnections(member.id);

  return (
    <div>
      <ProfileCard
        currentUserId={currentUserId}
        member={member}
        isEditable={isOwnProfile}
        onFollow={() => handleFollow(member)}
        onUnfollow={() => handleUnfollow(member.id)}
        onBlock={() => handleBlock(member)}
        onUnblock={() => handleUnblock(member.id)}
        onChat={() => handleChat(member.id)}
      />

      {member.privacySettings.connectionsVisibility && (
        <ConnectionsCard
          currentUserId={currentUserId}
          followers={followers}
          following={following}
          isVisible={true}
        />
      )}
    </div>
  );
};

export default MemberProfile;
