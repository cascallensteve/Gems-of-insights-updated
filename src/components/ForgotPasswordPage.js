import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Tailwind conversion: removed external CSS import
import { forgotPassword } from '../services/api'; // ✅ Corrected import

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await forgotPassword({ email }); // ✅ API expects an object
      setSuccessMessage('Password reset link sent to your email!');
      
      setTimeout(() => {
        navigate('/reset-token', { state: { email } });
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-[64px] md:mt-[72px]">
      <div className="mx-auto max-w-md px-4">
        <div className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
          <button className="mb-3 text-sm text-gray-600 hover:text-emerald-700" onClick={() => navigate('/login')}>
            ← Back to Login
          </button>

          <div className="flex items-center gap-3">
            <div className="rounded-full bg-emerald-50 p-3 text-emerald-700">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 14L9 11L5 15L9 19L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.59 13.41L13.42 20.58C13.23 20.77 13.01 20.91 12.77 21.01C12.53 21.11 12.27 21.17 12.01 21.17C11.74 21.17 11.48 21.11 11.24 21.01C11 20.91 10.78 20.77 10.59 20.58L2.59 12.58C2.4 12.39 2.26 12.17 2.16 11.93C2.06 11.69 2 11.43 2 11.17C2 10.9 2.06 10.64 2.16 10.4C2.26 10.16 2.4 9.94 2.59 9.75L9.76 2.58C9.95 2.39 10.17 2.25 10.41 2.15C10.65 2.05 10.91 1.99 11.17 1.99C11.44 1.99 11.7 2.05 11.94 2.15C12.18 2.25 12.4 2.39 12.59 2.58L20.59 10.58C20.96 10.95 21.17 11.46 21.17 11.99C21.17 12.51 20.96 13.02 20.59 13.39V13.41Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Forgot Password?</h2>
              <p className="text-gray-700">Don't worry! Enter your email address and we'll send you a password reset link.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-md border ${error ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-emerald-200'} px-3 py-2 text-sm outline-none`}
                placeholder="Enter your email address"
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
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-3 text-center text-sm text-gray-700">
            <p>Remember your password? 
              <button type="button" className="text-emerald-700 hover:underline" onClick={() => navigate('/login')}>
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
