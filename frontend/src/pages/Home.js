import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../AuthContext';
import API from '../api';
import Login from '../components/Login';
import Logout from '../components/Logout';
import Register from '../components/Register';
import CreateEvent from '../components/CreateEvent';
import Profile from '../components/Profile';
import CalendarComponent from '../components/CalendarComponent';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { Link } from 'react-router-dom';
import '../Home.css';
import '../css/calendar.css';

const Home = () => {
  const { token, userInfo, resetShowStateFlag } = useAuth();
  const [events, setEvents] = useState([]);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [message, setMessage] = useState('');

  const fetchEvents = useCallback(async () => {
    try {
      const response = await API.get('/events');
      const sortedEvents = response.data.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;
        // Dates are the same, compare times
        const timeA = parseInt(a.time.replace(':', ''), 10);
        const timeB = parseInt(b.time.replace(':', ''), 10);
        return timeA - timeB;
      });
      setEvents(sortedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }, []);

  const filterEventsByDate = useCallback((date) => {
    if (date) {
      const filtered = events.filter((event) => new Date(event.date).toLocaleDateString() === date.toLocaleDateString());
      const sorted = filtered.sort((a, b) => {
      const timeA = parseInt(a.time.replace(':', ''), 10);
      const timeB = parseInt(b.time.replace(':', ''), 10);
      return timeA - timeB;
      });
      setFilteredEvents(sorted);
    } else {
      // If date is null or undefined, show all events
      const sorted = events.slice().sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;
        // Dates are the same, compare times
        const timeA = parseInt(a.time.replace(':', ''), 10);
        const timeB = parseInt(b.time.replace(':', ''), 10);
        return timeA - timeB;
      });
      setFilteredEvents(sorted);
    }
  }, [events]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, token]); // Include fetchEvents and token in dependency array

  useEffect(() => {
    filterEventsByDate(selectedDate);
  }, [events, selectedDate, filterEventsByDate]); // Include events, selectedDate, and filterEventsByDate in dependency array

  useEffect(() => {
    setShowCalendar(false);
    setShowCreateEvent(false);
    setShowProfile(false);
  }, [resetShowStateFlag]); // Include resetShowStateFlag in dependency array

  const handleToggleState = useCallback((setState, stateToToggle) => {
    setState((prevState) => !prevState);
    if (stateToToggle !== showLogin) setShowLogin(false);
    if (stateToToggle !== showRegister) setShowRegister(false);
    if (stateToToggle !== showCreateEvent) setShowCreateEvent(false);
    if (stateToToggle !== showProfile) setShowProfile(false);
    if (stateToToggle !== showCalendar) setShowCalendar(false);
  }, [showLogin, showRegister, showCreateEvent, showProfile, showCalendar]); // Include showLogin, showRegister, showCreateEvent, showProfile, and showCalendar in dependency array

  const handleLoginClick = useCallback(() => {
    handleToggleState(setShowLogin, showLogin);
  }, [handleToggleState, showLogin]); // Include handleToggleState and showLogin in dependency array

  const handleCreateEventClick = useCallback(() => {
    handleToggleState(setShowCreateEvent, showCreateEvent);
  }, [handleToggleState, showCreateEvent]); // Include handleToggleState and showCreateEvent in dependency array

  const handleRegisterClick = useCallback(() => {
    handleToggleState(setShowRegister, showRegister);
  }, [handleToggleState, showRegister]); // Include handleToggleState and showRegister in dependency array

  const handleProfileClick = useCallback(() => {
    handleToggleState(setShowProfile, showProfile);
  }, [handleToggleState, showProfile]); // Include handleToggleState and showProfile in dependency array

  const handleCalendarClick = useCallback(() => {
    handleToggleState(setShowCalendar, showCalendar);
  }, [handleToggleState, showCalendar]); // Include handleToggleState and showCalendar in dependency array

  const handleDateChange = useCallback((newDate) => {
    setSelectedDate(newDate);
  }, []); // No dependencies needed here

  const handleFormSubmit = useCallback(async (formData) => {
    try {
      const response = await API.post('/createEvent', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        fetchEvents(); // Refresh events list after creating a new event
        setShowCreateEvent(false);
        setMessage('Event created successfully');
      } else {
        setMessage('Failed to create event');
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Server responded with a non-2xx status:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Request made but no response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an error
        console.error('Error setting up the request:', error.message);
      }
      setMessage('Failed to create event');
    }
  }, [fetchEvents, token]); // Include fetchEvents and token in dependency array

  return (
    <div>
      {token ? (
        <>
          {userInfo ? (
            <h1>Welcome [{userInfo.email}]</h1>
          ) : (
            <p>Loading user info...</p>
          )}
          <button onClick={handleCreateEventClick}>
            {showCreateEvent ? 'Cancel' : 'Create Event'}
          </button>
          <button onClick={handleProfileClick}>
            {showProfile ? 'Cancel' : 'Profile'}
          </button>
          <button onClick={handleCalendarClick}>
            {showCalendar ? 'Cancel' : 'Calendar'}
          </button>
          <button>
            <Logout />
          </button>
          <p>{message && <p>{message}</p>}</p>
        </>
      ) : (
        <>
          <h1>Welcome to the gathering</h1>
          <button onClick={handleLoginClick}>
            {showLogin ? 'Cancel' : 'Login'}
          </button>
          <button onClick={handleRegisterClick}>
            {showRegister ? 'Cancel' : 'Register'}
          </button>
          <button onClick={handleCalendarClick}>
            {showCalendar ? 'Cancel' : 'Calendar'}
          </button>
          {showRegister && <Register />}
          {showLogin && <Login />}
          {!showLogin && !showRegister && (
            <p>
              You must be logged in to create an event.{' '}
              <Link onClick={handleLoginClick}>Login</Link> or{' '}
              <Link onClick={handleRegisterClick}>Register</Link>
            </p>
          )}
        </>
      )}
      {showProfile && <Profile />}
      {showCreateEvent && <CreateEvent onSubmit={handleFormSubmit} />}
      {showCalendar && <CalendarComponent events={events} onDateChange={handleDateChange} />}
      <div className='container-header'>
        <h1>Events</h1>
      </div>
      {filteredEvents.length > 0 ? (
        filteredEvents.map((event) => (
          <div className='container' key={event._id}>
            <h2>{event.title}</h2>
            {event.latitude && event.longitude ? (
              <div className='map-container' style={{ height: '300px', width: '100%' }}>
                <GoogleMap
                  mapContainerStyle={{ height: '100%', width: '100%' }}
                  center={{ lat: event.latitude, lng: event.longitude }}
                  zoom={11}
                >
                  <Marker position={{ lat: event.latitude, lng: event.longitude }} />
                </GoogleMap>
              </div>
            ) : (
              <p className='no-coordinates'>No coordinates available</p>
            )}
            <p>
              Date: {new Date(event.date).toLocaleDateString()} Time: {event.time}
            </p>
            <p>Desc: {event.description}</p>
            <p>Location: {event.location}</p>
          </div>
        ))
      ) : (
        <p>{selectedDate ? `No events on ${selectedDate.toLocaleDateString()}` : 'No events found for the selected date.'}</p>
      )}
    </div>
  );
};

export default Home;
