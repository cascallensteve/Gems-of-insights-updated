import React, { useState, useEffect } from 'react';
import { FaBell, FaUserPlus, FaInfoCircle, FaExclamationTriangle, FaCheckCircle, FaTimes } from 'react-icons/fa';
import apiService from '../../services/api';
import './Notifications.css';
import { useNotifications } from '../../context/NotificationContext';

const Notifications = () => {
  const { notifications, addNotification, markAsRead, removeNotification, clearAllNotifications, getLastVisit, updateLastVisit } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [showSinceLastVisit, setShowSinceLastVisit] = useState(true);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
    // Mark visit time on mount
    updateLastVisit();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // Removed auto-adding user registrations; only rely on explicit event hooks
      try {
        // Intentionally no-op
      } catch (userError) {
        console.error('Error checking for new users:', userError);
        // Continue with existing notifications if user check fails
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = () => {
    notifications.forEach(n => {
      if (!n.read) markAsRead(n.id);
    });
  };

  const deleteNotification = (notificationId) => {
    removeNotification(notificationId);
  };

  const handleClearAllNotifications = () => {
    clearAllNotifications();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'user_registration':
        return <FaUserPlus className="notification-icon user" />;
      case 'info':
        return <FaInfoCircle className="notification-icon info" />;
      case 'warning':
        return <FaExclamationTriangle className="notification-icon warning" />;
      case 'success':
        return <FaCheckCircle className="notification-icon success" />;
      default:
        return <FaBell className="notification-icon default" />;
    }
  };

  const getFilteredNotifications = () => {
    let list = notifications;
    if (showSinceLastVisit) {
      const last = getLastVisit();
      if (last) {
        list = list.filter(n => new Date(n.timestamp) >= last);
      }
    }
    switch (filter) {
      case 'unread':
        return list.filter(notif => !notif.read);
      case 'read':
        return list.filter(notif => notif.read);
      default:
        return list;
    }
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;

  if (loading) {
    return (
      <div className="notifications-container">
        <div className="notifications-loading">
          <div className="loading-spinner"></div>
          <p>Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      {/* Header */}
      <div className="notifications-header">
        <div className="notifications-header__left">
          <h1>Notifications</h1>
          <span className="notifications-count">
            {unreadCount} unread
          </span>
        </div>
        <div className="notifications-header__right">
          <button 
            className="btn btn-secondary"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark all as read
          </button>
          <button 
            className="btn btn-danger"
            onClick={handleClearAllNotifications}
            disabled={notifications.length === 0}
          >
            Clear all
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="notifications-filters">
        <button 
          className={`filter-btn ${showSinceLastVisit ? 'active' : ''}`}
          onClick={() => setShowSinceLastVisit(!showSinceLastVisit)}
        >
          Since last visit
        </button>
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </button>
        <button 
          className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
          onClick={() => setFilter('read')}
        >
          Read ({notifications.length - unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="notifications-list">
        {getFilteredNotifications().length === 0 ? (
          <div className="no-notifications">
            <FaBell size={48} />
            <h3>No notifications</h3>
            <p>
              {filter === 'all' 
                ? 'You\'re all caught up! No notifications to show.'
                : `No ${filter} notifications to show.`
              }
            </p>
          </div>
        ) : (
          getFilteredNotifications().map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
            >
              <div className="notification-icon-wrapper">
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="notification-content">
                <div className="notification-header">
                  <h4 className="notification-title">{notification.title}</h4>
                  <span className="notification-time">
                    {new Date(notification.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="notification-message">{notification.message}</p>
                
                {notification.details && (
                  <div className="notification-details">
                    {Object.entries(notification.details).map(([key, value]) => (
                      <div key={key} className="detail-item">
                        <span className="detail-label">{key}:</span>
                        <span className="detail-value">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="notification-actions">
                {!notification.read && (
                  <button 
                    className="action-btn mark-read"
                    onClick={() => markAsRead(notification.id)}
                    title="Mark as read"
                  >
                    <FaCheckCircle />
                  </button>
                )}
                <button 
                  className="action-btn delete"
                  onClick={() => deleteNotification(notification.id)}
                  title="Delete notification"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
