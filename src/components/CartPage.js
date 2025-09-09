import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import QuickView from './QuickView';
import './CartPage.css';

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
    <div className="cart-page">
      <div className="cart-page-container">
        {/* Header */}
        <div className="cart-page-header">
          <div className="cart-title-section">
            <h1>Shopping Cart</h1>
            <div className="cart-count">{cartItems.length} items</div>
          </div>
          <button className="back-to-shopping-btn" onClick={() => navigate(-1)}>
            ← Back to Shopping
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart-page">
            <div className="empty-cart-illustration">
              <div className="empty-cart-icon">🛒</div>
              <h2>Your cart is empty</h2>
              <p>Discover our natural remedies and wellness products to start your healthy journey!</p>
            </div>
            
            <div className="suggested-actions">
              <button 
                className="primary-action-btn"
                onClick={() => navigate('/shop')}
              >
                🌿 Browse Products
              </button>
              <button 
                className="secondary-action-btn"
                onClick={() => navigate('/trending-products')}
              >
                ⭐ View Trending
              </button>
            </div>
          </div>
        ) : (
          <div className="cart-page-content">
            {/* Cart Items Section */}
            <div className="cart-items-section">
              <div className="section-header">
                <h2>Your Items</h2>
                <button 
                  className="clear-cart-btn"
                  onClick={clearCart}
                >
                  Clear All
                </button>
              </div>

              <div className="cart-items-grid">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item-card">
                    <div className="item-image-container">
                      <img src={item.image} alt={item.name} className="item-image" />
                      <button 
                        className="quick-view-overlay"
                        onClick={() => handleQuickView(item)}
                      >
                        👁️ Quick View
                      </button>
                    </div>
                    
                    <div className="item-info">
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-category">{item.category}</p>
                      
                      {item.diseases && (
                        <div className="item-benefits">
                          <span className="benefits-label">Treats:</span>
                          <div className="benefits-tags">
                            {item.diseases.slice(0, 3).map((disease, index) => (
                              <span key={index} className="benefit-tag">{disease}</span>
                            ))}
                            {item.diseases.length > 3 && (
                              <span className="benefit-tag more">+{item.diseases.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="item-controls">
                      <div className="quantity-section">
                        <label>Quantity:</label>
                        <div className="quantity-controls">
                          <button 
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="quantity-btn decrease"
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="quantity-display">{item.quantity}</span>
                          <button 
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="quantity-btn increase"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      <div className="price-section">
                        <div className="unit-price">
                          KSH {item.price} each
                        </div>
                        <div className="total-price">
                          KSH {(parseFloat(item.price.replace(',', '')) * item.quantity).toLocaleString()}
                        </div>
                      </div>

                      <button 
                        className="remove-item-btn"
                        onClick={async () => {
                          try {
                            await removeFromCart(item.id);
                          } catch (error) {
                            console.error('Failed to remove item:', error);
                            // Could show a toast notification here
                          }
                        }}
                        title="Remove from cart"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="order-summary-section">
              <div className="summary-card">
                <h2>Order Summary</h2>
                
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Subtotal ({cartItems.length} items):</span>
                    <span>KSH {getCartTotal().toLocaleString()}</span>
                  </div>
                  
                  <div className="summary-row">
                    <span>Tax:</span>
                    <span>Included</span>
                  </div>
                </div>

                {/* Shipping Options */}
                <div className="shipping-section">
                  <div className="shipping-header">
                    <h3>Shipping Options</h3>
                    <button 
                      className="toggle-shipping"
                      onClick={() => setShowShippingOptions(!showShippingOptions)}
                    >
                      {showShippingOptions ? '↑' : '↓'}
                    </button>
                  </div>
                  
                  {showShippingOptions && (
                    <div className="shipping-options">
                      {shippingOptions.map((option) => (
                        <label key={option.id} className="shipping-option">
                          <input
                            type="radio"
                            name="shipping"
                            value={option.id}
                            checked={selectedShipping === option.id}
                            onChange={(e) => setSelectedShipping(e.target.value)}
                          />
                          <div className="option-content">
                            <div className="option-header">
                              <span className="option-icon">{option.icon}</span>
                              <span className="option-name">{option.name}</span>
                              <span className="option-price">
                                {option.price === 0 ? 'FREE' : `KSH ${option.price}`}
                              </span>
                            </div>
                            <div className="option-description">{option.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                  
                  <div className="selected-shipping-summary">
                    <div className="summary-row">
                      <span>Shipping:</span>
                      <span>
                        {getSelectedShippingPrice() === 0 ? 'FREE' : `KSH ${getSelectedShippingPrice()}`}
                      </span>
                    </div>
                    
                    <div className="delivery-estimate">
                      <span>📅 Estimated delivery: {estimatedDelivery()}</span>
                    </div>
                  </div>
                </div>

                <div className="total-section">
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>KSH {getFinalTotal().toLocaleString()}</span>
                  </div>
                </div>

                <div className="checkout-actions">
                  <button 
                    className="checkout-btn"
                    onClick={handleProceedToCheckout}
                  >
                    Proceed to Checkout
                  </button>
                  
                  <button 
                    className="continue-shopping-btn"
                    onClick={() => navigate('/shop')}
                  >
                    Continue Shopping
                  </button>
                </div>

                {/* Security Badges */}
                <div className="security-badges">
                  <div className="badge">
                    <span>🔒</span>
                    <span>Secure Checkout</span>
                  </div>
                  <div className="badge">
                    <span>↩️</span>
                    <span>Free Returns</span>
                  </div>
                  <div className="badge">
                    <span>💳</span>
                    <span>M-Pesa Accepted</span>
                  </div>
                </div>
              </div>

              {/* Recommended Products */}
              <div className="recommendations-card">
                <h3>You might also like</h3>
                <div className="recommended-products">
                  <div className="recommended-item">
                    <img src="https://res.cloudinary.com/djksfayfu/image/upload/v1753303006/turmeric-powder_kpfh3p.jpg" alt="Turmeric" />
                    <div className="recommended-info">
                      <h4>Organic Turmeric</h4>
                      <p>KSH 850</p>
                    </div>
                  </div>
                  <div className="recommended-item">
                    <img src="https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg" alt="Ginger" />
                    <div className="recommended-info">
                      <h4>Fresh Ginger</h4>
                      <p>KSH 650</p>
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
        />
      )}
    </div>
  );
};

export default CartPage;
