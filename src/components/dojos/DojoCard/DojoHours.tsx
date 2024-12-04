import React from 'react';
import { DojoLocation } from '../../../types/dojo';
import ExpandableSection from './shared/ExpandableSection';

interface DojoHoursProps {
  dojo: DojoLocation;
}

const DojoHours: React.FC<DojoHoursProps> = ({ dojo }) => {
  const today = new Date().getDay();
  const currentHours = dojo.operatingHours[today === 0 ? 6 : today - 1];
  const currentHoursSummary = `${currentHours.openTime} - ${currentHours.closeTime}`;

  return (
    <ExpandableSection title="Hours" summary={currentHoursSummary}>
      {dojo.operatingHours.map((hours) => (
        <div key={hours.day} className="flex justify-between text-sm">
          <span className="font-medium">{hours.day}</span>
          <span>{hours.openTime} - {hours.closeTime}</span>
        </div>
      ))}
    </ExpandableSection>
  );
};

export default DojoHours;
