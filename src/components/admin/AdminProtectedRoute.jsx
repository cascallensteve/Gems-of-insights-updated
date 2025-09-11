import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from './AdminLayout';

const AdminProtectedRoute = () => {
  const { currentUser, isLoading } = useAuth();

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


  // While auth is loading, avoid redirect loops
  if (isLoading) {
    return (
      <div className="grid min-h-[60vh] place-items-center p-6">
        <div className="text-center text-sm text-gray-700">Checking admin session…</div>
      </div>
    );
  }

  // If user is authenticated and is an admin, allow access
  if (isAuthenticated && isAdmin) {
    return <AdminLayout />;
  }

  // Authenticated but NOT an admin → send to client home
  if (isAuthenticated && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Not authenticated → go to admin login
  return <Navigate to="/admin/login" replace />;
};

export default AdminProtectedRoute;
