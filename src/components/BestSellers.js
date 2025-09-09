import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LazyLoad from 'react-lazyload';
import './BestSellers.css';

const BestSellers = ({ onQuickView, onProductView }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const [cartNotification, setCartNotification] = useState({ show: false, productName: '' });

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const products = [
    {
      id: 'bs1',
      name: "Organic Turmeric Powder",
      price: "1,299",
      originalPrice: "1,799",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753303006/turmeric-powder_kpfh3p.jpg",
      category: "Herbs & Spices",
      subCategory: "Spices",
      description: "Pure organic turmeric powder with high curcumin content. Natural anti-inflammatory properties, supports joint health and immune system.",
      benefits: ["Immune Boosting", "Energy Boosting"],
      sale: true,
      rating: 4.8,
      reviews: 124,
      inStock: true
    },
    {
      id: 'bs2',
      name: "Raw Manuka Honey",
      price: "3,200",
      originalPrice: "4,200",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753346939/young-woman-with-curly-hair-sitting-cafe_pbym6j.jpg",
      category: "Natural Sweeteners",
      subCategory: "Honey",
      description: "Genuine Manuka honey with MGO 400+. Natural antibacterial properties, supports digestive health, and boosts immune system effectively.",
      benefits: ["Immune Boosting", "Digestive Disorder"],
      sale: true,
      rating: 4.9,
      reviews: 89,
      inStock: true
    },
    {
      id: 'bs3',
      name: "Himalayan Pink Salt",
      price: "850",
      originalPrice: "1,200",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      category: "Herbs & Spices",
      subCategory: "Salts",
      description: "Pure Himalayan pink salt rich in minerals. Natural electrolyte balance, supports hydration and overall wellness.",
      benefits: ["Energy Boosting"],
      sale: true,
      rating: 4.7,
      reviews: 156,
      inStock: true
    },
    {
      id: 'bs4',
      name: "Organic Coconut Oil",
      price: "1,450",
      originalPrice: "1,899",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg",
      category: "Fats & Oils",
      subCategory: "Coconut Oil",
      description: "Virgin coconut oil extracted using cold-press method. Perfect for cooking, skincare, and hair care routines.",
      benefits: ["Energy Boosting"],
      sale: true,
      rating: 4.6,
      reviews: 203,
      inStock: true
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const handleAddToCart = (product) => {
    if (!currentUser) {
      if (window.confirm('Please login to add items to cart. Would you like to login now?')) {
        navigate('/login');
      }
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
    if (onQuickView) {
      onQuickView(product);
    } else {
      // Fallback: navigate to product page
      navigate(`/product/${product.id}`);
    }
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
    <motion.section 
      ref={ref}
      className="best-sellers"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="section-header">
        <h2 className="section-title">Best Sellers</h2>
        <p className="section-subtitle">Our most popular natural wellness products</p>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <motion.div 
            key={product.id} 
            className="best-seller-product-card"
            variants={itemVariants}
          >
            {product.sale && <span className="sale-badge">Sale!</span>}
            
            <div className="product-image">
              <LazyLoad height={200} offset={100} placeholder={<div className="image-placeholder">Loading...</div>}>
                <img src={product.image} alt={product.name} />
              </LazyLoad>
              <div className="product-overlay">
                <button 
                  className="quick-view-btn"
                  onClick={() => handleQuickView(product)}
                >
                  Quick View
                </button>
                <button 
                  className="full-view-btn"
                  onClick={() => handleProductView(product)}
                >
                  Full Details
                </button>
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

              <button 
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cart Notification */}
      {cartNotification.show && (
        <div className="cart-notification">
          <div className="notification-content">
            <span>✅ {cartNotification.productName} added to cart!</span>
          </div>
        </div>
      )}
    </motion.section>
  );
};

export default BestSellers;
