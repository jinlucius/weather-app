import React from 'react';
import './Common.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading weather data...</p>
    </div>
  );
};

export default LoadingSpinner;