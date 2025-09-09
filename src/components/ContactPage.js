import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ContactPage_Clean.css';
import apiService from '../services/api';
import { useNotifications } from '../context/NotificationContext';

const ContactPage = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+2547',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const payload = {
        full_name: formData.name,
        email: formData.email,
        phone_number: formData.phone,
        subject: formData.subject,
        message: formData.message
      };
      const res = await apiService.contact.sendMessage(payload);
      setSubmitMessage(res?.message || 'Thank you for your message! We will get back to you soon.');
      setFormSubmitted(true);
      setShowSuccess(true);
      // Emit real-time admin notification
      addNotification({
        type: 'info',
        title: 'New Inquiry Received',
        message: `${payload.full_name} submitted an inquiry: ${payload.subject}`,
        details: {
          'Email': payload.email,
          'Phone': payload.phone_number,
          'Subject': payload.subject
        },
        temporary: false
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      // Auto-close after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2500);
    } catch (error) {
      setSubmitMessage(error?.detail || error?.message || 'Sorry, there was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    navigate('/');
  };

  const handlePhoneClick = () => {
    window.location.href = 'tel:+254794491920';
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:info@gemsofinsight.com?subject=Inquiry from Gems of Insight Website';
  };

  const handleLocationClick = () => {
    navigate('/location');
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Hello! I would like to get more information about your natural wellness products and services.');
    window.open(`https://wa.me/254794491920?text=${message}`, '_blank');
  };

  return (
    <div className="contact-page">
      {/* Video Hero Section */}
      <div className="contact-hero">
        <div className="hero-video-container">
          {/* Fallback background image */}
          <div className="hero-fallback-bg"></div>
          
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            preload="metadata"
            className="hero-video"
            onError={(e) => {
              console.log('Video failed to load, using fallback background');
              e.target.style.display = 'none';
              const fallback = document.querySelector('.hero-fallback-bg');
              if (fallback) {
                fallback.style.opacity = '1';
              }
            }}
            onLoadStart={() => console.log('Video loading started')}
            onCanPlay={() => console.log('Video can play - hiding fallback')}
            onLoadedData={() => {
              console.log('Video loaded successfully');
              const fallback = document.querySelector('.hero-fallback-bg');
              if (fallback) {
                fallback.style.opacity = '0';
              }
            }}
          >
            <source src="https://res.cloudinary.com/dqvsjtkqw/video/upload/v1755519277/large_5mHOOv9b_gp2ytq.mp4" type="video/mp4" />
          </video>
          <div className="hero-video-overlay"></div>
        </div>
        <div className="contact-hero-content">
          <h1>Get In Touch</h1>
          <p>We're here to help you on your natural wellness journey. Reach out to us with any questions or concerns.</p>
        </div>
      </div>

      {/* Simple Image Showcase Section */}
      <div className="wellness-showcase">
        <div className="showcase-container">
          <div className="showcase-header">
            <h2>Our Natural Wellness Center</h2>
            <p>Experience quality care and natural healing in a peaceful environment</p>
          </div>
          <div className="showcase-grid">
            <div className="showcase-card main-card">
              <img src="https://res.cloudinary.com/dqvsjtkqw/image/upload/v1755512011/acourses_rqbgul.webp" alt="Consultation services" />
              <div className="card-content">
                <h3>Expert Consultations</h3>
                <p>Personalized wellness guidance from experienced practitioners</p>
              </div>
            </div>
            <div className="showcase-card">
              <img src="https://res.cloudinary.com/dqvsjtkqw/image/upload/v1753882302/beautiful-african-female-florist-smiling-cutting-stems-working-flower-shop-white-wall_2_l3ozdi.webp" alt="Herbal preparations" />
              <div className="card-content">
                <h3>Natural Remedies</h3>
                <p>Fresh herbal medicines prepared with care</p>
              </div>
            </div>
            <div className="showcase-card">
              <img src="https://res.cloudinary.com/dqvsjtkqw/image/upload/v1750921889/logs_co58wn.jpg" alt="Pure ingredients" />
              <div className="card-content">
                <h3>Pure Ingredients</h3>
                <p>Sourced from trusted natural suppliers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="contact-container">
        <div className="contact-content">
          {/* Contact Information */}
          <div className="contact-info-section">
            <h2>Contact Information</h2>
            <div className="contact-info-cards">
              <div className="contact-card clickable" onClick={handlePhoneClick}>
                <div className="contact-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Phone</h3>
                <p>+254 794 491920</p>
                <span>Monday - Friday, 8AM - 6PM</span>
                <div className="contact-card-action">📞 Call Now</div>
              </div>

              <div className="contact-card clickable" onClick={handleEmailClick}>
                <div className="contact-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Email</h3>
                <p>info@gemsofinsight.com</p>
                <span>We respond within 24 hours</span>
                <div className="contact-card-action">✉️ Send Email</div>
              </div>

              <div className="contact-card clickable" onClick={handleLocationClick}>
                <div className="contact-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3>Location</h3>
                <p>Nairobi, Kenya</p>
                <span>Visit us for consultation</span>
                <div className="contact-card-action">📍 View Location</div>
              </div>

              <div className="contact-card whatsapp-card clickable" onClick={handleWhatsAppClick}>
                <div className="contact-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" fill="currentColor"/>
                  </svg>
                </div>
                <h3>WhatsApp</h3>
                <p>+254 794 491920</p>
                <span>Quick chat support</span>
                <div className="contact-card-action">💬 Chat Now</div>
              </div>
            </div>
          </div>

          {/* Contact Form or Success */}
          <div className="contact-form-section">
            {!formSubmitted && (
              <>
                <h2>Send us a Message</h2>
                <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+2547XXXXXXXX"
                    pattern="\+2547\d{8}"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Subject *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="consultation">Book Consultation</option>
                    <option value="product">Product Information</option>
                    <option value="order">Order Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us how we can help you..."
                  rows="6"
                  required
                ></textarea>
              </div>

                  {submitMessage && (
                    <div className={`submit-message ${submitMessage.toLowerCase().includes('success') ? 'success' : ''}`}>
                      {submitMessage}
                    </div>
                  )}

                  <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </>
            )}

            {formSubmitted && (
              <div className="success-card" role="status" aria-live="polite">
                <div className="success-icon">✓</div>
                <h3>Message Sent</h3>
                <p>{submitMessage || 'Thanks for reaching out. We will get back to you shortly.'}</p>
                <button className="close-success-btn" onClick={closeSuccess}>Close</button>
              </div>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>How do I book a consultation?</h3>
              <p>You can book a consultation through our appointment system or by calling us directly at +254 794 491920.</p>
            </div>
            <div className="faq-item">
              <h3>What are your business hours?</h3>
              <p>We're open Monday to Friday, 8AM to 6PM EAT. For urgent matters, you can reach us via WhatsApp.</p>
            </div>
            <div className="faq-item">
              <h3>Do you ship products nationwide?</h3>
              <p>Yes, we ship all our natural remedies and wellness products across Kenya with reliable delivery partners.</p>
            </div>
            <div className="faq-item">
              <h3>Are your products certified?</h3>
              <p>All our natural remedies are sourced from certified suppliers and comply with local health regulations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
