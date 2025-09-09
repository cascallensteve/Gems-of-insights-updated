import React from 'react';
import BlogLikesAnalytics from './BlogLikesAnalytics';
import './Analytics.css';

const Analytics = () => {
  return (
    <div className="admin-analytics">
      <div className="analytics-header">
        <div className="header-content">
          <h1>Analytics Dashboard</h1>
          <p>Comprehensive insights and data analysis for your business</p>
        </div>
      </div>
      
      <div className="analytics-content">
        <div className="analytics-overview">
          <div className="analytics-card">
            <h3>Page Views</h3>
            <p className="analytics-number">45,892</p>
            <span className="analytics-period">Last 30 Days</span>
          </div>
          
          <div className="analytics-card">
            <h3>Unique Visitors</h3>
            <p className="analytics-number">12,847</p>
            <span className="analytics-period">Last 30 Days</span>
          </div>
          
          <div className="analytics-card">
            <h3>Conversion Rate</h3>
            <p className="analytics-number">3.2%</p>
            <span className="analytics-period">Average</span>
          </div>
        </div>
        
        {/* Blog Likes Analytics Section */}
        <BlogLikesAnalytics />
        
        <div className="analytics-placeholder">
          <div className="placeholder-content">
            <h2>Analytics Dashboard</h2>
            <p>Advanced analytics and reporting features will be implemented here.</p>
            <div className="placeholder-features">
              <div className="feature-item">📊 User Behavior Analysis</div>
              <div className="feature-item">📈 Traffic Sources</div>
              <div className="feature-item">🎯 Conversion Tracking</div>
              <div className="feature-item">�� Device Analytics</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 