// GoogleMapsLoader.js
import React from 'react';
import { LoadScript } from '@react-google-maps/api';
import PropTypes from 'prop-types'; // Import PropTypes

const libraries = ['places'];

const GoogleMapsLoader = ({ children }) => {
  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={libraries}>
      {children}
    </LoadScript>
  );
  
};

GoogleMapsLoader.propTypes = {
  children: PropTypes.node.isRequired, // Add prop type validation for children
};

export default GoogleMapsLoader;
