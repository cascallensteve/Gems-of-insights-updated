import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CookiePolicyPage.css';

const CookiePolicyPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="cookie-policy-page">
      <button className="back-button" onClick={handleGoBack}>
        ← Go Back
      </button>
      
      <div className="cookie-container">
        <div className="cookie-header">
          <h1>Cookie Policy</h1>
          <p>Learn about how we use cookies on our website</p>
        </div>

        <div className="cookie-section">
          <h2>Cookie Information</h2>
          <p>
            We use cookies to enhance your browsing experience and provide personalized content. 
            By using our website, you agree to our use of cookies.
          </p>
        </div>

        <div className="cookie-section">
          <h2>Contact Us</h2>
          <p>
            If you have any questions about our cookie policy, please contact us.
          </p>
        </div>

        <div className="contact-info">
          <h3>Need Help?</h3>
          <p>Email: info@gemsofinsight.com</p>
          <p>Phone: +254794491920</p>
          <p>Address: Nairobi, Kenya</p>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;
