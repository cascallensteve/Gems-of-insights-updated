import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, useAnimation } from 'framer-motion';

const FeatureBenefits = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const renderIcon = (iconType) => {
    const iconProps = {
      width: "32",
      height: "32",
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    };

    switch (iconType) {
      case 'truck':
        return (
          <svg {...iconProps}>
            <path d="M16 3H1V16H3C3 17.66 4.34 19 6 19C7.66 19 9 17.66 9 16H15C15 17.66 16.34 19 18 19C19.66 19 21 17.66 21 16H23V13L20 8H16V3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="6" cy="16" r="2" stroke="currentColor" strokeWidth="2"/>
            <circle cx="18" cy="16" r="2" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'support':
        return (
          <svg {...iconProps}>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 14S9.5 16 12 16S16 14 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M9 9H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M15 9H15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'return':
        return (
          <svg {...iconProps}>
            <path d="M3 7V13C3 16.866 6.134 20 10 20H14C17.866 20 21 16.866 21 13V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M21 7L12 2L3 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 12L12 9L15 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'secure':
        return (
          <svg {...iconProps}>
            <rect x="3" y="11" width="18" height="10" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="16" r="1" fill="currentColor"/>
            <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      default:
        return null;
    }
  };

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
      icon: 'truck',
      title: 'Free Shipping',
      description: 'Free shipping on all orders over KSH 2,000',
      color: '#4CAF50'
    },
    {
      icon: 'support',
      title: 'Support 24/7',
      description: 'Contact us 24 hours a day, 7 days a week',
      color: '#2196F3'
    },
    {
      icon: 'return',
      title: '30 Days Return',
      description: 'Simply return it within 30 days for an exchange',
      color: '#FF9800'
    },
    {
      icon: 'secure',
      title: '100% Payment Secure',
      description: 'We ensure secure payment with M-Pesa and cards',
      color: '#9C27B0'
    }
  ];

  return (
    <section ref={ref} className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="grid gap-4 grid-cols-2 md:grid-cols-4"
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="rounded-lg border border-gray-100 bg-white p-4 text-center shadow-sm hover:shadow transition"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full" style={{ backgroundColor: `${feature.color}20`, color: feature.color }}>
                {renderIcon(feature.icon)}
              </div>
              <h3 className="text-sm font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-1 text-xs text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureBenefits;