import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);
  const slideInterval = useRef(null);

  const slides = [
    {
      id: 1,
      image: "https://res.cloudinary.com/dqvsjtkqw/image/upload/v1756902519/happy_woman_z0cpbb.webp",
      title: "Premium Natural Remedies",
      description: "Discover our collection of organic herbal solutions",
      cta: "Shop Now"
    },
    {
      id: 2,
      image: "https://res.cloudinary.com/dqvsjtkqw/image/upload/v1753870920/background_wam447.webp",
      title: "Gems of Insight classes ",
      description: "Get Skills! Stay Healthy",
      cta: "Join  our weeklyclasses"
    },
    {
      id: 3,
      image: "https://res.cloudinary.com/dqvsjtkqw/image/upload/v1756902724/beatuful_woman_dez_u6iive.webp",
      title: "Expert Consultations",
      description: "Personalized wellness advice from our specialists",
      cta: "Book Now"
    },
    {
    
      id:4,
      image:"https://res.cloudinary.com/dqvsjtkqw/image/upload/v1753882847/people-office-work-day_1_ym2pr0.jpg",
      title:"Learn Natural Treaments with us",
      description:"Join our classes",
      cta:"Register Here"

    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const startCarousel = () => {
      slideInterval.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
      }, 5000);
    };

    startCarousel();

    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    // Reset timer when manually changing slides
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
    }
    slideInterval.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
  };

  const goToNext = () => goToSlide((currentSlide + 1) % slides.length);
  const goToPrev = () => goToSlide((currentSlide - 1 + slides.length) % slides.length);

  const handleSlideAction = (slide) => {
    switch(slide.cta) {
      case 'Shop Now':
      case 'Explore':
        navigate('/shop');
        break;
      case 'Book Now':
        navigate('/consultation');
        break;
      default:
        navigate('/shop');
    }
  };

  return (
    <section className="hero">
      {/* Animated Background Elements */}
      <div className="hero-background">
        <div className="floating-element herb-1">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C12 2 17 5 17 12C17 15.866 14.866 19 11 19C7.134 19 5 15.866 5 12C5 5 12 2 12 2Z" fill="currentColor" opacity="0.8"/>
            <path d="M12 6C12 6 15 8 15 12C15 14.209 13.209 16 11 16C8.791 16 7 14.209 7 12C7 8 12 6 12 6Z" fill="currentColor"/>
          </svg>
        </div>
        <div className="floating-element herb-2">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 8C17 8 20 10 20 15C20 18.314 17.314 21 14 21C10.686 21 8 18.314 8 15C8 10 17 8 17 8Z" fill="currentColor" opacity="0.7"/>
            <path d="M7 6C7 6 4 8 4 13C4 16.314 6.686 19 10 19C13.314 19 16 16.314 16 13C16 8 7 6 7 6Z" fill="currentColor" opacity="0.9"/>
          </svg>
        </div>
        <div className="floating-element herb-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L12 12M12 12C12 15.314 9.314 18 6 18C2.686 18 0 15.314 0 12C0 8.686 2.686 6 6 6C9.314 6 12 8.686 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 12C12 15.314 14.686 18 18 18C21.314 18 24 15.314 24 12C24 8.686 21.314 6 18 6C14.686 6 12 8.686 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="carousel-container">
        <div 
          className="carousel-track"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div 
              key={slide.id}
              className={`carousel-slide ${currentSlide === index ? 'active' : ''}`}
            >
              <div className="slide-image-container">
                <LazyLoad height={500} offset={200} placeholder={<div className="hero-image-placeholder">Loading...</div>}>
                  <img src={slide.image} alt={slide.title} className="slide-image" />
                </LazyLoad>
                <div className="slide-overlay">
                  <div className="slide-content">
                    <h2 className="slide-title">{slide.title}</h2>
                    <p className="slide-description">{slide.description}</p>
                    <button 
                      className="slide-button"
                      onClick={() => handleSlideAction(slide)}
                    >
                      {slide.cta} <span className="arrow-icon">→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button className="carousel-arrow prev" onClick={goToPrev}>
          &lt;
        </button>
        <button className="carousel-arrow next" onClick={goToNext}>
          &gt;
        </button>

        {/* Indicators */}
        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${currentSlide === index ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;