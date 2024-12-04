import React from 'react';
import { DojoLocation } from '../../../types/dojo';

interface DojoCapacityProps {
  dojo: DojoLocation;
}

const DojoCapacity: React.FC<DojoCapacityProps> = ({ dojo }) => {
  const capacityPercentage = (dojo.capacity.current / dojo.capacity.maximum) * 100;

  const getCapacityColor = () => {
    if (capacityPercentage > 80) return 'bg-error';
    if (capacityPercentage > 50) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold">Capacity</span>
        <span className="text-sm font-medium">
          {dojo.capacity.current}/{dojo.capacity.maximum}
        </span>
      </div>
      <div className="w-full bg-base-200 rounded-full h-2.5">
        <div 
          className={`h-full rounded-full transition-all duration-300 ${getCapacityColor()}`}
          style={{ width: `${capacityPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default DojoCapacity;
