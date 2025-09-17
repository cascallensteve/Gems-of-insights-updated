import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LazyLoad from 'react-lazyload';
import { HiEye, HiPlus } from 'react-icons/hi2';
import QuickViewModal from './QuickViewModal';

const BestSellers = ({ onQuickView, onProductView }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const [cartNotification, setCartNotification] = useState({ show: false, productName: '' });
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const products = [
    {
      id: 'bs1',
      name: "Organic Turmeric Powder",
      price: "1,299",
      originalPrice: "1,799",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753303006/turmeric-powder_kpfh3p.jpg",
      category: "Herbs & Spices",
      subCategory: "Spices",
      description: "Pure organic turmeric powder with high curcumin content. Natural anti-inflammatory properties, supports joint health and immune system.",
      benefits: ["Immune Boosting", "Energy Boosting"],
      sale: true,
      rating: 4.8,
      reviews: 124,
      inStock: true
    },
    {
      id: 'bs2',
      name: "Raw Manuka Honey",
      price: "3,200",
      originalPrice: "4,200",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753346939/young-woman-with-curly-hair-sitting-cafe_pbym6j.jpg",
      category: "Natural Sweeteners",
      subCategory: "Honey",
      description: "Genuine Manuka honey with MGO 400+. Natural antibacterial properties, supports digestive health, and boosts immune system effectively.",
      benefits: ["Immune Boosting", "Digestive Disorder"],
      sale: true,
      rating: 4.9,
      reviews: 89,
      inStock: true
    },
    {
      id: 'bs3',
      name: "Himalayan Pink Salt",
      price: "850",
      originalPrice: "1,200",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      category: "Herbs & Spices",
      subCategory: "Salts",
      description: "Pure Himalayan pink salt rich in minerals. Natural electrolyte balance, supports hydration and overall wellness.",
      benefits: ["Energy Boosting"],
      sale: true,
      rating: 4.7,
      reviews: 156,
      inStock: true
    },
    {
      id: 'bs4',
      name: "Organic Coconut Oil",
      price: "1,450",
      originalPrice: "1,899",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg",
      category: "Fats & Oils",
      subCategory: "Coconut Oil",
      description: "Virgin coconut oil extracted using cold-press method. Perfect for cooking, skincare, and hair care routines.",
      benefits: ["Energy Boosting"],
      sale: true,
      rating: 4.6,
      reviews: 203,
      inStock: true
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
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const handleAddToCart = (product) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    };

    addToCart(cartItem);
    
    // Show notification
    setCartNotification({
      show: true,
      productName: product.name
    });

    // Hide notification after 3 seconds
    setTimeout(() => {
      setCartNotification({ show: false, productName: '' });
    }, 3000);
  };

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
    setShowQuickView(true);
  };

  const handleProductView = (product) => {
    if (onProductView) {
      onProductView(product);
    } else {
      // Fallback: navigate to product page
      navigate(`/product/${product.id}`);
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
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Best Sellers</h2>
          <p className="text-gray-600 mt-1">Our most popular natural wellness products</p>
        </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <motion.div 
            key={product.id} 
            className="group rounded-md border border-gray-100 shadow-sm overflow-hidden bg-white"
            variants={itemVariants}
          >
            {product.sale && <span className="absolute m-2 inline-flex items-center justify-center rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold text-white">Sale!</span>}
            
            <div className="relative">
              <LazyLoad height={180} offset={100} placeholder={<div className="h-44 bg-gray-100"/>}>
                <img src={product.image} alt={product.name} className="h-44 w-full object-cover" />
              </LazyLoad>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition"/>
              <div className="absolute bottom-2 right-2 flex gap-2">
                <button className="inline-flex items-center justify-center rounded-full bg-white/90 text-gray-800 w-8 h-8 shadow hover:bg-white" onClick={() => handleQuickView(product)} title="Quick view"><HiEye /></button>
                {/* Removed floating add-to-cart icon to avoid duplication; main button is below */}
              </div>
            </div>

            <div className="p-3">
              <div className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">{product.category}</div>
              <h3 className="mt-2 line-clamp-2 font-semibold text-sm text-gray-900 group-hover:text-emerald-700">{product.name}</h3>

              <div className="mt-1 flex items-center gap-2">
                {product.originalPrice && (
                  <span className="text-xs text-gray-400 line-through">KSH {product.originalPrice}</span>
                )}
                <span className="text-base font-semibold text-gray-900">KSH {product.price}</span>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <button className="inline-flex items-center justify-center rounded-md bg-emerald-700 text-white px-3 py-1.5 text-sm font-medium shadow hover:bg-emerald-600" onClick={() => handleAddToCart(product)}>Add to Cart</button>
                <button className="inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50" onClick={() => handleQuickView(product)}>Quick View</button>
                <button className="inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50" onClick={() => handleProductView(product)}>Full Details</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {cartNotification.show && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="rounded-md bg-emerald-600 text-white px-4 py-2 shadow">
            <span>✅ {cartNotification.productName} added to cart!</span>
          </div>
        </div>
      )}
      </div>
      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={showQuickView}
        onClose={() => {
          setShowQuickView(false);
          setQuickViewProduct(null);
        }}
        onViewFullDetails={(product) => {
          setShowQuickView(false);
          setQuickViewProduct(null);
          handleProductView(product);
        }}
      />
    </motion.section>
  );
};

export default BestSellers;
