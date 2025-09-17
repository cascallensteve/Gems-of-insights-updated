import React, { useState, useEffect, useRef } from 'react';
import './StatsCounter.css';

const StatsCounter = () => {
  const [counters, setCounters] = useState({
    patients: 0,
    experience: 0,
    successRate: 0,
    support: 0
  });
  
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  const stats = [
    {
      id: 'patients',
      finalValue: 500,
      suffix: '+',
      label: 'Happy Patients',
      icon: '😊',
      color: '#6b8e23'
    },
    {
      id: 'experience',
      finalValue: 15,
      suffix: '+',
      label: 'Years Experience',
      icon: '📅',
      color: '#3498db'
    },
    {
      id: 'successRate',
      finalValue: 98,
      suffix: '%',
      label: 'Success Rate',
      icon: '✅',
      color: '#22c55e'
    },
    {
      id: 'support',
      finalValue: 24,
      suffix: '/7',
      label: 'Support Available',
      icon: '🕒',
      color: '#f59e0b'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounters();
        }
      },
      {
        threshold: 0.5, // Trigger when 50% of the component is visible
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  const animateCounters = () => {
    stats.forEach((stat) => {
      let startValue = 0;
      const endValue = stat.finalValue;
      const duration = 2000; // 2 seconds
      const stepTime = 50; // Update every 50ms
      const steps = duration / stepTime;
      const increment = endValue / steps;

      const timer = setInterval(() => {
        startValue += increment;
        if (startValue >= endValue) {
          startValue = endValue;
          clearInterval(timer);
        }
        
        setCounters(prev => ({
          ...prev,
          [stat.id]: Math.floor(startValue)
        }));
      }, stepTime);
    });
  };

  return (
    <section className="stats-counter" ref={sectionRef}>
      <div className="container">
        <div className="stats-header">
          <h2 className="stats-title">Why Choose GemsOfInsight?</h2>
          <p className="stats-subtitle">
            Trusted by thousands of people worldwide for natural wellness solutions
          </p>
        </div>

        <div className="stats-grid">
          {stats.map((stat) => (
            <div 
              key={stat.id} 
              className={`stat-card ${hasAnimated ? 'animated' : ''}`}
              style={{ '--accent-color': stat.color }}
            >
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-number">
                <span className="counter">{counters[stat.id]}</span>
                <span className="suffix">{stat.suffix}</span>
              </div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-bar">
                <div 
                  className="stat-progress"
                  style={{ 
                    width: hasAnimated ? '100%' : '0%',
                    backgroundColor: stat.color 
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="stats-testimonial">
          <div className="testimonial-content">
            <p>"GemsOfInsight transformed my approach to wellness. Their natural remedies and expert guidance have been life-changing!"</p>
            <div className="testimonial-author">
              <img src="https://res.cloudinary.com/djksfayfu/image/upload/v1753346939/young-woman-with-curly-hair-sitting-cafe_pbym6j.jpg" alt="Sarah Johnson" />
              <div>
                <strong>Sarah Johnson</strong>
                <span>Wellness Enthusiast</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="floating-stats-bg">
        <div className="floating-element stats-leaf-1">🌿</div>
        <div className="floating-element stats-leaf-2">🍃</div>
        <div className="floating-element stats-leaf-3">🌱</div>
        <div className="floating-element stats-remedy-1">💊</div>
        <div className="floating-element stats-remedy-2">🧪</div>
      </div>
    </section>
  );
};

export default StatsCounter;
