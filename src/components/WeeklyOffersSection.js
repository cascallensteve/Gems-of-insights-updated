import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './WeeklyOffersSection.css';

const WeeklyOffersSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 6,
    hours: 23,
    minutes: 46,
    seconds: 14
  });

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        let { days, hours, minutes, seconds } = prevTime;
        
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              hours = 23;
              days--;
              if (days < 0) {
                days = 0;
                hours = 0;
                minutes = 0;
                seconds = 0;
              }
            }
          }
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const weeklyOffers = [
    {
      id: 1,
      title: "Natural Remedies Classes",
      subtitle: "Holistic Healing",
      description: "Learn herbal medicine and natural healing methods.",
      rating: 4.8,
      reviewCount: 156,
      currentPrice: 2500,
      originalPrice: 4000,
      features: [
        "Live Sessions",
        "Expert Instructors", 
        "Materials Included",
        "Certificate"
      ],
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753346939/young-woman-with-curly-hair-sitting-cafe_pbym6j.jpg",
      badge: "LIMITED TIME",
      spots: "Limited Spots!"
    },
    {
      id: 2,
      title: "Herbal Medicine Masterclass",
      subtitle: "Advanced Plant-Based Healing",
      description: "Dive deep into the world of medicinal plants and herbs. Learn identification, preparation methods, and therapeutic applications.",
      rating: 4.9,
      reviewCount: 89,
      currentPrice: 3000,
      originalPrice: 5500,
      features: [
        "Hands-on Workshops",
        "Plant Identification Guide",
        "Recipe Collection",
        "1-on-1 Mentoring"
      ],
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753303006/turmeric-powder_kpfh3p.jpg",
      badge: "BESTSELLER",
      spots: "Only 8 spots left!"
    },
    {
      id: 3,
      title: "Essential Oils Certification",
      subtitle: "Aromatherapy & Wellness",
      description: "Master the art of essential oils for healing, relaxation, and wellness. Get certified as an aromatherapy practitioner.",
      rating: 4.7,
      reviewCount: 124,
      currentPrice: 2800,
      originalPrice: 4200,
      features: [
        "Professional Certification",
        "Essential Oil Kit Included",
        "Business Setup Guide",
        "Lifetime Support"
      ],
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg",
      badge: "NEW",
      spots: "Early bird pricing!"
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const getSavingsPercentage = (current, original) => {
    return Math.round(((original - current) / original) * 100);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star full">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }
    
    return stars;
  };

  return (
    <motion.section 
      ref={ref}
      className="weekly-offers-section"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="container">
        <motion.div className="section-header" variants={itemVariants}>
          <h2>🔥 Weekly Special Offers</h2>
          <p>Transform your wellness journey with our limited-time course deals</p>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div className="countdown-banner" variants={itemVariants}>
          <div className="countdown-content">
            <h3>⏰ Offer ends in:</h3>
            <div className="countdown-timer">
              <div className="time-unit">
                <span className="number">{timeLeft.days.toString().padStart(2, '0')}</span>
                <span className="label">Days</span>
              </div>
              <div className="separator">:</div>
              <div className="time-unit">
                <span className="number">{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span className="label">Hours</span>
              </div>
              <div className="separator">:</div>
              <div className="time-unit">
                <span className="number">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                <span className="label">Minutes</span>
              </div>
              <div className="separator">:</div>
              <div className="time-unit">
                <span className="number">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                <span className="label">Seconds</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Offers Grid */}
        <motion.div className="offers-grid" variants={containerVariants}>
          {weeklyOffers.map((offer, index) => (
            <motion.div 
              key={offer.id} 
              className={`offer-card ${index === 0 ? 'featured' : ''}`}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="offer-image">
                <img src={offer.image} alt={offer.title} />
                <div className="offer-badge">{offer.badge}</div>
                <div className="savings-badge">
                  Save {getSavingsPercentage(offer.currentPrice, offer.originalPrice)}%
                </div>
              </div>

              <div className="offer-content">
                <div className="offer-header">
                  <h3 className="offer-title">{offer.title}</h3>
                  <p className="offer-subtitle">{offer.subtitle}</p>
                  
                  <div className="rating-section">
                    <div className="stars">
                      {renderStars(offer.rating)}
                    </div>
                    <span className="rating-text">({offer.reviewCount} reviews)</span>
                  </div>
                </div>

                <p className="offer-description">{offer.description}</p>

                <div className="features-list">
                  {offer.features.map((feature, idx) => (
                    <div key={idx} className="feature-item">
                      <span className="feature-icon">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pricing-section">
                  <div className="price-row">
                    <span className="current-price">KSh {offer.currentPrice.toLocaleString()}</span>
                    <span className="original-price">KSh {offer.originalPrice.toLocaleString()}</span>
                  </div>
                  <div className="savings-amount">
                    You Save: KSh {(offer.originalPrice - offer.currentPrice).toLocaleString()}
                  </div>
                </div>

                <div className="offer-actions">
                  <button className="enroll-btn">
                    <span className="btn-text">Enroll Now</span>
                    <span className="btn-subtitle">{offer.spots}</span>
                  </button>
                  <button className="learn-more-btn">
                    Learn More
                  </button>
                </div>

                <div className="trust-indicators">
                  <div className="indicator">
                    <span className="icon">🎓</span>
                    <span>Certified Course</span>
                  </div>
                  <div className="indicator">
                    <span className="icon">💰</span>
                    <span>Money Back Guarantee</span>
                  </div>
                  <div className="indicator">
                    <span className="icon">👥</span>
                    <span>Expert Support</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div className="bottom-cta" variants={itemVariants}>
          <div className="cta-content">
            <h3>🌟 Don't Miss Out!</h3>
            <p>Join thousands who have transformed their lives with natural healing</p>
            <button className="cta-button">
              View All Weekly Offers
            </button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default WeeklyOffersSection;
