import React, { useState } from 'react';
import { HiPlus, HiEye } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LazyLoad from 'react-lazyload';
import QuickViewModal from './QuickViewModal';

const NewArrivals = ({ onNavigateToShop, onQuickView, onProductView }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const [cartNotification, setCartNotification] = useState({ show: false, productName: '' });
  const [loginAlert, setLoginAlert] = useState({ show: false, message: '' });
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);

  const products = [
    {
      id: 1,
      name: "Premium Organic Green Tea Collection",
      price: "1",
      originalPrice: "3,499",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg",
      category: "Tea Blends",
      subCategory: "Green Tea",
      description: "Hand-picked organic green tea leaves from high-altitude gardens. Rich in antioxidants, promotes metabolism, and supports heart health naturally.",
      benefits: ["Immune Boosting", "Energy Boosting"],
      sale: true,
      rating: 4.8,
      inStock: true
    },
    {
      id: 2,
      name: "Himalayan Herbal Wellness Mix",
      price: "200",
      originalPrice: "2,500",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      category: "Herbs & Spices",
      subCategory: "Medicinal Herbs",
      description: "Ancient Himalayan blend of 12 powerful herbs. Boosts immunity, reduces stress, and enhances overall vitality for modern living.",
      benefits: ["Immune Boosting", "Stress and Anxiety"],
      sale: true,
      rating: 4.9,
      inStock: true
    },
    {
      id: 3,
      name: "Pure Turmeric Capsules",
      price: "500",
      originalPrice: "1,200",
      image: "https://res.cloudinary.com/dqvsjtkqw/image/upload/v1753871838/capsules_twqx2t.webp",
      category: "Extracts",
      subCategory: "Capsules",
      description: "Genuine Manuka honey with MGO 400+. Natural antibacterial properties, supports digestive health, and boosts immune system effectively.",
      benefits: ["Blood cleansers", "Immune Boosting"],
      sale: true,
      rating: 4.7,
      inStock: true
    },
    {
      id: 4,
      name: "Complete Wellness Starter Kit",
      price: "4,599",
      originalPrice: "6,500",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg",
      category: "Kits & Bundles",
      subCategory: "Wellness Bundles",
      description: "Everything you need to start your natural wellness journey. Includes superfoods, probiotics, and essential vitamins for optimal health.",
      benefits: ["Immune Boosting", "Energy Boosting"],
      sale: true,
      rating: 4.6,
      inStock: true
    },
    {
      id: 5,
      name: "Organic Turmeric Root Powder",
      price: "1,299",
      originalPrice: "1,799",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg",
      category: "Herbs & Spices",
      subCategory: "Spices",
      description: "Pure turmeric powder with high curcumin content. Natural anti-inflammatory properties, supports joint health and immune system.",
      benefits: ["Immune Boosting", "Energy Boosting"],
      sale: true,
      rating: 4.5,
      inStock: true
    },
    {
      id: 6,
      name: "Moringa Leaf Capsules - 60ct",
      price: "2,150",
      originalPrice: null,
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      category: "Supplements",
      subCategory: "Herbal",
      description: "Nutrient-dense moringa capsules packed with vitamins, minerals, and antioxidants. Boosts energy and supports overall wellness.",
      benefits: ["Immune Boosting", "Energy Boosting"],
      sale: false,
      rating: 4.8,
      inStock: true
    },
    {
      id: 7,
      name: "Cold-Pressed Coconut Oil",
      price: "899",
      originalPrice: "1,299",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753346939/young-woman-with-curly-hair-sitting-cafe_pbym6j.jpg",
      category: "Fats & Oils",
      subCategory: "Coconut Oil",
      description: "Virgin coconut oil extracted using cold-press method. Perfect for cooking, skincare, and hair care routines.",
      benefits: ["Energy Boosting"],
      sale: true,
      rating: 4.6,
      inStock: true
    },
    {
      id: 8,
      name: "Herbal Detox Tea Blend",
      price: "1,650",
      originalPrice: "2,100",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753303006/turmeric-powder_kpfh3p.jpg",
      category: "Tea Blends",
      subCategory: "Herbal Tea",
      description: "Natural detox tea blend with dandelion, milk thistle, and green tea. Supports liver health and natural cleansing.",
      benefits: ["Digestive Disorder", "Immune Boosting"],
      sale: true,
      rating: 4.7,
      inStock: true
    }
  ];

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
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">New Products</h2>
          <p className="text-gray-600 mt-1">Discover our latest natural wellness products</p>
        </div>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="group rounded-md border border-gray-100 shadow-sm overflow-hidden bg-white">
              {product.sale && <span className="absolute m-2 inline-flex items-center justify-center rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold text-white">Sale!</span>}

              <div className="relative">
                <LazyLoad height={180} offset={100} placeholder={<div className="h-44 bg-gray-100"/>}>
                  <img src={product.image} alt={product.name} className="h-44 w-full object-cover" />
                </LazyLoad>
                <button 
                  className="absolute right-2 top-2 z-10 inline-flex items-center justify-center rounded-full bg-white/90 text-gray-800 w-8 h-8 shadow hover:bg-white"
                  title="Quick view"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleQuickView(product); }}
                >
                  <HiEye />
                </button>

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition pointer-events-none"/>
                {/* Removed floating add-to-cart icon to avoid duplication */}
              </div>

              <div className="p-3">
                <div className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">{product.category}</div>
                <h3 className="mt-2 line-clamp-2 font-semibold text-sm text-gray-900 group-hover:text-emerald-700">{product.name}</h3>

                <div className="mt-1 flex items-center gap-2">
                  {product.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">KES {product.originalPrice}</span>
                  )}
                  <span className="text-base font-semibold text-gray-900">KES {product.price}</span>
                </div>
                <button 
                  className="mt-2 w-full inline-flex items-center justify-center rounded-md bg-emerald-700 text-white px-3 py-1.5 text-sm font-medium shadow hover:bg-emerald-600"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button 
            className="inline-flex items-center gap-2 rounded-full bg-emerald-700 text-white px-6 py-3 text-sm font-semibold shadow hover:bg-emerald-600"
            onClick={() => (onNavigateToShop ? onNavigateToShop() : navigate('/shop'))}
          >
            Shop More Products
            <span>→</span>
          </button>
        </div>
      </div>

      {cartNotification.show && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="rounded-md bg-emerald-600 text-white px-4 py-2 shadow">
            <span>✅ {cartNotification.productName} added to cart!</span>
          </div>
        </div>
      )}

      {loginAlert.show && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-3 rounded-md bg-white px-4 py-2 shadow border">
            <span className="text-xl">🔒</span>
            <span className="text-sm text-gray-800">{loginAlert.message}</span>
            <button 
              className="inline-flex items-center justify-center rounded-md bg-emerald-700 text-white px-3 py-1 text-sm hover:bg-emerald-600"
              onClick={() => navigate('/login')}
            >
              Login Now
            </button>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setLoginAlert({ show: false, message: '' })}
            >
              ×
            </button>
          </div>
        </div>
      )}

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
    </section>
  );
};

export default NewArrivals;
