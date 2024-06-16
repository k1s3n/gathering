import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import API from '../api';
import Login from '../components/Login';
import Logout from '../components/Logout';
import Register from '../components/Register';
import CreateEvent from '../components/CreateEvent';
import Profile from '../components/Profile';
import CalendarComponent from '../components/CalendarComponent';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Link } from 'react-router-dom';
import '../Home.css';
import '../css/calendar.css';

const Home = () => {
  const { token, userId, userInfo, resetShowStateFlag} = useAuth();
  const [events, setEvents] = useState([]);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // calender import
  const [showCalendar, setShowCalendar] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    setShowCalendar(false);
    setShowCreateEvent(false);
    setShowProfile(false);
  }, [resetShowStateFlag]);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await API.get('/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [token]);

  const handleLoginClick = () => {
    setShowLogin(!showLogin);
    setShowRegister(false);
  };

  const handleCreateEventClick = () => {
    setShowCreateEvent(!showCreateEvent);
    setShowProfile(false);
    setShowCalendar(false);
  };

  const handleRegisterClick = () => {
    setShowRegister(!showRegister);
    setShowLogin(false);
  };

  const handleProfileClick = () => {
    setShowProfile(!showProfile);
    setShowCreateEvent(false);
    setShowCalendar(false);
  };

  const handleCalendarClick = () => {
    setShowCalendar(!showCalendar);
    setShowProfile(false);
    setShowCreateEvent(false);
  };

  useEffect(() => {
    // Filter events based on selectedDate
    if (selectedDate) {
      const filtered = events.filter((event) => {
        return new Date(event.date).toDateString() === selectedDate.toDateString();
      });
      setFilteredEvents(filtered);
    } else {
      // If no date is selected, show all events
      setFilteredEvents(events);
    }
  }, [events, selectedDate]);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

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
          {/*Show login and register components based on their state */}
          {showRegister && <Register />}
          {showLogin && <Login />}
          {!showLogin && (
            <p>
              You must be logged in to create an event. <a onClick={handleLoginClick}><Link>Login</Link></a>
            </p>
          )}
        </>
      )}
      {showProfile && <Profile />}
      {showCreateEvent && <CreateEvent />}
      {/* Display events calender */}
      {showCalendar && <CalendarComponent events={events} onDateChange={handleDateChange} />}
      <div className='container-header'><h1>Events</h1></div>
      {filteredEvents.length > 0 ? (
        filteredEvents.map((event) => (
          <div className='container' key={event._id}>
            <h2>{event.title}</h2>
            {event.latitude && event.longitude ? (
              <div className='map-container' style={{ height: '300px', width: '100%' }}>
              <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                  mapContainerStyle={{ height: '100%', width: '100%' }}
                  center={{ lat:event.latitude, lng: event.longitude }}
                  zoom={10}
                >
                  <Marker position={{ lat: event.latitude, lng: event.longitude }} />
                </GoogleMap>
              </LoadScript>
              </div>
              ) : (
                <p className='no-coordinates'>No coordinates available</p>
              )}
            <p >Date: {new Date(event.date).toLocaleDateString()} Time: {event.time}</p>
            <p>Desc: {event.description}</p>
            <p>Location: {event.location}</p> 
          </div>
        ))
      ) : (
        <p>No events found for the selected date.</p>
      )}
      {/* Display events calender */}
    </div>
  );
};

export default Home;
