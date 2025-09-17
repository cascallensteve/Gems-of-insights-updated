import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { resetPassword } from '../services/api';

const ResetTokenPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');

  // Pre-fill email if passed from forgot password page
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError('Please enter the reset token from your email');
      return;
    }

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!newPassword) {
      setError('Please enter a new password');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await resetPassword(email, token, newPassword);
      setSuccessMessage('Password reset successful! Redirecting to login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to reset password. Please check your token and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-[64px] md:mt-[72px]">
      <div className="mx-auto max-w-md px-4">
        <div className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
          <button 
            className="mb-3 text-sm text-gray-600 hover:text-emerald-700" 
            onClick={() => navigate('/forgot-password')}
          >
            ← Back to Forgot Password
          </button>

          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-50 p-3 text-emerald-700">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Reset Your Password</h2>
              <p className="text-gray-700">Enter the token from your email and create a new password.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-md border ${error ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-emerald-200'} px-3 py-2 text-sm outline-none`}
                placeholder="Enter your email address"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reset Token
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className={`w-full rounded-md border ${error ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-emerald-200'} px-3 py-2 text-sm outline-none`}
                placeholder="Enter the token from your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full rounded-md border ${error ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-emerald-200'} px-3 py-2 text-sm outline-none`}
                placeholder="Enter your new password"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full rounded-md border ${error ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-emerald-200'} px-3 py-2 text-sm outline-none`}
                placeholder="Confirm your new password"
                required
              />
            </div>

            {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</div>}
            {successMessage && <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{successMessage}</div>}

            <button 
              type="submit" 
              className="inline-flex w-full items-center justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-60"
              disabled={isLoading}
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>

          <div className="mt-3 text-center text-sm text-gray-700">
            <p>Remember your password? 
              <button type="button" className="text-emerald-700 hover:underline ml-1" onClick={() => navigate('/login')}>
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetTokenPage;
