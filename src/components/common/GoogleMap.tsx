import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { DojoLocation } from '../../types/dojo';

interface MapProps {
  dojos: DojoLocation[];
  onMarkerClick?: (dojo: DojoLocation) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
}

const containerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: 43.6532,
  lng: -79.3832
};

// Define libraries with explicit type
const libraries: ('places')[] = ['places'];

const GoogleMapComponent: React.FC<MapProps> = ({
  dojos,
  onMarkerClick,
  center = defaultCenter,
  zoom = 11
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  if (loadError) {
    console.error('Map load error:', loadError);
    return (
      <div className="h-[400px] flex items-center justify-center text-base-content/70 bg-base-300/50">
        <div className="text-center">
          <p className="text-lg font-medium">Error loading map</p>
          <p className="text-sm mt-2 text-red-500">{loadError.message}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-[400px] flex items-center justify-center text-base-content/70 bg-base-300/50">
        <div className="text-center">
          <p className="text-lg font-medium">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: true,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true
        }}
      >
        {dojos.map((dojo) => (
          <Marker
            key={dojo.id}
            position={dojo.coordinates}
            onClick={() => onMarkerClick?.(dojo)}
            title={dojo.name}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: dojo.isOpen ? '#00C853' : '#D32F2F',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2,
              scale: 10
            }}
          />
        ))}
      </GoogleMap>
      <div className="absolute bottom-4 left-4 text-xs text-gray-600 bg-white px-2 py-1 rounded shadow">
        Markers: {dojos.length}
      </div>
    </div>
  );
};

export default GoogleMapComponent;
