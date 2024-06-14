import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import API from '../api';
import Login from '../components/Login';
import Logout from '../components/Logout';
import Register from '../components/Register';
import CreateEvent from '../components/CreateEvent';
import { formatDate, formatDateTime } from '../components/timeconverter';

const Home = () => {
  const { token, userId } = useAuth();
  const [events, setEvents] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  console.log('Token:', token);
  console.log('User ID:', userId);
  console.log('User Info:', userInfo);
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
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (token) {
        try {
          const userData = await API.get('/userinfo', 
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (!userData) {
            console.error('Error fetching user info: Empty response');
            return;
          }
          setUserInfo(userData.data);
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }
    };

    fetchUserInfo();
  }, [token]);

  const handleLoginClick = () => {
    setShowLogin(!showLogin);
    setShowRegister(false);
  };

  const handleCreateEventClick = () => {
    setShowCreateEvent(!showCreateEvent);
  };

  const handleRegisterClick = () => {
    setShowRegister(!showRegister);
    setShowLogin(false);
  };

  return (
    <div>
      {token ? (
        <>
          {userInfo ? (
            <>
            <h1>Welcome [{userInfo.username}]</h1>
            
        
            </>
          ) : (
            <p>Loading user info...</p>
          )}
          <button onClick={handleCreateEventClick}>
            {showCreateEvent ? 'Cancel' : 'Create Event'}
          </button>
          <button margin="20px">
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

          {/*Show login and register components based on their state */}
          {showRegister && <Register />}
          {showLogin && <Login />}
        </>
      )}
      {showCreateEvent && <CreateEvent />}

      <h2>Events</h2>
      {events.length > 0 ? (
        <ul>
          {events.map((event) => (
            <li key={event._id}>
              <h3>{event.title}</h3>
              <p>Desc: {event.description}</p>
              <p>Location: {event.location}</p>
              <p>Date: {formatDate(event.date)}</p>
              <p>Time: {event.time}</p>
              <p>Created: {formatDateTime(event.postCreated)}</p>
              <p>Created by: {event.createdBy}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No events available</p>
      )}
    </div>
  );
};

export default Home;
