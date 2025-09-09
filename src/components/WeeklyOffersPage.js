import React from 'react';
import WeeklyOffersSection from './WeeklyOffersSection';
import './WeeklyOffersPage.css';

const WeeklyOffersPage = () => {
  return (
    <div className="weekly-offers-page">
      <div className="page-header">
        <div className="container">
          <h1>🔥 Weekly Special Offers</h1>
          <p>Limited-time deals on our most popular natural healing courses</p>
        </div>
      </div>
      
      <WeeklyOffersSection />
      
      <div className="additional-info">
        <div className="container">
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">📚</div>
              <h3>Expert-Led Courses</h3>
              <p>Learn from certified professionals with years of experience in natural healing and holistic wellness.</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon">💰</div>
              <h3>Best Price Guarantee</h3>
              <p>We offer the most competitive prices on natural healing education. Price match guarantee included.</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon">🎓</div>
              <h3>Certification Included</h3>
              <p>Receive internationally recognized certificates upon successful completion of your chosen course.</p>
            </div>
            
            <div className="info-card">
              <div className="info-icon">🌍</div>
              <h3>Global Community</h3>
              <p>Join a worldwide community of natural healing practitioners and continue learning together.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyOffersPage;
