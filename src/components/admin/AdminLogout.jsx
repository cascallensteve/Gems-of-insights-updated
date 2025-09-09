import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaSignOutAlt, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import './AdminLogout.css';

const AdminLogout = () => {
  const { logout, currentUser } = useAuth();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    
    try {
      // Clear all authentication data
      logout();
      
      // Clear any stored data
      localStorage.clear();
      
      // Redirect to admin welcome page
      setTimeout(() => {
        window.location.href = '/admin';
      }, 1000);
      
    } catch (error) {
      console.error('Logout error:', error);
      setLoggingOut(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSessionDuration = () => {
    const loginTime = localStorage.getItem('loginTime');
    if (loginTime) {
      const duration = Date.now() - parseInt(loginTime);
      const hours = Math.floor(duration / (1000 * 60 * 60));
      const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    }
    return 'Unknown';
  };

  if (loggingOut) {
    return (
      <div className="logout-container">
        <div className="logout-card logging-out">
          <div className="logout-icon">
            <FaSignOutAlt className="spinning" />
          </div>
          <h2>Logging Out...</h2>
          <p>Please wait while we securely log you out</p>
          <div className="logout-progress">
            <div className="progress-bar"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="logout-container">
      <div className="logout-card">
        <div className="logout-header">
          <div className="logout-icon">
            <FaSignOutAlt />
          </div>
          <h2>Admin Logout</h2>
          <p>Manage your admin session</p>
        </div>

        <div className="logout-content">
          <div className="session-info">
            <h3>Current Session Information</h3>
            
            <div className="session-details">
              <div className="session-item">
                <label>Administrator:</label>
                <span className="admin-name">
                  {currentUser?.firstName || currentUser?.first_name} {currentUser?.lastName || currentUser?.last_name}
                </span>
              </div>
              
              <div className="session-item">
                <label>Email:</label>
                <span>{currentUser?.email}</span>
              </div>
              
              <div className="session-item">
                <label>User ID:</label>
                <span className="user-id">#{currentUser?.id}</span>
              </div>
              
              <div className="session-item">
                <label>Account Type:</label>
                <span className="admin-badge">
                  {currentUser?.userType || currentUser?.role || 'admin'}
                </span>
              </div>
              
              <div className="session-item">
                <label>Session Duration:</label>
                <span>{getSessionDuration()}</span>
              </div>
              
              <div className="session-item">
                <label>Last Activity:</label>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          <div className="logout-actions">
            {!showConfirmation ? (
              <div className="action-buttons">
                <button 
                  className="btn btn-secondary"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={() => setShowConfirmation(true)}
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            ) : (
              <div className="confirmation-section">
                <div className="confirmation-warning">
                  <FaExclamationTriangle />
                  <h4>Confirm Logout</h4>
                  <p>Are you sure you want to logout? You will need to sign in again to access the admin panel.</p>
                </div>
                
                <div className="confirmation-buttons">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setShowConfirmation(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={handleLogout}
                  >
                    <FaCheckCircle />
                    Yes, Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogout;
