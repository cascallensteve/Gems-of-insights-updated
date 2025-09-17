import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RefundPolicyPage = () => {
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
          <h1 className="text-2xl font-bold text-gray-900">Refund Policy</h1>
        </div>

        {/* Refund Policy Content */}
        <div className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
          <div className="prose prose-emerald max-w-none">
            <div className="refund-section">
              <h2>1. Our Commitment to Customer Satisfaction</h2>
              <p>At Gems of Insight, we are committed to providing you with the highest quality natural health products and exceptional customer service. We want you to be completely satisfied with your purchase. If you're not happy with your order, we're here to help.</p>
            </div>

            <div className="refund-section">
              <h2>2. Refund Eligibility</h2>
              <p>We offer refunds for most products under the following conditions:</p>
              <ul>
                <li><strong>Unopened Products:</strong> Products in their original, unopened packaging</li>
                <li><strong>Damaged Products:</strong> Items that arrive damaged or defective</li>
                <li><strong>Wrong Products:</strong> Items that don't match your order</li>
                <li><strong>Quality Issues:</strong> Products that don't meet our quality standards</li>
              </ul>
              <p><strong>Note:</strong> Due to health and safety regulations, certain products may not be eligible for return or refund.</p>
            </div>

            <div className="refund-section">
              <h2>3. Return Timeframe</h2>
              <p>You have <strong>30 days</strong> from the date of delivery to request a return or refund. This gives you adequate time to evaluate the product while ensuring we can process returns efficiently.</p>
              <p>For subscription products, you may cancel your subscription at any time, and we'll process a refund for any unused portion of your current billing cycle.</p>
            </div>

            <div className="refund-section">
              <h2>4. Return Process</h2>
              <h3>Step 1: Contact Customer Service</h3>
              <p>Before returning any product, please contact our customer service team to:</p>
              <ul>
                <li>Explain the reason for your return</li>
                <li>Receive a Return Authorization Number (RAN)</li>
                <li>Get specific return instructions</li>
                <li>Confirm refund eligibility</li>
              </ul>

              <h3>Step 2: Package Your Return</h3>
              <p>Ensure your return package includes:</p>
              <ul>
                <li>The product in its original packaging</li>
                <li>Your Return Authorization Number (RAN)</li>
                <li>A brief description of the issue</li>
                <li>Your contact information</li>
              </ul>

              <h3>Step 3: Ship Your Return</h3>
              <p>Ship your return package to our designated return address. We recommend using a trackable shipping method to ensure your return arrives safely.</p>
            </div>

            <div className="refund-section">
              <h2>5. Refund Methods and Timeline</h2>
              <p>Once we receive and inspect your return, we'll process your refund within <strong>5-7 business days</strong>.</p>
              
              <h3>Refund Methods:</h3>
              <ul>
                <li><strong>Original Payment Method:</strong> Refunds will be issued to the same payment method used for the original purchase</li>
                <li><strong>Credit Card:</strong> Refunds typically appear on your statement within 3-5 business days</li>
                <li><strong>Mobile Money:</strong> Refunds are processed within 24-48 hours</li>
                <li><strong>Bank Transfer:</strong> Refunds may take 3-7 business days to appear in your account</li>
              </ul>
            </div>

            <div className="refund-section">
              <h2>6. Shipping Costs</h2>
              <p><strong>Free Returns:</strong> We offer free returns for defective or damaged products, or if we made an error in your order.</p>
              <p><strong>Customer-Paid Returns:</strong> For returns due to change of mind or other customer-initiated reasons, return shipping costs are the responsibility of the customer.</p>
              <p><strong>Restocking Fee:</strong> A 10% restocking fee may apply to returns of non-defective items that are returned in opened condition.</p>
            </div>

            <div className="refund-section">
              <h2>7. Non-Refundable Items</h2>
              <p>For health and safety reasons, the following items are generally not eligible for return or refund:</p>
              <ul>
                <li>Personal care items that have been opened or used</li>
                <li>Custom or personalized products</li>
                <li>Digital products (e-books, courses, consultations)</li>
                <li>Products that have been damaged due to customer misuse</li>
                <li>Items purchased during clearance sales (unless defective)</li>
              </ul>
            </div>

            <div className="refund-section">
              <h2>8. Exchanges</h2>
              <p>We're happy to exchange products for different sizes, flavors, or similar items. Exchanges are subject to:</p>
              <ul>
                <li>Product availability</li>
                <li>Price differences (you'll be charged or refunded the difference)</li>
                <li>Return eligibility requirements</li>
              </ul>
              <p>To request an exchange, please contact our customer service team with your order details and desired replacement.</p>
            </div>

            <div className="refund-section">
              <h2>9. Damaged or Defective Products</h2>
              <p>If you receive a damaged or defective product:</p>
              <ul>
                <li><strong>Document the Issue:</strong> Take photos of the damage or defect</li>
                <li><strong>Contact Us Immediately:</strong> Report the issue within 48 hours of delivery</li>
                <li><strong>Do Not Use:</strong> Stop using the product immediately</li>
                <li><strong>Keep Packaging:</strong> Retain all original packaging and materials</li>
              </ul>
              <p>We'll arrange for a replacement or refund at no additional cost to you.</p>
            </div>

            <div className="refund-section">
              <h2>10. International Returns</h2>
              <p>For international orders, return shipping costs and customs duties are the responsibility of the customer. We recommend contacting us before initiating an international return to discuss the best approach for your situation.</p>
            </div>

            <div className="refund-section">
              <h2>11. Contact Information</h2>
              <p>For questions about returns, refunds, or exchanges, please contact us:</p>
              <div className="contact-info">
                <p><strong>Customer Service Email:</strong> support@gemsofinsight.com</p>
                <p><strong>Returns Email:</strong> returns@gemsofinsight.com</p>
                <p><strong>Phone:</strong> +254 794 491 920</p>
                <p><strong>Address:</strong> Thika Town, Kiambu County, Central Kenya Region</p>
                <p><strong>Business Hours:</strong> Monday - Friday: 8:00 AM - 6:00 PM, Saturday: 9:00 AM - 4:00 PM</p>
              </div>
            </div>

            <div className="refund-section">
              <h2>12. Updates to This Policy</h2>
              <p>We may update this Refund Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new policy on our website and updating the "Last Updated" date.</p>
            </div>

            <div className="mt-6 text-sm text-gray-600">
              <p><strong>Last Updated:</strong> January 2024</p>
              <p>This Refund Policy is effective as of the date listed above and will remain in effect except with respect to any changes in its provisions in the future.</p>
              <p><strong>Thank you for choosing Gems of Insight for your natural health journey!</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyPage;
