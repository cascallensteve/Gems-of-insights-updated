import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import LazyLoad from 'react-lazyload';
import { HiEye, HiPlus } from 'react-icons/hi2';
import QuickViewModal from './QuickViewModal';

const BlackFridayPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [cartNotification, setCartNotification] = useState({ show: false, productName: '' });

  // Example promo products (reusing some from Shop)
  const promoProducts = [
    {
      id: 101,
      name: 'Black Friday Turmeric Bundle',
      price: '1,299',
      originalPrice: '2,599',
      image: 'https://res.cloudinary.com/djksfayfu/image/upload/v1753303006/turmeric-powder_kpfh3p.jpg',
      category: 'Herbs & Spices',
      description: 'Special turmeric bundle with extra savings for Black Friday.',
      sale: true,
    },
    {
      id: 102,
      name: 'Coconut Oil Family Pack',
      price: '1,450',
      originalPrice: '2,300',
      image: 'https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg',
      category: 'Fats & Oils',
      description: 'Family-sized coconut oil with massive discount.',
      sale: true,
    },
    {
      id: 103,
      name: 'Manuka Honey BF Special',
      price: '2,700',
      originalPrice: '4,200',
      image: 'https://res.cloudinary.com/djksfayfu/image/upload/v1753346939/young-woman-with-curly-hair-sitting-cafe_pbym6j.jpg',
      category: 'Natural Sweeteners',
      description: 'Premium Manuka honey at an unbeatable Black Friday price.',
      sale: true,
    },
  ];

  const handleAddToCart = (product) => {
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 });
    setCartNotification({ show: true, productName: product.name });
    setTimeout(() => setCartNotification({ show: false, productName: '' }), 3000);
  };

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
    setShowQuickView(true);
  };

  const handleProductView = (product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <section className="py-12 bg-white mt-[64px] md:mt-[72px]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center rounded-full bg-emerald-600 px-3 py-1 text-white text-sm font-semibold">Black Friday</div>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-gray-900">Huge Savings on Featured Products</h1>
          <p className="mt-1 text-gray-600">Limited-time offers. Add your favorites to cart now.</p>
        </div>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {promoProducts.map((product) => (
            <div key={product.id} className="group rounded-md border border-gray-100 shadow-sm overflow-hidden bg-white">
              {product.originalPrice && <span className="absolute m-2 inline-flex items-center justify-center rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold text-white">Sale!</span>}
              <div className="relative">
                <LazyLoad height={180} offset={100} placeholder={<div className="h-44 bg-gray-100"/>}>
                  <img src={product.image} alt={product.name} className="h-44 w-full object-cover" />
                </LazyLoad>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition"/>
                <div className="absolute bottom-2 right-2 flex gap-2">
                  <button className="inline-flex items-center justify-center rounded-full bg-white/90 text-gray-800 w-8 h-8 shadow hover:bg-white" title="Quick view" onClick={() => handleQuickView(product)}><HiEye /></button>
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
            </div>
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
        onClose={() => { setShowQuickView(false); setQuickViewProduct(null); }}
        onViewFullDetails={(product) => { setShowQuickView(false); setQuickViewProduct(null); handleProductView(product); }}
      />
    </section>
  );
};

export default BlackFridayPage;


