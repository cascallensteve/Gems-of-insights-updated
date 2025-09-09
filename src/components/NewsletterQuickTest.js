import React, { useState } from 'react';
import { newsletterService } from '../services/newsletterService';
import './NewsletterQuickTest.css';

const NewsletterQuickTest = () => {
  const [email, setEmail] = useState('technova446@example.com');
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
      console.log('=== Quick Newsletter Test ===');
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

  return (
    <div className="newsletter-quick-test">
      <div className="quick-test-container">
        <h2>Quick Newsletter Test</h2>
        <p>Test the newsletter subscription with the exact API specification</p>

        <div className="test-form">
          <div className="form-group">
            <label>Email Address:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="technova446@example.com"
            />
          </div>

          <button 
            onClick={testSubscription} 
            disabled={loading}
            className="test-button"
          >
            {loading ? 'Testing...' : 'Test Subscription'}
          </button>
        </div>

        {result && (
          <div className="success-result">
            <h3>✅ Success!</h3>
            <p><strong>Message:</strong> {result.message}</p>
            {result.email && <p><strong>Email:</strong> {result.email}</p>}
            {result.subscribers_count && <p><strong>Subscribers:</strong> {result.subscribers_count}</p>}
          </div>
        )}

        {error && (
          <div className="error-result">
            <h3>❌ Error</h3>
            <p>{error}</p>
          </div>
        )}

        <div className="api-spec">
          <h3>API Specification:</h3>
          <div className="spec-item">
            <strong>Endpoint:</strong> POST {{baseURL}}/newsletter/subscribe
          </div>
          <div className="spec-item">
            <strong>Request:</strong> {`{"email": "technova446@example.com"}`}
          </div>
          <div className="spec-item">
            <strong>Response:</strong> {`{"message": "Subscribed successfully!"}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterQuickTest;
