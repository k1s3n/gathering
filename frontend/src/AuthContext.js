import React, { createContext, useContext, useState, useCallback } from 'react';
import API from './api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const getStoredToken = () => localStorage.getItem('token') || null;
const getStoredUserId = () => localStorage.getItem('userId') || null;


export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getStoredToken());
  const [userId, setUserId] = useState(getStoredUserId());

  const login = useCallback((token, userId) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    setToken(token);
    setUserId(userId);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setToken(null);
    setUserId(null);
  }, []);


  return (
    <AuthContext.Provider value={{ token, userId, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};