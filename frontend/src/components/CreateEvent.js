import React, { useState, useCallback } from 'react';
import { useAuth } from '../AuthContext';
import { GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import '../Home.css';

const CreateEvent = ({ onSubmit }) => {
  const { userId } = useAuth();
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
  const [message, setMessage] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure date and time are set
      if (!formData.date || !formData.time) {
        setMessage('Please provide both date and time');
        return;
      }

      // Call onSubmit function passed from props
      const response = await onSubmit({
        ...formData,
        createdBy: userId,
      });

      if (response && response.status === 201) {
        setMessage('Event created successfully');
      } else {
        setMessage('Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      setMessage('Failed to create event');
    }
  };

  return (
    <div>
      <h4>Create Event</h4>
      <div >
        <div>
        <strong>Selected Address:</strong> {formData.location}
      </div>
        <div className='map-container'>
          <GoogleMap
            mapContainerStyle={{ height: '100%', width: '90%' }}
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
            value={formData.title}
            onChange={handleChange}
            required
          />
          <br />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <br />
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
            value={formData.date}
            onChange={handleChange}
            required
          />
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
          <br />
          <button type="submit">Create Event</button>
        </form>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateEvent;
