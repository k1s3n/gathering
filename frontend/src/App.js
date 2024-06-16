import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import CreateEvent from './components/CreateEvent';
import CalendarComponent from './components/CalendarComponent';
import { AuthProvider, useAuth } from './AuthContext';
import './index.css';
import Profile from './components/Profile';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} /> {/* Inga props behövs */}
          <Route path="/register" element={<Register />} />
          <Route path="/calender" element={<CalendarComponent />} />
          <Route path="/createEvent" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

// Skyddad rutt som bara tillåter åtkomst om användaren är inloggad
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

export default App;
