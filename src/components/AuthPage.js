import React, { useState } from 'react';
import './AuthPage.css';

const AuthPage = ({ onLogin, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    terms: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email or username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      if (!formData.terms) {
        newErrors.terms = 'You must accept the terms';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        name: isLogin ? 'User' : `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone || '+254700000000',
        isAdmin: formData.email.includes('admin')
      };

      if (onLogin) {
        onLogin(userData);
      }
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    // Simulate Google authentication
    const userData = {
      name: 'Google User',
      email: 'user@gmail.com',
      phone: '+254700000000',
      isAdmin: false
    };
    
    if (onLogin) {
      onLogin(userData);
    }
    
    if (onClose) {
      onClose();
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      terms: false
    });
    setErrors({});
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-auth" onClick={onClose}>×</button>
        
        {/* Logo Section */}
        <div className="auth-logo">
          <img 
            src="https://res.cloudinary.com/djksfayfu/image/upload/v1753345398/Gems_Logo_h9auzj.png" 
            alt="Gems of Insight" 
            className="logo-image"
          />
        </div>

        {/* Login/Signup Form Section */}
        <div className="auth-content">
          {!isLogin && (
            <div className="auth-image-section">
              <img 
                src="https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg" 
                alt="Healthy Living" 
                className="healthy-image"
              />
              <div className="image-overlay">
                <h3>Start Your Wellness Journey</h3>
                <p>Join thousands who trust us for their natural health needs</p>
              </div>
            </div>
          )}

          <div className="auth-form-section">
            <div className="auth-header">
              <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
              <p>{isLogin ? 'Sign in to continue your wellness journey' : 'Join our natural wellness community'}</p>
            </div>

            {/* Google Authentication removed */}

            <form className="auth-form" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? 'error' : ''}
                      placeholder="First Name"
                      required
                    />
                    {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? 'error' : ''}
                      placeholder="Last Name"
                      required
                    />
                    {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                  </div>
                </div>
              )}

              {!isLogin && (
                <div className="form-group">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? 'error' : ''}
                    placeholder="Phone Number (+254...)"
                    required
                  />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>
              )}

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="Email or Username"
                  required
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? 'error' : ''}
                  placeholder="Password"
                  required
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              {!isLogin && (
                <div className="form-group">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={errors.confirmPassword ? 'error' : ''}
                    placeholder="Confirm Password"
                    required
                  />
                  {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                </div>
              )}

              {!isLogin && (
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="terms"
                      checked={formData.terms}
                      onChange={handleInputChange}
                      className={errors.terms ? 'error' : ''}
                    />
                    <span className="checkmark"></span>
                    I agree to the Terms & Conditions
                  </label>
                  {errors.terms && <span className="error-text">{errors.terms}</span>}
                </div>
              )}

              {errors.submit && <div className="error-text submit-error">{errors.submit}</div>}

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button type="button" className="toggle-auth" onClick={toggleAuthMode}>
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
