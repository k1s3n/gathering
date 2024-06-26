import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import UserPosts from './UserPosts';


const Profile = ({ onUpdateMessage }) => {
  const { userInfo, updateUserInfo } = useAuth();
  const [editMode, setEditMode] = useState(null); // Use null to indicate no editing
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [phone, setPhone] = useState('');
  const [showUserPosts, setShowUserPosts] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setEmail(userInfo.email || '');
      setFirstname(userInfo.firstname || '');
      setLastname(userInfo.lastname || '');
      setPhone(userInfo.phone || '');
    }
  }, [userInfo]);

  const handleSave = async (field) => {
    try {
      let updatedInfo = {};
      if (field === 'email') updatedInfo = { email };
      if (field === 'firstname') updatedInfo = { firstname };
      if (field === 'lastname') updatedInfo = { lastname };
      if (field === 'phone') updatedInfo = { phone };

      const response = await updateUserInfo(updatedInfo);
      onUpdateMessage(response?.message || 'Profile Updated!');
      setEditMode(null); // Exit edit mode
    } catch (error) {
      console.error('Error updating user info:', error);
      onUpdateMessage('Failed to update user info');
    }
  };

  const handlePostsClick = () => {
    setShowUserPosts(!showUserPosts);
  };

  return (
    <div>
      <h3>Profile</h3>
      {userInfo ? (
        <>
        <div>
          <img src={userInfo.profilePicture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%' , borderStyle: 'solid', borderColor: 'black', borderWidth: '1px' }} />
        </div>
          <div>
          <label htmlFor="email">Email: </label>
            {editMode === 'email' ? (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={() => handleSave('email')}>Save</button>
                <button onClick={() => setEditMode(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{userInfo.email}</span>
                <button style={{ marginLeft: '10px' }} onClick={() => setEditMode('email')}>Edit</button>
              </>
            )}
          </div>
          <div>
          <label htmlFor="firstname">First Name: </label>
            {editMode === 'firstname' ? (
              <>
                <input
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                />
                <button onClick={() => handleSave('firstname')}>Save</button>
                <button onClick={() => setEditMode(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{userInfo.firstname}</span>
                <button style={{ marginLeft: '10px' }} onClick={() => setEditMode('firstname')}>Edit</button>
              </>
            )}
          </div>
          <div>
          <label htmlFor="lastname">Last Name: </label>
            {editMode === 'lastname' ? (
              <>
                <input
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
                <button onClick={() => handleSave('lastname')}>Save</button>
                <button onClick={() => setEditMode(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{userInfo.lastname}</span>
                <button style={{ marginLeft: '10px' }} onClick={() => setEditMode('lastname')}>Edit</button>
              </>
            )}
          </div>
          <div>
          <label htmlFor="phone">Phone: </label>
            {editMode === 'phone' ? (
              <>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <button onClick={() => handleSave('phone')}>Save</button>
                <button onClick={() => setEditMode(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{userInfo.phone}</span>
                <button style={{ marginLeft: '10px' }} onClick={() => setEditMode('phone')}>Edit</button>
              </>
            )}
          </div>
          <div style={{ marginTop: '20px' }}></div>
          <div>
            <button style={{ marginTop: '20px' }} onClick={handlePostsClick}>{showUserPosts ? 'Hide Post Details' : 'Post Details'} </button>
            {showUserPosts && <UserPosts />}
          </div>
        </>
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  );
};

export default Profile;
