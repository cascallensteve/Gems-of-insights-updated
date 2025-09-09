import React from 'react';
import './TermsPage.css';

const TermsPage = ({ onClose }) => {
  return (
    <div className="terms-page-overlay">
      <div className="terms-page">
        <div className="terms-header">
          <div className="terms-logo">
            <img
              src="/images/Gems_of_insight_logo_ghxcbv (1).png"
              alt="Gems of Insight"
              className="logo-image"
            />
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="terms-content">
          <h1>Terms & Conditions</h1>
          <p className="last-updated">Last updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using Gems of Insight ("we," "our," or "us"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
          </section>

          <section>
            <h2>2. Description of Service</h2>
            <p>Gems of Insight provides natural health products, wellness education, and consultation services. Our platform offers:</p>
            <ul>
              <li>Natural health products and supplements</li>
              <li>Educational content about wellness and natural remedies</li>
              <li>Consultation services with health professionals</li>
              <li>Online courses and workshops</li>
              <li>Community support and resources</li>
            </ul>
          </section>

          <section>
            <h2>3. User Accounts</h2>
            <p>To access certain features of our service, you must create an account. You are responsible for:</p>
            <ul>
              <li>Maintaining the confidentiality of your account information</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and complete information</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section>
            <h2>4. Health Disclaimer</h2>
            <p><strong>Important:</strong> The information provided on Gems of Insight is for educational purposes only and is not intended as medical advice. We recommend:</p>
            <ul>
              <li>Consulting with healthcare professionals before starting any new health regimen</li>
              <li>Not discontinuing prescribed medications without medical supervision</li>
              <li>Understanding that natural products may interact with medications</li>
              <li>Being aware that results may vary between individuals</li>
            </ul>
          </section>

          <section>
            <h2>5. Product Information</h2>
            <p>While we strive to provide accurate product information:</p>
            <ul>
              <li>Product descriptions are for informational purposes</li>
              <li>We do not guarantee specific health outcomes</li>
              <li>Individual results may vary</li>
              <li>Always read product labels and instructions carefully</li>
            </ul>
          </section>

          <section>
            <h2>6. Privacy Policy</h2>
            <p>Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using our service, you agree to our Privacy Policy.</p>
          </section>

          <section>
            <h2>7. Payment Terms</h2>
            <p>Payment terms include:</p>
            <ul>
              <li>All prices are in Kenyan Shillings (KSH)</li>
              <li>Payment is required at the time of order</li>
              <li>We accept various payment methods as displayed</li>
              <li>Orders are processed upon payment confirmation</li>
            </ul>
          </section>

          <section>
            <h2>8. Shipping & Returns</h2>
            <p>Our shipping and return policies:</p>
            <ul>
              <li>Orders are typically processed within 1-2 business days</li>
              <li>Shipping times vary by location</li>
              <li>Returns accepted within 30 days for unused products</li>
              <li>Contact customer service for return authorization</li>
            </ul>
          </section>

          <section>
            <h2>9. Prohibited Uses</h2>
            <p>You agree not to use our service to:</p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit harmful or malicious content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the service's operation</li>
            </ul>
          </section>

          <section>
            <h2>10. Limitation of Liability</h2>
            <p>Gems of Insight shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our service.</p>
          </section>

          <section>
            <h2>11. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the service constitutes acceptance of the modified terms.</p>
          </section>

          <section>
            <h2>12. Contact Information</h2>
            <p>For questions about these Terms & Conditions, please contact us:</p>
            <ul>
              <li>Email: info@gemsofinsight.com</li>
              <li>Phone: +254 712 345 678</li>
              <li>Address: [Your Business Address]</li>
            </ul>
          </section>

          <div className="terms-footer">
            <button className="accept-terms-btn" onClick={onClose}>
              I Accept Terms & Conditions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
