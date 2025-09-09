import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import './QuickView.css';

const QuickView = ({ product, isOpen, onClose, onOpenFullView }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    alert(`Added ${quantity} ${product.name} to cart!`);
    onClose();
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleViewDetails = () => {
    onClose();
    onOpenFullView(product);
  };

  return (
    <div className="quick-view-overlay" onClick={onClose}>
      <div className="quick-view-modal" onClick={(e) => e.stopPropagation()}>
        <button className="quick-view-close" onClick={onClose}>×</button>
        
        <div className="quick-view-content">
          <div className="quick-view-image">
            <img src={product.image} alt={product.name} />
            {product.sale && <div className="sale-badge">SALE</div>}
          </div>
          
          <div className="quick-view-details">
            <span className="product-category">{product.category}</span>
            <h2 className="product-name">{product.name}</h2>
            
            <div className="product-rating">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <span className="rating-text">(4.8/5)</span>
            </div>
            
            <div className="product-price">
              <span className="current-price">KSH {product.price}</span>
              {product.originalPrice && (
                <span className="original-price">KSH {product.originalPrice}</span>
              )}
            </div>
            
            <p className="product-description">{product.description}</p>
            
            <div className="product-diseases">
              <strong>Treats:</strong>
              <div className="diseases-tags">
                {product.diseases?.slice(0, 3).map((disease, index) => (
                  <span key={index} className="disease-tag">{disease}</span>
                ))}
                {product.diseases?.length > 3 && (
                  <span className="more-diseases">+{product.diseases.length - 3} more</span>
                )}
              </div>
            </div>
            
            <div className="quick-actions">
              <div className="quantity-selector">
                <label>Qty:</label>
                <div className="quantity-controls">
                  <button onClick={() => handleQuantityChange(-1)}>-</button>
                  <span>{quantity}</span>
                  <button onClick={() => handleQuantityChange(1)}>+</button>
                </div>
              </div>
              
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
            
            <div className="quick-view-footer">
              <button className="view-details-btn" onClick={handleViewDetails}>
                View Full Details
              </button>
              
              <div className="product-features">
                <span className="feature">🌿 Natural</span>
                <span className="feature">🚚 Free Delivery</span>
                <span className="feature">💯 Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickView;
