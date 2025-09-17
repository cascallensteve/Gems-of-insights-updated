import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './PromotionalBanners.css';

const PromotionalBanners = () => {
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
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

  return (
    <motion.section 
      ref={ref}
      className="promotional-banners"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="container">
        <div className="banners-grid">
          {/* Salad Banner */}
          <motion.div className="promo-banner salad-banner" variants={itemVariants}>
            <div className="banner-content">
              <div className="discount-badge">50% OFF</div>
              <h3>Enjoy Your Favorite Salad</h3>
              <p>Fresh, organic greens and vegetables delivered to your door</p>
              <button className="view-products-btn" onClick={() => navigate('/shop?category=herbs-spices')}>View Products</button>
            </div>
            <div className="banner-image">
              <img 
                src="https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg" 
                alt="Fresh Salad"
              />
            </div>
          </motion.div>

          {/* Drinks Banner */}
          <motion.div className="promo-banner drinks-banner" variants={itemVariants}>
            <div className="banner-content">
              <div className="discount-badge">50% OFF</div>
              <h3>Create Fresh Drinks</h3>
              <p>Natural juices and smoothie ingredients for healthy living</p>
              <button className="view-products-btn" onClick={() => navigate('/shop?category=tea-blends')}>View Products</button>
            </div>
            <div className="banner-image">
              <img 
                src="https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg" 
                alt="Fresh Drinks"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default PromotionalBanners;
