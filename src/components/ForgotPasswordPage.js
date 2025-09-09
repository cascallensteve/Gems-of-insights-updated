import React, { useState } from 'react';
import './ForgotPassword.css';
import { forgotPassword } from '../services/api'; // ✅ Corrected import

const ForgotPassword = ({ onBack, onResetTokenSent }) => {
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
        onResetTokenSent(email);
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password">
      <div className="forgot-password-container">
        <button className="back-button" onClick={onBack}>
          ← Back to Login
        </button>

        <div className="forgot-password-header">
          <div className="forgot-password-icon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 14L9 11L5 15L9 19L12 16" stroke="#4a6fa5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20.59 13.41L13.42 20.58C13.23 20.77 13.01 20.91 12.77 21.01C12.53 21.11 12.27 21.17 12.01 21.17C11.74 21.17 11.48 21.11 11.24 21.01C11 20.91 10.78 20.77 10.59 20.58L2.59 12.58C2.4 12.39 2.26 12.17 2.16 11.93C2.06 11.69 2 11.43 2 11.17C2 10.9 2.06 10.64 2.16 10.4C2.26 10.16 2.4 9.94 2.59 9.75L9.76 2.58C9.95 2.39 10.17 2.25 10.41 2.15C10.65 2.05 10.91 1.99 11.17 1.99C11.44 1.99 11.7 2.05 11.94 2.15C12.18 2.25 12.4 2.39 12.59 2.58L20.59 10.58C20.96 10.95 21.17 11.46 21.17 11.99C21.17 12.51 20.96 13.02 20.59 13.39V13.41Z" stroke="#4a6fa5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2>Forgot Password?</h2>
          <p>Don't worry! Enter your email address and we'll send you a password reset link.</p>
        </div>

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={error ? 'error' : ''}
              placeholder="Enter your email address"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}

          <button 
            type="submit" 
            className="reset-button"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="forgot-password-footer">
          <p>Remember your password? 
            <button type="button" className="login-link" onClick={onBack}>
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
