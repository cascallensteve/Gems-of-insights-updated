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
// Tailwind conversion: removed external CSS import
// import './AdminLayout.css'; // legacy css removed
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
  const formattedDate = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

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
    window.location.href = '/admin/logout';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNotificationClick = () => {
    setActiveTab('notifications');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 lg:pl-60">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[10003] bg-black/50 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Menu Toggle Button */}
      <button
        className="fixed left-4 top-4 z-[10006] inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-500 p-3 text-white shadow-lg transition hover:from-emerald-700 hover:to-emerald-600 lg:hidden"
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

      <div className="flex min-h-screen flex-col">
        <div className="flex items-center justify-between border-b border-emerald-100/60 bg-white/90 p-4 backdrop-blur">
          <div className="flex items-end gap-3">
            <img src="/images/LOGOGEMS.png" alt="Admin Logo" className="h-28 w-28 object-contain" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{menuItems.find(item => item.id === activeTab)?.name || 'Dashboard'}</h1>
              <div className="text-xs text-gray-600">{formattedDate}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">{formattedTime}</div>
            <button className="relative rounded-md bg-emerald-600 p-2 text-white shadow hover:bg-emerald-700" title="Notifications" onClick={handleNotificationClick}>
              <FaBell size={18} />
              {getUnreadCount() > 0 && (
                <span className="absolute -right-1 -top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">{getUnreadCount()}</span>
              )}
            </button>
          </div>
        </div>
        <div className="flex-1 p-4">
          {banner && (
            <div className="mb-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-800">
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
              className="h-full"
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
