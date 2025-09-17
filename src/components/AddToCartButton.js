import React from 'react';
import { useCart } from '../context/CartContext';
import { useCartAPI } from '../hooks/useCartAPI';
import { useAuth } from '../context/AuthContext';
import './AddToCartButton.css';

const AddToCartButton = ({ product, className = "" }) => {
  const { addToCart: addToLocalCart } = useCart();
  const { addToCart: addToAPICart, loading, error } = useCartAPI();
  const { currentUser } = useAuth();

  const handleAddToCart = async () => {
    if (currentUser) {
      // User is logged in, use API
      const result = await addToAPICart(product.id);
      if (result.success) {
        // Also add to local cart for immediate UI update
        addToLocalCart(product);
        alert(`${product.name} added to cart successfully!`);
      } else {
        // API failed, fallback to local cart
        addToLocalCart(product);
        alert(`${product.name} added to local cart! (API error: ${result.error})`);
      }
    } else {
      // User not logged in, use local cart
      addToLocalCart(product);
      alert(`${product.name} added to local cart! Please login to sync with your account.`);
    }
  };

  return (
    <div className={`add-to-cart-container ${className}`}>
      <button 
        className={`add-to-cart-btn ${loading ? 'loading' : ''}`}
        onClick={handleAddToCart}
        disabled={loading}
      >
        {loading ? (
          <span className="loading-content">
            <span className="spinner"></span>
            Adding...
          </span>
        ) : (
          <span className="button-content">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V16.5M9 19.5C9.8 19.5 10.5 20.2 10.5 21S9.8 22.5 9 22.5 7.5 21.8 7.5 21 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21S20.8 22.5 20 22.5 18.5 21.8 18.5 21 19.2 19.5 20 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add to Cart
          </span>
        )}
      </button>
      
      {error && (
        <div className="error-message">
          <small>{error}</small>
        </div>
      )}
      
      {!currentUser && (
        <div className="login-hint">
          <small>Login to sync cart across devices</small>
        </div>
      )}
    </div>
  );
};

export default AddToCartButton;
