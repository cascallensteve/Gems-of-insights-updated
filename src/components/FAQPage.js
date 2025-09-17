import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FAQPage.css';

const FAQPage = () => {
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState(new Set());
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  const handleGoBack = () => {
    navigate(-1);
  };

  const faqs = [
    {
      question: "What are natural remedies and how do they work?",
      answer: "Natural remedies are treatments derived from plants, herbs, and other natural sources that have been used for centuries to promote health and wellness. They work by harnessing the natural healing properties of these substances, often providing gentle, holistic support for various health concerns."
    },
    {
      question: "Are your products safe to use?",
      answer: "Yes, all our products are carefully sourced and tested for quality and safety. However, we always recommend consulting with a healthcare professional before starting any new supplement or remedy, especially if you have existing health conditions or are taking medications."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 3-5 business days within Kenya, and 7-14 days for international orders. Express shipping options are available for faster delivery. You'll receive tracking information once your order ships."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for unused, unopened products in their original packaging. If you're not satisfied with your purchase, please contact our customer support team to initiate a return."
    },
    {
      question: "Do you offer consultations?",
      answer: "Yes! We offer both in-person and virtual consultations with our natural health experts. You can book appointments through our website or contact us directly. Consultations help us provide personalized recommendations based on your specific health needs."
    },
    {
      question: "Are your products organic?",
      answer: "Many of our products are certified organic, and we clearly label all organic products. We also offer conventional options to provide choices for different preferences and budgets. All products meet our high quality standards regardless of certification."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order ships, you'll receive an email with tracking information. You can also log into your account on our website to view order status and tracking details. If you need help tracking your order, our customer support team is happy to assist."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept major credit cards, mobile money (M-Pesa, Airtel Money), bank transfers, and cash on delivery for local orders. All online payments are processed securely through our payment partners."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. Please note that some products may have restrictions in certain countries due to local regulations."
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach our customer support team through multiple channels: phone (+254 794 491 920), email (info@gemsofinsight.com), WhatsApp, or through the contact form on our website. We typically respond within 24 hours."
    }
  ];

  const toggleFAQ = (index) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="faq-page">
      <button className="back-button" onClick={handleGoBack}>
        ← Go Back
      </button>
      
      <div className="faq-container">
        <div className="faq-header">
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to common questions about our natural remedies and services</p>
        </div>

        <div className="faq-section">
          <h2>General Questions</h2>
          {faqs.map((faq, index) => (
            <div key={index} className={`faq-item ${expandedItems.has(index) ? 'expanded' : ''}`}>
              <div className="faq-question" onClick={() => toggleFAQ(index)}>
                {faq.question}
              </div>
              {expandedItems.has(index) && (
                <div className="faq-answer">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="contact-options">
          <h3>Still have questions?</h3>
          <p>Our team is here to help! Contact us for personalized assistance.</p>
          <p>Phone: +254 794 491 920</p>
          <p>Email: info@gemsofinsight.com</p>
          <p>WhatsApp: Available for quick support</p>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
