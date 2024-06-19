import React, { useState, useCallback } from 'react';
import API from '../api';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
const CreateEvent = () => {
  const { token, userId } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    latitude: null,
    longitude: null,
    date: '',
    time: '',
  });
  const [mapCenter, setMapCenter] = useState({ lat: 51.1657, lng: 10.4515 }); // Initial center of the map
  const [autocomplete, setAutocomplete] = useState(null);
  const [markerPosition, setMarkerPosition] = useState({ lat: 59.3293, lng: 18.0686 }); // Default to Stockholm coordinates

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMapClick = useCallback((event) => {
    const latitude = event.latLng.lat();
    const longitude = event.latLng.lng();
    setMarkerPosition({ lat: latitude, lng: longitude });
    setFormData((prevFormData) => ({
      ...prevFormData,
      latitude,
      longitude,
    }));
    setMapCenter({ lat: latitude, lng: longitude });
    fetchAddressFromCoordinates(latitude, longitude);
  }, []);

  const handleAutocompleteLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const handlePlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const location = place.geometry.location;
        setMapCenter({ lat: location.lat(), lng: location.lng() });
        setMarkerPosition({ lat: location.lat(), lng: location.lng() });
        setFormData((prevFormData) => ({
          ...prevFormData,
          location: place.formatted_address,
          latitude: location.lat(),
          longitude: location.lng(),
        }));
      } else {
        console.error('Place has no geometry');
      }
    } else {
      console.error('Autocomplete is not loaded');
    }
  };

  const fetchAddressFromCoordinates = (latitude, longitude) => {
    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat: latitude, lng: longitude };

    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          const address = results[0].formatted_address;
          setFormData((prevFormData) => ({
            ...prevFormData,
            location: address,
          }));
        } else {
          console.error('No results found');
        }
      } else {
        console.error('Geocoder failed due to: ' + status);
      }
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post(
        '/createEvent',
        { ...formData, createdBy: userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate('/'); // Handle success here, e.g., reset the form or show a message
      
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <div>
        <h3>Create Event</h3>
        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
          <strong>Selected Address:</strong> {formData.location}
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ height: '400px', width: '50%' }}>
            <GoogleMap
              mapContainerStyle={{ height: '100%', width: '100%' }}
              center={mapCenter}
              zoom={15}
              onClick={handleMapClick}
            >
              <Marker position={markerPosition} />
            </GoogleMap>
          </div>
          <form onSubmit={handleSubmit} style={{ width: '50%' }}>
            <input
              type="text"
              name="title"
              placeholder="Title"
              onChange={handleChange}
              required
            />
            <br></br>
            <input
              type="text"
              name="description"
              placeholder="Description"
              onChange={handleChange}
              required
            />
            <br></br>
            <Autocomplete onLoad={handleAutocompleteLoad} onPlaceChanged={handlePlaceChanged}>
            <input
            type="text"
            placeholder="Enter a location"
            value={formData.location}
            onChange={handleChange}
            name="location"
            />
            </Autocomplete>
            <input
              type="date"
              name="date"
              onChange={handleChange}
              required
            />
            <input
              type="time"
              name="time"
              onChange={handleChange}
              required
            />
            <br></br>
            <button type="submit">Create Event</button>
          </form>
        </div>
    </div>
  );
};

export default CreateEvent;
