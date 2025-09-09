import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import './AdminLayout.css';

const AdminSignup = ({ onSignup }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { addNotification } = useNotifications();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Replace with real admin registration logic
    if (email && password && firstName && lastName) {
      setError('');
      setSuccess('Admin account created! You can now log in.');
      // Emit admin signup notification
      addNotification({
        type: 'info',
        title: 'New Admin Signup',
        message: `Admin ${firstName} ${lastName} created an account (${email})`,
        details: {
          'Email': email
        },
        temporary: false
      });
      if (onSignup) onSignup();
    } else {
      setError('Please fill in all fields');
    }
  };

  return (
    <div className="admin-auth-page">
      <div className="admin-auth-container">
        <div className="admin-logo">
          <img
            src="/images/gems_of_insight_favicon_zcfwrx.png"
            alt="Gems of Insight"
            className="logo-image"
          />
          <span className="logo-text">Gems of Insight</span>
        </div>
        {/* Added welcome text below the logo */}
        <p className="welcome-text">Welcome to Gems of Insight</p>
        <h2>Admin Signup</h2>
        <form onSubmit={handleSubmit} className="admin-auth-form">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="admin-auth-error">{error}</div>}
          {success && <div className="admin-auth-success">{success}</div>}
          <button type="submit">Sign Up</button>
        </form>
        <div className="admin-auth-link">
          <a href="/admin/login">Already have an account? Log in</a>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;