import React, { useState } from 'react';
import './AdminLayout.css';

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Replace with real admin login logic
    if (email && password) {
      setError('');
      setSuccess('Login successful!');
      if (onLogin) onLogin();
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
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit} className="admin-auth-form">
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
          <button type="submit">Login</button>
        </form>
        <div className="admin-auth-link">
          <a href="/admin/signup">Don't have an account? Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;