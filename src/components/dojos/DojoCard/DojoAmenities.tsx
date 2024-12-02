import React from 'react';
import { DojoLocation } from '../../../types/dojo';
import AmenityIcon from './shared/AmenityIcon';

interface DojoAmenitiesProps {
  dojo: DojoLocation;
}

interface AmenityConfig {
  type: 'washroom' | 'changeRooms' | 'showers' | 'lockers';
  name: string;
  isAvailable: (amenities: DojoLocation['amenities']) => boolean;
}

const AMENITY_CONFIG: AmenityConfig[] = [
  {
    type: 'washroom',
    name: 'Washroom',
    isAvailable: (amenities) => amenities.hasWashroom,
  },
  {
    type: 'changeRooms',
    name: 'Change Rooms',
    isAvailable: (amenities) => amenities.hasChangeRooms,
  },
  {
    type: 'showers',
    name: 'Showers',
    isAvailable: (amenities) => amenities.hasShowers,
  },
  {
    type: 'lockers',
    name: 'Lockers',
    isAvailable: (amenities) => amenities.hasLockers,
  },
];

const DojoAmenities: React.FC<DojoAmenitiesProps> = ({ dojo }) => {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3">
      {AMENITY_CONFIG.map((amenity) => (
        <div
          key={amenity.type}
          className={`flex items-center gap-2 p-2 rounded-lg transition-colors
            ${amenity.isAvailable(dojo.amenities) 
              ? 'text-success bg-success/10' 
              : 'text-base-content/30 bg-base-200'}`}
        >
          <AmenityIcon type={amenity.type} />
          <span className="text-sm font-medium">{amenity.name}</span>
        </div>
      ))}
    </div>
  );
};

export default DojoAmenities;
