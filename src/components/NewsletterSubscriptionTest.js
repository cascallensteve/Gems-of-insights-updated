import React, { useState } from 'react';
import { newsletterService } from '../services/newsletterService';

const NewsletterSubscriptionTest = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const testSubscription = async () => {
    if (!email) {
      setError('Please enter an email address');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      console.log('=== Testing Newsletter Subscription ===');
      console.log('Email:', email);
      console.log('API URL: https://gems-of-truth.vercel.app/newsletter/subscribe');
      
      const response = await newsletterService.subscribe(email);
      
      console.log('Success:', response);
      setResult(response);
      
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkLocalSubscribers = () => {
    const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
    setResult({
      message: `Found ${subscribers.length} local subscribers`,
      subscribers: subscribers,
      mode: 'local'
    });
  };

  const clearLocalSubscribers = () => {
    localStorage.removeItem('newsletter_subscribers');
    setResult({ message: 'Local subscribers cleared', mode: 'local' });
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '600px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2>Newsletter Subscription Test</h2>
      <p>Use this component to test and debug newsletter subscription issues.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: '10px',
            marginRight: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            width: '200px'
          }}
        />
        
        <button 
          onClick={testSubscription}
          disabled={loading}
          style={{ 
            padding: '10px 20px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {loading ? 'Testing...' : 'Test Subscription'}
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={checkLocalSubscribers}
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Check Local Subscribers
        </button>
        
        <button 
          onClick={clearLocalSubscribers}
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear Local Subscribers
        </button>
      </div>

      {result && (
        <div style={{
          padding: '15px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          <h4>✅ Result:</h4>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {error && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          <h4>❌ Error:</h4>
          <p>{error}</p>
        </div>
      )}

      <div style={{ 
        marginTop: '20px', 
        padding: '15px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '4px'
      }}>
        <h4>Debug Information:</h4>
        <ul style={{ fontSize: '14px' }}>
          <li><strong>API Endpoint:</strong> https://gems-of-truth.vercel.app/newsletter/subscribe</li>
          <li><strong>Method:</strong> POST</li>
          <li><strong>Content-Type:</strong> application/json</li>
          <li><strong>Body:</strong> {"{ \"email\": \"your-email@example.com\" }"}</li>
          <li><strong>Fallback:</strong> If API fails, emails are stored locally</li>
        </ul>
      </div>

      <div style={{ 
        marginTop: '15px', 
        padding: '15px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '4px'
      }}>
        <h4>Instructions:</h4>
        <ol style={{ fontSize: '14px' }}>
          <li>Enter a valid email address</li>
          <li>Click "Test Subscription" to test the API</li>
          <li>Check browser console for detailed logs</li>
          <li>If API fails, check local subscribers</li>
          <li>Use "Clear Local Subscribers" to reset</li>
        </ol>
      </div>
    </div>
  );
};

export default NewsletterSubscriptionTest;

