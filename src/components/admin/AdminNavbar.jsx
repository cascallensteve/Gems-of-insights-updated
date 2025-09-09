import React from 'react';
import { FaTachometerAlt, FaBoxOpen, FaClipboardList, FaUsers, FaCog, FaSignOutAlt, FaUserCircle, FaChartLine, FaBell, FaCalendarAlt, FaBlog, FaGraduationCap, FaEnvelope, FaMoneyBillWave } from 'react-icons/fa';
import './AdminLayout.css';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
  { id: 'sales', label: 'Sales', icon: <FaChartLine /> },
  { id: 'analytics', label: 'Analytics', icon: <FaChartLine /> },
  { id: 'products', label: 'Products', icon: <FaBoxOpen /> },
  { id: 'courses', label: 'Courses', icon: <FaGraduationCap /> },
  { id: 'orders', label: 'Orders', icon: <FaClipboardList /> },
  { id: 'transactions', label: 'Payments', icon: <FaMoneyBillWave /> },
  { id: 'users', label: 'Users', icon: <FaUsers /> },
  { id: 'blog', label: 'Blog Manager', icon: <FaBlog /> },
  { id: 'appointments', label: 'Appointments', icon: <FaCalendarAlt /> },
  { id: 'inquiries', label: 'Inquiries', icon: <FaEnvelope /> },
  { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
  { id: 'settings', label: 'Settings', icon: <FaCog /> },
];

const AdminNavbar = ({ currentUser, activeTab, setActiveTab, handleLogout, isMobileMenuOpen }) => {
  return (
    <aside className={`vertical-admin-navbar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
      <div className="vertical-admin-navbar__profile">
        <div className="vertical-admin-navbar__avatar">
          {currentUser?.firstName ? (
            <span>{currentUser.firstName[0]}{currentUser.lastName?.[0]}</span>
          ) : (
            <FaUserCircle size={36} />
          )}
        </div>
        <div className="vertical-admin-navbar__profile-info">
          <span className="vertical-admin-navbar__profile-name">
            {currentUser?.firstName || 'Admin'}
          </span>
          <span className="vertical-admin-navbar__profile-role">Administrator</span>
        </div>
      </div>
      <nav className="vertical-admin-navbar__nav">
        <ul>
          {navItems.map(item => (
            <li key={item.id}>
              <button
                className={`vertical-admin-navbar__nav-link${activeTab === item.id ? ' active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="vertical-admin-navbar__icon">{item.icon}</span>
                <span className="vertical-admin-navbar__text">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <button className="vertical-admin-navbar__logout" onClick={handleLogout}>
        <span className="vertical-admin-navbar__icon"><FaSignOutAlt /></span>
        <span className="vertical-admin-navbar__text">Logout</span>
      </button>
    </aside>
  );
};

export default AdminNavbar;