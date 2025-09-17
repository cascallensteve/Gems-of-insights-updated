// src/pages/ResetPasswordPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResetPasswordPage.css';

const ResetPasswordPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    token: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email || !formData.email.includes('@')) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.token) {
      newErrors.token = 'Token is required';
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://gems-of-truth.vercel.app/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          token: formData.token,
          new_password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Reset failed');
      }

      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2500);

    } catch (err) {
      setMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <button className="back-button" onClick={() => navigate('/login')}>
          ← Back to Login
        </button>

        <div className="reset-password-header">
          <div className="reset-password-icon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#4a6fa5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="#4a6fa5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#4a6fa5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2>Reset Your Password</h2>
          <p>Enter the reset token from your email and your new password below.</p>
        </div>

        {message && (
          <div className={message.includes('successful') ? 'success-message' : 'error-message'}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              required
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label>Reset Token</label>
            <input
              type="text"
              name="token"
              placeholder="Enter reset token (e.g., X40Q4J14)"
              value={formData.token}
              onChange={handleChange}
              className={errors.token ? 'error' : ''}
              required
            />
            {errors.token && <p className="error">{errors.token}</p>}
          </div>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your new password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              required
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
              required
            />
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>

        <div className="reset-password-footer">
          <p>Remember your password? 
            <button type="button" className="login-link" onClick={() => navigate('/login')}>
              Sign In
            </button>
          </p>
        </div>
      </div>

    </div>
  );
};

export default ResetPasswordPage;
