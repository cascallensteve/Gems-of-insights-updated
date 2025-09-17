import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingDots from './LoadingDots';
// Tailwind conversion: removed external CSS import

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 grid place-items-center px-4">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-emerald-100 bg-white p-8 text-center shadow-xl">
            <div className="mb-4">
              <img 
                src="https://res.cloudinary.com/dqvsjtkqw/image/upload/v1750921889/logs_co58wn.jpg" 
                alt="Gems of Insight"
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop"; }}
                className="mx-auto h-16 w-16 rounded object-cover"
              />
            </div>
            <div className="mb-2 text-3xl">🔄</div>
            <h1 className="text-xl font-semibold text-gray-900">Logging Out...</h1>
            <div className="mt-2 text-gray-700">
              <LoadingDots text="Please wait while we log you out" size="large" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 grid place-items-center px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-emerald-100 bg-white p-8 text-center shadow-xl">
          <div className="mb-4">
            <img 
              src="https://res.cloudinary.com/dqvsjtkqw/image/upload/v1750921889/logs_co58wn.jpg" 
              alt="Gems of Insight"
              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop"; }}
              className="mx-auto h-16 w-16 rounded object-cover"
            />
          </div>
          <div className="mb-2 text-3xl">🚪</div>
          <h1 className="text-2xl font-bold text-gray-900">Confirm Logout</h1>
          <div className="mt-2 text-gray-700">
            <p>Are you sure you want to logout?</p>
            <p>You will need to log in again to access your account.</p>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button className="inline-flex items-center justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600" onClick={handleConfirmLogout}>
              Yes, Logout
            </button>
            <button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50" onClick={handleCancelLogout}>
              Cancel
            </button>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            Auto-logout in 5 seconds...
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;