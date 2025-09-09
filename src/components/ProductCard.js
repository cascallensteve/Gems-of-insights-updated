import React from 'react';
import AddToCartButton from './AddToCartButton';
import StarRating from './StarRating';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img 
          src={product.photo || '/images/default-product.jpg'} 
          alt={product.name}
          onError={(e) => {
            e.target.src = '/images/default-product.jpg';
          }}
        />
        {product.average_rating && (
          <div className="rating-badge">
            ⭐ {product.average_rating}
          </div>
        )}
      </div>
      
      <div className="product-info">
        <div className="product-category">
          {product.category}
        </div>
        
        <h3 className="product-name">
          {product.name}
        </h3>
        
        <p className="product-description">
          {product.description}
        </p>
        
        <div className="product-price">
          KES {typeof product.price === 'number' ? product.price.toLocaleString() : product.price}
        </div>

        <div className="product-rating">
          <StarRating 
            productId={product.id} 
            initialRating={product.average_rating || 0}
            size="small"
            readOnly={false}
            onRatingSubmit={(response) => {
              console.log('Rating submitted:', response);
            }}
          />
        </div>
        
        <div className="product-actions">
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
