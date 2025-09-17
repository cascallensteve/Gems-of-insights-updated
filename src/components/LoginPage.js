import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';
import TermsPage from './TermsPage';
// GoogleSignInButton removed

const LoginPage = ({ onLogin, onClose }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
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

  const getPasswordStrength = (pwd) => {
    const lengthScore = pwd.length >= 12 ? 2 : pwd.length >= 8 ? 1 : 0;
    const varietyScore = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].reduce((s, r) => s + (r.test(pwd) ? 1 : 0), 0);
    const total = lengthScore + varietyScore; // 0-6
    if (pwd.length < 8) return { label: 'Too short', level: 'weak' };
    if (total <= 2) return { label: 'Weak', level: 'weak' };
    if (total <= 4) return { label: 'Medium', level: 'medium' };
    return { label: 'Strong', level: 'strong' };
  };

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
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
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

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }
    // If there's navigation history, go back; otherwise, go home
    try {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        window.location.href = '/';
      }
    } catch (e) {
      window.location.href = '/';
    }
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
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden grid md:grid-cols-2 max-h-[85vh] md:max-h-[90vh] overflow-y-auto">
          {/* Success Message Overlay */}
          {showSuccess && (
            <div className="absolute inset-0 z-20 grid place-items-center bg-black/40">
              <div className="bg-white rounded-lg shadow p-6 flex items-center gap-3 text-emerald-700 font-medium">
                <div className="h-8 w-8 rounded-full bg-emerald-600 text-white grid place-items-center">✓</div>
                <p>{successMessage}</p>
              </div>
            </div>
          )}

          <div className="block bg-emerald-50">
            <div className="h-20 sm:h-28 md:h-full w-full bg-[url('https://res.cloudinary.com/dqvsjtkqw/image/upload/v1753870920/background_wam447.webp')] bg-cover bg-center opacity-90" aria-hidden="true" />
          </div>
          <div className="relative p-4 md:p-8">
            <button className="absolute left-4 top-4 text-sm text-gray-600 hover:text-emerald-700" onClick={handleClose}>← Back</button>
            <button className="absolute right-4 top-4 text-2xl leading-none text-gray-600 hover:text-emerald-700" onClick={handleClose}>×</button>

            <div className="flex justify-center mb-3 mt-1 md:mt-4">
              <img
                src="/images/LOGOGEMS.png"
                alt="Gems of Insight"
                className="h-16 sm:h-24 md:h-40 w-auto object-contain"
              />
            </div>

            <div className="text-center mb-6">
              <h1 className="text-xl font-semibold text-gray-900">{getFormTitle()}</h1>
              <p className="text-sm text-gray-600 mt-1">{getFormSubtitle()}</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Signup Fields */}
              {authMode === 'signup' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`mt-1 rounded-md border ${errors.firstName ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-emerald-200'} px-3 py-2 text-sm outline-none`}
                      required
                    />
                    {errors.firstName && <div className="text-sm text-red-600 mt-1">{errors.firstName}</div>}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`mt-1 rounded-md border ${errors.lastName ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-emerald-200'} px-3 py-2 text-sm outline-none`}
                      required
                    />
                    {errors.lastName && <div className="text-sm text-red-600 mt-1">{errors.lastName}</div>}
                  </div>
                  </div>
                </>
              )}

              {/* Email Field */}
              {authMode !== 'reset' && (
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`mt-1 w-full rounded-md border ${errors.email ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-emerald-200'} pl-10 pr-3 py-2 text-sm outline-none`}
                    required
                  />
                  </div>
                  {errors.email && <div className="text-sm text-red-600 mt-1">{errors.email}</div>}
                </div>
              )}

              {/* Password Field */}
              {authMode !== 'forgot' && (
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder={authMode === 'reset' ? 'Enter your new password' : 'Enter your password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`mt-1 w-full rounded-md border ${errors.password ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-emerald-200'} pl-10 pr-10 py-2 text-sm outline-none`}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-2 my-auto text-gray-600 hover:text-emerald-700"
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
                  </div>
                  {/* Password strength meter for signup/reset modes */}
                  {(authMode === 'signup' || authMode === 'reset') && formData.password && (
                    (() => {
                      const s = getPasswordStrength(formData.password);
                      return (
                        <div className="mt-1 flex items-center gap-2 text-xs">
                          <div className={`h-1.5 w-20 rounded ${s.level==='weak' ? 'bg-red-500' : 'bg-emerald-200'}`}></div>
                          <div className={`h-1.5 w-20 rounded ${s.level!=='strong' ? 'bg-yellow-500' : 'bg-emerald-200'}`}></div>
                          <div className={`h-1.5 w-20 rounded ${s.level==='strong' ? 'bg-emerald-600' : 'bg-gray-200'}`}></div>
                          <span className={`ml-2 ${s.level==='strong' ? 'text-emerald-700' : s.level==='medium' ? 'text-yellow-700' : 'text-red-700'}`}>{s.label}</span>
                        </div>
                      );
                    })()
                  )}
                  {errors.password && <div className="text-sm text-red-600 mt-1">{errors.password}</div>}
                </div>
              )}

              {/* Confirm Password Field */}
              {(authMode === 'signup' || authMode === 'reset') && (
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="16" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`mt-1 w-full rounded-md border ${errors.confirmPassword ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-emerald-200'} pl-10 pr-10 py-2 text-sm outline-none`}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-2 my-auto text-gray-600 hover:text-emerald-700"
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
                  </div>
                  {errors.confirmPassword && <div className="text-sm text-red-600 mt-1">{errors.confirmPassword}</div>}
                </div>
              )}

              {/* Terms Checkbox (for signup only) */}
              {authMode === 'signup' && (
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleInputChange}
                    className={`h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 ${errors.terms ? 'ring-2 ring-red-200' : ''}`}
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    I agree to the <button type="button" className="text-emerald-700 hover:underline" onClick={openTerms}>Terms & Conditions</button>
                  </label>
                  {errors.terms && <div className="text-sm text-red-600 mt-1">{errors.terms}</div>}
                </div>
              )}

              {/* Forgot Password Link (for login only) */}
              {authMode === 'login' && (
                <div className="flex items-center justify-between text-sm">
                  <div></div>
                  <button 
                    type="button"
                    className="text-emerald-700 hover:underline"
                    onClick={() => switchAuthMode('forgot')}
                  >
                    Forgot your password?
                  </button>
                </div>
              )}

              {errors.submit && <div className="text-sm text-red-600">{errors.submit}</div>}

              <button 
                type="submit" 
                className={`w-full inline-flex items-center justify-center rounded-md bg-emerald-700 text-white px-4 py-2.5 text-sm font-medium shadow hover:bg-emerald-600 transition ${loading ? 'opacity-80' : ''}`}
                disabled={loading}
              >
                {getSubmitButtonText()}
              </button>
                </form>

                {/* Auth Mode Toggle Links */}
                <div className="text-center text-sm text-gray-700 mt-4">
              {authMode === 'login' && (
                <p>
                  Don't have an account? 
                  <button 
                    className="text-emerald-700 hover:underline" 
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
                    className="text-emerald-700 hover:underline" 
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
                    className="text-emerald-700 hover:underline" 
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
                    className="text-emerald-700 hover:underline" 
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

      {/* Terms & Conditions Modal */}
      {showTerms && <TermsPage onClose={closeTerms} />}
    </>
  );
};

export default LoginPage;