import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './VerifyEmail.css';

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
      <div className="email-verification-container">
        <div className="verification-box">
          <h2>Email Not Found</h2>
          <p>We couldn't find your email address. Please try signing up again.</p>
          <button onClick={() => navigate('/login')}>
            Go to Login/Signup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="email-verification-container">
      <div className="verification-box">
        <button className="back-button" onClick={handleBack}>← Back</button>

        <div className="verification-logo">
          <img
            src="https://res.cloudinary.com/djksfayfu/image/upload/v1753272258/Gems_of_insight_logo_ghxcbv.png"
            alt="Gems of Insight"
            className="logo-image"
          />
        </div>

        <h2>Verify Your Email with OTP</h2>
        <p>We've sent a One-Time Password (OTP) to <strong>{email}</strong>. Please enter the 6-digit code below.</p>

        <form onSubmit={handleVerify}>
          <div className="form-group">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit OTP code"
              className={error ? 'error' : ''}
              required
              maxLength="6"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" disabled={loading || !verificationCode.trim()}>
            {loading ? 'Verifying OTP...' : 'Verify OTP'}
          </button>
        </form>

        <div className="resend-section">
          <p className="resend-text">
            Didn't receive the OTP?{' '}
            <button
              type="button"
              onClick={handleResendCode}
              disabled={loading}
              className="resend-button"
            >
              {loading ? 'Sending...' : 'Resend OTP'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
