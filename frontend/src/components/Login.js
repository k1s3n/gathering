import React, { useState } from 'react';
import API from '../api';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/login', formData);
      login(response.data.token, response.data.userId); // Spara token och userId
      setMessage('Login successful');
      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error);
      setMessage('Login failed');
    }
  };

  return (
    <div>
      <h3>Sign In</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" name="email" placeholder="Email" onChange={handleChange} required />
        <br></br>
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <br></br>
        <button type="submit">Login</button>
      </form>
      {message && <div>{message}</div>}
    </div>
  );
};

export default Login;
