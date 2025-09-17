import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { newsletterService } from '../services/newsletterService';
import { useAuth } from '../context/AuthContext';
// Tailwind conversion: removed external CSS import

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { currentUser, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);

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
      setSubscriptionInfo({
        email,
        message: result.message || 'Subscribed successfully',
        mode: result.mode || 'online'
      });
      // If user is logged in and email matches, mark newsletter true in profile
      try {
        if (currentUser && currentUser.email && currentUser.email.toLowerCase() === email.toLowerCase()) {
          updateUser({ newsletter: true });
        }
      } catch(_) {}
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
      className="mt-8"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid items-center gap-6 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm md:grid-cols-2">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Get Discount 30% Off</h2>
            <p className="mt-1 text-gray-700">
              It is a long established fact that a reader will be distracted by the readable 
              content of natural health tips, exclusive offers, and wellness insights delivered to your inbox.
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-emerald-800">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm">🎁 Exclusive Offers</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm">📚 Health Tips</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm">⚡ Early Access</span>
            </div>
          </div>

          <div>
            {subscribed ? (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">✓</div>
                <h3 className="text-lg font-semibold">Welcome to our community!</h3>
                <p>You've been successfully subscribed to our newsletter.</p>
                <p>Check your email for your 30% discount code and future updates!</p>
                {subscriptionInfo && (
                  <div className="mt-2 space-y-1 text-sm">
                    <p><strong>Email:</strong> {subscriptionInfo.email}</p>
                    <p><strong>Status:</strong> {subscriptionInfo.message}</p>
                    {subscriptionInfo.mode === 'offline' && (
                      <p><em>Saved locally until service is available.</em></p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2">
                {error && (
                  <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                    {error}
                  </div>
                )}
                
                <div className="flex w-full gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
                    required
                    disabled={loading}
                  />
                  <button 
                    type="submit" 
                    className="inline-flex items-center justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-60"
                    disabled={loading}
                  >
                    {loading ? (
                      'Subscribing...'
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
                
                <p className="text-sm text-gray-600">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Newsletter;
