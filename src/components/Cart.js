import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import Checkout from './Checkout';
import './Cart.css';

const Cart = ({ isOpen, onClose, onOpenQuickView }) => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    window.location.href = '/checkout';
  };

  const handleOrderComplete = (orderData) => {
    alert(`Order confirmed! Order ID: ${orderData.id}\nTotal: KSH ${orderData.total.toLocaleString()}\nThank you for your order!`);
    clearCart();
    setShowCheckout(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Shopping Cart ({cartItems.length} items)</h2>
          <button className="cart-close" onClick={onClose}>×</button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Add some natural remedies to your cart to get started!</p>
              <button className="continue-shopping" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                    
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <p className="item-category">{item.category}</p>
                      <div className="item-diseases">
                        <strong>Treats:</strong> {item.diseases?.join(', ')}
                      </div>
                      
                      <div className="item-actions">
                        <button 
                          className="quick-view-btn"
                          onClick={() => onOpenQuickView(item)}
                        >
                          Quick View
                        </button>
                        <button 
                          className="remove-btn"
                          onClick={async () => {
                            try {
                              await removeFromCart(item.id);
                            } catch (error) {
                              console.error('Failed to remove item:', error);
                              // Could show a toast notification here
                            }
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    <div className="item-controls">
                      <div className="quantity-controls">
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="quantity-btn"
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="item-price">
                        <div className="unit-price">KSH {item.price}</div>
                        <div className="total-price">
                          KSH {(parseFloat(item.price.replace(',', '')) * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="summary-row subtotal">
                  <span>Subtotal:</span>
                  <span>KSH {getCartTotal().toLocaleString()}</span>
                </div>
                <div className="summary-row shipping">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>KSH {getCartTotal().toLocaleString()}</span>
                </div>
                
                <div className="cart-actions">
                  <button className="continue-shopping" onClick={onClose}>
                    Continue Shopping
                  </button>
                  <button className="checkout-btn" onClick={handleCheckout}>
                    Proceed to Checkout
                  </button>
                </div>
                
                <button className="clear-cart" onClick={clearCart}>
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      {showCheckout && (
        <Checkout
          cartItems={cartItems}
          onClose={() => setShowCheckout(false)}
          onOrderComplete={handleOrderComplete}
        />
      )}
    </div>
  );
};

export default Cart;
