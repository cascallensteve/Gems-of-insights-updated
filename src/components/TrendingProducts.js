import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './TrendingProducts.css';

const TrendingProducts = () => {
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
      id: 'tp1',
      name: "Organic Ginger Root",
      price: "KSh 450",
      originalPrice: "KSh 650",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg",
      category: "Fresh Herbs",
      badge: "New",
      trending: true
    },
    {
      id: 'tp2',
      name: "Moringa Leaf Powder",
      price: "KSh 1,200",
      originalPrice: null,
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      category: "Superfoods",
      badge: "Hot",
      trending: true
    },
    {
      id: 'tp3',
      name: "Chia Seeds Premium",
      price: "KSh 890",
      originalPrice: "KSh 1,100",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753303006/turmeric-powder_kpfh3p.jpg",
      category: "Seeds & Nuts",
      badge: "Sale",
      trending: true
    },
    {
      id: 'tp4',
      name: "Raw Cacao Nibs",
      price: "KSh 1,750",
      originalPrice: "KSh 2,200",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg",
      category: "Superfoods",
      badge: "Popular",
      trending: true
    },
    {
      id: 'tp5',
      name: "Organic Ashwagandha",
      price: "KSh 2,100",
      originalPrice: null,
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753346939/young-woman-with-curly-hair-sitting-cafe_pbym6j.jpg",
      category: "Adaptogens",
      badge: "Premium",
      trending: true
    },
    {
      id: 'tp6',
      name: "Green Tea Extract",
      price: "KSh 1,650",
      originalPrice: "KSh 1,950",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg",
      category: "Tea & Extracts",
      badge: "Trending",
      trending: true
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
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
    setCartNotification({ show: true, productName: product.name });
    setTimeout(() => {
      setCartNotification({ show: false, productName: '' });
    }, 3000);
  };

  return (
    <motion.section 
      ref={ref}
      className="trending-products"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="container">
        <motion.div className="section-header" variants={itemVariants}>
          <h2>Recently Added to Our Store</h2>
          <p>Trending products that our customers are loving</p>
        </motion.div>

        <motion.div className="products-grid" variants={containerVariants}>
          {products.map((product) => (
            <motion.div 
              key={product.id} 
              className="product-card"
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                <div className={`product-badge ${product.badge.toLowerCase()}`}>
                  {product.badge}
                </div>
                {product.trending && (
                  <div className="trending-indicator">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>

              <div className="product-info">
                <div className="product-category">{product.category}</div>
                <h3 className="product-name">{product.name}</h3>
                
                <div className="product-pricing">
                  <span className="current-price">{product.price}</span>
                  {product.originalPrice && (
                    <span className="original-price">{product.originalPrice}</span>
                  )}
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
        </motion.div>
      </div>

      {/* Cart Notification */}
      {cartNotification.show && (
        <div className="cart-notification">
          <div className="notification-content">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{cartNotification.productName} added to cart!</span>
            <button onClick={() => navigate('/cart')}>View Cart</button>
          </div>
        </div>
      )}
    </motion.section>
  );
};

export default TrendingProducts;
