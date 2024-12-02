import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DojoLocation } from '../../../types/dojo';
import ExpandableSection from './shared/ExpandableSection';
import { useMember } from '../../../hooks/useMember';
import { dummyMembers, convertDBMemberToMember } from '../../../db/dummy-data';
import DojoAttendeeItem from './DojoAttendeeItem';

interface DojoAttendeesProps {
  dojo: DojoLocation;
  currentUserId?: string;
}

const DojoAttendees: React.FC<DojoAttendeesProps> = ({ 
  dojo, 
  currentUserId = "1"
}) => {
  const navigate = useNavigate();
  const { 
    handleFollow, 
    handleUnfollow, 
    handleBlock, 
    handleUnblock,
    handleChat, 
    getConnectionState 
  } = useMember(currentUserId);

  const attendeeCount = `${dojo.checkedInMembers.length} ${dojo.checkedInMembers.length === 1 ? 'person' : 'people'}`;

  const handleMemberClick = (memberId: string) => {
    navigate(`/members/${memberId}`);
  };

  const renderAttendeeList = () => {
    if (dojo.checkedInMembers.length === 0) {
      return (
        <div className="text-sm text-base-content/70 text-center">
          No members currently checked in
        </div>
      );
    }

    return dojo.checkedInMembers.map((memberId) => {
      const dbMember = dummyMembers.find(m => m.id === memberId);
      if (!dbMember) return null;
      
      const member = convertDBMemberToMember(dbMember);
      const connectionState = getConnectionState(member.id);

      // Don't show blocked members
      if (connectionState.isBlocked || connectionState.isBlockedBy) {
        return null;
      }

      return (
        <DojoAttendeeItem
          key={memberId}
          member={member}
          currentUserId={currentUserId}
          connectionState={connectionState}
          onMemberClick={handleMemberClick}
          onChat={handleChat}
          onFollow={handleFollow}
          onUnfollow={handleUnfollow}
          onBlock={handleBlock}
          onUnblock={handleUnblock}
        />
      );
    }).filter(Boolean);
  };

  return (
    <ExpandableSection title="Current Attendees" summary={attendeeCount}>
      <div className="divide-y divide-base-200">
        {renderAttendeeList()}
      </div>
    </ExpandableSection>
  );
};

export default DojoAttendees;
