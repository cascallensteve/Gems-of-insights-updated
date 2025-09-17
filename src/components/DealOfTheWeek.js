import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LazyLoad from 'react-lazyload';

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
      className="py-12 bg-white"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4">
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <h2 className="text-2xl font-bold text-gray-900">Natural Remedies Classes</h2>
          <p className="text-gray-600 mt-1">Learn natural healing methods</p>
        </motion.div>

        <motion.div className="grid gap-6 md:grid-cols-2 items-stretch" variants={itemVariants}>
          <div className="relative overflow-hidden rounded-xl shadow">
            <LazyLoad height={400} offset={100} placeholder={<div className="h-64 bg-gray-100"/>}>
              <img src={weeklyClass.image} alt={weeklyClass.name} className="h-full w-full object-cover" />
            </LazyLoad>
            <div className="absolute left-4 top-4 inline-flex items-center rounded-full bg-emerald-600 px-3 py-1 text-white text-xs font-semibold">
              Save {weeklyClass.savings}
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold text-gray-900">{weeklyClass.name}</h3>
              <div className="flex items-center gap-1 text-amber-500 text-sm">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
                <span className="ml-2 text-gray-600 text-xs">({weeklyClass.reviews} reviews)</span>
              </div>
            </div>

            <p className="mt-2 text-sm text-gray-700">{weeklyClass.description}</p>

            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
              {weeklyClass.features.map((feature, index) => (
                <div key={index} className="inline-flex items-center gap-2 rounded-md border border-gray-200 px-2 py-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-end gap-3">
              <span className="text-xl font-semibold text-gray-900">{weeklyClass.price}</span>
              <span className="text-sm text-gray-400 line-through">{weeklyClass.originalPrice}</span>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-900">Offer ends in:</h4>
              <div className="mt-2 grid grid-cols-4 gap-2">
                <div className="rounded-md border border-gray-200 p-2 text-center">
                  <div className="text-lg font-semibold text-gray-900">{timeLeft.days}</div>
                  <div className="text-xs text-gray-600">Days</div>
                </div>
                <div className="rounded-md border border-gray-200 p-2 text-center">
                  <div className="text-lg font-semibold text-gray-900">{timeLeft.hours}</div>
                  <div className="text-xs text-gray-600">Hours</div>
                </div>
                <div className="rounded-md border border-gray-200 p-2 text-center">
                  <div className="text-lg font-semibold text-gray-900">{timeLeft.minutes}</div>
                  <div className="text-xs text-gray-600">Minutes</div>
                </div>
                <div className="rounded-md border border-gray-200 p-2 text-center">
                  <div className="text-lg font-semibold text-gray-900">{timeLeft.seconds}</div>
                  <div className="text-xs text-gray-600">Seconds</div>
                </div>
              </div>
            </div>

            <button 
              className="mt-5 inline-flex items-center justify-center rounded-md bg-emerald-700 text-white px-5 py-2.5 text-sm font-semibold shadow hover:bg-emerald-600"
              onClick={() => navigate('/courses?enroll=1')}
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
