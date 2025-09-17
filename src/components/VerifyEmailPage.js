import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// Tailwind conversion: removed external CSS import

const EmailVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ✅ Get email from query param, location state, or localStorage fallback
  const urlParams = new URLSearchParams(location.search);
  const email =
    urlParams.get('email') ||
    location.state?.email ||
    localStorage.getItem('email') ||
    '';

  // ✅ Check if user just signed up (stored in localStorage on signup)
  const justSignedUp = localStorage.getItem('justSignedUp') === 'true';

  useEffect(() => {
    if (!email) {
      setError('Email not found. Please try signing up again.');
    }
  }, [email]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    if (!email.trim()) {
      setError('Email not found. Please try again.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Sending verification:', {
        email: email.trim(),
        otp: verificationCode.trim(),
      });

      const response = await fetch('https://gems-of-truth.vercel.app/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          otp: verificationCode.trim(), // ✅ must use "otp", not "code"
        }),
      });

      const data = await response.json();
      console.log('Verification response:', data);

      if (!response.ok) {
        if (data.otp) {
          throw new Error(data.otp[0] || 'Invalid verification code');
        }
        if (data.email) {
          throw new Error(data.email[0] || 'Email verification failed');
        }
        throw new Error(data.detail || data.message || 'Verification failed');
      }

      setSuccess('OTP verified successfully! Email confirmed. Redirecting...');
      localStorage.removeItem('justSignedUp');

      // If user just signed up, log them in automatically
      if (justSignedUp && (data.user || data.token || data)) {
        try {
          // Get the stored signup data to ensure complete user information
          const storedSignupData = localStorage.getItem('signupData');
          
          let userData = data.user || data;
          
          if (storedSignupData) {
            const signupData = JSON.parse(storedSignupData);
            
            // Merge API response with stored signup data
            userData = {
              ...userData,
              ...signupData,
              // Ensure we have the complete user information
              firstName: signupData.firstName,
              lastName: signupData.lastName,
              email: signupData.email,
              phone: signupData.phone,
              role: signupData.role,
              isAdmin: signupData.isAdmin,
              id: data.id || data.user_id || userData.id
            };
            
            // Clean up stored signup data
            localStorage.removeItem('signupData');
            localStorage.removeItem('justSignedUp');
          }
          
          const token = data.token || data.access_token;
          
          login(userData, token);
        } catch (loginError) {
          console.error('Error during auto-login:', loginError);
        }
      }

      setTimeout(() => {
        // Always redirect to home page after successful verification
        navigate('/');
      }, 1500);

    } catch (err) {
      console.error('Verification error:', err);
      setError(err.message || 'Failed to verify email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email.trim()) {
      setError('Email not found. Please try again.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('https://gems-of-truth.vercel.app/resend-verification-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();
      console.log('Resend response:', data);

      if (!response.ok) {
        if (data.email) {
          throw new Error(data.email[0] || 'Failed to resend code');
        }
        throw new Error(data.detail || data.message || 'Failed to resend code');
      }

      setSuccess('OTP code resent successfully! Check your email.');
      setTimeout(() => setSuccess(''), 3000);

    } catch (err) {
      console.error('Resend error:', err);
      setError(err.message || 'Failed to resend verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/login');
  };

  if (!email) {
    return (
      <div className="mt-[64px] md:mt-[72px]">
        <div className="mx-auto max-w-md px-4">
          <div className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Email Not Found</h2>
            <p className="mt-1 text-gray-700">We couldn't find your email address. Please try signing up again.</p>
            <button onClick={() => navigate('/login')} className="mt-4 inline-flex items-center justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600">
              Go to Login/Signup
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-[64px] md:mt-[72px]">
      <div className="mx-auto max-w-md px-4">
        <div className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
          <button className="text-sm text-gray-600 hover:text-emerald-700" onClick={handleBack}>← Back</button>

          <div className="mt-3 flex justify-center">
            <img
              src="https://res.cloudinary.com/djksfayfu/image/upload/v1753272258/Gems_of_insight_logo_ghxcbv.png"
              alt="Gems of Insight"
              className="h-48 w-auto object-contain"
            />
          </div>

          <h2 className="mt-4 text-xl font-semibold text-gray-900">Verify Your Email with OTP</h2>
          <p className="mt-1 text-gray-700">We've sent a One-Time Password (OTP) to <strong>{email}</strong>. Please enter the 6-digit code below.</p>

          <form onSubmit={handleVerify} className="mt-4 space-y-3">
            <div>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit OTP code"
                className={`w-full rounded-md border ${error ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-emerald-200'} px-3 py-2 text-sm outline-none`}
                required
                maxLength="6"
              />
            </div>

            {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</div>}
            {success && <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{success}</div>}

            <button type="submit" disabled={loading || !verificationCode.trim()} className="inline-flex w-full items-center justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-60">
              {loading ? 'Verifying OTP...' : 'Verify OTP'}
            </button>
          </form>

          <div className="mt-3 text-center text-sm text-gray-700">
            <p>
              Didn't receive the OTP?{' '}
              <button
                type="button"
                onClick={handleResendCode}
                disabled={loading}
                className="text-emerald-700 hover:underline disabled:opacity-60"
              >
                {loading ? 'Sending...' : 'Resend OTP'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
