// Cart API service for backend integration
const API_BASE_URL = 'https://gems-of-truth.vercel.app/store';

// Get auth token from localStorage
const getAuthToken = () => {
  return (
    localStorage.getItem('authToken') ||
    localStorage.getItem('token') ||
    localStorage.getItem('access_token')
  );
};

// Generic API call with Authorization header
const makeAPICall = async (url, options = {}) => {
  try {
    const token = getAuthToken();
    console.log(
      'Cart API - Using token:',
      token ? `Found (${token.length} chars)` : 'Not found'
    );

    if (!token) {
      throw new Error('Authentication required. Token not found.');
    }

    const fetchConfig = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // ✅ fixed
        ...options.headers,
      },
      ...(options.body && { body: options.body }),
    };

    console.log('Cart API - Making request to:', url);
    console.log('Cart API - Config:', fetchConfig);

    const response = await fetch(url, fetchConfig);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Cart API - Response error:', errorData);
      throw new Error(errorData || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Cart API - Success response:', result);
    return result;
  } catch (error) {
    console.error('Cart API Error:', error);
    throw error;
  }
};

// Cart API functions
export const cartAPI = {
  // Add item to cart
  addToCart: async (itemId) => {
    try {
      return await makeAPICall(`${API_BASE_URL}/add-to-cart/${itemId}/`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  // View cart items
  viewCart: async () => {
    try {
      return await makeAPICall(`${API_BASE_URL}/view-cart/`);
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    try {
      return await makeAPICall(`${API_BASE_URL}/remove-from-cart/${itemId}/`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  // Rate item
  rateItem: async (itemId, rating) => {
    try {
      return await makeAPICall(`${API_BASE_URL}/rate-item/${itemId}/`, {
        method: 'POST',
        body: JSON.stringify({ rating }),
      });
    } catch (error) {
      console.error('Error rating item:', error);
      throw error;
    }
  },
};
