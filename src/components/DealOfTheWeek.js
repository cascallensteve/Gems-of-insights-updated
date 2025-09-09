import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LazyLoad from 'react-lazyload';
import './DealOfTheWeek.css';

const DealOfTheWeek = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const weeklyClass = {
    id: 'class-1',
    name: "Natural Remedies Classes",
    price: "KSh 2,500",
    originalPrice: "KSh 4,000",
    image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg",
    description: "Learn herbal medicine and natural healing methods.",
    savings: "38%",
    rating: 4.9,
    reviews: 156,
    features: [
      "Live Sessions",
      "Expert Instructors",
      "Materials Included",
      "Certificate"
    ]
  };

  // Countdown timer logic
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7); // 7 days from now

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = () => {
    if (!currentUser) {
      if (window.confirm('Please login to add items to cart. Would you like to login now?')) {
        navigate('/login');
      }
      return;
    }

    const cartItem = {
      id: weeklyClass.id,
      name: weeklyClass.name,
      price: weeklyClass.price,
      image: weeklyClass.image,
      quantity: 1
    };
    
    addToCart(cartItem);
    alert('Class enrollment added to cart!');
  };

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <motion.section 
      ref={ref}
      className="deal-of-the-week"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="container">
        <motion.div className="section-header" variants={itemVariants}>
          <h2>Natural Remedies Classes</h2>
          <p>Learn natural healing methods</p>
        </motion.div>

        <motion.div className="deal-card" variants={itemVariants}>
          <div className="deal-image">
            <LazyLoad height={400} offset={100} placeholder={<div className="deal-image-placeholder">Loading class image...</div>}>
              <img src={weeklyClass.image} alt={weeklyClass.name} />
            </LazyLoad>
            <div className="savings-badge">
              Save {weeklyClass.savings}
            </div>
          </div>

          <div className="deal-content">
            <div className="deal-header">
              <h3>{weeklyClass.name}</h3>
              <div className="deal-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="star filled">★</span>
                  ))}
                </div>
                <span className="rating-text">({weeklyClass.reviews} reviews)</span>
              </div>
            </div>

            <p className="deal-description">{weeklyClass.description}</p>

            <div className="deal-features">
              {weeklyClass.features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="deal-pricing">
              <span className="current-price">{weeklyClass.price}</span>
              <span className="original-price">{weeklyClass.originalPrice}</span>
            </div>

            <div className="countdown-timer">
              <h4>Offer ends in:</h4>
              <div className="timer-grid">
                <div className="timer-item">
                  <span className="timer-number">{timeLeft.days}</span>
                  <span className="timer-label">Days</span>
                </div>
                <div className="timer-item">
                  <span className="timer-number">{timeLeft.hours}</span>
                  <span className="timer-label">Hours</span>
                </div>
                <div className="timer-item">
                  <span className="timer-number">{timeLeft.minutes}</span>
                  <span className="timer-label">Minutes</span>
                </div>
                <div className="timer-item">
                  <span className="timer-number">{timeLeft.seconds}</span>
                  <span className="timer-label">Seconds</span>
                </div>
              </div>
            </div>

            <button 
              className="deal-btn"
              onClick={handleAddToCart}
            >
              Enroll Now
            </button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default DealOfTheWeek;
