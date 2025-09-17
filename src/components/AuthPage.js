import React, { useState } from 'react';

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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative w-full max-w-5xl bg-white rounded-xl shadow-xl overflow-hidden grid md:grid-cols-2" onClick={(e) => e.stopPropagation()}>
        <button className="absolute right-3 top-2 text-2xl text-gray-600 hover:text-emerald-700" onClick={onClose}>×</button>
        
        {/* Logo/Visual Section */}
        <div className="hidden md:flex items-center justify-center bg-emerald-50">
          <img 
            src="https://res.cloudinary.com/djksfayfu/image/upload/v1753345398/Gems_Logo_h9auzj.png" 
            alt="Gems of Insight" 
            className="h-20 w-auto object-contain"
          />
        </div>

        {/* Login/Signup Form Section */}
        <div className="p-6 md:p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-sm text-gray-600 mt-1">{isLogin ? 'Sign in to continue your wellness journey' : 'Join our natural wellness community'}</p>
          </div>

          {/* Google Authentication removed */}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`mt-1 rounded-md border ${errors.firstName ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-emerald-200'} px-3 py-2 text-sm outline-none`}
                    placeholder="First name"
                    required
                  />
                  {errors.firstName && <span className="text-sm text-red-600 mt-1">{errors.firstName}</span>}
                </div>
                <div className="flex flex-col">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`mt-1 rounded-md border ${errors.lastName ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-emerald-200'} px-3 py-2 text-sm outline-none`}
                    placeholder="Last name"
                    required
                  />
                  {errors.lastName && <span className="text-sm text-red-600 mt-1">{errors.lastName}</span>}
                </div>
              </div>
            )}

            {!isLogin && (
              <div className="flex flex-col">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`mt-1 rounded-md border ${errors.phone ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-emerald-200'} px-3 py-2 text-sm outline-none`}
                  placeholder="Phone Number (+254...)"
                  required
                />
                {errors.phone && <span className="text-sm text-red-600 mt-1">{errors.phone}</span>}
              </div>
            )}

            <div className="flex flex-col">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`mt-1 rounded-md border ${errors.email ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-emerald-200'} px-3 py-2 text-sm outline-none`}
                placeholder="Email or Username"
                required
              />
              {errors.email && <span className="text-sm text-red-600 mt-1">{errors.email}</span>}
            </div>

            <div className="flex flex-col">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`mt-1 rounded-md border ${errors.password ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-emerald-200'} px-3 py-2 text-sm outline-none`}
                placeholder="Password"
                required
              />
              {errors.password && <span className="text-sm text-red-600 mt-1">{errors.password}</span>}
            </div>

            {!isLogin && (
              <div className="flex flex-col">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`mt-1 rounded-md border ${errors.confirmPassword ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-emerald-200'} px-3 py-2 text-sm outline-none`}
                  placeholder="Confirm Password"
                  required
                />
                {errors.confirmPassword && <span className="text-sm text-red-600 mt-1">{errors.confirmPassword}</span>}
              </div>
            )}

            {!isLogin && (
              <div className="flex items-start gap-2">
                <label className="text-sm text-gray-700">
                  <input
                    type="checkbox"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleInputChange}
                    className={`mr-2 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 ${errors.terms ? 'ring-2 ring-red-200' : ''}`}
                  />
                  I agree to the Terms & Conditions
                </label>
                {errors.terms && <span className="text-sm text-red-600 mt-1">{errors.terms}</span>}
              </div>
            )}

            {errors.submit && <div className="text-sm text-red-600">{errors.submit}</div>}

            <button type="submit" className="w-full inline-flex items-center justify-center rounded-md bg-emerald-700 text-white px-4 py-2.5 text-sm font-medium shadow hover:bg-emerald-600 transition disabled:opacity-80" disabled={loading}>
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="text-center text-sm text-gray-700 mt-4">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button type="button" className="text-emerald-700 hover:underline" onClick={toggleAuthMode}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
