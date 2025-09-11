import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
// Tailwind conversion: removed external CSS import
// import './AdminLayout.css'; // legacy css removed

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
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-emerald-50 to-emerald-100 p-6">
      <div className="w-full max-w-md rounded-2xl border border-emerald-200 bg-white p-6 shadow">
        <div className="mb-4 flex flex-col items-center">
          <img
            src="/images/gems_of_insight_favicon_zcfwrx.png"
            alt="Gems of Insight"
            className="h-10 w-10"
          />
          <span className="mt-2 text-base font-semibold text-gray-900">Gems of Insight</span>
        </div>
        <p className="text-center text-sm text-gray-600">Welcome to Gems of Insight</p>
        <h2 className="mt-2 text-center text-lg font-semibold text-gray-900">Admin Signup</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
          />
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
          />
          {error && <div className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-800">{error}</div>}
          {success && <div className="rounded-md border border-emerald-200 bg-emerald-50 p-2 text-sm text-emerald-800">{success}</div>}
          <button type="submit" className="inline-flex w-full items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Sign Up</button>
        </form>
        <div className="mt-3 text-center text-sm">
          <a className="text-emerald-700 hover:underline" href="/admin/login">Already have an account? Log in</a>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;