import React from 'react';
import './LoadingDots.css';

const LoadingDots = ({ size = 'medium', color = '#10b981', text = 'Loading...' }) => {
  return (
    <div className={`loading-dots ${size}`}>
      <div className="loading-text">{text}</div>
      <div className="dots-container">
        <div className="dot" style={{ backgroundColor: color }}></div>
        <div className="dot" style={{ backgroundColor: color }}></div>
        <div className="dot" style={{ backgroundColor: color }}></div>
      </div>
    </div>
  );
};

export default LoadingDots;
