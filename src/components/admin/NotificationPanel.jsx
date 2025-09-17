import React, { useState } from 'react';
import { FaBell, FaTimes, FaTrash, FaGraduationCap, FaUser, FaEdit } from 'react-icons/fa';
import { useNotifications } from '../../context/NotificationContext';
import './NotificationPanel.css';

const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, removeNotification, clearAllNotifications, markAsRead, getUnreadCount } = useNotifications();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'course':
        return <FaGraduationCap className="notification-icon course" />;
      case 'enrollment':
        return <FaUser className="notification-icon enrollment" />;
      case 'edit':
        return <FaEdit className="notification-icon edit" />;
      default:
        return <FaBell className="notification-icon default" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notifTime) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="notification-panel">
      <button className="notification-bell" onClick={togglePanel}>
        <FaBell />
        {getUnreadCount() > 0 && (
          <span className="notification-badge">{getUnreadCount()}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            <div className="notification-actions">
              {notifications.length > 0 && (
                <button 
                  className="clear-all-btn"
                  onClick={clearAllNotifications}
                  title="Clear all"
                >
                  <FaTrash />
                </button>
              )}
              <button 
                className="close-panel-btn"
                onClick={togglePanel}
                title="Close"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <FaBell className="empty-bell" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {getNotificationIcon(notification.type)}
                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">{formatTimestamp(notification.timestamp)}</div>
                  </div>
                  <button 
                    className="remove-notification"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
