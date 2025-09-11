import React, { useEffect, useState } from 'react';
import { newsletterService } from '../../services/newsletterService';
import BlogLikesAnalytics from './BlogLikesAnalytics';
import './Analytics.css';

const Analytics = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [nlLoading, setNlLoading] = useState(false);
  const [nlError, setNlError] = useState('');
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setNlLoading(true);
        setNlError('');
        const res = await newsletterService.getAllNewsletters();
        const list = res.Newsletters || res.newsletters || [];
        setNewsletters(Array.isArray(list) ? list : []);
      } catch (e) {
        setNlError(e.message || 'Failed to fetch newsletters');
      } finally {
        setNlLoading(false);
      }
    };
    load();
  }, []);

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

        {/* Newsletters Analytics */}
        <div className="analytics-card full-width">
          <h2>Newsletters</h2>
          {nlLoading && <p>Loading newsletters...</p>}
          {nlError && <p style={{ color: '#b91c1c' }}>{nlError}</p>}
          {!nlLoading && !nlError && (
            <div className="table like-compact">
              <div className="table-header grid-4">
                <div>ID</div>
                <div>Subject</div>
                <div>Author</div>
                <div>Date</div>
              </div>
              {newsletters.map(n => (
                <div key={n.id} className="table-row grid-4" onClick={async ()=>{
                  try {
                    setDetailError('');
                    setDetailLoading(true);
                    const res = await newsletterService.getNewsletterDetail(n.id);
                    setSelectedNewsletter(res.Newsletter || res.newsletter || null);
                  } catch (e) {
                    setDetailError(e.message || 'Failed to fetch newsletter detail');
                    setSelectedNewsletter(null);
                  } finally {
                    setDetailLoading(false);
                  }
                }} style={{cursor:'pointer'}}>
                  <div>#{n.id}</div>
                  <div>{n.subject}</div>
                  <div>{n.author}</div>
                  <div>{new Date(n.timestamp).toLocaleString()}</div>
                </div>
              ))}
              {newsletters.length === 0 && (
                <div className="table-row"><div>No newsletters found.</div></div>
              )}
            </div>
          )}
          {(detailLoading || selectedNewsletter || detailError) && (
            <div className="newsletter-detail" style={{marginTop:16}}>
              <h3>Newsletter Detail</h3>
              {detailLoading && <p>Loading details...</p>}
              {detailError && <p style={{ color: '#b91c1c' }}>{detailError}</p>}
              {!detailLoading && !detailError && selectedNewsletter && (
                <div className="detail-card">
                  <p><strong>ID:</strong> {selectedNewsletter.id}</p>
                  <p><strong>Author:</strong> {selectedNewsletter.author}</p>
                  <p><strong>Subject:</strong> {selectedNewsletter.subject}</p>
                  <p><strong>Body:</strong> {selectedNewsletter.body}</p>
                  <p><strong>Date:</strong> {new Date(selectedNewsletter.timestamp).toLocaleString()}</p>
                </div>
              )}
            </div>
          )}
        </div>
        
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