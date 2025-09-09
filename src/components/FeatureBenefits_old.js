import React, { useEffect } from 'react';
import './FeatureBenefits.css';
import { useInView } from 'react-intersection-observer';
import { motion, useAnimation } from 'framer-motion';

const FeatureBenefits = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    },
    hidden: {}
  };

  const itemVariants = {
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.6, 
        ease: 'easeOut'
      }
    },
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9
    }
  };

  const features = [
    {
      icon: '🚚',
      title: 'Free Shipping',
      description: 'Free shipping on all orders over KSH 2,000',
      color: '#4CAF50'
    },
    {
      icon: '🌍',
      title: 'Support 24/7',
      description: 'Contact us 24 hours a day, 7 days a week',
      color: '#2196F3'
    },
    {
      icon: '↩️',
      title: '30 Days Return',
      description: 'Simply return it within 30 days for an exchange',
      color: '#FF9800'
    },
    {
      icon: '🔒',
      title: '100% Payment Secure',
      description: 'We ensure secure payment with M-Pesa and cards',
      color: '#9C27B0'
    }
  ];

  return (
    <section className="feature-benefits" ref={ref}>
      <div className="container">
        <motion.div 
          className="features-grid"
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="feature-item"
              variants={itemVariants}
            >
              <div className="feature-icon" style={{ backgroundColor: feature.color + '20', color: feature.color }}>
                <span className="icon-emoji">{feature.icon}</span>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}

          {/* Feature 2 - Support 24/7 */}
          <motion.div 
            className="feature-item"
            initial="hiddenRight"
            animate={controls}
            variants={variants}
            transition={{ delay: 0.2 }}
          >
            <div className="feature-image-container">
              <img 
                src={supportImage} 
                alt="24/7 Support" 
                className="feature-image"
                loading="lazy"
              />
            </div>
            <div className="feature-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2C7.4 2 7 2.4 7 3V5C7 5.6 7.4 6 8 6H16C16.6 6 17 5.6 17 5V3C17 2.4 16.6 2 16 2H8Z" stroke="#4ADE80" strokeWidth="2"/>
                <path d="M9 6V8C9 10.2 10.8 12 13 12H14C16.2 12 18 13.8 18 16V17" stroke="#4ADE80" strokeWidth="2"/>
                <path d="M15 18C15 19.7 13.7 21 12 21C10.3 21 9 19.7 9 18C9 16.3 10.3 15 12 15C13.7 15 15 16.3 15 18Z" stroke="#4ADE80" strokeWidth="2"/>
                <path d="M6 6V8C6 10.2 4.2 12 2 12H1C0.4 12 0 12.4 0 13C0 13.6 0.4 14 1 14H2C4.2 14 6 15.8 6 18V17" stroke="#4ADE80" strokeWidth="2"/>
              </svg>
            </div>
            <h3>Support 24/7</h3>
            <p>Contact us 24 hours a day, 7 days a week</p>
          </motion.div>

          {/* Feature 3 - 07 Days Return */}
          <motion.div 
            className="feature-item"
            initial="hiddenLeft"
            animate={controls}
            variants={variants}
            transition={{ delay: 0.4 }}
          >
            <div className="feature-image-container">
              <img 
                src={returnImage} 
                alt="7 Days Return" 
                className="feature-image"
                loading="lazy"
              />
            </div>
            <div className="feature-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="#4ADE80" strokeWidth="2" strokeDasharray="2 2"/>
                <text x="12" y="16" textAnchor="middle" fontSize="10" fill="#4ADE80" fontWeight="bold">7</text>
                <path d="M16 7L12 11L8 7" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 11V3" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>07 Days Return</h3>
            <p>Simply return it within 30 days for an exchange</p>
          </motion.div>

          {/* Feature 4 - 100% Payment Secure */}
          <motion.div 
            className="feature-item"
            initial="hiddenRight"
            animate={controls}
            variants={variants}
            transition={{ delay: 0.6 }}
          >
            <div className="feature-image-container">
              <img 
                src={paymentImage} 
                alt="Secure Payment" 
                className="feature-image"
                loading="lazy"
              />
            </div>
            <div className="feature-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="7" width="18" height="12" rx="3" stroke="#4ADE80" strokeWidth="2"/>
                <path d="M3 10H21" stroke="#4ADE80" strokeWidth="2"/>
                <rect x="7" y="13" width="4" height="2" rx="1" fill="#4ADE80"/>
                <rect x="13" y="13" width="6" height="2" rx="1" fill="#4ADE80"/>
                <path d="M7 7C7 5.89543 7.89543 5 9 5H15C16.1046 5 17 5.89543 17 7" stroke="#4ADE80" strokeWidth="2"/>
              </svg>
            </div>
            <h3>100% Payment Secure</h3>
            <p>We ensure secure payment with PayPal and card</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeatureBenefits;