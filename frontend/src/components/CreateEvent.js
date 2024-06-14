import React, { useState } from 'react';
import API from '../api';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const CreateEvent = () => {
  const { token, userId } = useAuth(); // Lägg till userId här
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/createEvent', { ...formData, createdBy: userId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
      navigate('/'); // Hantera framgång här, t.ex. töm formuläret eller visa ett meddelande
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
      <input type="text" name="description" placeholder="Description" onChange={handleChange} required />
      <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
      <input type="date" name="date" onChange={handleChange} required />
      <input type="time" name="time" onChange={handleChange} required />
      <button type="submit">Create Event</button>
    </form>
  );
};

export default CreateEvent;
