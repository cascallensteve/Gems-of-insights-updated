import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomerSupportPage.css';

const CustomerSupportPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('contact');
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  const handleGoBack = () => {
    navigate(-1);
  };

  const supportTopics = [
    {
      category: "Order & Shipping",
      topics: [
        "Order status and tracking",
        "Shipping options and costs",
        "Delivery issues",
        "International shipping"
      ],
      icon: "📦"
    },
    {
      category: "Products & Quality",
      topics: [
        "Product information",
        "Quality concerns",
        "Product recommendations",
        "Ingredient questions"
      ],
      icon: "🌿"
    },
    {
      category: "Returns & Refunds",
      topics: [
        "Return policy",
        "Refund process",
        "Damaged items",
        "Wrong items received"
      ],
      icon: "🔄"
    },
    {
      category: "Account & Billing",
      topics: [
        "Account management",
        "Payment issues",
        "Billing questions",
        "Password reset"
      ],
      icon: "👤"
    },
    {
      category: "Technical Support",
      topics: [
        "Website issues",
        "Mobile app problems",
        "Login difficulties",
        "Payment processing"
      ],
      icon: "💻"
    }
  ];

  const contactMethods = [
    {
      method: "Phone Support",
      details: "+254 794 491 920",
      description: "Speak directly with our support team",
      availability: "Mon-Fri: 8AM-6PM EAT",
      icon: "📞"
    },
    {
      method: "WhatsApp Support",
      details: "+254 794 491 920",
      description: "Quick responses via WhatsApp",
      availability: "24/7",
      icon: "💬"
    },
    {
      method: "Email Support",
      details: "support@gemsofinsight.com",
      description: "Detailed inquiries and documentation",
      availability: "Response within 24 hours",
      icon: "✉️"
    },
    {
      method: "Live Chat",
      details: "Available on website",
      description: "Real-time chat support",
      availability: "Mon-Fri: 9AM-5PM EAT",
      icon: "💻"
    }
  ];

  const faqItems = [
    {
      question: "How can I track my order?",
      answer: "You can track your order by entering your order number and email on our Track Order page, or by logging into your account and viewing your order history."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for unused, unopened products in their original packaging. Returns are free and we provide prepaid shipping labels."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship to most countries worldwide. International shipping takes 7-14 business days and costs start from KSh 2,500."
    },
    {
      question: "Are your products organic?",
      answer: "Many of our products are certified organic, and we clearly label all organic products. All products meet our high quality standards regardless of certification."
    },
    {
      question: "How can I contact customer support?",
      answer: "You can reach us by phone at +254 794 491 920, WhatsApp at the same number, email at support@gemsofinsight.com, or through live chat on our website."
    }
  ];

  return (
    <div className="customer-support-page">
      <button className="back-button" onClick={handleGoBack}>
        ← Go Back
      </button>
      
      <div className="support-container">
        <div className="support-header">
          <h1>Customer Support</h1>
          <p>We're here to help with any questions or concerns</p>
        </div>

        <div className="support-section">
          <h2>Support Options</h2>
          <div className="tab-navigation">
            <button 
              className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveTab('contact')}
            >
              Contact Us
            </button>
            <button 
              className={`tab-button ${activeTab === 'topics' ? 'active' : ''}`}
              onClick={() => setActiveTab('topics')}
            >
              Support Topics
            </button>
            <button 
              className={`tab-button ${activeTab === 'faq' ? 'active' : ''}`}
              onClick={() => setActiveTab('faq')}
            >
              FAQ
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'contact' && (
              <div className="tab-panel">
                <h3>📞 Get in Touch</h3>
                <p>Choose the best way to reach our support team:</p>
                
                <div className="contact-methods">
                  {contactMethods.map((method, index) => (
                    <div key={index} className="contact-method">
                      <h4>{method.method}</h4>
                      <p>{method.details}</p>
                      <p>{method.description}</p>
                      <a href="#">Contact via {method.method}</a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'topics' && (
              <div className="tab-panel">
                <h3>🎯 Support Topics</h3>
                <p>Find help for common issues and questions:</p>
                
                <div className="support-topics">
                  {supportTopics.map((category, index) => (
                    <div key={index} className="topic-item">
                      <h4>{category.category}</h4>
                      <p>Common questions about {category.category.toLowerCase()}:</p>
                      <ul>
                        {category.topics.map((topic, topicIndex) => (
                          <li key={topicIndex}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="tab-panel">
                <h3>❓ Frequently Asked Questions</h3>
                <p>Quick answers to common questions:</p>
                
                {faqItems.map((item, index) => (
                  <div key={index} className="topic-item">
                    <h4>{item.question}</h4>
                    <p>{item.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="contact-info">
          <h3>Need Immediate Help?</h3>
          <p>For urgent matters, call us directly at +254 794 491 920</p>
          <p>Our support team is available Monday-Friday, 8AM-6PM EAT</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupportPage;
