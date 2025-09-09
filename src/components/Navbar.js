import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoadingDots from './LoadingDots';
import './Navbar.css';
import { useNavigate, useLocation } from 'react-router-dom';
import AddToCartButton from './AddToCartButton';
import apiService from '../services/api';

const Navbar = ({ openAppointmentModal, openCart }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartCount, getCartTotal, addToCart } = useCart();
  const { currentUser, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const [expandedCategories, setExpandedCategories] = useState([]);
  const [mobileQuickItems, setMobileQuickItems] = useState([]);
  const [loadingQuick, setLoadingQuick] = useState(false);
  const [quickLoaded, setQuickLoaded] = useState(false);
  
  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  const isActive = (path) => location.pathname === path;

  // Shop categories for mobile dropdown
  const shopCategories = [
    { 
      title: "Herbs & Spices", 
      path: "/shop?category=herbs-spices"
    },
    { 
      title: "Extracts", 
      path: "/shop?category=extracts",
      subcategories: [
        { title: "Tinctures", path: "/shop?category=extracts&subcategory=tinctures" },
        { title: "Essential Oils", path: "/shop?category=extracts&subcategory=essential-oils" },
        { title: "Capsules", path: "/shop?category=extracts&subcategory=capsules" },
        { title: "Powder", path: "/shop?category=extracts&subcategory=powder" }
      ]
    },
    { 
      title: "Supplements", 
      path: "/shop?category=supplements",
      subcategories: [
        { title: "Vitamins", path: "/shop?category=supplements&subcategory=vitamins" },
        { title: "Minerals", path: "/shop?category=supplements&subcategory=minerals" },
        { title: "Herbal", path: "/shop?category=supplements&subcategory=herbal" },
        { title: "Probiotics", path: "/shop?category=supplements&subcategory=probiotics" },
        { title: "Amino Acids", path: "/shop?category=supplements&subcategory=amino-acids" },
        { title: "Enzymes", path: "/shop?category=supplements&subcategory=enzymes" }
      ]
    },
    { 
      title: "Tea Blends", 
      path: "/shop?category=tea-blends"
    },
    { 
      title: "Nuts & Seeds", 
      path: "/shop?category=nuts-seeds"
    },
    { 
      title: "Fats & Oils", 
      path: "/shop?category=fats-oils"
    },
    { 
      title: "Shop by Benefits", 
      path: "/shop?category=by-benefits",
      subcategories: [
        { title: "Immune Boosting", path: "/shop?category=by-benefits&subcategory=immune-boosting" },
        { title: "Digestive Disorder", path: "/shop?category=by-benefits&subcategory=digestive-disorder" },
        { title: "Blood Cleansers", path: "/shop?category=by-benefits&subcategory=blood-cleansers" },
        { title: "Stress and Anxiety", path: "/shop?category=by-benefits&subcategory=stress-anxiety" },
        { title: "Energy Boosting", path: "/shop?category=by-benefits&subcategory=energy-boosting" }
      ]
    },
    { 
      title: "Kits & Bundles", 
      path: "/shop?category=kits-bundles",
      subcategories: [
        { title: "Wellness Bundles", path: "/shop?category=kits-bundles&subcategory=wellness-bundles" },
        { title: "Recipe Packs", path: "/shop?category=kits-bundles&subcategory=recipe-packs" },
        { title: "Seasonal/Holiday Gift Sets", path: "/shop?category=kits-bundles&subcategory=gift-sets" },
        { title: "Starter Kits", path: "/shop?category=kits-bundles&subcategory=starter-kits" }
      ]
    },
    { 
      title: "Bath and Body", 
      path: "/shop?category=bath-body"
    },
    { 
      title: "Books and Education", 
      path: "/shop?category=books-education"
    }
  ];

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    
    if (newState) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
  };

  const handleNavClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setExpandedCategories([]);
    document.body.classList.remove('mobile-menu-open');
  };



  const toggleCategory = (categoryTitle) => {
    setExpandedCategories(prev => 
      prev.includes(categoryTitle) 
        ? prev.filter(cat => cat !== categoryTitle)
        : [...prev, categoryTitle]
    );
  };

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    document.body.classList.remove('mobile-menu-open');
    navigate('/logout');
  };

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
    if (menu === 'shop-mobile' && !quickLoaded) {
      // Lazy-load quick items for mobile shop menu
      (async () => {
        try {
          setLoadingQuick(true);
          const all = await apiService.store.getAllItems();
          const items = Array.isArray(all) ? all : (all.items || []);
          setMobileQuickItems(items);
          setQuickLoaded(true);
        } catch (_e) {
          setMobileQuickItems([]);
        } finally {
          setLoadingQuick(false);
        }
      })();
    }
  };

  const handleOpenAppointment = () => {
    // revert to original open behavior only
    if (openAppointmentModal) openAppointmentModal();
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close shop dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (activeDropdown && !e.target.closest('.dropdown-parent')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeDropdown]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, []);

  return (
    <>
      {/* Top Header Section */}
      <div className="top-header">
        <div className="header-container">
          {/* Contact Info */}
          <div className="contact-info">
            <span className="contact-item">📞 +254 712 345 678</span>
          </div>

          {/* Social Media Icons */}
          <div className="social-media">
            <a href="#facebook" className="social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#instagram" className="social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zM12 16c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="#whatsapp" className="social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.150-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.040 1.016-1.040 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .160 5.335 .157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488z"/>
              </svg>
            </a>
            <a href="#twitter" className="social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          {/* Logo (desktop only) */}
          <div className="navbar-logo desktop-only" onClick={() => handleNavClick('/')}>
            <img 
              src="/images/LOGOGEMS.png"
              alt="Gems of Insight Logo" 
              className="logo-image"
            />
          </div>

          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>

          {/* Removed duplicate mobile navigation links to avoid double rendering on mobile */}

          {/* Desktop Navigation Links */}
          <ul className={`navbar-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            {/* Mobile: Shop with categories */}
            {isMobileMenuOpen && (
              <li className="navbar-item mobile-only">
                <div className="mobile-shop">
                  <button 
                    className={`navbar-link ${activeDropdown === 'shop-mobile' ? 'active' : ''}`}
                    onClick={() => toggleDropdown('shop-mobile')}
                  >
                    Shop
                  </button>
                  {activeDropdown === 'shop-mobile' && (
                    <div className="mobile-shop-categories">
                      {shopCategories.map(cat => (
                        <div key={cat.title} className="mobile-category">
                          <button 
                            className="mobile-category-title"
                            onClick={() => cat.subcategories ? toggleCategory(cat.title) : handleNavClick(cat.path)}
                          >
                            {cat.title}
                            {cat.subcategories && (
                              <span className={`caret ${expandedCategories.includes(cat.title) ? 'open' : ''}`}>▾</span>
                            )}
                          </button>
                          {cat.subcategories && expandedCategories.includes(cat.title) && (
                            <div className="mobile-subcategories">
                              {cat.subcategories.map(sub => (
                                <button key={sub.title} className="mobile-subcategory" onClick={() => handleNavClick(sub.path)}>
                                  {sub.title}
                                </button>
                              ))}
                            </div>
                          )}
                          {/* Quick Picks with Add to Cart */}
                          {quickLoaded && (
                            <div className="mobile-quick-picks" style={{ display:'grid', gap:8, marginTop:8 }}>
                              {(() => {
                                const title = (cat.title || '').toLowerCase();
                                const picks = (mobileQuickItems || []).filter(it => {
                                  const name = (it.name || it.title || '').toLowerCase();
                                  const category = (it.category || it.type || '').toLowerCase();
                                  return name.includes(title) || category.includes(title);
                                }).slice(0, 2);
                                const list = picks.length > 0 ? picks : (mobileQuickItems || []).slice(0, 2);
                                return list.map(item => (
                                  <div key={item.id || item._id || item.slug || item.name} className="quick-pick" style={{ display:'flex', alignItems:'center', gap:8 }}>
                                    <img src={item.image || item.photo || '/images/default-product.jpg'} alt={item.name || item.title || 'Item'} style={{ width:40, height:40, objectFit:'cover', borderRadius:6, border:'1px solid #e5e7eb' }} onClick={() => handleNavClick('/shop')} />
                                    <div style={{ display:'flex', flexDirection:'column', flex:1 }}>
                                      <button className="quick-pick-name" onClick={() => handleNavClick('/shop')} style={{ textAlign:'left' }}>
                                        {(item.name || item.title || 'Product')}
                                      </button>
                                      <span style={{ fontSize:12, opacity:0.8 }}>KSH {Number(item.price || item.unit_price || item.amount || 0).toLocaleString()}</span>
                                    </div>
                                    <AddToCartButton product={{
                                      id: item.id || item._id,
                                      name: item.name || item.title,
                                      price: item.price || item.unit_price || item.amount || 0,
                                      image: item.image || item.photo || ''
                                    }} className="quick-add-btn" />
                                  </div>
                                ));
                              })()}
                            </div>
                          )}
                          {loadingQuick && (
                            <div style={{ padding:'6px 0', fontSize:12, opacity:0.7 }}>Loading...</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            )}
            <li className="navbar-item">
              <button 
                className={`navbar-link ${isActive('/') ? 'active' : ''}`}
                onClick={() => handleNavClick('/')}
              >
                Home
              </button>
            </li>
            
            {/* Shop */}
            <li className="navbar-item">
              {/* Desktop: Navigate directly to shop page */}
              <button 
                className={`navbar-link desktop-only ${isActive('/shop') ? 'active' : ''}`}
                onClick={() => handleNavClick('/shop')}
              >
                Shop
              </button>
            </li>
            
            <li className="navbar-item">
              <button 
                className={`navbar-link ${isActive('/about') ? 'active' : ''}`}
                onClick={() => handleNavClick('/about')}
              >
                About
              </button>
            </li>
            
            <li className="navbar-item">
              <button 
                className={`navbar-link ${isActive('/courses') ? 'active' : ''}`}
                onClick={() => handleNavClick('/courses')}
              >
                Courses
              </button>
            </li>
            
            <li className="navbar-item">
              <button 
                className={`navbar-link ${isActive('/blog') ? 'active' : ''}`}
                onClick={() => handleNavClick('/blog')}
              >
                Blog
              </button>
            </li>
            
            <li className="navbar-item">
              <button 
                className={`navbar-link ${isActive('/contact') ? 'active' : ''}`}
                onClick={() => handleNavClick('/contact')}
              >
                Contact
              </button>
            </li>

            {/* Desktop Appointment & Cart - Now in main navbar */}
            <li className="navbar-item desktop-only">
              <button 
                className="navbar-link appointment-link-desktop" 
                onClick={handleOpenAppointment} 
                title="Book appointment"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Appointment</span>
              </button>
            </li>

            <li className="navbar-item desktop-only">
              <div className="cart-section" onClick={openCart}>
                <div className="cart-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M9 19.5C9.8 19.5 10.5 20.2 10.5 21S9.8 22.5 9 22.5 7.5 21.8 7.5 21 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21S20.8 22.5 20 22.5 18.5 21.8 18.5 21 19.2 19.5 20 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                </div>
                <div className="cart-info">
                  <span className="cart-count-text">[ {cartCount} ]</span>
                  <span className="cart-total">KSH {cartTotal.toLocaleString()}</span>
                </div>
              </div>
            </li>
            
            {/* Mobile-only items */}
            {isLoading ? (
              <li className="navbar-item mobile-only">
                <LoadingDots text="Loading" size="small" />
              </li>
            ) : currentUser ? (
              <>
                {/* Mobile user greeting removed */}
                <li className="navbar-item mobile-only">
                  <button className="navbar-link user-link" onClick={() => handleNavClick('/profile')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 8 }}>
                      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    My Profile
                  </button>
                </li>
                <li className="navbar-item mobile-only">
                  <button className="navbar-link user-link" onClick={() => handleNavClick('/orders')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 8 }}>
                      <path d="M16 11V7C16 5.93913 15.5786 4.92172 14.8284 4.17157C14.0783 3.42143 13.0609 3 12 3C10.9391 3 9.92172 3.42143 9.17157 4.17157C8.42143 4.92172 8 5.93913 8 7V11M5 9H19L18 21H6L5 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    My Orders
                  </button>
                </li>
                {(currentUser?.role === 'admin' || currentUser?.userType === 'admin') && (
                  <li className="navbar-item mobile-only">
                    <a 
                      href="/admin" 
                      className="navbar-link admin-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 8 }}>
                        <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Admin Panel
                    </a>
                  </li>
                )}
                <li className="navbar-item mobile-only">
                  <button className="navbar-link logout-link" onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 8 }}>
                      <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Logout
                  </button>
                </li>
                <li className="navbar-item mobile-only">
                  <button className="navbar-link appointment-link-mobile" onClick={() => {
                    handleOpenAppointment();
                    setIsMobileMenuOpen(false);
                  }}>
                    📅 Book Appointment
                  </button>
                </li>
              </>
            ) : (
              <li className="navbar-item mobile-only">
                <button className="navbar-link login-link" onClick={() => handleNavClick('/login')}>
                  🔑 Login
                </button>
              </li>
            )}
          </ul>

          {/* Right Section - Desktop Only */}
          <div className="navbar-right desktop-only">
            {isLoading ? (
              <div className="login-section">
                <LoadingDots text="Loading" size="small" />
              </div>
            ) : currentUser ? (
              <div className="user-section">
                <div className="user-avatar">
                  <span>{currentUser.firstName?.charAt(0) || currentUser.name?.charAt(0) || 'U'}</span>
                </div>
                <span className="user-name">Hi, {currentUser.firstName || currentUser.first_name || 'User'}</span>
                <div className="user-dropdown" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => handleNavClick('/profile')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Profile
                  </button>
                  <button onClick={() => handleNavClick('/orders')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 11V7C16 5.93913 15.5786 4.92172 14.8284 4.17157C14.0783 3.42143 13.0609 3 12 3C10.9391 3 9.92172 3.42143 9.17157 4.17157C8.42143 4.92172 8 5.93913 8 7V11M5 9H19L18 21H6L5 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    My Orders
                  </button>
                  {(currentUser?.role === 'admin' || currentUser?.userType === 'admin') && (
                    <a 
                      href="/admin" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-dropdown-link"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Admin Panel
                    </a>
                  )}
                  <button onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="login-section" onClick={() => handleNavClick('/login')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="login-text">Login</span>
              </div>
            )}
          </div>

          {/* Mobile Right Section - Profile, Cart, Logo (logo furthest right) */}
          <div className="mobile-right-section">
            {/* Mobile Profile Section */}
            {/* Removed mobile profile/login greeting near cart as requested */}

            {/* Mobile Cart - Always Visible */}
            <div className="mobile-cart">
              <div className="cart-section" onClick={openCart}>
                <div className="cart-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M9 19.5C9.8 19.5 10.5 20.2 10.5 21S9.8 22.5 9 22.5 7.5 21.8 7.5 21 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21S20.8 22.5 20 22.5 18.5 21.8 18.5 21 19.2 19.5 20 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                </div>
              </div>
            </div>

            {/* Mobile Logo - furthest right */}
            <div className="mobile-logo" onClick={() => handleNavClick('/')}> 
              <img 
                src="/images/LOGOGEMS.png"
                alt="Gems of Insight Logo" 
                className="logo-image"
                style={{ height: 36, width: 36, objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;