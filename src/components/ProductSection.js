import React from 'react';
import { useCart } from '../context/CartContext';
import './ProductSection.css';

const ProductSection = ({ title, products = [], showViewAll = true, onQuickView, onProductView }) => {
  const { addToCart } = useCart();
  return (
    <section className="product-section">
      <div className="product-container">
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
          {showViewAll && (
            <button className="view-all-btn" onClick={() => (window.location.href = '/shop')}>View All Products</button>
          )}
        </div>
        
        <div className="products-grid">
          {(products || []).map(product => (
            <div key={product.id} className="product-card">
              {product.sale && <span className="sale-badge">Sale!</span>}
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                <div className="product-overlay">
                  <button 
                    className="quick-view-btn"
                    onClick={() => onQuickView && onQuickView(product)}
                  >
                    Quick View
                  </button>
                  <button 
                    className="full-view-btn"
                    onClick={() => onProductView && onProductView(product)}
                  >
                    Full Details
                  </button>
                </div>
              </div>
              <div className="product-info">
                <p className="product-category">{product.category}</p>
                <h3 className="product-name">{product.name}</h3>
                {product.description && (
                  <p className="product-description">{product.description}</p>
                )}
                {product.diseases && (
                  <div className="product-diseases">
                    <span className="diseases-label">Treats:</span>
                    <div className="diseases-tags">
                      {product.diseases.slice(0, 3).map((disease, index) => (
                        <span key={index} className="disease-tag">{disease}</span>
                      ))}
                      {product.diseases.length > 3 && (
                        <span className="disease-tag more">+{product.diseases.length - 3}</span>
                      )}
                    </div>
                  </div>
                )}
                <div className="product-price">
                  {product.originalPrice && (
                    <span className="original-price">KSH {product.originalPrice}</span>
                  )}
                  <span className="current-price">KSH {product.price}</span>
                </div>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
