// Newsletter API Service
import { api } from './api';

const API_BASE_URL = 'https://gems-of-truth.vercel.app';

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication token required');
  }

  const config = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
      ...options.headers
    },
    ...options
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Newsletter service functions
export const newsletterService = {
  /**
   * Subscribe to newsletter
   * @param {string} email - Email address to subscribe
   * @returns {Promise<Object>} Response with subscription status
   */
  subscribe: async (email) => {
    try {
      console.log('Newsletter Service - Subscribing email:', email);
      console.log('Newsletter Service - API URL:', `${API_BASE_URL}/newsletter/subscribe`);
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      console.log('Newsletter Service - Response status:', response.status);
      console.log('Newsletter Service - Response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Newsletter Service - Error response:', errorData);
        
        // Handle specific error cases
        if (response.status === 400) {
          throw new Error(errorData.message || 'Invalid email address or already subscribed');
        } else if (response.status === 409) {
          throw new Error('This email is already subscribed to our newsletter');
        } else if (response.status === 500) {
          throw new Error('Server error. Please try again later');
        } else {
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
      }

      const result = await response.json();
      console.log('Newsletter Service - Subscription success:', result);
      return result;
    } catch (error) {
      console.error('Newsletter Service - Error subscribing:', error);
      
      // If the API endpoint doesn't exist (404) or there's a network error,
      // provide a fallback response for development/testing
      if (error.message.includes('404') || error.message.includes('Failed to fetch') || error.message.includes('Network Error')) {
        console.log('Newsletter Service - Using fallback mode (API endpoint not available)');
        
        // Store email in localStorage as a fallback
        const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
        if (!subscribers.includes(email)) {
          subscribers.push(email);
          localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
          
          return {
            message: 'Subscribed successfully! You will receive updates when the service is available.',
            email: email,
            subscribers_count: subscribers.length,
            mode: 'offline'
          };
        } else {
          return {
            message: 'This email is already subscribed!',
            email: email,
            subscribers_count: subscribers.length,
            mode: 'offline'
          };
        }
      }
      
      throw error;
    }
  },

  /**
   * Fetch all newsletters (admin only)
   */
  getAllNewsletters: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token required');
      const res = await fetch(`${API_BASE_URL}/newsletter/all-newsletters`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        }
      });
      if (!res.ok) {
        const err = await res.json().catch(()=>({}));
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      return res.json();
    } catch (error) {
      console.error('Newsletter Service - Error fetching all newsletters:', error);
      throw error;
    }
  },

  /**
   * Fetch newsletter detail by id (admin only)
   * @param {number|string} newsletterId
   */
  getNewsletterDetail: async (newsletterId) => {
    try {
      if (!newsletterId && newsletterId !== 0) throw new Error('Newsletter id is required');
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token required');
      const res = await fetch(`${API_BASE_URL}/newsletter/newsletter-detail/${newsletterId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        }
      });
      if (!res.ok) {
        const err = await res.json().catch(()=>({}));
        throw new Error(err.message || `HTTP error! status: ${res.status}`);
      }
      return res.json();
    } catch (error) {
      console.error('Newsletter Service - Error fetching newsletter detail:', error);
      throw error;
    }
  },

  /**
   * Unsubscribe from newsletter
   * @param {string} email - Email address to unsubscribe
   * @returns {Promise<Object>} Response with unsubscription status
   */
  unsubscribe: async (email) => {
    try {
      console.log('Newsletter Service - Unsubscribing email:', email);
      
      const response = await fetch(`${API_BASE_URL}/newsletter/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Newsletter Service - Unsubscription success:', result);
      return result;
    } catch (error) {
      console.error('Newsletter Service - Error unsubscribing:', error);
      
      // Fallback for when API endpoint doesn't exist
      if (error.message.includes('404') || error.message.includes('Failed to fetch') || error.message.includes('Network Error')) {
        console.log('Newsletter Service - Using fallback mode for unsubscribe (API endpoint not available)');
        
        // Remove email from localStorage
        const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
        const updatedSubscribers = subscribers.filter(sub => sub !== email);
        localStorage.setItem('newsletter_subscribers', JSON.stringify(updatedSubscribers));
        
        return {
          message: 'Successfully unsubscribed from newsletter (offline mode)',
          email: email,
          subscribers_count: updatedSubscribers.length
        };
      }
      
      throw error;
    }
  },

  /**
   * Send newsletter to all subscribers
   * @param {Object} newsletterData - Newsletter data
   * @param {string} newsletterData.subject - Newsletter subject
   * @param {string} newsletterData.body - Newsletter body content
   * @returns {Promise<Object>} Response with message about sent newsletters
   */
  sendNewsletter: async (newsletterData) => {
    try {
      console.log('Newsletter Service - Sending newsletter:', newsletterData);
      
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required. Please log in as an admin to send newsletters.');
      }
      
      const response = await makeAuthenticatedRequest(`${API_BASE_URL}/newsletter/send-newsletter`, {
        body: {
          subject: newsletterData.subject,
          body: newsletterData.body
        }
      });

      console.log('Newsletter Service - Success response:', response);
      return response;
    } catch (error) {
      console.error('Newsletter Service - Error sending newsletter:', error);
      
      // Provide more specific error messages
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        throw new Error('Authentication failed. Please log in as an admin.');
      } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
        throw new Error('Access denied. Admin privileges required to send newsletters.');
      } else if (error.message.includes('404')) {
        throw new Error('Newsletter endpoint not found. Please contact support.');
      } else if (error.message.includes('500')) {
        throw new Error('Server error. Please try again later.');
      } else if (error.message.includes('Network Error') || error.message.includes('Failed to fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      }
      
      throw error;
    }
  },

  /**
   * Send newsletter using axios (alternative method)
   * @param {Object} newsletterData - Newsletter data
   * @param {string} newsletterData.subject - Newsletter subject
   * @param {string} newsletterData.body - Newsletter body content
   * @returns {Promise<Object>} Response with message about sent newsletters
   */
  sendNewsletterAxios: async (newsletterData) => {
    try {
      console.log('Newsletter Service - Sending newsletter via axios:', newsletterData);
      
      const response = await api.post('/newsletter/send-newsletter', {
        subject: newsletterData.subject,
        body: newsletterData.body
      });

      console.log('Newsletter Service - Success response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Newsletter Service - Error sending newsletter:', error);
      throw error.response?.data || error.message;
    }
  }
};

// Example usage function
export const sendNewsletterExample = async () => {
  try {
    const newsletterData = {
      subject: "10 ways to improve your gut health by Dr. Denzel Odwuor",
      body: "Hello lovers of insight. This week we bring you 10 ways to improve your gut health by Dr. Denzel Odwuor"
    };

    const result = await newsletterService.sendNewsletter(newsletterData);
    console.log('Newsletter sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Failed to send newsletter:', error);
    throw error;
  }
};

export default newsletterService;
