import React, { useState } from 'react';
import { newsletterService } from '../services/newsletterService';
import './NewsletterDebug.css';

const NewsletterDebug = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('');

  const testSubscription = async () => {
    if (!email) {
      setError('Please enter an email address');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setDebugInfo('');

    try {
      console.log('=== Newsletter Debug Test ===');
      console.log('Testing email:', email);
      console.log('API Base URL:', 'https://gems-of-truth.vercel.app');
      console.log('Full endpoint:', 'https://gems-of-truth.vercel.app/newsletter/subscribe');
      
      setDebugInfo('Attempting to subscribe...');
      
      const response = await newsletterService.subscribe(email);
      
      console.log('Success response:', response);
      setResult(response);
      setDebugInfo('Subscription successful!');
      
    } catch (err) {
      console.error('Error details:', err);
      setError(err.message);
      setDebugInfo(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testDirectAPI = async () => {
    if (!email) {
      setError('Please enter an email address');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setDebugInfo('');

    try {
      console.log('=== Direct API Test ===');
      const url = 'https://gems-of-truth.vercel.app/newsletter/subscribe';
      console.log('Testing direct API call to:', url);
      
      setDebugInfo('Making direct API call...');
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Success data:', data);
      setResult(data);
      setDebugInfo(`Direct API call successful! Status: ${response.status}`);
      
    } catch (err) {
      console.error('Direct API error:', err);
      setError(err.message);
      setDebugInfo(`Direct API Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const checkLocalStorage = () => {
    const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
    setResult({
      message: 'Local storage subscribers',
      subscribers: subscribers,
      count: subscribers.length
    });
    setDebugInfo(`Found ${subscribers.length} subscribers in localStorage`);
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('newsletter_subscribers');
    setResult(null);
    setDebugInfo('Local storage cleared');
  };

  return (
    <div className="newsletter-debug">
      <div className="newsletter-debug-container">
        <h2>Newsletter Subscription Debug Tool</h2>
        <p>Use this tool to debug newsletter subscription issues</p>

        <div className="debug-form">
          <div className="form-group">
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="debug-actions">
            <button onClick={testSubscription} disabled={loading}>
              {loading ? 'Testing...' : 'Test Subscription Service'}
            </button>
            
            <button onClick={testDirectAPI} disabled={loading}>
              {loading ? 'Testing...' : 'Test Direct API'}
            </button>
            
            <button onClick={checkLocalStorage} disabled={loading}>
              Check Local Storage
            </button>
            
            <button onClick={clearLocalStorage} disabled={loading}>
              Clear Local Storage
            </button>
          </div>
        </div>

        {debugInfo && (
          <div className="debug-info">
            <h3>Debug Info:</h3>
            <p>{debugInfo}</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <h3>Error:</h3>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="result-message">
            <h3>Result:</h3>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}

                 <div className="api-info">
           <h3>API Information:</h3>
           <ul>
             <li><strong>Base URL:</strong> https://gems-of-truth.vercel.app</li>
             <li><strong>Subscribe Endpoint:</strong> POST /newsletter/subscribe</li>
             <li><strong>Full URL:</strong> https://gems-of-truth.vercel.app/newsletter/subscribe</li>
             <li><strong>Request Body:</strong> {`{"email": "technova446@example.com"}`}</li>
             <li><strong>Expected Response:</strong> {`{"message": "Subscribed successfully!"}`}</li>
           </ul>
         </div>
      </div>
    </div>
  );
};

export default NewsletterDebug;
