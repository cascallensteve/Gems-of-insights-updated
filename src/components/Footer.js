import React, { useState } from 'react';
import { newsletterService } from '../services/newsletterService';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { currentUser, updateUser } = useAuth();

  const handleFooterSubscribe = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!email) {
      setError('Please enter your email');
      return;
    }
    try {
      setLoading(true);
      const res = await newsletterService.subscribe(email);
      setMessage(res.message || 'Subscribed successfully!');
      try {
        if (currentUser && currentUser.email && currentUser.email.toLowerCase() === email.toLowerCase()) {
          updateUser({ newsletter: true });
        }
      } catch(_) {}
      setEmail('');
      setTimeout(() => setMessage(''), 6000);
    } catch (err) {
      setError(err.message || 'Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-logo">
              <div className="logo-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="24" cy="24" r="20" fill="#4CAF50" stroke="#2E7D32" strokeWidth="2"/>
                  <path d="M24 8C24 8 16 12 16 20C16 28 24 32 24 32C24 32 32 28 32 20C32 12 24 8 24 8Z" fill="#66BB6A"/>
                  <circle cx="20" cy="18" r="2" fill="#2E7D32"/>
                  <circle cx="28" cy="22" r="1.5" fill="#2E7D32"/>
                  <circle cx="24" cy="26" r="1" fill="#2E7D32"/>
                  <path d="M18 30L30 30" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="footer-company-name">Gems of Insight</h3>
            </div>
            <p className="footer-description">
              Your trusted partner in natural healing and wellness. We provide premium herbal remedies 
              and personalized consultations to help you achieve optimal health naturally.
            </p>
            <div className="footer-certifications">
              <span className="cert-badge">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                </svg>
                Licensed Herbalist
              </span>
              <span className="cert-badge">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                </svg>
                Kenya Medical Board Approved
              </span>
              <span className="cert-badge">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                </svg>
                Organic Certified
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shop">Shop Remedies</Link></li>
              <li><Link to="/consultation">Book Consultation</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/blog">Health Blog</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4 className="footer-title">Our Services</h4>
            <ul className="footer-links">
              <li><Link to="/consultation">Herbal Consultation</Link></li>
              <li><Link to="/consultation">Nutrition Therapy</Link></li>
              <li><Link to="/consultation">Pain Management</Link></li>
              <li><Link to="/consultation">Stress & Anxiety Relief</Link></li>
              <li><Link to="/consultation">Chronic Disease Care</Link></li>
              <li><Link to="/consultation">Wellness Programs</Link></li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div className="footer-section">
            <h4 className="footer-title">Get In Touch</h4>
            <div className="footer-contact">
              <div className="contact-item">
                <span className="contact-icon">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                  </svg>
                </span>
                <div className="contact-details">
                  <strong>Main Clinic</strong>
                  <p>Thika Town, Kiambu County<br/>Central Kenya Region</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122L9.98 10.98a.678.678 0 0 1-.586-.064l-1.318-.835a.678.678 0 0 1-.064-.586L8.56 7.688a.678.678 0 0 0-.122-.58L6.644 4.801a.678.678 0 0 0-1.015-.063L3.654 1.328z"/>
                  </svg>
                </span>
                <div className="contact-details">
                  <strong>Call Us</strong>
                  <p>+254 712 345 678<br/>+254 788 901 234</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                  </svg>
                </span>
                <div className="contact-details">
                  <strong>Email</strong>
                  <p>info@gemsofinsight.com<br/>appointments@gemsofinsight.com</p>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                  </svg>
                </span>
                <div className="contact-details">
                  <strong>Operating Hours</strong>
                  <p>Mon-Fri: 8:00 AM - 6:00 PM<br/>Sat: 9:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
            
            {/* Service Areas */}
            <div className="service-areas">
              <h5 className="service-areas-title">We Serve:</h5>
              <div className="areas-list">
                <span className="area-tag">Thika</span>
                <span className="area-tag">Kiambu</span>
                <span className="area-tag">Nairobi</span>
                <span className="area-tag">Murang'a</span>
                <span className="area-tag">Nyeri</span>
                <span className="area-tag">Nakuru</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Newsletter */}
        <div className="footer-bottom-section">
          <div className="social-newsletter">
            <div className="footer-social">
              <h5>Follow Us</h5>
              <div className="social-links">
                <a href="#facebook" className="social-link facebook" aria-label="Facebook">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#instagram" className="social-link instagram" aria-label="Instagram">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#twitter" className="social-link twitter" aria-label="Twitter">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="#whatsapp" className="social-link whatsapp" aria-label="WhatsApp">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.451 3.488"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="footer-newsletter">
              <h5>Health Tips Newsletter</h5>
              <p>Get weekly natural health tips and exclusive offers</p>
              {message && <div className="footer-newsletter-success">{message}</div>}
              {error && <div className="footer-newsletter-error">{error}</div>}
              <form className="newsletter-form" onSubmit={handleFooterSubscribe}>
                <input 
                  type="email" 
                  placeholder="your.email@example.com" 
                  required 
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                />
                <button type="submit" disabled={loading}>{loading ? 'Subscribing...' : 'Subscribe'}</button>
              </form>
            </div>

            <div className="footer-search">
              <h5>Search Remedies</h5>
              <p>Find herbal solutions for your health needs</p>
              <form className="search-form">
                <div className="search-input-container">
                  <input type="text" placeholder="Search conditions, herbs, or remedies..." className="search-input" />
                  <button type="submit" className="search-button">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                    </svg>
                  </button>
                </div>
                <div className="popular-searches">
                  <span className="search-label">Popular:</span>
                  <Link to="/shop?search=diabetes" className="search-tag">Diabetes</Link>
                  <Link to="/shop?search=stress" className="search-tag">Stress Relief</Link>
                  <Link to="/shop?search=immunity" className="search-tag">Immunity</Link>
                  <Link to="/shop?search=digestion" className="search-tag">Digestion</Link>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Medical Disclaimer */}
        <div className="footer-disclaimer">
          <div className="disclaimer-content">
            <h5 className="disclaimer-title">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="disclaimer-icon">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
              </svg>
              Important Medical Disclaimer
            </h5>
            <div className="disclaimer-text">
              <p>The information provided on this website is for educational and informational purposes only and is not intended as medical advice. It is not a substitute for professional healthcare diagnosis, treatment, or guidance. Always consult with a qualified physician or licensed naturopathic doctor before making changes to your health regimen, especially if you have a medical condition or are taking medications.</p>
              
              <p>Products and services mentioned on this site are not intended to diagnose, treat, cure, or prevent any disease. Individual results may vary. Gems of Insight disclaims any liability for decisions made based on the content of this website.</p>
              
              <p>By using this site, you agree to these terms. If you do not agree, please discontinue use.</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-copyright">
          <div className="copyright-content">
            <p>&copy; 2024 Gems of Insight. All rights reserved.</p>
            <div className="footer-legal">
                          <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
            <Link to="/disclaimer">Medical Disclaimer</Link>
            <Link to="/refund">Refund Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;