import React, { useState, useCallback } from 'react';
import { DojoLocation } from '../types/dojo';
import DojoCard from '../components/dojos/DojoCard/DojoCard';
import Toast from '../components/common/Toast';
import GoogleMap from '../components/common/GoogleMap';

interface DojosProps {
  currentUserId: string;
}

// Temporary dummy data until we connect to the backend
const dummyDojos: { [key: string]: DojoLocation } = {
  'dojo-1': {
    id: 'dojo-1',
    name: 'Downtown Toronto Dojo',
    address: '123 Queen Street West, Toronto, ON M5H 2M9',
    coordinates: {
      lat: 43.6532,
      lng: -79.3832
    },
    bannerImage: 'https://source.unsplash.com/random/800x400/?martial-arts-gym',
    operatingHours: [
      { day: 'Monday', openTime: '06:00', closeTime: '22:00', isOpen: true },
      { day: 'Tuesday', openTime: '06:00', closeTime: '22:00', isOpen: true },
      { day: 'Wednesday', openTime: '06:00', closeTime: '22:00', isOpen: true },
      { day: 'Thursday', openTime: '06:00', closeTime: '22:00', isOpen: true },
      { day: 'Friday', openTime: '06:00', closeTime: '21:00', isOpen: true },
      { day: 'Saturday', openTime: '08:00', closeTime: '20:00', isOpen: true },
      { day: 'Sunday', openTime: '08:00', closeTime: '20:00', isOpen: true }
    ],
    amenities: {
      hasWashroom: true,
      hasChangeRooms: true,
      hasShowers: true,
      hasLockers: true
    },
    capacity: {
      current: 15,
      maximum: 50
    },
    checkedInMembers: ['member-1', 'member-2', 'member-3'],
    isOpen: true
  },
  'dojo-2': {
    id: 'dojo-2',
    name: 'North York Dojo',
    address: '789 Yonge Street, Toronto, ON M2N 6M4',
    coordinates: {
      lat: 43.7615,
      lng: -79.4111
    },
    bannerImage: 'https://source.unsplash.com/random/800x400/?dojo',
    operatingHours: [
      { day: 'Monday', openTime: '08:00', closeTime: '20:00', isOpen: true },
      { day: 'Tuesday', openTime: '08:00', closeTime: '20:00', isOpen: true },
      { day: 'Wednesday', openTime: '08:00', closeTime: '20:00', isOpen: true },
      { day: 'Thursday', openTime: '08:00', closeTime: '20:00', isOpen: true },
      { day: 'Friday', openTime: '08:00', closeTime: '19:00', isOpen: true },
      { day: 'Saturday', openTime: '09:00', closeTime: '18:00', isOpen: true },
      { day: 'Sunday', openTime: '10:00', closeTime: '17:00', isOpen: true }
    ],
    amenities: {
      hasWashroom: true,
      hasChangeRooms: true,
      hasShowers: false,
      hasLockers: false
    },
    capacity: {
      current: 12,
      maximum: 40
    },
    checkedInMembers: ['member-4', 'member-5'],
    isOpen: true
  },
  'dojo-3': {
    id: 'dojo-3',
    name: 'Scarborough Dojo',
    address: '456 Kennedy Road, Toronto, ON M1K 2G4',
    coordinates: {
      lat: 43.7280,
      lng: -79.2640
    },
    bannerImage: 'https://source.unsplash.com/random/800x400/?training-gym',
    operatingHours: [
      { day: 'Monday', openTime: '07:00', closeTime: '21:00', isOpen: true },
      { day: 'Tuesday', openTime: '07:00', closeTime: '21:00', isOpen: true },
      { day: 'Wednesday', openTime: '07:00', closeTime: '21:00', isOpen: true },
      { day: 'Thursday', openTime: '07:00', closeTime: '21:00', isOpen: true },
      { day: 'Friday', openTime: '07:00', closeTime: '20:00', isOpen: true },
      { day: 'Saturday', openTime: '09:00', closeTime: '17:00', isOpen: true },
      { day: 'Sunday', openTime: '09:00', closeTime: '17:00', isOpen: true }
    ],
    amenities: {
      hasWashroom: true,
      hasChangeRooms: true,
      hasShowers: true,
      hasLockers: true
    },
    capacity: {
      current: 8,
      maximum: 30
    },
    checkedInMembers: ['member-6'],
    isOpen: false
  }
};

const Dojos: React.FC<DojosProps> = ({ currentUserId }) => {
  const [selectedDojo, setSelectedDojo] = useState<DojoLocation | null>(null);
  const [checkedInDojoId, setCheckedInDojoId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const dojos = Object.values(dummyDojos);

  const handleCheckInOut = useCallback((dojoId: string) => {
    const dojo = dummyDojos[dojoId];
    if (!dojo) return;

    setCheckedInDojoId(prevId => {
      const isCheckingIn = prevId !== dojoId;
      setToast({
        message: isCheckingIn 
          ? `Successfully checked in to ${dojo.name}` 
          : `Successfully checked out from ${dojo.name}`,
        type: 'success'
      });
      return isCheckingIn ? dojoId : null;
    });
  }, []);

  const handleMarkerClick = useCallback((dojo: DojoLocation) => {
    setSelectedDojo(dojo);
    // Scroll to the dojo card
    const dojoCard = document.getElementById(`dojo-card-${dojo.id}`);
    if (dojoCard) {
      dojoCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <h1 className="text-xl font-bold mb-4">Open Mats</h1>
      
      {/* Map Section */}
      <div className="card bg-base-100 shadow-lg mb-4 overflow-hidden">
        <GoogleMap
          dojos={dojos}
          onMarkerClick={handleMarkerClick}
          center={selectedDojo?.coordinates}
        />
      </div>

      {/* Dojo Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dojos.map((dojo: DojoLocation) => (
          <DojoCard
            key={dojo.id}
            dojo={dojo}
            onCheckInOut={handleCheckInOut}
            isCheckedIn={checkedInDojoId === dojo.id}
            onClick={() => setSelectedDojo(dojo)}
            id={`dojo-card-${dojo.id}`}
          />
        ))}
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Dojos;
