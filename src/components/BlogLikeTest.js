import React, { useState } from 'react';

// Simple test component to test blog like endpoints
// This can be temporarily added to a page to test the API
const BlogLikeTest = () => {
  const [blogId, setBlogId] = useState('1');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const checkAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    setResult(`Token: ${token ? 'Found (' + token.substring(0, 20) + '...)' : 'Not found'}
User Data: ${userData ? 'Found' : 'Not found'}
${userData ? 'User: ' + JSON.stringify(JSON.parse(userData), null, 2) : ''}`);
  };

  const testLikeEndpoint = async () => {
    setLoading(true);
    setResult('Testing...');
    
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    
    try {
      // Method 1: Try with Authorization header (standard)
      let response = await fetch(`https://gems-of-truth.vercel.app/blogs/like-blog/${blogId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status !== 403) {
        const text = await response.text();
        setResult(`Method 1 (Authorization Bearer):\nStatus: ${response.status}\nResponse: ${text}`);
        return;
      }

      // Method 2: Try with token in query parameter
      response = await fetch(`https://gems-of-truth.vercel.app/blogs/like-blog/${blogId}/?token=${token}`, {
        method: 'POST',
      });

      if (response.status !== 403) {
        const text = await response.text();
        setResult(`Method 2 (Query Parameter):\nStatus: ${response.status}\nResponse: ${text}`);
        return;
      }

      // Method 3: Try with token in form body
      const formData = new FormData();
      formData.append('token', token);
      
      response = await fetch(`https://gems-of-truth.vercel.app/blogs/like-blog/${blogId}/`, {
        method: 'POST',
        body: formData
      });

      const text = await response.text();
      setResult(`Method 3 (Form Body):\nStatus: ${response.status}\nResponse: ${text}`);

    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testViewLikesEndpoint = async () => {
    setLoading(true);
    setResult('Testing...');
    
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    
    try {
      // Method 1: Try with Authorization header (standard)
      let response = await fetch(`https://gems-of-truth.vercel.app/blogs/view-likes/${blogId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status !== 403) {
        const text = await response.text();
        setResult(`Method 1 (Authorization Bearer):\nStatus: ${response.status}\nResponse: ${text}`);
        return;
      }

      // Method 2: Try with token in query parameter
      response = await fetch(`https://gems-of-truth.vercel.app/blogs/view-likes/${blogId}/?token=${token}`, {
        method: 'GET',
      });

      const text = await response.text();
      setResult(`Method 2 (Query Parameter):\nStatus: ${response.status}\nResponse: ${text}`);

    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ccc', 
      margin: '20px', 
      borderRadius: '8px',
      backgroundColor: '#f9f9f9' 
    }}>
      <h3>Blog Like API Test</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <label>Blog ID: </label>
        <input 
          type="text" 
          value={blogId} 
          onChange={(e) => setBlogId(e.target.value)}
          style={{ marginLeft: '10px', padding: '5px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={checkAuth} 
          disabled={loading}
          style={{ 
            marginRight: '10px', 
            padding: '8px 15px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Check Auth Status
        </button>

        <button 
          onClick={testLikeEndpoint} 
          disabled={loading}
          style={{ 
            marginRight: '10px', 
            padding: '8px 15px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Like Endpoint
        </button>
        
        <button 
          onClick={testViewLikesEndpoint} 
          disabled={loading}
          style={{ 
            padding: '8px 15px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test View Likes Endpoint
        </button>
      </div>

      {loading && <p>Loading...</p>}
      
      <pre style={{ 
        backgroundColor: 'white', 
        padding: '10px', 
        border: '1px solid #ddd',
        borderRadius: '4px',
        whiteSpace: 'pre-wrap',
        fontSize: '12px'
      }}>
        {result || 'Click a button to test the endpoints'}
      </pre>

      <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
        <p><strong>Note:</strong> This component tests the API endpoints directly without authentication headers to avoid CORS issues.</p>
        <p><strong>Like Endpoint:</strong> POST https://gems-of-truth.vercel.app/blogs/like-blog/[blog_id]/</p>
        <p><strong>View Likes Endpoint:</strong> GET https://gems-of-truth.vercel.app/blogs/view-likes/[blog_id]/</p>
      </div>
    </div>
  );
};

export default BlogLikeTest;
