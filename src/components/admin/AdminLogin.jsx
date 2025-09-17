import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Tailwind conversion: removed external CSS import
// import './AdminLayout.css'; // legacy css removed
import apiService from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await apiService.auth.login(email, password);
      // Normalize possible response shapes
      const userData = res.user || res.data || res;
      const token = res.token || res.key || res.authToken || res.access || res.access_token;
      if (!userData || !token) {
        throw new Error('Invalid login response');
      }
      login(userData, token);
      setSuccess('Login successful!');
      if (onLogin) onLogin();
      navigate('/admin', { replace: true });
    } catch (err) {
      const msg = typeof err === 'string' ? err : (err?.detail || err?.message || 'Login failed');
      setError(msg);
    } finally {
      setLoading(false);
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
        <h2 className="mt-2 text-center text-lg font-semibold text-gray-900">Admin Login</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
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
          <button
            type="submit"
            disabled={loading}
            className={[
              'inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-white',
              loading ? 'bg-emerald-400' : 'bg-emerald-600 hover:bg-emerald-700'
            ].join(' ')}
          >
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>
        <div className="mt-3 text-center text-sm">
          <a className="text-emerald-700 hover:underline" href="/admin/signup">Don't have an account? Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;