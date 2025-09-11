import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserOrders } from '../services/api';
import apiService from '../services/api';
import { FaUser, FaBox, FaLock, FaCog, FaDownload } from 'react-icons/fa';
import receiptService from '../services/receiptService';
import pdfService from '../services/pdfService';
import AdminBlogManager from './AdminBlogManager';
import LoadingDots from './LoadingDots';
// Tailwind conversion: removed external CSS import

const UserProfile = () => {
  const { currentUser, updateUser, logout, refreshUserFromServer, getCurrentUserData, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: currentUser?.email || '',
    phone: currentUser?.phone || currentUser?.phone_number || '',
    newsletter: currentUser?.newsletter || false
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [showAdminBlog, setShowAdminBlog] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [passwordResetData, setPasswordResetData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  // Load user orders
  useEffect(() => {
    if (activeTab === 'orders') {
      loadUserOrders();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'orders') return;
    const interval = setInterval(() => {
      loadUserOrders();
    }, 15000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const loadUserOrders = async () => {
    setLoadingOrders(true);
    try {
      const apiData = await getUserOrders();
      const rawOrders = Array.isArray(apiData) ? apiData : (apiData?.orders || apiData?.data || []);

      const normalized = rawOrders.map((o, idx) => {
        const items = (o.items || o.order_items || o.products || []).map((it, i) => ({
          id: it.id ?? it.product_id ?? it.product ?? it.item ?? `${o.id}-item-${i}`,
          productId: it.product ?? it.item ?? it.product_id ?? it.id,
          name: it.name ?? it.product_name ?? it.title ?? `Item ${i+1}`,
          price: Number(it.price ?? it.unit_price ?? it.amount ?? 0) || 0,
          quantity: Number(it.quantity ?? it.qty ?? 1),
          image: it.image ?? it.photo ?? '/images/default-product.jpg'
        }));

        const created = o.date || o.created_at || o.created || new Date().toISOString();
        let status = (o.status || o.order_status || o.payment_status || 'processing').toString().toLowerCase();
        const isPaid = (o.is_paid === true) || ['paid','completed','success','delivered'].includes(status);
        if (!isPaid) {
          if (['pending','awaiting','payment_pending','unpaid'].includes(status)) {
            status = 'payment_pending';
          }
        }
        const total = Number(
          o.total ?? o.total_amount ?? o.amount ?? (items.reduce((s, it) => s + (Number(it.price)||0) * (Number(it.quantity)||1), 0))
        );

        return {
          id: o.id?.toString?.() || o.order_id || o.reference || `ORD-${Date.now()}-${idx}`,
          date: new Date(created).toISOString(),
          status,
          total,
          items
        };
      });

      normalized.sort((a, b) => new Date(b.date) - new Date(a.date));
      setOrders(normalized);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getMembershipDuration = () => {
    const memberSince = currentUser?.createdAt || currentUser?.joinedDate;
    if (!memberSince) return 'New member';
    
    const joinDate = new Date(memberSince);
    const now = new Date();
    const diffTime = Math.abs(now - joinDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      await updateUser(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleCancel = () => {
    setFormData({
      email: currentUser?.email || '',
      phone: currentUser?.phone || currentUser?.phone_number || '',
      newsletter: currentUser?.newsletter || false
    });
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (passwordResetData.newPassword !== passwordResetData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match!' });
      return;
    }

    if (passwordResetData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long!' });
      return;
    }

    try {
      await apiService.auth.changePassword(passwordResetData.currentPassword, passwordResetData.newPassword);
      
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setShowPasswordReset(false);
      setPasswordResetData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update password. Please try again.' });
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      setMessage({ type: 'error', text: 'Please type "DELETE" to confirm account deletion.' });
      return;
    }

    try {
      // Call delete account API here
      setMessage({ type: 'success', text: 'Account deletion request submitted. You will be logged out.' });
      setTimeout(() => {
        logout();
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete account. Please contact support.' });
    }
  };

  const handleLogout = () => {
    logout();
    // Navigate to home page and scroll to top
    window.location.href = '/';
    // Force scroll to top after navigation
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  // Refresh user data when component mounts (only once)
  useEffect(() => {
    const refreshData = async () => {
      console.log('Refreshing user data in profile...');
      await refreshUserFromServer();
      getCurrentUserData(); // Debug current state
    };
    
    refreshData();
  }, []); // Remove dependencies to prevent infinite loop





  // Mock data for recent activity
  const recentOrders = [
    { id: 'ORD-2024-001', date: '2024-01-15', total: 67.99, status: 'delivered' },
    { id: 'ORD-2024-002', date: '2024-01-20', total: 45.50, status: 'shipped' }
  ];

  const upcomingAppointments = [
    { id: 'APT-001', date: '2024-01-25', time: '10:00 AM', specialist: 'Dr. Sarah Mitchell' },
    { id: 'APT-002', date: '2024-02-01', time: '2:30 PM', specialist: 'Dr. James Chen' }
  ];

  return (
    <div className="mt-[64px] md:mt-[72px]">
      <div className="mx-auto max-w-6xl px-4">
        {/* Welcome Message */}
        <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Hi, {currentUser?.firstName || currentUser?.first_name || 'User'}! 🌟</h2>
          <p className="mt-1 text-gray-700">{getGreeting()}! Welcome back to your wellness dashboard. You've been a valued member for {getMembershipDuration()}. Manage your health journey, track your orders, and personalize your experience.</p>
        </div>

        {/* Messages */}
        {message.text && (
          <div className={`mt-3 rounded-md border px-3 py-2 text-sm ${message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-red-200 bg-red-50 text-red-800'}`}>
            <span className="mr-2">{message.type === 'success' ? '✅' : '❌'}</span>
            {message.text}
          </div>
        )}
        
        {/* Profile Header */}
        <div className="mt-4 grid gap-4 rounded-xl border border-emerald-100 bg-white p-5 shadow-sm md:grid-cols-[auto_1fr] md:items-center">
          <div className="flex items-center justify-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-600 text-lg font-semibold text-white">
              {(currentUser?.firstName || currentUser?.first_name || 'U').charAt(0).toUpperCase()}
            </div>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{currentUser?.firstName || currentUser?.first_name || 'User'} {currentUser?.lastName || currentUser?.last_name || ''}</h1>
            <p className="text-sm text-gray-700">{currentUser?.email}</p>
            <p className="text-xs text-gray-500 mt-1">Member since {new Date(currentUser?.createdAt || Date.now()).toLocaleDateString()}</p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-md border border-emerald-100 bg-emerald-50/60 p-2">
                <div className="text-base font-semibold text-gray-900">{orders.length || 0}</div>
                <div className="text-xs text-gray-700">Orders</div>
              </div>
              <div className="rounded-md border border-emerald-100 bg-emerald-50/60 p-2">
                <div className="text-base font-semibold text-gray-900">{getMembershipDuration()}</div>
                <div className="text-xs text-gray-700">Member</div>
              </div>
              <div className="rounded-md border border-emerald-100 bg-emerald-50/60 p-2">
                <div className="text-base font-semibold text-gray-900">{currentUser?.role === 'admin' ? 'Admin' : 'Active'}</div>
                <div className="text-xs text-gray-700">Status</div>
              </div>
            </div>
          </div>
          {/* Edit profile controls removed as requested */}
        </div>

        {/* Profile Tabs */}
        <div className="mt-4 flex gap-2 overflow-x-auto rounded-xl border border-emerald-100 bg-white p-2">
          <button 
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${activeTab === 'profile' ? 'bg-emerald-600 text-white' : 'text-gray-700 hover:bg-emerald-50'}`}
            onClick={() => setActiveTab('profile')}
          >
            <FaUser /> Personal Info
          </button>
          <button 
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${activeTab === 'orders' ? 'bg-emerald-600 text-white' : 'text-gray-700 hover:bg-emerald-50'}`}
            onClick={() => setActiveTab('orders')}
          >
            <FaBox /> My Orders
          </button>
          <button 
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${activeTab === 'security' ? 'bg-emerald-600 text-white' : 'text-gray-700 hover:bg-emerald-50'}`}
            onClick={() => setActiveTab('security')}
          >
            <FaLock /> Security
          </button>
          <button 
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${activeTab === 'settings' ? 'bg-emerald-600 text-white' : 'text-gray-700 hover:bg-emerald-50'}`}
            onClick={() => setActiveTab('settings')}
          >
            <FaCog /> Account Settings
          </button>
          {(currentUser?.role === 'admin' || currentUser?.userType === 'admin') && (
            <button 
              className={`rounded-md px-3 py-2 text-sm font-semibold ${activeTab === 'admin' ? 'bg-emerald-600 text-white' : 'text-gray-700 hover:bg-emerald-50'}`}
              onClick={() => setActiveTab('admin')}
            >
              📝 Blog Management
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="mt-4 rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <div className="text-xs text-gray-500">First Name</div>
                  <div className="text-sm font-medium text-gray-900">{currentUser?.firstName || currentUser?.first_name || 'Not provided'}</div>
                </div>
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <div className="text-xs text-gray-500">Last Name</div>
                  <div className="text-sm font-medium text-gray-900">{currentUser?.lastName || currentUser?.last_name || 'Not provided'}</div>
                </div>
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="text-sm font-medium text-gray-900 break-all">{currentUser?.email || 'Not provided'}</div>
                </div>
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <div className="text-xs text-gray-500">Phone</div>
                  <div className="text-sm font-medium text-gray-900">{currentUser?.phone || currentUser?.phone_number || 'Not provided'}</div>
                </div>
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 sm:col-span-2">
                  <div className="text-xs text-gray-500">Newsletter Subscription</div>
                  <div className="text-sm font-medium text-gray-900">{currentUser?.newsletter ? 'Subscribed' : 'Not subscribed'}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">My Orders</h2>
                <button className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => window.location.href = '/orders'}>
                  View All Orders
                </button>
              </div>
              {loadingOrders ? (
                <div className="py-10 flex items-center justify-center"><LoadingDots text="Loading your orders..." size="large" /></div>
              ) : orders.length > 0 ? (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {orders.slice(0, 4).map(order => {
                    const paid = ['paid','completed','success','delivered'].includes((order.status||'').toLowerCase());
                    const statusColor = paid ? '#16a34a' : (order.status==='payment_pending' ? '#f59e0b' : '#64748b');
                    return (
                      <div key={order.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">Order #{order.id}</div>
                            <div className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</div>
                          </div>
                          <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium text-white" style={{ backgroundColor: statusColor }}>
                            {paid ? 'Paid' : (order.status?.charAt(0).toUpperCase() + order.status?.slice(1))}
                          </span>
                        </div>
                        <div className="mt-3 text-sm text-gray-700"><strong className="text-gray-900">Total:</strong> KSH {Number(order.total||0).toLocaleString()}</div>
                        <div className="mt-3">
                          <button
                            className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
                            onClick={() => paid ? receiptService.downloadReceipt(order) : receiptService.downloadCartDetailsPDF(order)}
                          >
                            <FaDownload /> {paid ? 'Download Receipt' : 'Download Cart PDF'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-600 py-10">
                  <p>No orders yet. Start shopping to see your orders here!</p>
                  <button 
                    className="mt-3 inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-white text-sm font-medium hover:bg-emerald-700" 
                    onClick={() => window.location.href = '/shop'}
                  >
                    🛍️ Start Shopping
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
              <div className="mt-4 grid grid-cols-1 gap-4">
                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2"><FaLock /> Password Management</h3>
                  {!showPasswordReset ? (
                    <div className="mt-3 flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">Change Password</div>
                        <div className="text-sm text-gray-600">Update your account password for better security</div>
                      </div>
                      <button 
                        className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowPasswordReset(true)}
                      >
                        Change Password
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handlePasswordReset} className="mt-4 grid grid-cols-1 gap-3">
                      <div>
                        <label className="text-xs text-gray-600">Current Password</label>
                        <input
                          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                          type="password"
                          value={passwordResetData.currentPassword}
                          onChange={(e) => setPasswordResetData(prev => ({
                            ...prev,
                            currentPassword: e.target.value
                          }))}
                          required
                          placeholder="Enter your current password"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">New Password</label>
                        <input
                          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                          type="password"
                          value={passwordResetData.newPassword}
                          onChange={(e) => setPasswordResetData(prev => ({
                            ...prev,
                            newPassword: e.target.value
                          }))}
                          required
                          placeholder="Enter new password (min 6 characters)"
                          minLength="6"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Confirm New Password</label>
                        <input
                          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                          type="password"
                          value={passwordResetData.confirmPassword}
                          onChange={(e) => setPasswordResetData(prev => ({
                            ...prev,
                            confirmPassword: e.target.value
                          }))}
                          required
                          placeholder="Confirm your new password"
                        />
                      </div>
                      <div className="mt-1 flex items-center justify-end gap-2">
                        <button type="button" className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => {
                            setShowPasswordReset(false);
                            setPasswordResetData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                          }}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700">
                          Update Password
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-900">🛡️ Account Security</h3>
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm">
                      <div className="text-gray-600">Last Login</div>
                      <div className="font-medium text-gray-900">{new Date().toLocaleDateString()} - Current session</div>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm">
                      <div className="text-gray-600">Account Created</div>
                      <div className="font-medium text-gray-900">{new Date(currentUser?.createdAt || Date.now()).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="appointments-summary">
              <div className="section-header">
                <h2>Upcoming Appointments</h2>
                <button className="view-all-btn">
                  View All Appointments
                </button>
              </div>
              <div className="appointments-list">
                {upcomingAppointments.map(appointment => (
                  <div key={appointment.id} className="appointment-summary">
                    <div className="appointment-info">
                      <h4>{appointment.specialist}</h4>
                      <p>{new Date(appointment.date).toLocaleDateString()} at {appointment.time}</p>
                    </div>
                    <div className="appointment-actions">
                      <button className="reschedule-btn">Reschedule</button>
                      <button className="cancel-btn">Cancel</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
              <div className="mt-4 grid grid-cols-1 gap-4">
                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-900">📧 Notifications</h3>
                  <div className="mt-3 space-y-3">
                    <div className="flex items-start justify-between rounded-lg border border-gray-100 bg-gray-50 p-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">Email Newsletter</div>
                        <div className="text-sm text-gray-600">Receive wellness tips and product updates</div>
                      </div>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-gray-200 text-gray-700">
                        {currentUser?.newsletter ? 'Subscribed' : 'Not subscribed'}
                      </span>
                    </div>
                    <div className="flex items-start justify-between rounded-lg border border-gray-100 bg-gray-50 p-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">Order Updates</div>
                        <div className="text-sm text-gray-600">Get notified about order status changes</div>
                      </div>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800">
                        Always enabled
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-900">💾 Data & Privacy</h3>
                  <div className="mt-3 flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">Download My Data</div>
                      <div className="text-sm text-gray-600">Export all your account data</div>
                    </div>
                    <button className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => pdfService.downloadUserProfilePDF(currentUser)}>
                      📥 Export Data
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-red-200 bg-red-50 p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-red-700">⚠️ Danger Zone</h3>
                  {!showDeleteAccount ? (
                    <div className="mt-3 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4">
                      <div>
                        <div className="text-sm font-medium text-red-800">Delete Account</div>
                        <div className="text-sm text-red-700">Permanently delete your account and all associated data</div>
                      </div>
                      <button 
                        className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
                        onClick={() => setShowDeleteAccount(true)}
                      >
                        🗑️ Delete Account
                      </button>
                    </div>
                  ) : (
                    <div className="mt-3 rounded-lg border border-red-200 bg-white p-4">
                      <h4 className="text-sm font-semibold text-red-700 mb-2">Are you absolutely sure?</h4>
                      <p className="text-sm text-gray-700 mb-3">This action cannot be undone. This will permanently delete your account and remove all your data from our servers.</p>
                      <div>
                        <label className="text-xs text-gray-600">Type DELETE to confirm:</label>
                        <input
                          className="mt-1 w-full rounded-md border border-red-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-red-500"
                          type="text"
                          value={deleteConfirmation}
                          onChange={(e) => setDeleteConfirmation(e.target.value)}
                          placeholder="Type DELETE here"
                        />
                      </div>
                      <div className="mt-3 flex items-center justify-end gap-2">
                        <button 
                          className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                          onClick={handleDeleteAccount}
                          disabled={deleteConfirmation !== 'DELETE'}
                        >
                          I understand, delete my account
                        </button>
                        <button 
                          className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => {
                            setShowDeleteAccount(false);
                            setDeleteConfirmation('');
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Admin Blog Management Tab */}
          {activeTab === 'admin' && showAdminBlog && (
            <AdminBlogManager 
              user={currentUser}
              onNavigateBack={() => setShowAdminBlog(false)}
            />
          )}

          {activeTab === 'admin' && !showAdminBlog && (
            <div className="admin-section">
              <h2>Admin Dashboard</h2>
              <p>Welcome to the admin dashboard. Here you can manage blog posts and other administrative tasks.</p>
              
              <div className="admin-actions">
                <button 
                  className="admin-action-btn"
                  onClick={() => setShowAdminBlog(true)}
                >
                  <span className="btn-icon">📝</span>
                  <div className="btn-content">
                    <h3>Manage Blog Posts</h3>
                    <p>Create, edit, and manage blog posts</p>
                  </div>
                </button>
                
                <a 
                  href="/admin" 
                  className="admin-action-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="btn-icon">🚀</span>
                  <div className="btn-content">
                    <h3>Full Admin Dashboard</h3>
                    <p>Access complete admin panel with all features</p>
                  </div>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
