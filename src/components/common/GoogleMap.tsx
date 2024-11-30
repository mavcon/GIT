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

const GoogleMapComponent: React.FC<MapProps> = ({
  dojos,
  onMarkerClick,
  center = defaultCenter,
  zoom = 11
}) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''
  });

  if (loadError) {
    return (
      <div className="h-[400px] flex items-center justify-center text-base-content/70 bg-base-300/50">
        <div className="text-center">
          <p className="text-lg font-medium">Error loading map</p>
          <p className="text-sm mt-2">Please try again later</p>
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
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      options={{
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      }}
    >
      {dojos.map((dojo) => (
        <Marker
          key={dojo.id}
          position={dojo.coordinates}
          onClick={() => onMarkerClick?.(dojo)}
          icon={{
            url: dojo.isOpen ? '/green-marker.svg' : '/red-marker.svg',
            scaledSize: new window.google.maps.Size(30, 30)
          }}
        />
      ))}
    </GoogleMap>
  );
};

export default GoogleMapComponent;
