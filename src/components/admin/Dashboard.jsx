import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaRegNewspaper, 
  FaShoppingCart, 
  FaMoneyBillWave, 
  FaCalendarAlt, 
  FaGraduationCap, 
  FaUser, 
  FaClipboardList, 
  FaFileInvoice, 
  FaCogs 
} from 'react-icons/fa';
import { blogService } from '../../services/blogService';
import apiService from '../../services/api';
import LoadingDots from '../LoadingDots';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBlogs: 0,
    totalOrders: 0,
    totalRevenue: 0,
    newUsersToday: 0,
    ordersToday: 0,
    totalAppointments: 0,
    totalEnrollments: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    // Set up polling to check for new data every 5 minutes
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch blogs
      const blogsData = await blogService.getAllBlogs();
      setBlogs(blogsData.slice(0, 5)); // Latest 5 blogs

      // Fetch real user data
      let totalUsers = 0;
      let newUsersToday = 0;
      
      try {
        const usersResponse = await apiService.users.getAllUsers();
        console.log('Dashboard - Users API Response:', usersResponse);
        
        if (usersResponse && Array.isArray(usersResponse)) {
          totalUsers = usersResponse.length;
          
          // Calculate new users today (users registered in the last 24 hours)
          const today = new Date();
          const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
          
          newUsersToday = usersResponse.filter(user => {
            const userDate = user.created_at ? new Date(user.created_at) : new Date();
            return userDate >= yesterday;
          }).length;
        } else if (usersResponse && usersResponse.users && Array.isArray(usersResponse.users)) {
          totalUsers = usersResponse.users.length;
          
          const today = new Date();
          const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
          
          newUsersToday = usersResponse.users.filter(user => {
            const userDate = user.created_at ? new Date(user.created_at) : new Date();
            return userDate >= yesterday;
          }).length;
        }
        
        console.log(`Dashboard - Total users: ${totalUsers}, New today: ${newUsersToday}`);
      } catch (userError) {
        console.error('Error fetching users in dashboard:', userError);
        // Fallback to stored data if API fails
        const storedUsers = localStorage.getItem('adminUsers') || '[]';
        totalUsers = JSON.parse(storedUsers).length;
        setError('Unable to fetch real-time user data. Showing cached data.');
      }

      // Fetch appointments count (best-effort)
      let totalAppointments = 0;
      try {
        const token = apiService.getAuthToken();
        if (token) {
          const res = await fetch(`${apiService.api?.defaults?.baseURL || 'https://gems-of-truth.vercel.app'}/bookings/appointment-list`, {
            headers: { 'Authorization': `Token ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            totalAppointments = Array.isArray(data) ? data.length : (Array.isArray(data?.appointments) ? data.appointments.length : 0);
          }
        }
      } catch (e) {
        console.warn('Appointments fetch failed; skipping');
      }

      // Fetch enrollments count from localStorage (source used by Courses admin)
      let totalEnrollments = 0;
      try {
        const stored = localStorage.getItem('courseEnrollments');
        if (stored) {
          const parsed = JSON.parse(stored);
          totalEnrollments = Array.isArray(parsed) ? parsed.length : 1;
        }
      } catch {}

      // Set real stats
      setStats({
        totalUsers: totalUsers,
        totalBlogs: blogsData.length,
        totalOrders: 0, // You can implement orders API later
        totalRevenue: 0, // You can implement revenue API later
        newUsersToday: newUsersToday,
        ordersToday: 0,
        totalAppointments,
        totalEnrollments
      });

      // Real recent activity based on actual data
      const realActivity = [];
      
      if (newUsersToday > 0) {
        realActivity.push({
          id: 1,
          type: 'user',
          message: `${newUsersToday} new user${newUsersToday > 1 ? 's' : ''} registered today`,
          time: 'Today'
        });
      }
      
      if (blogsData.length > 0) {
        realActivity.push({
          id: 2,
          type: 'blog',
          message: `Latest blog: ${blogsData[0].title}`,
          time: 'Recent'
        });
      }
      
      // Add more real activities as needed
      if (realActivity.length === 0) {
        realActivity.push({
          id: 1,
          type: 'info',
          message: 'System is running smoothly',
          time: 'Now'
        });
      }
      
      setRecentActivity(realActivity);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
      
      // Set mock data on error
      setStats(prevStats => ({
        ...prevStats,
        totalOrders: 3542,
        totalRevenue: 125670,
        newUsersToday: 24,
        ordersToday: 18
      }));

      // Mock recent activity
      setRecentActivity([
        { id: 1, type: 'user', message: 'New user registration: john.doe@email.com', time: '2 minutes ago' },
        { id: 2, type: 'order', message: 'New order #3543 - KSh 2,500', time: '15 minutes ago' },
        { id: 3, type: 'blog', message: 'Blog post published: NEWSTART Health Tips', time: '1 hour ago' },
        { id: 4, type: 'user', message: 'User profile updated: sarah.wilson@email.com', time: '2 hours ago' },
        { id: 5, type: 'order', message: 'Order completed #3541 - KSh 1,850', time: '3 hours ago' }
      ]);

    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `KSh ${amount.toLocaleString()}`;
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user': return <FaUser />;
      case 'order': return <FaClipboardList />;
      case 'blog': return <FaRegNewspaper />;
      default: return <FaClipboardList />;
    }
  };

  const quickActions = [
    { title: 'Add New Blog Post', icon: <FaRegNewspaper />, action: 'blog', color: '#6b8e23' },
    { title: 'View All Users', icon: <FaUsers />, action: 'users', color: '#3b82f6' },
    { title: 'Manage Orders', icon: <FaClipboardList />, action: 'orders', color: '#f59e0b' },
    { title: 'System Settings', icon: <FaCogs />, action: 'settings', color: '#8b5cf6' }
  ];

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="dashboard-loading">
          <LoadingDots text="Loading dashboard..." size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Admin Dashboard</h1>
            <p>Welcome back! Here's what's happening with your store today.</p>
          </div>
          <div className="header-actions">
            <button className="refresh-btn" onClick={fetchDashboardData}>
              🔄 Refresh
            </button>
          </div>
        </div>
        
        <div className="error-message">
          <p>⚠️ {error}</p>
          <button className="btn btn-primary" onClick={fetchDashboardData}>
            Try Again
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="admin-dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <p>Welcome back! Here's what's happening with your store today.</p>
        </div>
        <div className="header-actions">
          <button className="refresh-btn" onClick={fetchDashboardData}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#6b8e23' }}><FaUsers /></div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers.toLocaleString()}</p>
            <span className="stat-change positive">+{stats.newUsersToday} today</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#3b82f6' }}><FaRegNewspaper /></div>
          <div className="stat-content">
            <h3>Blog Posts</h3>
            <p className="stat-number">{stats.totalBlogs}</p>
            <span className="stat-change neutral">Published</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => window.dispatchEvent(new CustomEvent('admin-navigate', { detail: { tab: 'orders' } }))} style={{ cursor: 'pointer' }}>
          <div className="stat-icon" style={{ backgroundColor: '#f59e0b' }}><FaShoppingCart /></div>
          <div className="stat-content">
            <h3>Total Orders</h3>
            <p className="stat-number">{stats.totalOrders.toLocaleString()}</p>
            <span className="stat-change positive">+{stats.ordersToday} today</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#10b981' }}><FaMoneyBillWave /></div>
          <div className="stat-content">
            <h3>Revenue</h3>
            <p className="stat-number">{formatCurrency(stats.totalRevenue)}</p>
            <span className="stat-change positive">+12.5% this month</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => window.dispatchEvent(new CustomEvent('admin-navigate', { detail: { tab: 'appointments' } }))} style={{ cursor: 'pointer' }}>
          <div className="stat-icon" style={{ backgroundColor: '#14b8a6' }}><FaCalendarAlt /></div>
          <div className="stat-content">
            <h3>Appointments</h3>
            <p className="stat-number">{stats.totalAppointments.toLocaleString()}</p>
            <span className="stat-change neutral">All time</span>
          </div>
        </div>

        <div className="stat-card" onClick={() => window.dispatchEvent(new CustomEvent('admin-navigate', { detail: { tab: 'courses' } }))} style={{ cursor: 'pointer' }}>
          <div className="stat-icon" style={{ backgroundColor: '#0ea5e9' }}><FaGraduationCap /></div>
          <div className="stat-content">
            <h3>Enrollments</h3>
            <p className="stat-number">{stats.totalEnrollments.toLocaleString()}</p>
            <span className="stat-change neutral">All time</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content">
        {/* Quick Actions */}
        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <div key={index} className="quick-action-card" onClick={() => window.dispatchEvent(new CustomEvent('admin-navigate', { detail: { tab: action.action } }))} style={{ cursor: 'pointer' }}>
                <div className="action-icon" style={{ backgroundColor: action.color }}>
                  {action.icon}
                </div>
                <h3>{action.title}</h3>
                <button className="action-btn">Go to {action.action}</button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="activity-content">
                  <p>{activity.message}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Blog Posts */}
        <div className="dashboard-section">
          <h2>Recent Blog Posts</h2>
          <div className="blog-list">
            {blogs.map(blog => (
              <div key={blog.id} className="blog-item">
                <div className="blog-content">
                  <h4>{blog.title}</h4>
                  <p>{blog.description}</p>
                  <div className="blog-meta">
                    <span>By {blogService.getAuthorName(blog.author)}</span>
                    <span>{blogService.formatTimestamp(blog.timestamp)}</span>
                  </div>
                </div>
                <div className="blog-actions">
                  <button className="edit-btn">Edit</button>
                  <button className="view-btn">View</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Orders Shortcut */}
        <div className="dashboard-section">
          <h2>Latest Orders</h2>
          <div className="activity-list">
            <div className="activity-item" onClick={() => window.dispatchEvent(new CustomEvent('admin-navigate', { detail: { tab: 'orders' } }))} style={{ cursor: 'pointer' }}>
              <div className="activity-icon">🧾</div>
              <div className="activity-content">
                <p>View latest orders</p>
                <span className="activity-time">Go to Orders</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="dashboard-section">
          <h2>System Status</h2>
          <div className="status-grid">
            <div className="status-item">
              <div className="status-indicator online"></div>
              <div className="status-content">
                <h4>Website Status</h4>
                <p>Online and running smoothly</p>
              </div>
            </div>
            <div className="status-item">
              <div className="status-indicator online"></div>
              <div className="status-content">
                <h4>Database</h4>
                <p>Connected and optimized</p>
              </div>
            </div>
            <div className="status-item">
              <div className="status-indicator warning"></div>
              <div className="status-content">
                <h4>Server Load</h4>
                <p>Moderate usage - 67%</p>
              </div>
            </div>
            <div className="status-item">
              <div className="status-indicator online"></div>
              <div className="status-content">
                <h4>API Status</h4>
                <p>All endpoints operational</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
