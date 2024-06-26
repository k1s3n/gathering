import React, { useEffect, useState, useCallback, useRef } from 'react';
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

// Example with custom options
const options = {
  weekday: 'long', // e.g., "Monday"
  year: 'numeric', // e.g., "2023"
  month: 'long', // e.g., "June"
  day: 'numeric' // e.g., "23"
};

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
  const [commentsVisible, setCommentsVisible] = useState({});
  const [showCalendarPanel, setShowCalendarPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const calendarRef = useRef(null); // Ref to access CalendarComponent instance

  const toggleCalendarPanel = () => {
    setShowCalendarPanel((prevState) => !prevState);
  };

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

  const handleSearchChange = useCallback((event) => {
    const query = event.target.value.toLowerCase().trim();
    console.log('Search query:', query);
    setFilteredEvents(events.filter(event => {
      console.log('Event:', event.title, event.location, event.date);
      // Check if the query matches title, location, or date
      return (
        event.title.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        new Date(event.date).toLocaleDateString('en-GB').includes(query)
      );
    }));

    setSearchQuery(event.target.value);
  }, [events]);

  const handleSearchFieldClick = useCallback(() => {
    setSearchQuery('');
    // Clear selected date in CalendarComponent
    if (calendarRef.current) {
      calendarRef.current.clearSelectedDate();
    }
  }, []);

  const filterEvents = useCallback(() => {
    let filtered = events.slice(); // Start with all events

    // Filter by selected date
    if (selectedDate) {
      filtered = filtered.filter(
        (event) => new Date(event.date).toLocaleDateString() === selectedDate.toLocaleDateString()
      );
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const lowerCaseQuery = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(lowerCaseQuery) ||
        event.location.toLowerCase().includes(lowerCaseQuery) ||
        new Date(event.date).toLocaleDateString('en-GB').includes(lowerCaseQuery)
      );
    }

    // Sort by date and time
    const sorted = filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;
      const timeA = parseInt(a.time.replace(':', ''), 10);
      const timeB = parseInt(b.time.replace(':', ''), 10);
      return timeA - timeB;
    });

    setFilteredEvents(sorted);
  }, [events, selectedDate, searchQuery]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, token]);

  useEffect(() => {
    filterEvents();
  }, [events, selectedDate, searchQuery, filterEvents]);

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

  const handleCommentClick = (eventId) => {
    setCommentsVisible((prevState) => ({
      ...prevState,
      [eventId]: !prevState[eventId],
    }));
  };

  const handleDateChange = useCallback((newDate) => {
    setSelectedDate(newDate);
    setShowCalendarPanel(false);
    setCommentsVisible(false);
    setSearchQuery('');
  }, []);

  const handleFormSubmit = useCallback(async (formData) => {
    try {
      const response = await API.post('/createEvent', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        fetchEvents();
        setShowCreateEvent(false);
        setShowCalendarPanel(false);
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
        <div className='sticky-menu'>
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
              <button className='toggle-calendar-button' onClick={toggleCalendarPanel}>
                {showCalendar ? 'Cancel' : 'Calendar'}
              </button>
              <button><Logout /></button>
              <p>{message && <p>{message}</p>}</p>
            </>
          ) : (
            <>
              <div className='welcome'>
                <h3>Welcome to the gathering</h3>
              </div>
              <button onClick={handleLoginClick}>
                {showLogin ? 'Cancel' : 'Login'}
              </button>
              <button className='toggle-calendar-button' onClick={toggleCalendarPanel}>
                {showCalendar ? 'Cancel' : 'Calendar'}
              </button>
              <button onClick={handleRegisterClick}>
                {showRegister ? 'Cancel' : 'Register'}
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
      </div>
      <div className="events-column">
        <div className="container-header">
          <h1>Gatherings</h1>
          <input
            type="text"
            placeholder="Search gatherings, locations or dates"
            value={searchQuery}
            onChange={handleSearchChange}
            onClick={handleSearchFieldClick} // Clear search query on click
            className="search-input"
          />
        </div>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div className="event-container" key={event._id}>
              <div className="event-header">
                <h3>{event.title}</h3>
                <p className='date'>
                  Date: {new Date(event.date).toLocaleDateString('en-GB', options)} Time: {event.time}
                </p>
              </div>
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
                <p>Info: {event.description}</p>
                <Link onClick={() => openGoogleMaps(event)}>{event.location}</Link>
              </div>
              <div style={{ textAlign: 'center' }}>
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
              ? `No events on ${selectedDate.toLocaleDateString()}
              \nChoose a date in the calender or hit 'Clear Date' to see all events.`
              : 'No events found for the selected date or search criteria.'}
          </p>
        )}
      </div>
      <div className={`right-column ${showCalendarPanel ? 'show' : ''}`}>
        <div className='sticky-calendar'>
          <div className='welcome'>
            <CalendarComponent
              ref={calendarRef} // Pass ref to CalendarComponent
              events={events}
              onDateChange={handleDateChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
