import React from 'react';
import { FaTachometerAlt, FaBoxOpen, FaClipboardList, FaUsers, FaCog, FaSignOutAlt, FaUserCircle, FaChartLine, FaBell, FaCalendarAlt, FaBlog, FaGraduationCap, FaEnvelope, FaMoneyBillWave } from 'react-icons/fa';

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
    <aside
      className={
        [
          'fixed left-0 top-0 z-[10004] h-screen w-60 overflow-y-auto border-r border-white/10 bg-emerald-900/95 text-white shadow-2xl backdrop-blur',
          'transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        ].join(' ')
      }
    >
      <div className="flex items-center gap-4 border-b border-white/10 bg-white/5 px-4 py-5">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-400 text-lg font-bold shadow">
          {currentUser?.firstName ? (
            <span>{currentUser.firstName[0]}{currentUser.lastName?.[0]}</span>
          ) : (
            <FaUserCircle size={24} />
          )}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{currentUser?.firstName || 'Admin'}</div>
          <div className="text-xs text-emerald-100/80">Administrator</div>
        </div>
      </div>

      <nav className="px-2 py-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={[
                    'group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition',
                    isActive
                      ? 'bg-emerald-800/70 text-white shadow-inner'
                      : 'text-emerald-50 hover:bg-emerald-800/40 hover:text-white'
                  ].join(' ')}
                >
                  <span className="grid h-5 w-5 place-items-center text-emerald-100 group-hover:text-white">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto border-t border-white/10 px-2 py-2">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md bg-red-600/10 px-3 py-2 text-sm text-red-200 transition hover:bg-red-600/20 hover:text-white"
        >
          <span className="grid h-5 w-5 place-items-center"><FaSignOutAlt /></span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminNavbar;