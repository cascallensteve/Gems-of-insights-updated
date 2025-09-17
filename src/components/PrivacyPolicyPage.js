import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicyPage = () => {
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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
        </div>

        {/* Policy Content */}
        <div className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="prose prose-emerald max-w-none">
            <div className="policy-section">
              <h2>1. Information We Collect</h2>
              <p>At Gems of Insight, we collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include:</p>
              <ul>
                <li>Personal identification information (name, email address, phone number)</li>
                <li>Billing and shipping addresses</li>
                <li>Payment information</li>
                <li>Health-related information you choose to share</li>
                <li>Communication preferences</li>
              </ul>
            </div>

            <div className="policy-section">
              <h2>2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Process and fulfill your orders</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Send you important updates about your account or orders</li>
                <li>Improve our products and services</li>
                <li>Comply with legal obligations</li>
                <li>Send marketing communications (with your consent)</li>
              </ul>
            </div>

            <div className="policy-section">
              <h2>3. Information Sharing</h2>
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties, except in the following circumstances:</p>
              <ul>
                <li>With your explicit consent</li>
                <li>To trusted third-party service providers who assist us in operating our website and serving you</li>
                <li>To comply with legal requirements or protect our rights</li>
                <li>In connection with a business transfer or merger</li>
              </ul>
            </div>

            <div className="policy-section">
              <h2>4. Data Security</h2>
              <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:</p>
              <ul>
                <li>Encryption of sensitive data</li>
                <li>Regular security assessments</li>
                <li>Access controls and authentication</li>
                <li>Secure data transmission protocols</li>
              </ul>
            </div>

            <div className="policy-section">
              <h2>5. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </div>

            <div className="policy-section">
              <h2>6. Cookies and Tracking</h2>
              <p>We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, and understand where our visitors are coming from. You can control cookie settings through your browser preferences.</p>
            </div>

            <div className="policy-section">
              <h2>7. Children's Privacy</h2>
              <p>Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.</p>
            </div>

            <div className="policy-section">
              <h2>8. International Transfers</h2>
              <p>Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards.</p>
            </div>

            <div className="policy-section">
              <h2>9. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.</p>
            </div>

            <div className="policy-section">
              <h2>10. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
              <div className="contact-info">
                <p><strong>Email:</strong> privacy@gemsofinsight.com</p>
                <p><strong>Phone:</strong> +254 794 491 920</p>
                <p><strong>Address:</strong> Thika Town, Kiambu County, Central Kenya Region</p>
              </div>
            </div>

            <div className="policy-footer">
              <p><strong>Last Updated:</strong> January 2024</p>
              <p>This Privacy Policy is effective as of the date listed above and will remain in effect except with respect to any changes in its provisions in the future.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
