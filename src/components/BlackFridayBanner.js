import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './BlackFridayBanner.css';

const BlackFridayBanner = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const bannerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <motion.section 
      ref={ref}
      className="black-friday-banner"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={bannerVariants}
    >
      <div className="container">
        <div className="banner-wrapper">
          <div className="banner-background">
            <img 
              src="https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg" 
              alt="Organic Vegetables"
            />
            <div className="banner-overlay"></div>
          </div>
          
          <div className="banner-content">
            <motion.div 
              className="sale-tag"
              initial={{ opacity: 0, y: -20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Black Friday
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Sale 50% Off All Vegetable Products
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              Don't miss this incredible opportunity to stock up on fresh, organic vegetables at unbeatable prices
            </motion.p>
            
            <motion.button 
              className="discover-btn"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { window.location.href = '/shop'; }}
            >
              Discover Now
            </motion.button>
          </div>
          
          <div className="floating-elements">
            <motion.div 
              className="floating-leaf leaf-1"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🍃
            </motion.div>
            <motion.div 
              className="floating-leaf leaf-2"
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            >
              🥬
            </motion.div>
            <motion.div 
              className="floating-leaf leaf-3"
              animate={{ 
                y: [0, -8, 0],
                rotate: [0, 3, 0]
              }}
              transition={{ 
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            >
              🥕
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default BlackFridayBanner;
