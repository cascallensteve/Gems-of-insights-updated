import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReturnsPage.css';

const ReturnsPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="returns-page">
      <button className="back-button" onClick={handleGoBack}>
        ← Go Back
      </button>
      
      <div className="returns-container">
        <div className="returns-header">
          <h1>Returns & Refunds</h1>
          <p>We want you to be completely satisfied with your purchase</p>
        </div>

        <div className="returns-section">
          <h2>🔄 Return Policy Overview</h2>
          <div className="policy-highlights">
            <div className="policy-highlight">
              <h4>30-Day Return Window</h4>
              <p>Return items within 30 days of delivery for a full refund</p>
            </div>
            <div className="policy-highlight">
              <h4>Free Return Shipping</h4>
              <p>We provide prepaid return labels for easy returns</p>
            </div>
            <div className="policy-highlight">
              <h4>Full Refund Guarantee</h4>
              <p>Get your money back for any reason within 30 days</p>
            </div>
          </div>
        </div>

        <div className="returns-section">
          <h2>❓ Common Return Reasons</h2>
          <ul>
            <li><strong>Product not as described:</strong> Item received doesn't match the description or images</li>
            <li><strong>Damaged during shipping:</strong> Product arrived with visible damage or broken packaging</li>
            <li><strong>Wrong item received:</strong> Different product than what was ordered</li>
            <li><strong>Quality issues:</strong> Product doesn't meet expected quality standards</li>
            <li><strong>Changed mind:</strong> Simply decided the product isn't right for you</li>
          </ul>
        </div>

        <div className="returns-section">
          <h2>📋 Return Process</h2>
          <div className="return-steps">
            <div className="steps-header">Step-by-Step Return Process</div>
            <div className="steps-content">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Contact Us</h4>
                  <p>Reach out within 30 days of delivery to initiate return</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Get Approval</h4>
                  <p>We'll review your request and provide return authorization</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Package Item</h4>
                  <p>Securely package the item in original packaging</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h4>Ship Back</h4>
                  <p>Send the package using our prepaid return label</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">5</div>
                <div className="step-content">
                  <h4>Refund Processed</h4>
                  <p>Refund issued within 5-7 business days of receipt</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="returns-section">
          <h2>⚠️ Return Conditions</h2>
          <h3>✅ What We Accept</h3>
          <ul>
            <li>Unused and unopened products</li>
            <li>Original packaging intact</li>
            <li>All original tags and labels</li>
            <li>Products within 30 days of delivery</li>
          </ul>
          
          <h3>❌ What We Don't Accept</h3>
          <ul>
            <li>Used or opened products</li>
            <li>Damaged or missing packaging</li>
            <li>Products past 30-day return window</li>
            <li>Personal care items (for hygiene reasons)</li>
          </ul>
        </div>

        <div className="returns-section">
          <h2>💳 Refund Information</h2>
          <ul>
            <li><strong>Processing Time:</strong> Refunds are processed within 5-7 business days of receiving your return</li>
            <li><strong>Refund Method:</strong> Refunds are issued to the original payment method used for the purchase</li>
            <li><strong>Partial Refunds:</strong> If items are returned partially used, we may offer a partial refund</li>
            <li><strong>Shipping Costs:</strong> Original shipping costs are non-refundable unless the return is due to our error</li>
          </ul>
        </div>

        <div className="contact-info">
          <h3>Need Help with Returns?</h3>
          <p>Our customer service team is here to help with any return questions or issues.</p>
          <p>Phone: +254 794 491 920</p>
          <p>Email: returns@gemsofinsight.com</p>
          <p>Live Chat: Available on our website</p>
        </div>
      </div>
    </div>
  );
};

export default ReturnsPage;
