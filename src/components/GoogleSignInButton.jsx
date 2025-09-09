import React, { useEffect, useRef } from 'react';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';

const GoogleSignInButton = ({ onSuccess, onError, text = 'continue_with', size = 'large' }) => {
  const buttonRef = useRef(null);
  const { login } = useAuth();

  useEffect(() => {
    const init = () => {
      if (!window.google || !window.google.accounts || !window.google.accounts.id) {
        return;
      }

      // IMPORTANT: replace with your real Google OAuth Client ID
      const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || window.GOOGLE_CLIENT_ID;
      if (!clientId) {
        console.warn('Google Client ID is not set. Define REACT_APP_GOOGLE_CLIENT_ID.');
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          try {
            const credential = response.credential;
            const data = await apiService.auth.googleLogin(credential);

            const userPayload = {
              ...data,
              firstName: data.firstName || data.first_name || data.name?.split(' ')[0] || 'User',
              lastName: data.lastName || data.last_name || data.name?.split(' ').slice(1).join(' ') || '',
              email: data.email,
              role: data.role || data.user_type || 'user',
              id: data.id || data.user_id
            };

            const token = data.token || data.access || data.access_token;
            login(userPayload, token);
            if (onSuccess) onSuccess(userPayload);
          } catch (err) {
            console.error('Google login error:', err);
            if (onError) onError(err);
          }
        },
        ux_mode: 'popup'
      });

      if (buttonRef.current) {
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size,
          text,
          shape: 'rectangular',
          logo_alignment: 'left'
        });
      }
    };

    // Wait a tick in case the script is still loading
    const timer = setTimeout(init, 0);
    return () => clearTimeout(timer);
  }, [login, onError, onSuccess, size, text]);

  return (
    <div ref={buttonRef} />
  );
};

export default GoogleSignInButton;


