import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import '../styles/forms.css';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';
import TermsPage from './TermsPage';
// GoogleSignInButton removed

const LoginPage = ({ onLogin, onClose }) => {
  const { login } = useAuth();
  const [authMode, setAuthMode] = useState('login'); // 'login', 'signup', 'forgot', 'reset'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    resetToken: '',
    terms: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // Get current time for greeting
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  const timeOfDay = getTimeOfDay();
  const greeting = `Good ${timeOfDay}!`;

  // Check for reset token in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      setAuthMode('reset');
      setFormData(prev => ({ ...prev, resetToken: token }));
    }
  }, []);

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Google auth removed

  const openTerms = () => setShowTerms(true);
  const closeTerms = () => setShowTerms(false);

  const validateForm = () => {
    const newErrors = {};

    if (authMode !== 'reset') {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
    }

    if (authMode !== 'forgot') {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    if (authMode === 'signup') {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (!formData.terms) {
        newErrors.terms = 'You must accept the terms';
      }
    }

    if (authMode === 'reset') {
      if (!formData.resetToken.trim()) {
        newErrors.resetToken = 'Reset token is required';
      } else if (formData.resetToken.trim().length < 6) {
        newErrors.resetToken = 'Reset token must be at least 6 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    return newErrors;
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      switch (authMode) {
        case 'login':
          const loginData = await apiService.auth.login(formData.email.trim(), formData.password);
          
          const userDataForLogin = {
            ...loginData,
            firstName: loginData.firstName || loginData.first_name || loginData.name?.split(' ')[0] || 'User',
            lastName: loginData.lastName || loginData.last_name || loginData.name?.split(' ').slice(1).join(' ') || '',
            email: loginData.email,
            phone: loginData.phone || loginData.phone_number,
            role: loginData.role || loginData.user_type || 'user',
            id: loginData.id || loginData.user_id
          };
          
          login(userDataForLogin, loginData.token || loginData.access_token);
          showSuccessMessage(`Welcome back! Redirecting to home page...`);
          
          setTimeout(() => {
            if (onLogin) onLogin(userDataForLogin);
            if (onClose) onClose();
            else window.location.href = '/';
          }, 1000);
          break;

        case 'signup':
          const signupPayload = {
            first_name: formData.firstName.trim(),
            last_name: formData.lastName.trim(),
            email: formData.email.trim(),
            password: formData.password
          };
          
          await apiService.auth.signUp(signupPayload);
          
          const signupData = {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim(),
            phone: formData.phone || '+254700000000',
            role: 'user',
            isAdmin: false
          };
          
          localStorage.setItem('signupData', JSON.stringify(signupData));
          localStorage.setItem('justSignedUp', 'true');
          
          showSuccessMessage('Account created successfully! OTP sent to your email for verification.');
          
          setTimeout(() => {
            window.location.href = `/verify-email?email=${encodeURIComponent(formData.email)}`;
          }, 2000);
          break;

        case 'forgot':
          await apiService.auth.forgotPassword(formData.email.trim());
          showSuccessMessage('Password reset link sent to your email. Please check your inbox.');
          
          setTimeout(() => {
            switchAuthMode('login');
          }, 3000);
          break;

        case 'reset':
          await apiService.auth.resetPassword(
            formData.email.trim(),
            formData.resetToken,
            formData.password
          );
          showSuccessMessage('Password reset successful! You can now login with your new password.');
          
          setTimeout(() => {
            switchAuthMode('login');
          }, 2000);
          break;

        default:
          throw new Error('Invalid authentication mode');
      }

    } catch (error) {
      console.error('Authentication error:', error);
      
      if (error.email_verification_required) {
        window.location.href = `/verify-email?email=${encodeURIComponent(formData.email)}`;
        return;
      }
      
      if (error.email && Array.isArray(error.email)) {
        setErrors({ email: error.email[0] });
      } else if (error.password && Array.isArray(error.password)) {
        setErrors({ password: error.password[0] });
      } else if (error.first_name && Array.isArray(error.first_name)) {
        setErrors({ firstName: error.first_name[0] });
      } else if (error.last_name && Array.isArray(error.last_name)) {
        setErrors({ lastName: error.last_name[0] });
      } else {
        setErrors({ submit: error.detail || error.message || 'Something went wrong. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      resetToken: authMode === 'reset' ? formData.resetToken : '',
      terms: false
    });
    setErrors({});
    setSuccessMessage('');
    setShowSuccess(false);
  };

  const getFormTitle = () => {
    switch (authMode) {
      case 'login':
        return `${greeting} Welcome Back!`;
      case 'signup':
        return 'Create Your Account';
      case 'forgot':
        return 'Reset Your Password';
      case 'reset':
        return 'Set New Password';
      default:
        return 'Welcome';
    }
  };

  const getFormSubtitle = () => {
    switch (authMode) {
      case 'login':
        return 'Login to continue your wellness journey';
      case 'signup':
        return 'Sign up to begin your natural health transformation';
      case 'forgot':
        return 'Enter your email to receive a password reset link';
      case 'reset':
        return 'Enter your new password below';
      default:
        return '';
    }
  };

  const getSubmitButtonText = () => {
    if (loading) {
      switch (authMode) {
        case 'login': return 'Logging in...';
        case 'signup': return 'Creating Account...';
        case 'forgot': return 'Sending Reset Link...';
        case 'reset': return 'Resetting Password...';
        default: return 'Processing...';
      }
    }

    switch (authMode) {
      case 'login': return 'Login';
      case 'signup': return 'Sign Up';
      case 'forgot': return 'Send Reset Link';
      case 'reset': return 'Reset Password';
      default: return 'Submit';
    }
  };

  return (
    <>
      <div className="login-page-overlay">
        <div className="login-page">
          {/* Success Message Overlay */}
          {showSuccess && (
            <div className="success-overlay">
              <div className="success-message">
                <div className="success-icon">✓</div>
                <p>{successMessage}</p>
              </div>
            </div>
          )}

          <div className="login-container">
            <div className="login-content">
              <div className="login-illustration" aria-hidden="true"></div>
              <div className="login-form-wrapper">
                <button className="back-button" onClick={onClose}>← Back</button>

                <div className="login-logo">
                  <img
                    src="/images/LOGOGEMS.png"
                    alt="Gems of Insight"
                    className="logo-image"
                  />
                </div>

                <div className="form-header">
                  <h1>{getFormTitle()}</h1>
                  <p>{getFormSubtitle()}</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
              {/* Signup Fields */}
              {authMode === 'signup' && (
                <>
                  <div className="form-group half">
                    <label>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`form-input ${errors.firstName ? 'error' : ''}`}
                      required
                    />
                    {errors.firstName && <div className="error-message">{errors.firstName}</div>}
                  </div>

                  <div className="form-group half">
                    <label>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`form-input ${errors.lastName ? 'error' : ''}`}
                      required
                    />
                    {errors.lastName && <div className="error-message">{errors.lastName}</div>}
                  </div>
                </>
              )}

              {/* Email Field */}
              {authMode !== 'reset' && (
                <div className="form-group with-icon">
                  <label>Email Address</label>
                  <div className="form-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    required
                  />
                  {errors.email && <div className="error-message">{errors.email}</div>}
                </div>
              )}

              {/* Password Field */}
              {authMode !== 'forgot' && (
                <div className="form-group with-icon">
                  <label>Password</label>
                  <div className="form-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder={authMode === 'reset' ? 'Enter your new password' : 'Enter your password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                  {errors.password && <div className="error-message">{errors.password}</div>}
                </div>
              )}

              {/* Confirm Password Field */}
              {(authMode === 'signup' || authMode === 'reset') && (
                <div className="form-group with-icon">
                  <label>Confirm Password</label>
                  <div className="form-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                  {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                </div>
              )}

              {/* Terms Checkbox (for signup only) */}
              {authMode === 'signup' && (
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleInputChange}
                    className={errors.terms ? 'error' : ''}
                  />
                  <label htmlFor="terms">
                    I agree to the <button type="button" className="terms-link" onClick={openTerms}>Terms & Conditions</button>
                  </label>
                  {errors.terms && <div className="error-message">{errors.terms}</div>}
                </div>
              )}

              {/* Forgot Password Link (for login only) */}
              {authMode === 'login' && (
                <div className="login-options">
                  <div></div>
                  <button 
                    type="button"
                    className="forgot-password-link"
                    onClick={() => switchAuthMode('forgot')}
                  >
                    Forgot your password?
                  </button>
                </div>
              )}

              {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

              <button 
                type="submit" 
                className={`form-button ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {getSubmitButtonText()}
              </button>
                </form>

                {/* Auth Mode Toggle Links */}
                <div className="form-footer">
              {authMode === 'login' && (
                <p>
                  Don't have an account? 
                  <button 
                    className="toggle-auth" 
                    onClick={() => setAuthMode('signup')}
                  >
                    Sign Up
                  </button>
                </p>
              )}

              {authMode === 'signup' && (
                <p>
                  Already have an account? 
                  <button 
                    className="toggle-auth" 
                    onClick={() => setAuthMode('login')}
                  >
                    Login
                  </button>
                </p>
              )}

              {authMode === 'forgot' && (
                <p>
                  Remember your password? 
                  <button 
                    className="toggle-auth" 
                    onClick={() => setAuthMode('login')}
                  >
                    Back to Login
                  </button>
                </p>
              )}

              {authMode === 'reset' && (
                <p>
                  Want to login instead? 
                  <button 
                    className="toggle-auth" 
                    onClick={() => setAuthMode('login')}
                  >
                    Login
                  </button>
                </p>
              )}
                </div>

                {/* Google Auth removed */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Conditions Modal */}
      {showTerms && <TermsPage onClose={closeTerms} />}
    </>
  );
};

export default LoginPage;