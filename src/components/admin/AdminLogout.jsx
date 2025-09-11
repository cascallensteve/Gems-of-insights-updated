import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaSignOutAlt, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
// Tailwind conversion: removed external CSS import

const AdminLogout = () => {
  const { logout, currentUser } = useAuth();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const isLoggedIn = Boolean(currentUser);

  const handleLogout = async () => {
    setLoggingOut(true);
    
    try {
      // Clear all authentication data
      logout();
      
      // Clear any stored data
      localStorage.clear();
      
      // Redirect to admin login page after logout
      setTimeout(() => {
        window.location.href = '/admin/login';
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
      <div className="grid min-h-[60vh] place-items-center p-4">
        <div className="w-full max-w-md rounded-xl border border-emerald-200 bg-white p-6 text-center shadow">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-emerald-700">
            <FaSignOutAlt className="animate-spin-slow" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Logging Out...</h2>
          <p className="mt-1 text-sm text-gray-700">Please wait while we securely log you out</p>
          <div className="mt-4 h-2 w-full overflow-hidden rounded bg-emerald-100">
            <div className="h-full w-1/3 animate-[loading_1.2s_ease-in-out_infinite] rounded bg-emerald-500"></div>
          </div>
        </div>
      </div>
    );
  }

  // If not logged in, show a nice landing page with actions
  if (!isLoggedIn) {
    return (
      <div className="relative min-h-[70vh] px-4 py-10">
        <div className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=1974&auto=format&fit=crop')" }} />
        <div className="relative grid place-items-center">
          <div className="w-full max-w-lg rounded-2xl border border-emerald-200 bg-white/90 p-6 text-center shadow backdrop-blur">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-700">
            <FaSignOutAlt size={28} />
          </div>
          <h2 className="mt-3 text-xl font-semibold text-gray-900">You have been logged out</h2>
          <p className="mt-1 text-sm text-gray-700">Thank you for managing the store. You can log back in or create a new admin account below.</p>

          <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              onClick={() => (window.location.href = '/admin/login')}
            >
              Admin Login
            </button>
            <button
              className="inline-flex items-center justify-center rounded-md border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
              onClick={() => (window.location.href = '/admin/signup')}
            >
              Create Admin Account
            </button>
          </div>

          <div className="mt-4">
            <button
              className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
              onClick={() => (window.location.href = '/')}
            >
              ← Back to Client Site
            </button>
          </div>
          <div className="mt-6 border-t border-emerald-100 pt-3 text-center text-xs text-gray-600">
            © {new Date().getFullYear()} Gems of Insight. All rights reserved.
          </div>
          </div>
        </div>
        </div>
    );
  }

  // Logged-in view: show session and confirmation to logout
  return (
    <div className="relative px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=1974&auto=format&fit=crop')" }} />
      <div className="relative mx-auto max-w-5xl rounded-2xl border border-emerald-200 bg-white/90 p-6 shadow backdrop-blur">
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-emerald-700">
            <FaSignOutAlt />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Admin Logout</h2>
            <p className="text-sm text-gray-600">Manage your admin session</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="mb-2 text-sm font-semibold text-gray-900">Current Session Information</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center justify-between">
                <label className="text-gray-600">Administrator:</label>
                <span className="font-medium">
                  {currentUser?.firstName || currentUser?.first_name} {currentUser?.lastName || currentUser?.last_name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-gray-600">Email:</label>
                <span>{currentUser?.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-gray-600">User ID:</label>
                <span className="text-gray-900">#{currentUser?.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-gray-600">Account Type:</label>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                  {currentUser?.userType || currentUser?.role || 'admin'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-gray-600">Session Duration:</label>
                <span>{getSessionDuration()}</span>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-gray-600">Last Activity:</label>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            {!showConfirmation ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-700">Choose an action below:</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                    onClick={() => (window.location.href = '/')}
                  >
                    Go to Client Site
                  </button>
                  <button
                    className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                    onClick={() => (window.location.href = '/admin/login')}
                  >
                    Go to Admin Login
                  </button>
                  <button
                    className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                    onClick={() => (window.location.href = '/admin/signup')}
                  >
                    Create Admin Account
                  </button>
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    onClick={() => setShowConfirmation(true)}
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-md border border-yellow-200 bg-yellow-50 p-3 text-yellow-900">
                  <FaExclamationTriangle className="mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Confirm Logout</h4>
                    <p className="text-sm">Are you sure you want to logout? You will need to sign in again to access the admin panel.</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                    onClick={() => setShowConfirmation(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    onClick={handleLogout}
                  >
                    <FaCheckCircle /> Yes, Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 border-t border-emerald-100 pt-3 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} Gems of Insight. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AdminLogout;
