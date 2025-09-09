import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaBell, FaBars, FaTimes } from 'react-icons/fa';
import Dashboard from './Dashboard';
import Users from './Users';
import Settings from './Settings';
import Sales from './Sales';
import Analytics from './Analytics';
import Products from './Products';
import Orders from './Orders';
import Courses from './Courses';
import AdminBlogManager from '../AdminBlogManager';
import AdminAppointments from './AdminAppointments';
import AdminOrders from './AdminOrders';
import AdminProducts from './AdminProducts';
import AdminNavbar from './AdminNavbar';
import { AnimatePresence, motion } from 'framer-motion';
import Notifications from './Notifications';
import './AdminLayout.css';
import { useNotifications } from '../../context/NotificationContext';
import AdminInquiries from './AdminInquiries';
import Transactions from './Transactions';

const AdminLayout = () => {
  const { currentUser, logout } = useAuth();
  const { getUnreadCount } = useNotifications();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [time, setTime] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when tab changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeTab]);

  // Listen for new notifications and show a transient banner
  useEffect(() => {
    const onNewNotif = (e) => {
      const n = e.detail;
      setBanner({ title: n.title, message: n.message });
      setTimeout(() => setBanner(null), 3000);
    };
    window.addEventListener('admin-new-notification', onNewNotif);
    return () => window.removeEventListener('admin-new-notification', onNewNotif);
  }, []);

  // Listen for programmatic navigation from dashboard widgets
  useEffect(() => {
    const onAdminNavigate = (e) => {
      const target = e?.detail?.tab;
      if (target && menuItems.find(m => m.id === target)) {
        setActiveTab(target);
      }
    };
    window.addEventListener('admin-navigate', onAdminNavigate);
    return () => window.removeEventListener('admin-navigate', onAdminNavigate);
  }, []);

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'sales', name: 'Sales', icon: '📈' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'products', name: 'Products', icon: '🛒' },
    { id: 'courses', name: 'Courses', icon: '🎓' },
    { id: 'orders', name: 'Orders', icon: '📦' },
    { id: 'users', name: 'Users', icon: '👥' },
    { id: 'blog', name: 'Blog Manager', icon: '📝' },
    { id: 'appointments', name: 'Appointments', icon: '📅' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'inquiries', name: 'Inquiries', icon: '✉️' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'sales':
        return <Sales />;
      case 'analytics':
        return <Analytics />;
      case 'products':
        return <AdminProducts />;
      case 'courses':
        return <Courses />;
      case 'orders':
        return <AdminOrders />;
      case 'transactions':
        return <Transactions />;
      case 'users':
        return <Users />;
      case 'blog':
        return <AdminBlogManager user={currentUser} onNavigateBack={() => setActiveTab('dashboard')} />;
      case 'appointments':
        return <AdminAppointments />;
      case 'notifications':
        return <Notifications />;
      case 'inquiries':
        return <AdminInquiries />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNotificationClick = () => {
    setActiveTab('notifications');
  };
  return (
    <div className="admin-layout admin-layout--with-sidebar">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={toggleMobileMenu}
        />
      )}
      
      {/* Mobile Menu Toggle Button */}
      <button 
        className="mobile-menu-toggle desktop-hidden"
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <AdminNavbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      
      <div className="admin-main admin-main--with-sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="admin-top-header">
          <div className="admin-top-header__left">
            <div className="admin-top-header__logo">
           
            </div>
            <h1 className="admin-top-header__title">
              {menuItems.find(item => item.id === activeTab)?.name || 'Dashboard'}
            </h1>
          </div>
          <div className="admin-top-header__right">
            <img 
              src="/images/LOGOGEMS.png" 
              alt="Admin Logo" 
              style={{ height: 176, width: 176, objectFit: 'contain' }}
            />
            <div className="admin-top-header__time">{formattedTime}</div>
            <button 
              className="admin-top-header__bell" 
              title="Notifications"
              onClick={handleNotificationClick}
            >
              <div style={{ position: 'relative' }}>
                <FaBell size={24} />
                {getUnreadCount() > 0 && (
                  <span className="notif-badge">{getUnreadCount()}</span>
                )}
              </div>
            </button>
          </div>
        </div>
        <div className="admin-content" style={{ flex: 1 }}>
          {banner && (
            <div className="admin-live-banner">
              <strong>{banner.title}:</strong> {banner.message}
            </div>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              style={{ height: '100%' }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
