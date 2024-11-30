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
}

const DojoCard: React.FC<DojoCardProps> = ({ 
  dojo, 
  onClick, 
  onCheckInOut, 
  isCheckedIn,
  id
}) => {
  return (
    <div 
      id={id}
      className={`card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300
        ${dojo.isOpen ? 'ring-2 ring-success ring-opacity-50' : ''}`}
      onClick={onClick}
    >
      <DojoHeader dojo={dojo} />
      <div className="card-body p-4">
        <DojoHours dojo={dojo} />
        <DojoAmenities dojo={dojo} />
        <DojoCapacity dojo={dojo} />
        <DojoAttendees dojo={dojo} />
        <DojoCheckInButton 
          dojo={dojo} 
          onCheckInOut={onCheckInOut} 
          isCheckedIn={isCheckedIn} 
        />
      </div>
    </div>
  );
};

export default DojoCard;
