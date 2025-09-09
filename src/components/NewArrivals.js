import React, { useState } from 'react';
import { HiPlus, HiEye } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LazyLoad from 'react-lazyload';
import QuickViewModal from './QuickViewModal';
import './NewArrivals.css';

const NewArrivals = ({ onNavigateToShop, onQuickView, onProductView }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const [cartNotification, setCartNotification] = useState({ show: false, productName: '' });
  const [loginAlert, setLoginAlert] = useState({ show: false, message: '' });
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);

  const products = [
    {
      id: 1,
      name: "Premium Organic Green Tea Collection",
      price: "2,499",
      originalPrice: "3,499",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg",
      category: "Tea Blends",
      subCategory: "Green Tea",
      description: "Hand-picked organic green tea leaves from high-altitude gardens. Rich in antioxidants, promotes metabolism, and supports heart health naturally.",
      benefits: ["Immune Boosting", "Energy Boosting"],
      sale: true,
      rating: 4.8,
      inStock: true
    },
    {
      id: 2,
      name: "Himalayan Herbal Wellness Mix",
      price: "1,850",
      originalPrice: "2,500",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      category: "Herbs & Spices",
      subCategory: "Medicinal Herbs",
      description: "Ancient Himalayan blend of 12 powerful herbs. Boosts immunity, reduces stress, and enhances overall vitality for modern living.",
      benefits: ["Immune Boosting", "Stress and Anxiety"],
      sale: true,
      rating: 4.9,
      inStock: true
    },
    {
      id: 3,
      name: "Pure Turmeric Capsules",
      price: "500",
      originalPrice: "1,200",
      image: "https://res.cloudinary.com/dqvsjtkqw/image/upload/v1753871838/capsules_twqx2t.webp",
      category: "Extracts",
      subCategory: "Capsules",
      description: "Genuine Manuka honey with MGO 400+. Natural antibacterial properties, supports digestive health, and boosts immune system effectively.",
      benefits: ["Blood cleansers", "Immune Boosting"],
      sale: true,
      rating: 4.7,
      inStock: true
    },
    {
      id: 4,
      name: "Complete Wellness Starter Kit",
      price: "4,599",
      originalPrice: "6,500",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg",
      category: "Kits & Bundles",
      subCategory: "Wellness Bundles",
      description: "Everything you need to start your natural wellness journey. Includes superfoods, probiotics, and essential vitamins for optimal health.",
      benefits: ["Immune Boosting", "Energy Boosting"],
      sale: true,
      rating: 4.6,
      inStock: true
    },
    {
      id: 5,
      name: "Organic Turmeric Root Powder",
      price: "1,299",
      originalPrice: "1,799",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg",
      category: "Herbs & Spices",
      subCategory: "Spices",
      description: "Pure turmeric powder with high curcumin content. Natural anti-inflammatory properties, supports joint health and immune system.",
      benefits: ["Immune Boosting", "Energy Boosting"],
      sale: true,
      rating: 4.5,
      inStock: true
    },
    {
      id: 6,
      name: "Moringa Leaf Capsules - 60ct",
      price: "2,150",
      originalPrice: null,
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      category: "Supplements",
      subCategory: "Herbal",
      description: "Nutrient-dense moringa capsules packed with vitamins, minerals, and antioxidants. Boosts energy and supports overall wellness.",
      benefits: ["Immune Boosting", "Energy Boosting"],
      sale: false,
      rating: 4.8,
      inStock: true
    },
    {
      id: 7,
      name: "Cold-Pressed Coconut Oil",
      price: "899",
      originalPrice: "1,299",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753346939/young-woman-with-curly-hair-sitting-cafe_pbym6j.jpg",
      category: "Fats & Oils",
      subCategory: "Coconut Oil",
      description: "Virgin coconut oil extracted using cold-press method. Perfect for cooking, skincare, and hair care routines.",
      benefits: ["Energy Boosting"],
      sale: true,
      rating: 4.6,
      inStock: true
    },
    {
      id: 8,
      name: "Herbal Detox Tea Blend",
      price: "1,650",
      originalPrice: "2,100",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753303006/turmeric-powder_kpfh3p.jpg",
      category: "Tea Blends",
      subCategory: "Herbal Tea",
      description: "Natural detox tea blend with dandelion, milk thistle, and green tea. Supports liver health and natural cleansing.",
      benefits: ["Digestive Disorder", "Immune Boosting"],
      sale: true,
      rating: 4.7,
      inStock: true
    }
  ];

  const handleAddToCart = (product) => {
    if (!currentUser) {
      // Show custom login alert
      setLoginAlert({
        show: true,
        message: 'Please login to add items to cart'
      });
      
      // Auto-hide after 3 seconds
      setTimeout(() => {
        setLoginAlert({ show: false, message: '' });
      }, 3000);
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    };

    addToCart(cartItem);
    
    // Show notification
    setCartNotification({
      show: true,
      productName: product.name
    });

    // Hide notification after 3 seconds
    setTimeout(() => {
      setCartNotification({ show: false, productName: '' });
    }, 3000);
  };

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
    setShowQuickView(true);
  };

  const handleProductView = (product) => {
    if (onProductView) {
      onProductView(product);
    } else {
      // Fallback: navigate to product page
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <section className="new-arrivals">
      <div className="section-header">
        <h2 className="section-title">New Products</h2>
        <p className="section-subtitle">Discover our latest natural wellness products</p>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="new-arrival-product-card">
            {product.sale && <span className="sale-badge">Sale!</span>}
            
            <div className="product-image">
              <LazyLoad height={200} offset={100} placeholder={<div className="image-placeholder">Loading...</div>}>
                <img src={product.image} alt={product.name} />
              </LazyLoad>
              <div className="product-overlay">
                <div className="hover-actions">
                  <button 
                    className="icon-action"
                    title="Add to cart"
                    onClick={() => handleAddToCart(product)}
                  >
                    <HiPlus />
                  </button>
                  <button 
                    className="icon-action"
                    title="Quick view"
                    onClick={() => handleQuickView(product)}
                  >
                    <HiEye />
                  </button>
                </div>
              </div>
            </div>

            <div className="product-details">
              <div className="product-category-badge">{product.category}</div>
              <h3 className="product-name">{product.name}</h3>

              <div className="product-price">
                {product.originalPrice && (
                  <span className="original-price">KSH {product.originalPrice}</span>
                )}
                <span className="current-price">KSH {product.price}</span>
              </div>
              {/* Add to Cart button (visible on mobile too) */}
              <button 
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Shop More Button */}
      <div className="shop-more-section">
        <button 
          className="shop-more-btn"
          onClick={() => onNavigateToShop && onNavigateToShop()}
        >
          Shop More Products
          <span className="arrow">→</span>
        </button>
      </div>

      {/* Cart Notification */}
      {cartNotification.show && (
        <div className="cart-notification">
          <div className="notification-content">
            <span>✅ {cartNotification.productName} added to cart!</span>
          </div>
        </div>
      )}

      {/* Login Alert */}
      {loginAlert.show && (
        <div className="login-alert">
          <div className="alert-content">
            <span className="alert-icon">🔒</span>
            <span className="alert-message">{loginAlert.message}</span>
            <button 
              className="login-now-btn"
              onClick={() => navigate('/login')}
            >
              Login Now
            </button>
            <button 
              className="close-alert-btn"
              onClick={() => setLoginAlert({ show: false, message: '' })}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={showQuickView}
        onClose={() => {
          setShowQuickView(false);
          setQuickViewProduct(null);
        }}
        onViewFullDetails={(product) => {
          setShowQuickView(false);
          setQuickViewProduct(null);
          handleProductView(product);
        }}
      />
    </section>
  );
};

export default NewArrivals;
