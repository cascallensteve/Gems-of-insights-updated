import React from 'react';
import { Link } from 'react-router-dom';
import './NewFooter.css';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaTiktok } from 'react-icons/fa';
import { MdLocalShipping, MdSupportAgent, MdEco } from 'react-icons/md';
import { BsShieldLock, BsTelephone, BsEnvelope } from 'react-icons/bs';


const NewFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="new-footer">
      <div className="footer-container">
        {/* Trust Badges */}
        <div className="trust-badges">
          <div className="badge">
            <MdEco className="badge-icon" />
            <span className="badge-text">100% Organic</span>
          </div>
          <div className="badge">
            <MdLocalShipping className="badge-icon" />
            <span className="badge-text">Free Shipping</span>
          </div>
          <div className="badge">
            <BsShieldLock className="badge-icon" />
            <span className="badge-text">Secure Payment</span>
          </div>
          <div className="badge">
            <MdSupportAgent className="badge-icon" />
            <span className="badge-text">24/7 Support</span>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="footer-logo-container">
              <img 
                src="/images/Gems_of_insight_logo_ghxcbv (1).png" 
                alt="Gems of Insight Logo" 
                className="footer-logo-image"
                style={{ width: '350px', height: 'auto', maxHeight: '300px' }}
              />
            </div>
            <p className="footer-tagline">Your trusted partner in natural wellness and organic living</p>
            <div className="social-links">
              <a 
                href="https://www.facebook.com/share/19mQFYr7oK/" 
                className="social-link facebook" 
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook />
              </a>
              <a 
                href="https://www.instagram.com/gems_of_insight/" 
                className="social-link instagram" 
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
              <a 
                href="https://x.com/gems_ofinsight" 
                className="social-link twitter" 
                aria-label="Twitter/X"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter />
              </a>
              <a 
                href="https://youtube.com/@gemsofinsight_official" 
                className="social-link youtube" 
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube />
              </a>
              <a 
                href="https://tiktok.com/@gems_ofinsight" 
                className="social-link tiktok" 
                aria-label="TikTok"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTiktok />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shop">Shop</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-links">
            <h4>Categories</h4>
            <ul>
              <li><Link to="/shop?category=supplements">Supplements</Link></li>
              <li><Link to="/shop?category=herbs">Herbal Products</Link></li>
              <li><Link to="/shop?category=superfoods">Superfoods</Link></li>
              <li><Link to="/shop?category=wellness">Wellness</Link></li>
              <li><Link to="/shop?category=new-arrivals">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-links">
            <h4>Support</h4>
            <ul>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/shipping">Shipping Info</Link></li>
              <li><Link to="/returns">Returns</Link></li>
              <li><Link to="/track">Track Order</Link></li>
              <li><Link to="/support">Customer Support</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-newsletter">
            <h4>Stay Updated</h4>
            <p>Get health tips and exclusive offers</p>
            <div className="newsletter-signup">
              <input type="email" placeholder="Your email" />
              <button type="submit">Subscribe</button>
            </div>
            <div className="contact-info">
              <div className="contact-item">
                <BsTelephone className="icon" />
                <span>+254 794 491 920</span>
              </div>
              <div className="contact-item">
                <BsEnvelope className="icon" />
                <span>info@gemsofinsight.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer Section */}
        <div className="footer-disclaimer">
          <p>
            <strong>Disclaimer:</strong> The information provided on this website is for educational and informational purposes only and is not intended as medical advice. It is not a substitute for professional healthcare diagnosis, treatment, or guidance. Always consult with a qualified physician or licensed naturopathic doctor before making changes to your health regimen, especially if you have a medical condition or are taking medications.  
            Products and services mentioned on this site are not intended to diagnose, treat, cure, or prevent any disease. Individual results may vary. Gems of Insight disclaims any liability for decisions made based on the content of this website.  
            By using this site, you agree to these terms. If you do not agree, please discontinue use.
          </p>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p>&copy; {currentYear} GemsOfInsight. All rights reserved.</p>
          </div>
          <div className="footer-bottom-right">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/cookies">Cookie Policy</Link>
            <Link to="/refund">Refund Policy</Link>
            <Link to="/disclaimer">Medical Disclaimer</Link>
          </div>
          <div className="powered-by">
            <span>Powered by <strong>Technova</strong></span>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default NewFooter;