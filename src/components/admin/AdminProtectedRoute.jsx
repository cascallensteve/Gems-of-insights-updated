import React from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from './AdminLayout';

const AdminProtectedRoute = () => {
  const { currentUser } = useAuth();

  // Check if user is logged in and is an admin
  const isAuthenticated = !!currentUser;
  const isAdmin = currentUser && (
    currentUser.userType === 'admin' || 
    currentUser.role === 'admin' || 
    currentUser.user_type === 'admin' ||
    currentUser.isAdmin === true ||
    // Also check if email contains admin patterns (fallback)
    (currentUser.email && currentUser.email.includes('technova446@gmail.com'))
  );

  // Debug logging to see what's happening
  console.log('🔍 Admin Access Debug:', {
    isAuthenticated,
    isAdmin,
    currentUser: currentUser ? {
      id: currentUser.id,
      email: currentUser.email,
      firstName: currentUser.firstName,
      role: currentUser.role,
      userType: currentUser.userType,
      user_type: currentUser.user_type,
      isAdmin: currentUser.isAdmin
    } : 'NO USER'
  });


  // If user is authenticated, allow access (we'll determine admin status in the layout)
  if (isAuthenticated) {
    return <AdminLayout />;
  }

  // Only redirect to login if no user is authenticated at all
  window.location.href = '/admin/login';
  return null;
};

export default AdminProtectedRoute;
