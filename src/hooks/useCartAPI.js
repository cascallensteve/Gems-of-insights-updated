import { useState } from 'react';
import { cartAPI } from '../services/cartAPI';

export const useCartAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simple API methods without circular dependencies
  const addToCart = async (productId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await cartAPI.addToCart(productId);
      setLoading(false);
      return { success: true, data: response };
    } catch (error) {
      setError(error.message);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const removeFromCart = async (productId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await cartAPI.removeFromCart(productId);
      setLoading(false);
      return { success: true, data: response };
    } catch (error) {
      setError(error.message);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const viewCart = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await cartAPI.viewCart();
      setLoading(false);
      return { success: true, data: response };
    } catch (error) {
      setError(error.message);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  return {
    addToCart,
    removeFromCart,
    viewCart,
    loading,
    error,
    setError: (error) => setError(error)
  };
};
