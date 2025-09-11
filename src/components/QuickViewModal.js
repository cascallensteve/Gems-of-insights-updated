import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './QuickViewModal.css';

const QuickViewModal = ({ product, isOpen, onClose, onViewFullDetails }) => {
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Reset quantity when product changes
  useEffect(() => {
    if (product) {
      setQuantity(1);
    }
  }, [product]);

  // Manage body scroll lock when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleAddToCart = async () => {
    if (!currentUser) {
      alert('Please login to add items to cart');
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart(product, quantity);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="quick-view-overlay">
      <div className="quick-view-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="quick-view-content">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img src={product.image || product.photo} alt={product.name} />
              {product.sale && <span className="sale-badge">Sale!</span>}
            </div>
          </div>

          {/* Product Details */}
          <div className="product-details">
            <div className="product-header">
              <div className="product-category">{product.category}</div>
              <h2 className="product-title">{product.name}</h2>
              <div className="product-rating">
                <span className="stars">⭐⭐⭐⭐⭐</span>
                <span className="rating-text">{product.rating || 4.5} ({Math.floor(Math.random() * 50) + 10} reviews)</span>
              </div>
            </div>

            <div className="product-description">
              <p>{product.description}</p>
            </div>

            {product.benefits && (
              <div className="product-benefits">
                <h4>Key Benefits:</h4>
                <ul>
                  {product.benefits.map((benefit, index) => (
                    <li key={index}>✓ {benefit}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="product-price-section">
              <div className="price-display">
                {product.originalPrice && (
                  <span className="original-price">KES {product.originalPrice}</span>
                )}
                <span className="current-price">KES {product.price}</span>
              </div>
              
              {product.sale && (
                <div className="savings">
                  Save KSH {product.originalPrice ? parseInt(product.originalPrice.replace(',', '')) - parseInt(product.price.replace(',', '')) : 0}
                </div>
              )}
            </div>

            <div className="product-actions">
              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 10}
                  >
                    +
                  </button>
                </div>
              </div>

              <button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </button>

              <button 
                className="view-full-details-btn"
                onClick={() => onViewFullDetails && onViewFullDetails(product)}
              >
                View Full Details
              </button>
            </div>

            <div className="product-meta">
              <div className="meta-item">
                <span className="meta-label">Availability:</span>
                <span className={`meta-value ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Category:</span>
                <span className="meta-value">{product.category}</span>
              </div>
              {product.subCategory && (
                <div className="meta-item">
                  <span className="meta-label">Sub-category:</span>
                  <span className="meta-value">{product.subCategory}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Success Notification */}
        {showNotification && (
          <div className="success-notification">
            <span>✅ {product.name} added to cart!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickViewModal;
