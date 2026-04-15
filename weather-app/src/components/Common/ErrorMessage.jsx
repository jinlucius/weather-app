import React from 'react';
import './Common.css';

const ErrorMessage = ({ message }) => {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <p className="error-message">{message}</p>
      <button onClick={() => window.location.reload()} className="retry-btn">
        Retry
      </button>
    </div>
  );
};

export default ErrorMessage;