import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import API from '../api';

const Register = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    firstname: '',
    lastname: '',
  });

  const [message, setMessage] = useState('');
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(5); // Countdown in seconds

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/register', formData);
      console.log(response.data);
      setMessage('Register sucessfully');
      // If registration is successful, navigate to the login page
      setShowCountdown(true); // Show countdown message
      startRedirectCountdown(); // Start countdown to redirect
    } catch (error) {
      console.error('Error registering user:', error);
      const errMsg = error.response?.data?.errmsg; // Optional chaining here
      console.log(errMsg);
      if (errMsg?.includes('duplicate key error')) { // Optional chaining here
        setMessage('Email is already registered');
      } else {
        setMessage('Registration failed');
      }

    }
  };

  const startRedirectCountdown = () => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    // Redirect after countdown finishes
    setTimeout(() => {
      clearInterval(interval); // Stop the countdown interval
      navigate('/login'); // Redirect to login page
    }, countdown * 1000);
  };

  return (
    <div>
    <h3>Register</h3>
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <br></br>
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <br></br>
      <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
      <br></br>
      <input type="text" name="phone" placeholder="Phone" onChange={handleChange} />
      <br></br>
      <input type="text" name="firstname" placeholder="First Name" onChange={handleChange} />
      <br></br>
      <input type="text" name="lastname" placeholder="Last Name" onChange={handleChange} />
      <br></br>
      <button type="submit">Register</button>
    </form>
      {message && <div>{message}</div>} {/* Display message if not empty */}
      {showCountdown && <div>Redirecting in {countdown} seconds...</div>}
    </div>
  );
};

export default Register;
