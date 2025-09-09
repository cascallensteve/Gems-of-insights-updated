import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    const loadUser = () => {
      try {
        // First try to get user data from localStorage
        const storedUserData = localStorage.getItem('userData');
        
        if (storedUserData) {
          try {
            const userData = JSON.parse(storedUserData);
            const normalizedUser = normalizeUserData(userData);
            setCurrentUser(normalizedUser);
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError);
            localStorage.removeItem('userData');
          }
        } else {
          // Fallback to apiService
          const userData = apiService.getUserData();
          if (userData) {
            const normalizedUser = normalizeUserData(userData);
            setCurrentUser(normalizedUser);
            // Also store in localStorage for future use
            localStorage.setItem('userData', JSON.stringify(normalizedUser));
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
        // Clear invalid data
        apiService.clearAuth();
        localStorage.removeItem('userData');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Normalize user data to ensure consistent structure
  const normalizeUserData = (userData) => {
    if (!userData) {
      return null;
    }
    
    // Handle nested user structure (userData.user)
    let actualUserData = userData;
    if (userData.user && typeof userData.user === 'object') {
      actualUserData = userData.user;
    }
    
    const normalized = {
      id: actualUserData.id || actualUserData.user_id,
      firstName: actualUserData.firstName || actualUserData.first_name || actualUserData.name?.split(' ')[0] || 'User',
      lastName: actualUserData.lastName || actualUserData.last_name || actualUserData.name?.split(' ').slice(1).join(' ') || '',
      email: actualUserData.email,
      phone: actualUserData.phone || actualUserData.phone_number,
      role: actualUserData.role || actualUserData.userType || actualUserData.user_type || 'user',
      isAdmin: actualUserData.isAdmin || actualUserData.role === 'admin' || actualUserData.userType === 'admin' || actualUserData.user_type === 'admin',
      isEmailVerified: actualUserData.isEmailVerified || actualUserData.is_email_verified || false,
      createdAt: actualUserData.createdAt || actualUserData.created_at || actualUserData.joined_date || new Date().toISOString(),
      newsletter: actualUserData.newsletter || false,
      // Preserve original API fields
      first_name: actualUserData.first_name,
      last_name: actualUserData.last_name,
      userType: actualUserData.userType,
      is_email_verified: actualUserData.is_email_verified,
      // Preserve any additional fields from the API
      ...actualUserData
    };
    
    return normalized;
  };

  const login = (userData, token) => {
    try {
      // Normalize user data before storing
      const normalizedUser = normalizeUserData(userData);
      
      // Store token and user data
      if (token) {
        apiService.setAuthToken(token);
      }
      
      // Store normalized user data
      apiService.setUserData(normalizedUser);
      setCurrentUser(normalizedUser);
      
      // Also store in localStorage for immediate access
      localStorage.setItem('userData', JSON.stringify(normalizedUser));
      if (token) {
        localStorage.setItem('token', token);
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = () => {
    try {
      apiService.clearAuth();
      // Also clear localStorage
      localStorage.removeItem('userData');
      localStorage.removeItem('token');
      setCurrentUser(null);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const updateUser = (updatedUserData) => {
    try {
      const newUserData = { ...currentUser, ...updatedUserData };
      const normalizedUser = normalizeUserData(newUserData);
      
      // Update in both contexts
      apiService.setUserData(normalizedUser);
      localStorage.setItem('userData', JSON.stringify(normalizedUser));
      setCurrentUser(normalizedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const refreshUserData = () => {
    try {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        const normalizedUser = normalizeUserData(userData);
        setCurrentUser(normalizedUser);
        return normalizedUser;
      }
      return null;
    } catch (error) {
      console.error('Error refreshing user data:', error);
      return null;
    }
  };

  const getCurrentUserData = () => {
    return currentUser;
  };

  const refreshUserFromServer = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return null;
      }

      // You can add an API endpoint to get current user data
      // For now, we'll just refresh from localStorage
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        const normalizedUser = normalizeUserData(userData);
        setCurrentUser(normalizedUser);
        return normalizedUser;
      }
      return null;
    } catch (error) {
      console.error('Error refreshing user from server:', error);
      return null;
    }
  };

  const value = {
    currentUser,
    isLoading,
    login,
    logout,
    updateUser,
    refreshUserData,
    refreshUserFromServer,
    getCurrentUserData,
    isAuthenticated: !!currentUser,
  };



  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
