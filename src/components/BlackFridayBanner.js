import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

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
      className="relative py-12 bg-white"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={bannerVariants}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-xl shadow">
          <img 
            src="https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg" 
            alt="Organic Vegetables"
            className="h-64 w-full object-cover md:h-80"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <motion.div 
              className="inline-flex items-center rounded-full bg-emerald-600 px-3 py-1 text-white text-sm font-semibold"
              initial={{ opacity: 0, y: -20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Black Friday
            </motion.div>
            <motion.h2
              className="mt-3 text-white text-2xl md:text-3xl font-bold drop-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Sale 50% Off All Vegetable Products
            </motion.h2>
            <motion.p
              className="mt-2 max-w-2xl text-white/90 text-sm md:text-base"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              Don't miss this incredible opportunity to stock up on fresh, organic vegetables at unbeatable prices
            </motion.p>
            <motion.button 
              className="mt-4 inline-flex items-center rounded-full bg-emerald-600 text-white px-6 py-3 text-sm font-semibold shadow hover:bg-emerald-500"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { window.location.href = '/black-friday'; }}
            >
              Discover Now
            </motion.button>
          </div>

          <motion.div 
            className="absolute left-6 top-6 text-2xl"
            animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            🍃
          </motion.div>
          <motion.div 
            className="absolute right-8 top-10 text-2xl"
            animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            🥬
          </motion.div>
          <motion.div 
            className="absolute right-1/3 bottom-6 text-2xl"
            animate={{ y: [0, -8, 0], rotate: [0, 3, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          >
            🥕
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default BlackFridayBanner;
