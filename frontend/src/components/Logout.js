import React from 'react';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';

const Logout = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Link to="/" onClick={handleLogout}>
      Logout
    </Link>
  );
};

export default Logout;
