import React, { createContext, useContext, useEffect, useState } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem('adminNotifications');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  // Lightweight chime using Web Audio API
  const playNotificationSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.2, audioCtx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.25);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.25);
      // Close context shortly after to release resources
      setTimeout(() => {
        try { audioCtx.close(); } catch (_) {}
      }, 400);
    } catch (_) {}
  };

  // Persist to localStorage whenever notifications change
  useEffect(() => {
    try {
      localStorage.setItem('adminNotifications', JSON.stringify(notifications));
    } catch (e) {
      // ignore storage errors
    }
  }, [notifications]);

  // Sync across tabs/windows
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'adminNotifications') {
        try {
          setNotifications(e.newValue ? JSON.parse(e.newValue) : []);
        } catch (_) {}
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const addNotification = (notification) => {
    const id = Date.now();
    const newNotification = {
      id,
      ...notification,
      timestamp: new Date().toISOString()
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
    if (!notification.silent) {
      playNotificationSound();
    }

    // Broadcast to UI listeners (e.g., AdminLayout) for transient banners
    try {
      window.dispatchEvent(new CustomEvent('admin-new-notification', { detail: newNotification }));
    } catch (_) {}

    // Auto remove after 5 seconds if it's a temporary notification
    if (notification.temporary !== false) {
      setTimeout(() => {
        removeNotification(id);
      }, 5000);
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const getUnreadCount = () => {
    return notifications.filter(notif => !notif.read).length;
  };

  // Track last-visited timestamp for notifications page
  const LAST_VISIT_KEY = 'adminNotificationsLastVisit';
  const updateLastVisit = () => {
    try { localStorage.setItem(LAST_VISIT_KEY, new Date().toISOString()); } catch (_) {}
  };
  const getLastVisit = () => {
    try {
      const v = localStorage.getItem(LAST_VISIT_KEY);
      return v ? new Date(v) : null;
    } catch (_) {
      return null;
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearAllNotifications,
      markAsRead,
      getUnreadCount
      , updateLastVisit
      , getLastVisit
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
