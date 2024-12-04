import React from 'react';
import { DojoLocation } from '../../../types/dojo';
import DojoHeader from './DojoHeader';
import DojoHours from './DojoHours';
import DojoAmenities from './DojoAmenities';
import DojoCapacity from './DojoCapacity';
import DojoAttendees from './DojoAttendees';
import DojoCheckInButton from './DojoCheckInButton';

interface DojoCardProps {
  dojo: DojoLocation;
  onClick?: () => void;
  onCheckInOut?: (dojoId: string) => void;
  isCheckedIn?: boolean;
  id?: string;
  currentUserId?: string;
}

const getCardClasses = (isOpen: boolean): string => {
  const baseClasses = 'card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300';
  const statusClasses = isOpen ? 'ring-2 ring-success ring-opacity-50' : '';
  return `${baseClasses} ${statusClasses}`.trim();
};

const DojoCard: React.FC<DojoCardProps> = ({ 
  dojo, 
  onClick, 
  onCheckInOut, 
  isCheckedIn,
  id,
  currentUserId
}) => {
  const renderCardContent = () => (
    <div className="card-body p-4">
      <DojoHours dojo={dojo} />
      <DojoAmenities dojo={dojo} />
      <DojoCapacity dojo={dojo} />
      <DojoAttendees dojo={dojo} currentUserId={currentUserId} />
      <DojoCheckInButton 
        dojo={dojo} 
        onCheckInOut={onCheckInOut} 
        isCheckedIn={isCheckedIn} 
      />
    </div>
  );

  return (
    <div 
      id={id}
      className={getCardClasses(dojo.isOpen)}
      onClick={onClick}
    >
      <DojoHeader dojo={dojo} />
      {renderCardContent()}
    </div>
  );
};

export default DojoCard;
