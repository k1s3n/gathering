import React, { useState } from 'react';
import Register from './Register';
import Login from './Login';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div>
      {/* Render either Register or Login based on whether the user is logged in */}
      {loggedIn ? (
        <Login />
      ) : (
        <Register setLoggedIn={setLoggedIn} />
      )}
    </div>
  );
};

export default App;
