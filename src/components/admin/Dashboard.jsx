import React, { useState, useEffect, useMemo } from 'react';
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
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [blogsData, usersResponse] = await Promise.all([
        blogService.getAllBlogs(),
        (async () => {
          try { return await apiService.users.getAllUsers(); } catch (e) { return e; }
        })()
      ]);
      setBlogs((Array.isArray(blogsData) ? blogsData : []).slice(0, 5));

      // Users
      let totalUsers = 0;
      let newUsersToday = 0;
      if (usersResponse && !usersResponse.isAxiosError && !usersResponse.message) {
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
      } else {
        console.error('Error fetching users in dashboard:', usersResponse);
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

      // Fetch enrollments from localStorage (source used by Courses admin)
      let totalEnrollments = 0;
      let latestEnrollments = [];
      try {
        const stored = localStorage.getItem('courseEnrollments');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            totalEnrollments = parsed.length;
            latestEnrollments = parsed
              .slice()
              .sort((a, b) => new Date(b.created_at || b.enrollmentDate || 0) - new Date(a.created_at || a.enrollmentDate || 0))
              .slice(0, 6);
          } else {
            totalEnrollments = 1;
            latestEnrollments = [parsed];
          }
        }
      } catch {}

      // Fetch orders and payments to compute real totals
      let totalOrders = 0;
      let ordersToday = 0;
      let totalRevenue = 0;
      const [ordersRes, txRes] = await Promise.all([
        (async () => { try { return await apiService.store.getAllOrders(); } catch (e) { return e; } })(),
        (async () => { try { return await apiService.payments.getAllTransactions(); } catch (e) { return e; } })()
      ]);

      if (ordersRes && !ordersRes.isAxiosError && !ordersRes.message) {
        const ordersList = Array.isArray(ordersRes) ? ordersRes : (ordersRes?.orders || ordersRes?.data || []);
        totalOrders = ordersList.length;
        const startOfDay = new Date();
        startOfDay.setHours(0,0,0,0);
        ordersToday = ordersList.filter(o => {
          const d = new Date(o.created_at || o.date || o.created);
          return !isNaN(d) && d >= startOfDay;
        }).length;
      } else {
        console.warn('Orders fetch failed; using 0');
      }

      if (txRes && !txRes.isAxiosError && !txRes.message) {
        const txList = Array.isArray(txRes) ? txRes : (txRes?.transactions || txRes?.data || []);
        totalRevenue = txList.reduce((sum, t) => {
          const status = (t.status || t.result_code || '').toString().toLowerCase();
          const ok = status.includes('success') || status === 'completed' || status === 'paid' || t.success === true || t.ResultCode === '0' || t.responseCode === '0';
          const amount = Number(t.amount ?? t.Amount ?? t.total ?? 0) || 0;
          return ok ? sum + amount : sum;
        }, 0);
      } else {
        console.warn('Transactions fetch failed; using 0 revenue');
      }

      // Set real stats
      setStats({
        totalUsers: totalUsers,
        totalBlogs: blogsData.length,
        totalOrders,
        totalRevenue,
        newUsersToday: newUsersToday,
        ordersToday,
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
      setRecentEnrollments(latestEnrollments);

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

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      if (Number.isNaN(d.getTime())) return '';
      return d.toLocaleDateString();
    } catch {
      return '';
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

  // Do not block render on loading; show content immediately.

  if (error) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-700">Welcome back! Here's what's happening with your store today.</p>
          </div>
          <div>
            <button className="inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50" onClick={fetchDashboardData}>
              🔄 Refresh
            </button>
          </div>
        </div>
        <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          ⚠️ {error}
          <div className="mt-2">
            <button className="inline-flex items-center rounded-md bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-600" onClick={fetchDashboardData}>Try Again</button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-700">Welcome back! Here's what's happening with your store today.</p>
        </div>
        <div>
          <button className="inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50" onClick={fetchDashboardData}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-emerald-600/10 text-emerald-700"><FaUsers /></div>
          <div>
            <div className="text-xs text-gray-600">Total Users</div>
            <div className="text-lg font-semibold text-gray-900">{stats.totalUsers.toLocaleString()}</div>
            <div className="text-xs text-emerald-700">+{stats.newUsersToday} today</div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-blue-600/10 text-blue-700"><FaRegNewspaper /></div>
          <div>
            <div className="text-xs text-gray-600">Blog Posts</div>
            <div className="text-lg font-semibold text-gray-900">{stats.totalBlogs}</div>
            <div className="text-xs text-gray-600">Published</div>
          </div>
        </div>

        <button className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-white p-4 text-left shadow-sm hover:border-emerald-200" onClick={() => window.dispatchEvent(new CustomEvent('admin-navigate', { detail: { tab: 'orders' } }))}>
          <div className="grid h-10 w-10 place-items-center rounded-md bg-amber-500/10 text-amber-600"><FaShoppingCart /></div>
          <div>
            <div className="text-xs text-gray-600">Total Orders</div>
            <div className="text-lg font-semibold text-gray-900">{stats.totalOrders.toLocaleString()}</div>
            <div className="text-xs text-emerald-700">+{stats.ordersToday} today</div>
          </div>
        </button>

        <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-emerald-600/10 text-emerald-700"><FaMoneyBillWave /></div>
          <div>
            <div className="text-xs text-gray-600">Revenue</div>
            <div className="text-lg font-semibold text-gray-900">{formatCurrency(stats.totalRevenue)}</div>
            <div className="text-xs text-emerald-700">+12.5% this month</div>
          </div>
        </div>

        <button className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-white p-4 text-left shadow-sm hover:border-emerald-200" onClick={() => window.dispatchEvent(new CustomEvent('admin-navigate', { detail: { tab: 'appointments' } }))}>
          <div className="grid h-10 w-10 place-items-center rounded-md bg-teal-600/10 text-teal-700"><FaCalendarAlt /></div>
          <div>
            <div className="text-xs text-gray-600">Appointments</div>
            <div className="text-lg font-semibold text-gray-900">{stats.totalAppointments.toLocaleString()}</div>
            <div className="text-xs text-gray-600">All time</div>
          </div>
        </button>

        <button className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-white p-4 text-left shadow-sm hover:border-emerald-200" onClick={() => window.dispatchEvent(new CustomEvent('admin-navigate', { detail: { tab: 'courses' } }))}>
          <div className="grid h-10 w-10 place-items-center rounded-md bg-sky-600/10 text-sky-700"><FaGraduationCap /></div>
          <div>
            <div className="text-xs text-gray-600">Enrollments</div>
            <div className="text-lg font-semibold text-gray-900">{stats.totalEnrollments.toLocaleString()}</div>
            <div className="text-xs text-gray-600">All time</div>
          </div>
        </button>
      </div>

      {/* Main Content */}
      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Quick Actions */}
        <div className="lg:col-span-5">
          <div className="mb-3 text-sm font-semibold text-gray-900">Quick Actions</div>
          <div className="grid gap-3 sm:grid-cols-2">
            {quickActions.map((action, index) => (
              <button key={index} className="flex items-center justify-between rounded-xl border border-emerald-100 bg-white p-4 shadow-sm hover:border-emerald-200" onClick={() => window.dispatchEvent(new CustomEvent('admin-navigate', { detail: { tab: action.action } }))}>
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-md text-white" style={{ backgroundColor: action.color }}>{action.icon}</div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-900">{action.title}</div>
                    <div className="text-xs text-gray-600">Go to {action.action}</div>
                  </div>
                </div>
                <span>→</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-7">
          <div className="mb-3 text-sm font-semibold text-gray-900">Recent Activity</div>
          <div className="space-y-2">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-start gap-3 rounded-md border border-emerald-100 bg-white p-3 shadow-sm">
                <div className="grid h-8 w-8 place-items-center rounded-md bg-emerald-600/10 text-emerald-700">{getActivityIcon(activity.type)}</div>
                <div className="text-sm">
                  <p className="text-gray-900">{activity.message}</p>
                  <span className="text-xs text-gray-600">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Enrollments - simple table */}
        <div className="lg:col-span-12">
          <div className="mt-2 text-sm font-semibold text-gray-900">Recent Enrollments</div>
          <div className="mt-2 overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm">
            {recentEnrollments && recentEnrollments.length > 0 ? (
              <table className="min-w-full text-left text-sm">
                <thead className="bg-emerald-50 text-gray-900">
                  <tr>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Course</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Phone</th>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentEnrollments.map((enr) => (
                    <tr key={enr.enrollment_id || enr.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2">{enr.student || enr.firstName || enr.name || '—'}</td>
                      <td className="px-3 py-2">{enr.course_title || enr.course_name || enr.selectedModule || '—'}</td>
                      <td className="px-3 py-2">{enr.email || '—'}</td>
                      <td className="px-3 py-2">{enr.phone || enr.otherNumber || '—'}</td>
                      <td className="px-3 py-2">{formatDate(enr.created_at || enr.enrollment_date || enr.enrollmentDate)}</td>
                      <td className="px-3 py-2"><span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${String(enr.status || 'active').toLowerCase() === 'active' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100' : 'bg-gray-100 text-gray-700 ring-1 ring-gray-200'}`}>{enr.status || 'Active'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-4 text-sm text-gray-700">No enrollments yet.</div>
            )}
          </div>
        </div>

        {/* Recent Blog Posts */}
        <div className="lg:col-span-12">
          <div className="mt-2 text-sm font-semibold text-gray-900">Recent Blog Posts</div>
          <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map(blog => (
              <div key={blog.id} className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
                <div>
                  <h4 className="line-clamp-2 text-sm font-semibold text-gray-900">{blog.title}</h4>
                  <p className="mt-1 line-clamp-3 text-sm text-gray-700">{blog.description}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-600">
                    <span>By {blogService.getAuthorName(blog.author)}</span>
                    <span>{blogService.formatTimestamp(blog.timestamp)}</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-xs hover:bg-gray-50">Edit</button>
                  <button className="inline-flex items-center rounded-md bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600">View</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Orders Shortcut */}
        <div className="lg:col-span-12">
          <div className="mt-2 text-sm font-semibold text-gray-900">Latest Orders</div>
          <button className="mt-2 flex w-full items-center justify-between rounded-xl border border-emerald-100 bg-white p-4 text-left shadow-sm hover:border-emerald-200" onClick={() => window.dispatchEvent(new CustomEvent('admin-navigate', { detail: { tab: 'orders' } }))}>
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-md bg-emerald-600/10">🧾</div>
              <div className="text-sm text-gray-900">View latest orders</div>
            </div>
            <span className="text-sm text-gray-600">Go to Orders →</span>
          </button>
        </div>

        {/* System Status */}
        <div className="lg:col-span-12">
          <div className="mt-2 text-sm font-semibold text-gray-900">System Status</div>
          <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[{title:'Website Status',desc:'Online and running smoothly'},{title:'Database',desc:'Connected and optimized'},{title:'Server Load',desc:'Moderate usage - 67%'},{title:'API Status',desc:'All endpoints operational'}].map((s,idx)=> (
              <div key={idx} className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
                <div className={`mt-1 h-2.5 w-2.5 rounded-full ${s.title==='Server Load' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{s.title}</h4>
                  <p className="text-sm text-gray-700">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
