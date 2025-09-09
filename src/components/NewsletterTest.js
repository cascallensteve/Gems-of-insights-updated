import React, { useState } from 'react';
import { newsletterService } from '../services/newsletterService';

const NewsletterTest = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testNewsletterEndpoint = async () => {
    setLoading(true);
    setTestResult('');

    try {
      const testData = {
        subject: "Test Newsletter - " + new Date().toLocaleString(),
        body: "This is a test newsletter to verify the endpoint is working correctly."
      };

      console.log('Testing newsletter endpoint with data:', testData);
      const result = await newsletterService.sendNewsletter(testData);
      
      setTestResult(`✅ SUCCESS: ${result.message || 'Newsletter sent successfully!'}`);
      console.log('Newsletter test successful:', result);
    } catch (error) {
      setTestResult(`❌ ERROR: ${error.message}`);
      console.error('Newsletter test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (token) {
      setTestResult(`🔐 AUTHENTICATED: Token found (${token.substring(0, 10)}...)`);
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setTestResult(prev => prev + `\n👤 User: ${user.email || 'Unknown'}`);
        } catch (e) {
          setTestResult(prev => prev + `\n👤 User data: Invalid JSON`);
        }
      }
    } else {
      setTestResult('❌ NOT AUTHENTICATED: No token found. Please log in as admin.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Newsletter Endpoint Test</h2>
      <p>Use this component to test the newsletter sending functionality.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={checkAuthStatus}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Check Auth Status
        </button>
        
        <button 
          onClick={testNewsletterEndpoint}
          disabled={loading}
          style={{ 
            padding: '10px 20px',
            backgroundColor: loading ? '#bdc3c7' : '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Testing...' : 'Test Newsletter Send'}
        </button>
      </div>

      {testResult && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '5px',
          whiteSpace: 'pre-line',
          fontFamily: 'monospace',
          fontSize: '14px'
        }}>
          {testResult}
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <h3>Instructions:</h3>
        <ol>
          <li>First, check your authentication status</li>
          <li>If not authenticated, log in as an admin user</li>
          <li>Then test the newsletter sending functionality</li>
          <li>Check the browser console for detailed logs</li>
        </ol>
      </div>
    </div>
  );
};

export default NewsletterTest;