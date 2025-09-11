import React, { useState, useEffect } from 'react';
import LoadingDots from '../LoadingDots';
import apiService from "../../services/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [error, setError] = useState(null);
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'user',
    status: 'active'
  });

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token required. Please log in as admin.');
      }
      
      const response = await apiService.users.getAllUsers();
      
      if (response && Array.isArray(response)) {
        const formattedUsers = response.map(user => ({
          id: user.id,
          firstName: user.first_name || 'Unknown',
          lastName: user.last_name || '',
          email: user.email,
          phone: user.phone || user.phone_number || 'N/A',
          role: user.userType || 'client',
          status: user.is_email_verified ? 'active' : 'pending',
          joinDate: user.created_at || user.createdAt || new Date().toISOString(),
          lastLogin: user.last_login || user.lastLogin || null,
          orders: user.orders_count || 0,
          spent: user.total_spent || 0,
          isEmailVerified: user.is_email_verified || false,
          _originalData: user
        }));
        setUsers(formattedUsers);
        localStorage.setItem('adminUsers', JSON.stringify(response));
      } else if (response && response.users && Array.isArray(response.users)) {
        const formattedUsers = response.users.map(user => ({
          id: user.id,
          firstName: user.first_name || 'Unknown',
          lastName: user.last_name || '',
          email: user.email,
          phone: user.phone || user.phone_number || 'N/A',
          role: user.userType || 'client',
          status: user.is_email_verified ? 'active' : 'pending',
          joinDate: user.created_at || user.createdAt || new Date().toISOString(),
          lastLogin: user.last_login || user.lastLogin || null,
          orders: user.orders_count || 0,
          spent: user.total_spent || 0,
          isEmailVerified: user.is_email_verified || false,
          _originalData: user
        }));
        setUsers(formattedUsers);
        localStorage.setItem('adminUsers', JSON.stringify(response.users));
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      let errorMessage = 'Unknown error occurred while fetching users.';
      
      if (error && typeof error === 'object') {
        if (error.message) {
          errorMessage = error.message;
        } else if (error.response && error.response.data) {
          errorMessage = error.response.data.message || error.response.data.error || 'API error occurred';
        } else if (error.response && error.response.status) {
          if (error.response.status === 403) {
            errorMessage = 'Access denied. Admin privileges required.';
          } else if (error.response.status === 401) {
            errorMessage = 'Authentication required. Please log in as admin.';
          } else if (error.response.status === 404) {
            errorMessage = 'Users endpoint not found.';
          } else {
            errorMessage = `Server error (${error.response.status}). Please try again later.`;
          }
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.joinDate) - new Date(a.joinDate);
      case 'oldest':
        return new Date(a.joinDate) - new Date(b.joinDate);
      case 'name':
        return a.firstName.localeCompare(b.firstName);
      case 'orders':
        return b.orders - a.orders;
      case 'spent':
        return b.spent - a.spent;
      default:
        return 0;
    }
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  const handleUserAction = (action, userId) => {
    switch (action) {
      case 'view':
        const viewUser = users.find(u => u.id === userId);
        setSelectedUserDetails(viewUser);
        setShowUserDetails(true);
        break;
      case 'edit':
        const user = users.find(u => u.id === userId);
        setEditingUser(user);
        setUserForm({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status
        });
        setShowUserModal(true);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this user?')) {
          setUsers(users.filter(u => u.id !== userId));
        }
        break;
      case 'toggle-status':
        setUsers(users.map(u => 
          u.id === userId 
            ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
            : u
        ));
        break;
      default:
        break;
    }
  };

  const handleBulkAction = (action) => {
    if (selectedUsers.length === 0) {
      alert('Please select users first');
      return;
    }

    switch (action) {
      case 'delete':
        if (window.confirm(`Delete ${selectedUsers.length} selected users?`)) {
          setUsers(users.filter(u => !selectedUsers.includes(u.id)));
          setSelectedUsers([]);
        }
        break;
      case 'activate':
        setUsers(users.map(u => 
          selectedUsers.includes(u.id) ? { ...u, status: 'active' } : u
        ));
        setSelectedUsers([]);
        break;
      case 'deactivate':
        setUsers(users.map(u => 
          selectedUsers.includes(u.id) ? { ...u, status: 'inactive' } : u
        ));
        setSelectedUsers([]);
        break;
      default:
        break;
    }
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    
    if (editingUser) {
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? { ...u, ...userForm }
          : u
      ));
    } else {
      const newUser = {
        id: Date.now(),
        ...userForm,
        joinDate: new Date().toISOString().split('T')[0],
        lastLogin: null,
        orders: 0,
        spent: 0
      };
      setUsers([newUser, ...users]);
    }

    resetForm();
  };

  const resetForm = () => {
    setUserForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'user',
      status: 'active'
    });
    setEditingUser(null);
    setShowUserModal(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return `KSh ${amount.toLocaleString()}`;
  };

  const getUserStats = () => {
    return {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      inactive: users.filter(u => u.status === 'inactive').length,
      pending: users.filter(u => u.status === 'pending').length,
      admins: users.filter(u => u.role === 'admin').length
    };
  };

  const stats = getUserStats();

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <img 
            src="/images/Gems_of_insight_logo_ghxcbv (1).png" 
            alt="Gems of Insight Logo" 
            className="h-10 w-10 object-contain"
          />
          <div>
            <h1 className="text-lg font-semibold text-gray-900">User Management</h1>
            <p className="text-sm text-gray-700">Manage and monitor all registered users ({users.length} total)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
            onClick={fetchUsers}
            disabled={loading}
          >
            <span className="material-icons">refresh</span>
            Refresh
          </button>
          <button 
            className="inline-flex items-center justify-center rounded-md bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-600"
            onClick={() => setShowUserModal(true)}
          >
            <span className="material-icons">person_add</span>
            Add User
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchUsers}>Try Again</button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
          <div className="text-xs text-gray-600">Total Users</div>
          <div className="text-lg font-semibold text-gray-900">{stats.total}</div>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
          <div className="text-xs text-gray-600">Active Users</div>
          <div className="text-lg font-semibold text-emerald-700">{stats.active}</div>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
          <div className="text-xs text-gray-600">Inactive Users</div>
          <div className="text-lg font-semibold text-gray-900">{stats.inactive}</div>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
          <div className="text-xs text-gray-600">Pending Users</div>
          <div className="text-lg font-semibold text-amber-700">{stats.pending}</div>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
          <div className="text-xs text-gray-600">Administrators</div>
          <div className="text-lg font-semibold text-gray-900">{stats.admins}</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex-1 min-w-[220px]">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="user">User</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name A-Z</option>
            <option value="orders">Most Orders</option>
            <option value="spent">Highest Spent</option>
          </select>
        </div>

        {selectedUsers.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">{selectedUsers.length} selected</span>
            <button className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50" onClick={() => handleBulkAction('activate')}>Activate</button>
            <button className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50" onClick={() => handleBulkAction('deactivate')}>Deactivate</button>
            <button className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700" onClick={() => handleBulkAction('delete')}>Delete</button>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="mt-4 overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm">
        {loading ? (
          <div className="p-6">
            <LoadingDots text="Loading users..." size="medium" />
          </div>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="bg-emerald-50 text-gray-900">
              <tr>
                <th style={{width: '40px'}}>
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(currentUsers.map(u => u.id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                  />
                </th>
                <th className="px-3 py-2">User</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Phone</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Email Verified</th>
                <th className="px-3 py-2">Join Date</th>
                <th className="px-3 py-2">Last Login</th>
                <th className="px-3 py-2">Orders</th>
                <th className="px-3 py-2">Total Spent</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user.id]);
                        } else {
                          setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                        }
                      }}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-3">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-emerald-600/10 text-sm font-semibold text-emerald-700">
                        {user.firstName[0]}{user.lastName?.[0]}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                        <div className="text-xs text-gray-600">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="email-info">
                      <div>{user.email}</div>
                      {user._originalData && (
                        <div className="user-details">
                          <small>Created: {formatDate(user._originalData.created_at)}</small>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="phone-info">
                      {user.phone}
                      {user._originalData?.phone_number && user._originalData.phone_number !== user.phone && (
                        <small>Alt: {user._originalData.phone_number}</small>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ring-1 ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 ring-purple-100' : 'bg-gray-100 text-gray-700 ring-gray-200'}`}>
                      {user.role || user._originalData?.userType || 'user'}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ring-1 ${user.status === 'active' ? 'bg-emerald-50 text-emerald-700 ring-emerald-100' : user.status === 'pending' ? 'bg-amber-50 text-amber-700 ring-amber-100' : 'bg-gray-100 text-gray-700 ring-gray-200'}`}>{user.status}</span>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ring-1 ${user.isEmailVerified ? 'bg-emerald-50 text-emerald-700 ring-emerald-100' : 'bg-gray-100 text-gray-700 ring-gray-200'}`}>
                      {user.isEmailVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td className="px-3 py-2">{formatDate(user.joinDate)}</td>
                  <td className="px-3 py-2">{formatDate(user.lastLogin)}</td>
                  <td className="px-3 py-2">{user.orders}</td>
                  <td className="px-3 py-2">{formatCurrency(user.spent)}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      <button 
                        className="inline-flex items-center rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50"
                        onClick={() => handleUserAction('view', user.id)}
                        title="View Details"
                      >
                        <span className="material-icons">visibility</span>
                      </button>
                      <button 
                        className="inline-flex items-center rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50"
                        onClick={() => handleUserAction('edit', user.id)}
                        title="Edit User"
                      >
                        <span className="material-icons">edit</span>
                      </button>
                      <button 
                        className="inline-flex items-center rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50"
                        onClick={() => handleUserAction('toggle-status', user.id)}
                        title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        <span className="material-icons">
                          {user.status === 'active' ? 'toggle_on' : 'toggle_off'}
                        </span>
                      </button>
                      <button 
                        className="inline-flex items-center rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
                        onClick={() => handleUserAction('delete', user.id)}
                        title="Delete User"
                      >
                        <span className="material-icons">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            <span className="material-icons">chevron_left</span>
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`rounded-md border px-3 py-1.5 text-sm ${currentPage === page ? 'border-emerald-600 text-emerald-700' : 'border-gray-300 hover:bg-gray-50'}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            <span className="material-icons">chevron_right</span>
          </button>
        </div>
      )}

      {/* User Modal */}
      {showUserModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="user-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>

            <form onSubmit={handleUserSubmit} className="user-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    value={userForm.firstName}
                    onChange={(e) => setUserForm({...userForm, firstName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    value={userForm.lastName}
                    onChange={(e) => setUserForm({...userForm, lastName: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={userForm.phone}
                  onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                  placeholder="+254712345678"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Role *</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                    required
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    value={userForm.status}
                    onChange={(e) => setUserForm({...userForm, status: e.target.value})}
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetails && selectedUserDetails && (
        <div className="modal-overlay" onClick={() => setShowUserDetails(false)}>
          <div className="user-modal user-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>User Details & Credentials</h3>
              <button className="close-btn" onClick={() => setShowUserDetails(false)}>×</button>
            </div>

            <div className="user-details-content">
              <div className="user-details-grid">
                <div className="detail-section">
                  <h4>Personal Information</h4>
                  <div className="detail-item">
                    <label>Full Name:</label>
                    <span>{selectedUserDetails.firstName} {selectedUserDetails.lastName}</span>
                  </div>
                  <div className="detail-item">
                    <label>User ID:</label>
                    <span className="mono">{selectedUserDetails.id}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedUserDetails.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Phone:</label>
                    <span>{selectedUserDetails.phone}</span>
                  </div>
                  <div className="detail-item">
                    <label>Role:</label>
                    <span className={`role-badge ${selectedUserDetails.role}`}>
                      {selectedUserDetails.role}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    <span className={`status-badge ${selectedUserDetails.status}`}>
                      {selectedUserDetails.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Email Verified:</label>
                    <span className={`verification-badge ${selectedUserDetails.isEmailVerified ? 'verified' : 'unverified'}`}>
                      {selectedUserDetails.isEmailVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Account Activity</h4>
                  <div className="detail-item">
                    <label>Join Date:</label>
                    <span>{formatDate(selectedUserDetails.joinDate)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Last Login:</label>
                    <span>{formatDate(selectedUserDetails.lastLogin)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Total Orders:</label>
                    <span>{selectedUserDetails.orders}</span>
                  </div>
                  <div className="detail-item">
                    <label>Total Spent:</label>
                    <span>{formatCurrency(selectedUserDetails.spent)}</span>
                  </div>
                </div>

                {selectedUserDetails._originalData && (
                  <div className="detail-section">
                    <h4>Raw API Data</h4>
                    <div className="api-data-container">
                      <pre className="api-data">
                        {JSON.stringify(selectedUserDetails._originalData, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              <div className="detail-actions">
                <button 
                  className="action-btn edit"
                  onClick={() => {
                    setShowUserDetails(false);
                    handleUserAction('edit', selectedUserDetails.id);
                  }}
                >
                  <span className="material-icons">edit</span>
                  Edit User
                </button>
                <button 
                  className="refresh-btn"
                  onClick={() => {
                    fetchUsers();
                    setShowUserDetails(false);
                  }}
                >
                  <span className="material-icons">refresh</span>
                  Refresh Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;