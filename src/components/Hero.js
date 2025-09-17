import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LazyLoad from 'react-lazyload';

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
      image: "https://res.cloudinary.com/dqvsjtkqw/image/upload/v1758092595/38383_1_1_1_1_1_a2y09c.jpg",
      title: "Gems of Insight classes ",
      description: "Get Skills! Stay Healthy",
      cta: "Join  our weeklyclasses"
    },
    {
      id: 3,
      image: "https://res.cloudinary.com/dqvsjtkqw/image/upload/v1757600199/herbal-spa-treatment-equipments-put-wooden-floor_1_1_1_1_1_1_sczyzu.webp",
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
      case 'Join  our weeklyclasses':
      case 'Register Here':
        navigate('/courses');
        break;
      default:
        navigate('/shop');
    }
  };

  return (
    <section className="relative w-full h-[60vh] min-h-[400px] overflow-hidden mt-[40px] md:mt-[52px]">
      {/* Animated Background Elements */}
      <div className="pointer-events-none absolute top-0 left-0 w-full h-[60%] z-[1]">
        <div className="absolute text-emerald-700/15 flex items-center justify-center top-[20%] left-[5%] animate-[floatRight_25s_linear_infinite]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C12 2 17 5 17 12C17 15.866 14.866 19 11 19C7.134 19 5 15.866 5 12C5 5 12 2 12 2Z" fill="currentColor" opacity="0.8"/>
            <path d="M12 6C12 6 15 8 15 12C15 14.209 13.209 16 11 16C8.791 16 7 14.209 7 12C7 8 12 6 12 6Z" fill="currentColor"/>
          </svg>
        </div>
        <div className="absolute text-emerald-700/15 flex items-center justify-center top-[70%] left-[10%] animate-[floatUp_20s_linear_infinite_-5s]">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 8C17 8 20 10 20 15C20 18.314 17.314 21 14 21C10.686 21 8 18.314 8 15C8 10 17 8 17 8Z" fill="currentColor" opacity="0.7"/>
            <path d="M7 6C7 6 4 8 4 13C4 16.314 6.686 19 10 19C13.314 19 16 16.314 16 13C16 8 7 6 7 6Z" fill="currentColor" opacity="0.9"/>
          </svg>
        </div>
        <div className="absolute text-emerald-700/15 flex items-center justify-center top-[40%] left-[15%] animate-[floatDiagonal_22s_linear_infinite_-8s]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L12 12M12 12C12 15.314 9.314 18 6 18C2.686 18 0 15.314 0 12C0 8.686 2.686 6 6 6C9.314 6 12 8.686 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 12C12 15.314 14.686 18 18 18C21.314 18 24 15.314 24 12C24 8.686 21.314 6 18 6C14.686 6 12 8.686 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Carousel Container (fade transition to avoid wrap lag) */}
      <div className="relative w-full h-full overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${currentSlide === index ? 'opacity-100 z-[2]' : 'opacity-0 z-[1]'}`}
          >
            <LazyLoad height={500} offset={100} placeholder={<div className="w-full h-full bg-gray-100 animate-pulse" />}> 
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="w-full h-full object-cover object-center will-change-transform"
                loading="eager"
                decoding="async"
                fetchpriority="high"
              />
            </LazyLoad>
            {/* Overlay and text; reduced padding on mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/10 flex items-end p-[3%] sm:p-[4%]">
              <div className="max-w-[1200px] mx-auto w-full px-4 py-4 sm:px-6 sm:py-6">
                <h2 className={`text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] mb-2 sm:mb-3 leading-tight font-extrabold text-[1.6rem] sm:text-[2rem] md:text-[3rem] lg:text-[3.2rem] ${currentSlide === index ? 'opacity-100 translate-y-0 transition-all duration-700 delay-150' : 'opacity-0 translate-y-4'}`}>{slide.title}</h2>
                <p className={`text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] mb-4 sm:mb-6 max-w-[600px] text-[0.95rem] sm:text-[1.05rem] md:text-[1.25rem] ${currentSlide === index ? 'opacity-100 translate-y-0 transition-all duration-700 delay-200' : 'opacity-0 translate-y-4'}`}>{slide.description}</p>
                <button 
                  className={`inline-flex items-center gap-2 rounded-full bg-emerald-700 text-white px-5 py-2.5 sm:px-6 sm:py-3 text-[1rem] sm:text-[1.05rem] font-semibold shadow-md transition-all duration-300 hover:bg-emerald-600 hover:-translate-y-[3px] ${currentSlide === index ? 'opacity-100 translate-y-0 transition-all duration-700 delay-300' : 'opacity-0 translate-y-4'}`}
                  onClick={() => handleSlideAction(slide)}
                >
                  {slide.cta} <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button className="absolute top-[38%] md:top-1/2 -translate-y-1/2 left-3 sm:left-6 w-9 h-9 md:w-12 md:h-12 rounded-full bg-black/25 md:bg-white/20 text-white text-lg md:text-xl z-10 flex items-center justify-center transition-all duration-300 backdrop-blur hover:bg-white/40" onClick={goToPrev} aria-label="Previous">&lt;</button>
        <button className="absolute top-[38%] md:top-1/2 -translate-y-1/2 right-3 sm:right-6 w-9 h-9 md:w-12 md:h-12 rounded-full bg-black/25 md:bg-white/20 text-white text-lg md:text-xl z-10 flex items-center justify-center transition-all duration-300 backdrop-blur hover:bg-white/40" onClick={goToNext} aria-label="Next">&gt;</button>

        {/* Indicators */}
        <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white'}`}
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