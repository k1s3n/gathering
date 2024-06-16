import React, { useState, useCallback } from 'react';
import API from '../api';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

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
  const [mapClicked, setMapClicked] = useState(false);
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
    setMapClicked(true);
  }, []);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post(
        '/createEvent',
        { ...formData, createdBy: userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);
      console.log('Event created successfully', formData);
      navigate('/'); // Handle success here, e.g., reset the form or show a message
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <div>
      <h3>Create Event</h3>
      <div style={{ height: '400px', width: '100%' }}>
          <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={{ height: '100%', width: '50%' }}
              center={markerPosition}
              zoom={10}
              onClick={handleMapClick}
            >
              {mapClicked && (
                <Marker position={markerPosition} />
              )}
            </GoogleMap>
          </LoadScript>
        </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          onChange={handleChange}
          required
        />
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
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;
