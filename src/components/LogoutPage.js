import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingDots from './LoadingDots';
import './LogoutPage.css';

const LogoutPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(true);

  useEffect(() => {
    // Auto-logout after 5 seconds if user doesn't confirm
    const timer = setTimeout(() => {
      if (showConfirmation) {
        handleConfirmLogout();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [showConfirmation]);

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    setShowConfirmation(false);
    
    try {
      // Simulate logout process
      await new Promise(resolve => setTimeout(resolve, 1500));
      logout();
      // Navigate to home page and scroll to top
      navigate('/', { replace: true });
      // Force scroll to top after navigation
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if there's an error
      logout();
      navigate('/', { replace: true });
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    }
  };

  const handleCancelLogout = () => {
    navigate(-1); // Go back to previous page
  };

  if (isLoggingOut) {
    return (
      <div className="logout-page">
        <div className="logout-container">
          <div className="logout-card logout-processing">
            <div className="company-logo">
              <img 
                src="https://res.cloudinary.com/dqvsjtkqw/image/upload/v1750921889/logs_co58wn.jpg" 
                alt="Gems of Insight"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop";
                }}
              />
            </div>
            <div className="logout-icon">🔄</div>
            <h1 className="logout-processing-title">Logging Out...</h1>
            <div className="logout-message">
              <LoadingDots text="Please wait while we log you out" size="large" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="logout-page">
      <div className="logout-container">
        <div className="logout-card">
          <div className="company-logo">
            <img 
              src="https://res.cloudinary.com/dqvsjtkqw/image/upload/v1750921889/logs_co58wn.jpg" 
              alt="Gems of Insight"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop";
              }}
            />
          </div>
          <div className="logout-icon">🚪</div>
          <h1 className="logout-title">Confirm Logout</h1>
          <div className="logout-message">
            <p>Are you sure you want to logout?</p>
            <p>You will need to log in again to access your account.</p>
          </div>
          <div className="logout-actions">
            <button className="btn-confirm-logout" onClick={handleConfirmLogout}>
              Yes, Logout
            </button>
            <button className="btn-cancel-logout" onClick={handleCancelLogout}>
              Cancel
            </button>
          </div>
          <div className="logout-timer">
            <p>Auto-logout in 5 seconds...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;