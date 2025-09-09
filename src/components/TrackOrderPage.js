import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TrackOrderPage.css';

const TrackOrderPage = () => {
  const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  const handleGoBack = () => {
    navigate(-1);
  };

  const handleTrackOrder = (e) => {
    e.preventDefault();
    if (!orderNumber || !email) {
      alert('Please enter both order number and email');
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      // Mock tracking data - in real app, this would come from your backend
      const mockTrackingData = {
        orderNumber: orderNumber,
        status: 'In Transit',
        estimatedDelivery: '2024-01-25',
        currentLocation: 'Nairobi Distribution Center',
        trackingNumber: 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        timeline: [
          {
            date: '2024-01-20',
            time: '10:30 AM',
            status: 'Order Placed',
            description: 'Your order has been confirmed and is being processed',
            icon: '📋'
          },
          {
            date: '2024-01-21',
            time: '2:15 PM',
            status: 'Processing',
            description: 'Your order is being prepared and packaged',
            icon: '⚙️'
          },
          {
            date: '2024-01-22',
            time: '9:45 AM',
            status: 'Shipped',
            description: 'Your package has been shipped and is on its way',
            icon: '🚚'
          },
          {
            date: '2024-01-23',
            time: '11:20 AM',
            status: 'In Transit',
            description: 'Package is currently at Nairobi Distribution Center',
            icon: '📦'
          }
        ]
      };
      
      setTrackingResult(mockTrackingData);
    }, 2000);
  };

  return (
    <div className="track-order-page">
      <button className="back-button" onClick={handleGoBack}>
        ← Go Back
      </button>
      
      <div className="track-container">
        <div className="track-header">
          <h1>Track Your Order</h1>
          <p>Stay updated on your natural remedies delivery</p>
        </div>

        <div className="track-section">
          <h2>🔍 Enter Order Details</h2>
          <form onSubmit={handleTrackOrder} className="tracking-form">
            <div className="form-group">
              <label htmlFor="orderNumber">Order Number</label>
              <input
                type="text"
                id="orderNumber"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Enter your order number (e.g., ORD-12345)"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter the email used for the order"
                required
              />
            </div>
            
            <button type="submit" className="track-button">
              Track Order
            </button>
          </form>
        </div>

        {trackingResult && (
          <div className="tracking-result">
            <div className="result-header">Order Status</div>
            <div className="result-content">
              <div className="order-summary">
                <div className="summary-grid">
                  <div className="summary-item">
                    <h4>Order Number</h4>
                    <p>{trackingResult.orderNumber}</p>
                  </div>
                  <div className="summary-item">
                    <h4>Status</h4>
                    <p>{trackingResult.status}</p>
                  </div>
                  <div className="summary-item">
                    <h4>Estimated Delivery</h4>
                    <p>{trackingResult.estimatedDelivery}</p>
                  </div>
                  <div className="summary-item">
                    <h4>Current Location</h4>
                    <p>{trackingResult.currentLocation}</p>
                  </div>
                </div>
              </div>

              <div className="tracking-timeline">
                <h3>Order Timeline</h3>
                {trackingResult.timeline.map((event, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-icon">{index + 1}</div>
                    <div className="timeline-content">
                      <h4>{event.status}</h4>
                      <p>{event.description}</p>
                      <small>{event.date} at {event.time}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="help-options">
          <h3>Need Help Tracking Your Order?</h3>
          <p>Our support team is here to help with any tracking questions.</p>
          <p>Phone: +254 794 491 920</p>
          <p>Email: orders@gemsofinsight.com</p>
          <p>Live Chat: Available on our website</p>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;
