import React, { useState } from 'react';
import { newsletterService } from '../services/newsletterService';
import './NewsletterSender.css';

const NewsletterSender = () => {
  const [newsletterData, setNewsletterData] = useState({
    subject: '',
    body: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewsletterData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newsletterData.subject.trim() || !newsletterData.body.trim()) {
      setError('Please fill in both subject and body fields');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await newsletterService.sendNewsletter(newsletterData);
      setMessage(result.message || 'Newsletter sent successfully!');
      
      // Clear form on success
      setNewsletterData({
        subject: '',
        body: ''
      });
    } catch (err) {
      console.error('Newsletter send error:', err);
      setError(err.message || 'Failed to send newsletter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSend = async () => {
    const quickNewsletter = {
      subject: "10 ways to improve your gut health by Dr. Denzel Odwuor",
      body: "Hello lovers of insight. This week we bring you 10 ways to improve your gut health by Dr. Denzel Odwuor"
    };

    setNewsletterData(quickNewsletter);
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await newsletterService.sendNewsletter(quickNewsletter);
      setMessage(result.message || 'Newsletter sent successfully!');
      
      // Clear form on success
      setNewsletterData({
        subject: '',
        body: ''
      });
    } catch (err) {
      console.error('Quick send error:', err);
      setError(err.message || 'Failed to send newsletter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Clear messages after a delay
  const clearMessages = () => {
    setTimeout(() => {
      setMessage('');
      setError('');
    }, 5000);
  };

  // Clear messages when they change
  React.useEffect(() => {
    if (message || error) {
      clearMessages();
    }
  }, [message, error]);

  // Check authentication status
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  return (
    <div className="newsletter-sender">
      <div className="newsletter-container">
        <h2>Send Newsletter</h2>
        <p className="newsletter-description">
          Send a newsletter to all subscribers. This feature requires admin privileges.
        </p>

        {!isAuthenticated() && (
          <div className="warning-message">
            ⚠️ You must be logged in as an admin to send newsletters.
          </div>
        )}

        {message && (
          <div className="success-message">
            ✅ {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="newsletter-form">
          <div className="form-group">
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={newsletterData.subject}
              onChange={handleInputChange}
              placeholder="Enter newsletter subject..."
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="body">Body:</label>
            <textarea
              id="body"
              name="body"
              value={newsletterData.body}
              onChange={handleInputChange}
              placeholder="Enter newsletter content..."
              rows="6"
              required
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="send-button"
              disabled={loading || !isAuthenticated()}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Sending...
                </>
              ) : (
                'Send Newsletter'
              )}
            </button>

            <button
              type="button"
              className="quick-send-button"
              onClick={handleQuickSend}
              disabled={loading || !isAuthenticated()}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Sending...
                </>
              ) : (
                'Quick Send Example'
              )}
            </button>
          </div>
        </form>

        <div className="newsletter-info">
          <h3>API Endpoint Information:</h3>
          <ul>
            <li><strong>URL:</strong> POST https://gems-of-truth.vercel.app/newsletter/send-newsletter</li>
            <li><strong>Authentication:</strong> Required (Admin only)</li>
            <li><strong>Headers:</strong> Authorization: Token {isAuthenticated() ? '***' : 'Not logged in'}</li>
            <li><strong>Content-Type:</strong> application/json</li>
          </ul>

          <h3>Request Body:</h3>
          <pre className="code-example">
{`{
  "subject": "10 ways to improve your gut health by Dr. Denzel Odwuor",
  "body": "Hello lovers of insight. This week we bring you 10 ways to improve your gut health by Dr. Denzel Odwuor"
}`}
          </pre>

          <h3>Response:</h3>
          <pre className="code-example">
{`{
  "message": "Newsletter sent to 3 subscribers."
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSender;
