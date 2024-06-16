import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import API from './api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const getStoredToken = () => localStorage.getItem('token') || null;


export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getStoredToken());
  const [userInfo, setUserInfo] = useState(null);

  const login = useCallback((token, userId) => {
    localStorage.setItem('token', token);
    setToken(token);
  }, [token]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setToken(null);
    setUserInfo(null);
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

  const updateUserInfo = useCallback(async (updatedInfo) => {
    if (token) {
      try {
        const response = await API.put('/userinfo', updatedInfo, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.data) {
          console.error('Error updating user info: Empty response');
          return;
        }
        setUserInfo(prevUserInfo => ({
          ...prevUserInfo,
          ...response.data.user // Assuming your API returns updated user data
        }));
      } catch (error) {
        console.error('Error updating user info:', error);
      }
    }
  }, [token]);

  

  return (
    <AuthContext.Provider value={{ token, userInfo, updateUserInfo, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};