import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import QuickView from './QuickView';
// Tailwind conversion: removed external CSS import

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [showQuickView, setShowQuickView] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showShippingOptions, setShowShippingOptions] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState('standard');

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
    setShowQuickView(true);
  };

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/checkout');
  };

  const shippingOptions = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: '5-7 business days',
      price: 0,
      icon: '📦'
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: '2-3 business days',
      price: 200,
      icon: '🚚'
    },
    {
      id: 'overnight',
      name: 'Overnight Delivery',
      description: 'Next business day',
      price: 500,
      icon: '⚡'
    }
  ];

  const getSelectedShippingPrice = () => {
    const selected = shippingOptions.find(option => option.id === selectedShipping);
    return selected ? selected.price : 0;
  };

  const getFinalTotal = () => {
    return getCartTotal() + getSelectedShippingPrice();
  };

  const estimatedDelivery = () => {
    const today = new Date();
    const deliveryDays = selectedShipping === 'standard' ? 7 : selectedShipping === 'express' ? 3 : 1;
    const deliveryDate = new Date(today.getTime() + (deliveryDays * 24 * 60 * 60 * 1000));
    return deliveryDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="mt-[64px] md:mt-[72px]">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-end gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <div className="text-sm text-gray-600">{cartItems.length} items</div>
          </div>
          <button className="text-sm text-gray-600 hover:text-emerald-700" onClick={() => navigate(-1)}>
            ← Back to Shopping
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="mt-4 rounded-xl border border-emerald-100 bg-white p-6 text-center text-gray-700">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-2xl">🛒</div>
            <h2 className="text-lg font-semibold text-gray-900">Your cart is empty</h2>
            <p>Discover our natural remedies and wellness products to start your healthy journey!</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button 
                className="inline-flex items-center justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
                onClick={() => navigate('/shop')}
              >
                🌿 Browse Products
              </button>
              <button 
                className="inline-flex items-center justify-center rounded-md border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                onClick={() => navigate('/trending-products')}
              >
                ⭐ View Trending
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left: Items */}
            <div className="lg:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Your Items</h2>
                <button 
                  className="text-sm text-red-600 hover:underline"
                  onClick={clearCart}
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-[96px_1fr_auto] items-center gap-4 rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
                    <div className="relative">
                      <img src={item.image} alt={item.name} className="h-24 w-24 rounded-md object-cover" />
                      <button 
                        className="absolute bottom-1 left-1 z-10 rounded-md bg-black/60 px-2 py-1 text-xs text-white hover:bg-black/70"
                        onClick={() => handleQuickView(item)}
                      >
                        👁️ Quick View
                      </button>
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.category}</p>
                      {item.diseases && (
                        <div className="mt-2">
                          <span className="text-xs font-medium text-gray-700">Treats:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {item.diseases.slice(0, 3).map((disease, index) => (
                              <span key={index} className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 ring-1 ring-emerald-100">{disease}</span>
                            ))}
                            {item.diseases.length > 3 && (
                              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700 ring-1 ring-emerald-100">+{item.diseases.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="mb-2 text-sm text-gray-700">
                        <div>Unit: KSH {typeof item.price === 'string' ? item.price : Number(item.price).toLocaleString()}</div>
                        <div className="font-semibold">Total: KSH {(parseFloat((typeof item.price === 'string' ? item.price.replace(/[^\d.-]/g, '') : item.price)) * item.quantity).toLocaleString()}</div>
                      </div>
                      <div className="inline-flex items-center rounded-md border border-gray-300">
                        <button 
                          className="px-2 py-1 text-lg disabled:opacity-40"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="px-3 text-sm">{item.quantity}</span>
                        <button 
                          className="px-2 py-1 text-lg"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button 
                        className="mt-2 block w-full text-xs text-red-600 hover:underline"
                        onClick={() => removeFromCart(item.id)}
                        title="Remove from cart"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Summary */}
            <div className="lg:col-span-1">
              <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
                <h2 className="mb-2 text-lg font-semibold text-gray-900">Order Summary</h2>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Subtotal ({cartItems.length} items):</span>
                    <span>KSH {getCartTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tax:</span>
                    <span>Included</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Shipping Options</h3>
                    <button 
                      className="text-sm text-emerald-700 hover:underline"
                      onClick={() => setShowShippingOptions(!showShippingOptions)}
                    >
                      {showShippingOptions ? 'Hide' : 'Edit'}
                    </button>
                  </div>

                  {showShippingOptions && (
                    <div className="space-y-2">
                      {shippingOptions.map((option) => (
                        <label key={option.id} className="flex cursor-pointer items-start gap-3 rounded-lg border border-emerald-100 p-3 hover:bg-emerald-50/50">
                          <input
                            type="radio"
                            name="shipping"
                            value={option.id}
                            checked={selectedShipping === option.id}
                            onChange={(e) => setSelectedShipping(e.target.value)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-base">{option.icon}</span>
                                <span className="text-sm font-medium text-gray-900">{option.name}</span>
                              </div>
                              <span className="text-sm font-semibold text-gray-900">{option.price === 0 ? 'FREE' : `KSH ${option.price}`}</span>
                            </div>
                            <div className="text-xs text-gray-600">{option.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}

                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Shipping:</span>
                      <span>{getSelectedShippingPrice() === 0 ? 'FREE' : `KSH ${getSelectedShippingPrice()}`}</span>
                    </div>
                    <div className="rounded-md bg-emerald-50/60 p-2 text-xs text-gray-700">
                      📅 Estimated delivery: {estimatedDelivery()}
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t pt-3">
                  <div className="flex items-center justify-between text-base font-semibold">
                    <span>Total:</span>
                    <span>KSH {getFinalTotal().toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-3">
                  <button 
                    className="inline-flex w-full items-center justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
                    onClick={handleProceedToCheckout}
                  >
                    Proceed to Checkout
                  </button>
                  <button 
                    className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                    onClick={() => navigate('/shop')}
                  >
                    Continue Shopping
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs text-gray-700">
                  <div className="rounded-md border border-emerald-100 bg-emerald-50/60 p-2">
                    <span>🔒</span>
                    <span className="ml-1">Secure Checkout</span>
                  </div>
                  <div className="rounded-md border border-emerald-100 bg-emerald-50/60 p-2">
                    <span>↩️</span>
                    <span className="ml-1">Free Returns</span>
                  </div>
                  <div className="rounded-md border border-emerald-100 bg-emerald-50/60 p-2">
                    <span>💳</span>
                    <span className="ml-1">M-Pesa Accepted</span>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="mt-6 rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-sm font-semibold text-gray-900">You might also like</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 rounded-lg border border-emerald-100 p-2">
                    <img className="h-12 w-12 rounded object-cover" src="https://res.cloudinary.com/djksfayfu/image/upload/v1753303006/turmeric-powder_kpfh3p.jpg" alt="Turmeric" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Organic Turmeric</div>
                      <div className="text-xs text-gray-600">KSH 850</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg border border-emerald-100 p-2">
                    <img className="h-12 w-12 rounded object-cover" src="https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg" alt="Ginger" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Fresh Ginger</div>
                      <div className="text-xs text-gray-600">KSH 650</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {showQuickView && quickViewProduct && (
        <QuickView
          product={quickViewProduct}
          isOpen={showQuickView}
          onClose={() => {
            setShowQuickView(false);
            setQuickViewProduct(null);
          }}
          onOpenFullView={(product) => {
            setShowQuickView(false);
            setQuickViewProduct(null);
            navigate(`/product/${product.id}`);
          }}
        />
      )}
    </div>
  );
};

export default CartPage;
