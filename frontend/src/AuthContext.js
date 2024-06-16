import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import API from './api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const getStoredToken = () => localStorage.getItem('token') || null;


export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getStoredToken());
  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [latestPost, setLatestPost] = useState(null);
  const [resetShowStateFlag, setResetShowStateFlag] = useState(false);

  const login = useCallback((token, userId) => {
    localStorage.setItem('token', token);
    setToken(token);
  }, []);

  const resetShowState = useCallback(() => {
    setResetShowStateFlag(prevFlag => !prevFlag); // Toggle the flag to trigger state reset
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setToken(null);
    setUserInfo(null);
    setPosts([]);
    setPostCount(0);
    setLatestPost(null);
    resetShowState();
  }, [resetShowState]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (token) {
        try {
          const userData = await API.get('/user', 
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
        const response = await API.put('/user/update', updatedInfo, {
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

  const fetchUserPosts = useCallback(async () => {
    if (token) {
      try {
        const response = await API.get('/user/posts', {
          headers: { Authorization: `Bearer ${token}` }});
        setPosts(response.data.posts);
        setPostCount(response.data.count);
        setLatestPost(response.data.latestPost);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }
  }, [token]);
  

  return (
    <AuthContext.Provider value={{ token, userInfo, posts, postCount,latestPost, fetchUserPosts, updateUserInfo, login, logout,resetShowStateFlag}}>
      {children}
    </AuthContext.Provider>
  );
};