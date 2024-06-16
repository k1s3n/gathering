// googleMapComponent.js
import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const MapComponent = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);

  const markers = [
    { id: 1, position: { lat: 59.3293, lng: 18.0686 }, address: 'Stockholm, Sweden' },
    { id: 2, position: { lat: 52.52, lng: 13.405 }, address: 'Berlin, Germany' },
    // Add more markers as needed
  ];

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker); // Set selected marker for InfoWindow
  };

  const handleMarkerClose = () => {
    setSelectedMarker(null); // Close InfoWindow
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{ height: '400px', width: '100%' }}
        center={{ lat: 51.1657, lng: 10.4515 }} // Center map on Germany
        zoom={5}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            onClick={() => handleMarkerClick(marker)} // Handle marker click
          />
        ))}

        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={handleMarkerClose} // Handle InfoWindow close
          >
            <div>
              <h3>{selectedMarker.address}</h3>
              <p>Additional information can go here</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
