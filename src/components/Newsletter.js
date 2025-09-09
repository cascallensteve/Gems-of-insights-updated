import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { newsletterService } from '../services/newsletterService';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Spam protection
    if (honeypot) return;
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    setSubscribed(false);

    try {
      console.log('Attempting to subscribe email:', email);
      const result = await newsletterService.subscribe(email);
      console.log('Newsletter subscription successful:', result);
      
      // Show success message
      setSubscribed(true);
      setEmail('');
      setHoneypot('');
      
      // Reset success message after 8 seconds
      setTimeout(() => setSubscribed(false), 8000);
    } catch (err) {
      console.error('Newsletter subscription failed:', err);
      
      // Provide specific error messages
      if (err.message.includes('already subscribed')) {
        setError('This email is already subscribed to our newsletter!');
      } else if (err.message.includes('Invalid email')) {
        setError('Please enter a valid email address');
      } else if (err.message.includes('404') || err.message.includes('Not Found')) {
        setError('Newsletter service is temporarily unavailable. Your email has been saved locally.');
      } else if (err.message.includes('Network Error') || err.message.includes('Failed to fetch')) {
        setError('Network error. Please check your internet connection and try again.');
      } else if (err.message.includes('500')) {
        setError('Server error. Please try again later.');
      } else {
        setError(err.message || 'Failed to subscribe. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  return (
    <motion.section 
      ref={ref}
      className="newsletter"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="newsletter-container">
        <div className="newsletter-content">
          <div className="newsletter-text">
            <h2 className="newsletter-title">Get Discount 30% Off</h2>
            <p className="newsletter-subtitle">
              It is a long established fact that a reader will be distracted by the readable 
              content of natural health tips, exclusive offers, and wellness insights delivered to your inbox.
            </p>
            <div className="newsletter-benefits">
              <div className="benefit-item">
                <span className="benefit-icon">🎁</span>
                <span>Exclusive Offers</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">📚</span>
                <span>Health Tips</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">⚡</span>
                <span>Early Access</span>
              </div>
            </div>
          </div>

          <div className="newsletter-form-wrapper">
            {subscribed ? (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h3>Welcome to our community!</h3>
                <p>You've been successfully subscribed to our newsletter.</p>
                <p>Check your email for your 30% discount code and future updates!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="newsletter-form">
                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}
                
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="newsletter-input"
                    required
                    disabled={loading}
                  />
                  <button 
                    type="submit" 
                    className="newsletter-submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        Subscribing...
                      </>
                    ) : (
                      'Get 30% Off'
                    )}
                  </button>
                </div>
                
                {/* Honeypot field for spam protection */}
                <input
                  type="text"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  style={{ display: 'none' }}
                  tabIndex="-1"
                  autoComplete="off"
                  aria-label="Leave this field empty if you're human"
                />
                
                <p className="newsletter-privacy">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>
            )}
          </div>
        </div>

        <div className="newsletter-decorations">
          <div className="decoration decoration-1"></div>
          <div className="decoration decoration-2"></div>
          <div className="decoration decoration-3"></div>
        </div>
      </div>
    </motion.section>
  );
};

export default Newsletter;
