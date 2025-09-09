import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import './ProductView.css';

const ProductView = ({ product, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState('description');

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    alert(`Added ${quantity} ${product.name} to cart!`);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="product-view-overlay" onClick={onClose}>
      <div className="product-view-modal" onClick={(e) => e.stopPropagation()}>
        <button className="product-view-close" onClick={onClose}>×</button>
        
        <div className="product-view-content">
          <div className="product-view-left">
            <div className="product-main-image">
              <img src={product.image} alt={product.name} />
              {product.sale && <div className="sale-badge">SALE</div>}
            </div>
          </div>
          
          <div className="product-view-right">
            <div className="product-header">
              <span className="product-category">{product.category}</span>
              <h1 className="product-name">{product.name}</h1>
              
              <div className="product-rating">
                <div className="stars">
                  ⭐⭐⭐⭐⭐
                </div>
                <span className="rating-text">(4.8/5 - 127 reviews)</span>
              </div>
              
              <div className="product-price">
                <span className="current-price">KSH {product.price}</span>
                {product.originalPrice && (
                  <span className="original-price">KSH {product.originalPrice}</span>
                )}
                {product.sale && (
                  <span className="discount">
                    Save KSH {(parseFloat(product.originalPrice?.replace(',', '') || 0) - parseFloat(product.price.replace(',', ''))).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            <div className="product-diseases">
              <h3>Treats These Conditions:</h3>
              <div className="diseases-list">
                {product.diseases?.map((disease, index) => (
                  <span key={index} className="disease-tag">{disease}</span>
                ))}
              </div>
            </div>

            <div className="product-actions">
              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button onClick={() => handleQuantityChange(-1)}>-</button>
                  <span>{quantity}</span>
                  <button onClick={() => handleQuantityChange(1)}>+</button>
                </div>
              </div>
              
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Add to Cart - KSH {(parseFloat(product.price.replace(',', '')) * quantity).toLocaleString()}
              </button>
            </div>

            <div className="product-features">
              <div className="feature">
                <span className="feature-icon">🌿</span>
                <span>100% Natural</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🚚</span>
                <span>Free Delivery</span>
              </div>
              <div className="feature">
                <span className="feature-icon">💯</span>
                <span>Money Back Guarantee</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🧪</span>
                <span>Lab Tested</span>
              </div>
            </div>

            <div className="product-tabs">
              <div className="tab-buttons">
                <button 
                  className={selectedTab === 'description' ? 'active' : ''}
                  onClick={() => setSelectedTab('description')}
                >
                  Description
                </button>
                <button 
                  className={selectedTab === 'usage' ? 'active' : ''}
                  onClick={() => setSelectedTab('usage')}
                >
                  Usage & Dosage
                </button>
                <button 
                  className={selectedTab === 'ingredients' ? 'active' : ''}
                  onClick={() => setSelectedTab('ingredients')}
                >
                  Ingredients
                </button>
              </div>
              
              <div className="tab-content">
                {selectedTab === 'description' && (
                  <div className="tab-panel">
                    <p>{product.description}</p>
                    <p>Our premium natural remedy is carefully crafted using traditional methods combined with modern quality standards. Each batch is tested for purity and potency to ensure you receive the maximum therapeutic benefits.</p>
                    <ul>
                      <li>Sustainably sourced ingredients</li>
                      <li>No artificial preservatives or additives</li>
                      <li>GMP certified manufacturing facility</li>
                      <li>Third-party laboratory tested</li>
                    </ul>
                  </div>
                )}
                
                {selectedTab === 'usage' && (
                  <div className="tab-panel">
                    <h4>Recommended Dosage:</h4>
                    <p><strong>Adults:</strong> Take 1-2 capsules daily with meals, or as directed by your healthcare provider.</p>
                    <p><strong>Children (12+ years):</strong> Take 1 capsule daily with meals.</p>
                    
                    <h4>Usage Instructions:</h4>
                    <ul>
                      <li>Take with food to enhance absorption</li>
                      <li>Drink plenty of water</li>
                      <li>For best results, use consistently for 30 days</li>
                      <li>Consult your doctor if pregnant or nursing</li>
                    </ul>
                    
                    <div className="warning">
                      <strong>⚠️ Important:</strong> Not suitable for children under 12. Consult healthcare provider before use if you have medical conditions or take medications.
                    </div>
                  </div>
                )}
                
                {selectedTab === 'ingredients' && (
                  <div className="tab-panel">
                    <h4>Active Ingredients (per capsule):</h4>
                    <ul className="ingredients-list">
                      <li><strong>Primary Extract:</strong> 500mg (standardized to 95% active compounds)</li>
                      <li><strong>Supporting Blend:</strong> 100mg</li>
                      <li><strong>Absorption Enhancer:</strong> 25mg</li>
                    </ul>
                    
                    <h4>Other Ingredients:</h4>
                    <p>Vegetable cellulose (capsule), rice flour, magnesium stearate (vegetable source)</p>
                    
                    <div className="certifications">
                      <span className="cert-badge">Organic</span>
                      <span className="cert-badge">Non-GMO</span>
                      <span className="cert-badge">Gluten Free</span>
                      <span className="cert-badge">Vegan</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
