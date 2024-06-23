import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../AuthContext';
import API from '../api';
import Login from '../components/Login';
import Logout from '../components/Logout';
import Register from '../components/Register';
import CreateEvent from '../components/CreateEvent';
import Profile from '../components/Profile';
import CalendarComponent from '../components/CalendarComponent';
import Comment from '../components/comment';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { Link } from 'react-router-dom';
import '../Home.css'; // Ensure you have the correct path to your CSS file
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
  const [commentsVisible, setCommentsVisible] = useState({}); // Track which events have comments visible

  const fetchEvents = useCallback(async () => {
    try {
      const response = await API.get('/events');
      const fetchedEvents = response.data;

      // Fetch comments for each event to get comment count
      const eventsWithCommentCount = await Promise.all(
        fetchedEvents.map(async (event) => {
          const commentsResponse = await API.get(`/comments/${event._id}`);
          event.commentCount = commentsResponse.data.length;
          return event;
        })
      );

      const sortedEvents = eventsWithCommentCount.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;
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
      const sorted = events.slice().sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;
        const timeA = parseInt(a.time.replace(':', ''), 10);
        const timeB = parseInt(b.time.replace(':', ''), 10);
        return timeA - timeB;
      });
      setFilteredEvents(sorted);
    }
  }, [events]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, token]);

  useEffect(() => {
    filterEventsByDate(selectedDate);
  }, [events, selectedDate, filterEventsByDate]);

  useEffect(() => {
    setShowCalendar(false);
    setShowCreateEvent(false);
    setShowProfile(false);
  }, [resetShowStateFlag]);

  const handleToggleState = useCallback((setState, stateToToggle) => {
    setState((prevState) => !prevState);
    if (stateToToggle !== showLogin) setShowLogin(false);
    if (stateToToggle !== showRegister) setShowRegister(false);
    if (stateToToggle !== showCreateEvent) setShowCreateEvent(false);
    if (stateToToggle !== showProfile) setShowProfile(false);
    if (stateToToggle !== showCalendar) setShowCalendar(false);
  }, [showLogin, showRegister, showCreateEvent, showProfile, showCalendar]);

  const handleLoginClick = useCallback(() => {
    handleToggleState(setShowLogin, showLogin);
  }, [handleToggleState, showLogin]);

  const handleCreateEventClick = useCallback(() => {
    handleToggleState(setShowCreateEvent, showCreateEvent);
  }, [handleToggleState, showCreateEvent]);

  const handleRegisterClick = useCallback(() => {
    handleToggleState(setShowRegister, showRegister);
  }, [handleToggleState, showRegister]);

  const handleProfileClick = useCallback(() => {
    handleToggleState(setShowProfile, showProfile);
  }, [handleToggleState, showProfile]);

  const handleCalendarClick = useCallback(() => {
    handleToggleState(setShowCalendar, showCalendar);
  }, [handleToggleState, showCalendar]);

  const handleCommentClick = (eventId) => {
    setCommentsVisible((prevState) => ({
      ...prevState,
      [eventId]: !prevState[eventId],
    }));
  };


  const handleDateChange = useCallback((newDate) => {
    setSelectedDate(newDate);
  }, []);

  const handleFormSubmit = useCallback(async (formData) => {
    try {
      const response = await API.post('/createEvent', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        fetchEvents();
        setShowCreateEvent(false);
        setMessage('Event created successfully');
      } else {
        setMessage('Failed to create event');
      }
    } catch (error) {
      if (error.response) {
        console.error('Server responded with a non-2xx status:', error.response.data);
      } else if (error.request) {
        console.error('Request made but no response received:', error.request);
      } else {
        console.error('Error setting up the request:', error.message);
      }
      setMessage('Failed to create event');
    }
  }, [fetchEvents, token]);

  const openGoogleMaps = useCallback((event) => {
    const { latitude, longitude } = event;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(url, '_blank');
  }, []);

  return (
    <div className="home-container">
      <div className="left-column">
        {token ? (
          <>
            {userInfo ? (
              <div className='welcome'>
                <h3>Welcome {userInfo.username} </h3>
              </div>
            ) : (
              <p>Loading user info...</p>
            )}
            <button onClick={handleCreateEventClick}>
              {showCreateEvent ? 'Cancel' : 'Create Event'}
            </button>
            <button onClick={handleProfileClick}>
              {showProfile ? 'Cancel' : 'Profile'}
            </button>
            <button><Logout /></button>
            <p>{message && <p>{message}</p>}</p>
          </>
        ) : (
          <>
            <h3>Welcome to the gathering</h3>
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
      </div>
      <div className="events-column">
        <div className="container-header">
          <h1>Events</h1>
        </div>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div className="event-container" key={event._id}>
              <h2>{event.title}</h2>
              {event.latitude && event.longitude ? (
                <div className="map-container">
                  <GoogleMap
                    mapContainerStyle={{ height: '200px', width: '100%' }}
                    center={{ lat: event.latitude, lng: event.longitude }}
                    zoom={11}
                  >
                    <Marker position={{ lat: event.latitude, lng: event.longitude }} />
                  </GoogleMap>
                </div>
              ) : (
                <p className="no-coordinates">No coordinates available</p>
              )}
              <div className="event-details">
                <p>
                  Date: {new Date(event.date).toLocaleDateString()} Time: {event.time}
                </p>
                <p>Info: {event.description}</p>
                <Link onClick={() => openGoogleMaps(event)}>{event.location}</Link>
              </div>
              <div style={{textAlign: 'center'}}>
              <Link onClick={() => handleCommentClick(event._id)}>
                  <h3>Comments ({event.commentCount || 0})</h3>
                </Link>
                {commentsVisible[event._id] && <Comment eventId={event._id} />}
            </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center' }}>
            {selectedDate
              ? `No events on ${selectedDate.toLocaleDateString()}`
              : 'No events found for the selected date.'}
          </p>
        )}
      </div>
      <div className="right-column">
        <div className='sticky-calendar'>
          <CalendarComponent events={events} onDateChange={handleDateChange} />
        </div>
      </div>
    </div>
  );
};

export default Home;
