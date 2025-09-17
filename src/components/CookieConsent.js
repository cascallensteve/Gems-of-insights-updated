import React, { useState, useEffect } from 'react';
import './CookieConsent.css';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowConsent(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShowConsent(false);
  };

  if (!showConsent) {
    return null;
  }

  return (
    <div className="cookie-consent">
      <div className="cookie-content">
        <div className="cookie-text">
          <h3>🍪 We Use Cookies</h3>
          <p>
            We use cookies to enhance your browsing experience, analyze site traffic, 
            and personalize content. By continuing to use our site, you consent to our use of cookies.
          </p>
        </div>
        <div className="cookie-actions">
          <button className="cookie-btn accept" onClick={handleAccept}>
            Accept All Cookies
          </button>
          <button className="cookie-btn decline" onClick={handleDecline}>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
