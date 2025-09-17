import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TermsOfServicePage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="mt-[64px] md:mt-[72px]">
      <div className="mx-auto max-w-3xl px-4">
        {/* Navigation Header */}
        <div className="mb-4 flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-800 hover:bg-gray-50" onClick={handleGoBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Terms of Service</h1>
        </div>

        {/* Terms Content */}
        <div className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm prose prose-emerald max-w-none">
          <div className="terms-section">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using Gems of Insight ("we," "our," or "us"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
            <p>These Terms of Service govern your use of our website, products, and services. Your continued use of our services constitutes acceptance of these terms.</p>
          </div>

          <div className="terms-section">
            <h2>2. Description of Service</h2>
            <p>Gems of Insight provides natural health products, herbal remedies, wellness consultations, and educational content related to natural healing and wellness. Our services include:</p>
            <ul>
              <li>Online herbal product sales</li>
              <li>Professional herbal consultations</li>
              <li>Educational health content and blog</li>
              <li>Wellness programs and courses</li>
              <li>Customer support and guidance</li>
            </ul>
          </div>

          <div className="terms-section">
            <h2>3. User Accounts and Registration</h2>
            <p>To access certain features of our service, you may be required to create an account. You are responsible for:</p>
            <ul>
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and complete information</li>
              <li>Updating your information as necessary</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>
          </div>

          <div className="terms-section">
            <h2>4. Health Disclaimer</h2>
            <p><strong>Important:</strong> The information provided on this website is for educational and informational purposes only and is not intended as medical advice. It is not a substitute for professional healthcare diagnosis, treatment, or guidance.</p>
            <p>Always consult with a qualified physician or licensed naturopathic doctor before making changes to your health regimen, especially if you have a medical condition or are taking medications.</p>
            <p>Products and services mentioned on this site are not intended to diagnose, treat, cure, or prevent any disease. Individual results may vary.</p>
          </div>

          <div className="terms-section">
            <h2>5. Product Information and Orders</h2>
            <p>We strive to provide accurate product information, but we do not warrant that product descriptions, pricing, or other content is accurate, complete, reliable, current, or error-free.</p>
            <p>By placing an order, you:</p>
            <ul>
              <li>Confirm that all information provided is accurate</li>
              <li>Agree to pay the specified price</li>
              <li>Authorize us to process your payment</li>
              <li>Understand that product availability may change</li>
            </ul>
          </div>

          <div className="terms-section">
            <h2>6. Privacy Policy</h2>
            <p>Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using our service, you agree to our Privacy Policy, which is incorporated into these Terms of Service.</p>
          </div>

          <div className="terms-section">
            <h2>7. Payment Terms</h2>
            <p>Payment terms include:</p>
            <ul>
              <li>All prices are in Kenyan Shillings (KES) unless otherwise stated</li>
              <li>Payment is due at the time of order placement</li>
              <li>We accept various payment methods as indicated on our website</li>
              <li>Prices are subject to change without notice</li>
              <li>Taxes and shipping fees will be added as applicable</li>
            </ul>
          </div>

          <div className="terms-section">
            <h2>8. Shipping and Delivery</h2>
            <p>We offer various shipping options to locations within Kenya. Delivery times may vary based on your location and the shipping method selected. We are not responsible for delays beyond our control.</p>
            <p>Risk of loss and title for items purchased pass to you upon delivery to the carrier.</p>
          </div>

          <div className="terms-section">
            <h2>9. Returns and Refunds</h2>
            <p>We want you to be satisfied with your purchase. If you're not completely satisfied, you may return most items within 30 days of delivery for a refund or exchange, subject to our return policy.</p>
            <p>Certain items may not be eligible for return due to health and safety reasons. Please contact our customer service team for specific return instructions.</p>
          </div>

          <div className="terms-section">
            <h2>10. Intellectual Property</h2>
            <p>All content on this website, including text, graphics, logos, images, and software, is the property of Gems of Insight and is protected by copyright and other intellectual property laws.</p>
            <p>You may not reproduce, distribute, or create derivative works without our express written permission.</p>
          </div>

          <div className="terms-section">
            <h2>11. Prohibited Uses</h2>
            <p>You agree not to use our service to:</p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on the rights of others</li>
              <li>Transmit harmful, offensive, or inappropriate content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of our service</li>
            </ul>
          </div>

          <div className="terms-section">
            <h2>12. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Gems of Insight shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use.</p>
            <p>Our total liability shall not exceed the amount paid by you for the specific product or service giving rise to the claim.</p>
          </div>

          <div className="terms-section">
            <h2>13. Indemnification</h2>
            <p>You agree to indemnify and hold harmless Gems of Insight from any claims, damages, or expenses arising from your use of our service or violation of these terms.</p>
          </div>

          <div className="terms-section">
            <h2>14. Termination</h2>
            <p>We may terminate or suspend your access to our service at any time, with or without cause, with or without notice. Upon termination, your right to use the service will cease immediately.</p>
          </div>

          <div className="terms-section">
            <h2>15. Governing Law</h2>
            <p>These Terms of Service shall be governed by and construed in accordance with the laws of Kenya. Any disputes shall be subject to the exclusive jurisdiction of the courts in Kenya.</p>
          </div>

          <div className="terms-section">
            <h2>16. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the service constitutes acceptance of the modified terms.</p>
            <p>We will notify you of significant changes via email or through our website.</p>
          </div>

          <div className="terms-section">
            <h2>17. Contact Information</h2>
            <p>For questions about these Terms of Service, please contact us:</p>
            <div className="contact-info">
              <p><strong>Email:</strong> legal@gemsofinsight.com</p>
              <p><strong>Phone:</strong> +254 794 491 920</p>
              <p><strong>Address:</strong> Thika Town, Kiambu County, Central Kenya Region</p>
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-600">
            <p><strong>Last Updated:</strong> January 2024</p>
            <p>These Terms of Service are effective as of the date listed above and will remain in effect except with respect to any changes in their provisions in the future.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
