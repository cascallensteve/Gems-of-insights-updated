// Newsletter Test Utility
// This file demonstrates how to use the newsletter endpoint programmatically

import { newsletterService } from '../services/newsletterService';

/**
 * Test function to send a newsletter
 * This function can be called from the browser console or imported into other components
 */
export const testNewsletterEndpoint = async () => {
  console.log('🧪 Testing Newsletter Endpoint...');
  
  try {
    // Test data matching the specification
    const newsletterData = {
      subject: "10 ways to improve your gut health by Dr. Denzel Odwuor",
      body: "Hello lovers of insight. This week we bring you 10 ways to improve your gut health by Dr. Denzel Odwuor"
    };

    console.log('📧 Sending newsletter with data:', newsletterData);
    
    // Send the newsletter
    const result = await newsletterService.sendNewsletter(newsletterData);
    
    console.log('✅ Newsletter sent successfully!');
    console.log('📬 Response:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Failed to send newsletter:', error);
    throw error;
  }
};

/**
 * Test function using axios method
 */
export const testNewsletterAxios = async () => {
  console.log('🧪 Testing Newsletter Endpoint (Axios method)...');
  
  try {
    const newsletterData = {
      subject: "10 ways to improve your gut health by Dr. Denzel Odwuor",
      body: "Hello lovers of insight. This week we bring you 10 ways to improve your gut health by Dr. Denzel Odwuor"
    };

    console.log('📧 Sending newsletter with axios...');
    
    const result = await newsletterService.sendNewsletterAxios(newsletterData);
    
    console.log('✅ Newsletter sent successfully (axios)!');
    console.log('📬 Response:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Failed to send newsletter (axios):', error);
    throw error;
  }
};

/**
 * Test function with custom data
 */
export const testCustomNewsletter = async (subject, body) => {
  console.log('🧪 Testing Custom Newsletter...');
  
  try {
    const newsletterData = {
      subject: subject || "Test Newsletter",
      body: body || "This is a test newsletter message."
    };

    console.log('📧 Sending custom newsletter:', newsletterData);
    
    const result = await newsletterService.sendNewsletter(newsletterData);
    
    console.log('✅ Custom newsletter sent successfully!');
    console.log('📬 Response:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Failed to send custom newsletter:', error);
    throw error;
  }
};

/**
 * Test newsletter subscription
 */
export const testNewsletterSubscription = async (email) => {
  console.log('🧪 Testing Newsletter Subscription...');
  
  try {
    const testEmail = email || 'technova446@example.com';
    console.log('📧 Subscribing email:', testEmail);
    console.log('🌐 API URL: https://gems-of-truth.vercel.app/newsletter/subscribe');
    
    const result = await newsletterService.subscribe(testEmail);
    
    console.log('✅ Newsletter subscription successful!');
    console.log('📬 Response:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Failed to subscribe to newsletter:', error);
    throw error;
  }
};

/**
 * Test newsletter unsubscription
 */
export const testNewsletterUnsubscription = async (email) => {
  console.log('🧪 Testing Newsletter Unsubscription...');
  
  try {
    const testEmail = email || 'test@example.com';
    console.log('📧 Unsubscribing email:', testEmail);
    
    const result = await newsletterService.unsubscribe(testEmail);
    
    console.log('✅ Newsletter unsubscription successful!');
    console.log('📬 Response:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Failed to unsubscribe from newsletter:', error);
    throw error;
  }
};

/**
 * Check if user is authenticated (has token)
 */
export const checkAuthStatus = () => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  
  console.log('🔐 Authentication Status:', {
    hasToken: isAuthenticated,
    token: token ? `${token.substring(0, 10)}...` : 'None'
  });
  
  return isAuthenticated;
};

/**
 * Example of how to use the newsletter endpoint in a React component
 */
export const useNewsletterInComponent = () => {
  const sendNewsletter = async (subject, body) => {
    try {
      // Check authentication first
      if (!checkAuthStatus()) {
        throw new Error('User not authenticated. Please login first.');
      }

      const result = await newsletterService.sendNewsletter({ subject, body });
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return { sendNewsletter };
};

// Make functions available globally for testing in browser console
if (typeof window !== 'undefined') {
  window.testNewsletterEndpoint = testNewsletterEndpoint;
  window.testNewsletterAxios = testNewsletterAxios;
  window.testCustomNewsletter = testCustomNewsletter;
  window.testNewsletterSubscription = testNewsletterSubscription;
  window.testNewsletterUnsubscription = testNewsletterUnsubscription;
  window.checkAuthStatus = checkAuthStatus;
  window.newsletterService = newsletterService;
}

export default {
  testNewsletterEndpoint,
  testNewsletterAxios,
  testCustomNewsletter,
  testNewsletterSubscription,
  testNewsletterUnsubscription,
  checkAuthStatus,
  useNewsletterInComponent
};
