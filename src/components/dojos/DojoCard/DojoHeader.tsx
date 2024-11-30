import React from 'react';
import { DojoLocation } from '../../../types/dojo';

interface DojoHeaderProps {
  dojo: DojoLocation;
}

const DojoHeader: React.FC<DojoHeaderProps> = ({ dojo }) => {
  return (
    <>
      <figure className="relative h-48">
        <img 
          src={dojo.bannerImage} 
          alt={dojo.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className={`badge ${dojo.isOpen ? 'badge-success' : 'badge-error'} text-white font-semibold`}>
            {dojo.isOpen ? 'Open' : 'Closed'}
          </span>
        </div>
      </figure>

      <div className="px-4 pt-4">
        <h2 className="card-title text-xl font-bold mb-1">{dojo.name}</h2>
        <a 
          href={`https://maps.google.com/?q=${encodeURIComponent(dojo.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:text-primary-focus hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {dojo.address}
        </a>
      </div>
    </>
  );
};

export default DojoHeader;
