import React from 'react';
import './PromoBanner.css';

const PromoBanner = ({ 
  title, 
  subtitle, 
  discount, 
  backgroundImage, 
  buttonText = "Shop Now",
  textAlign = "center"
}) => {
  return (
    <section 
      className="promo-banner"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backgroundImage})`
      }}
    >
      <div className="promo-container">
        <div className={`promo-content ${textAlign}`}>
          <div className="discount-tag">{discount}</div>
          <h2 className="promo-title">{title}</h2>
          <p className="promo-subtitle">{subtitle}</p>
          <button className="promo-btn">{buttonText}</button>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
