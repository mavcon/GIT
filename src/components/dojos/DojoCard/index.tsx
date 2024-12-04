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
}

const DojoCard: React.FC<DojoCardProps> = ({ dojo, onClick, onCheckInOut, isCheckedIn }) => {
  return (
    <div 
      className={`card bg-base-100 shadow-xl transition-all duration-300 hover:shadow-2xl 
        ${dojo.isOpen ? 'border-2 border-success' : 'border-2 border-transparent'}`}
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
