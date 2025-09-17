import React, { useState } from 'react';
import { cartAPI } from '../services/cartAPI';
import { useAuth } from '../context/AuthContext';
import './StarRating.css';

const StarRating = ({ 
  productId, 
  initialRating = 0, 
  maxRating = 5, 
  size = 'medium',
  readOnly = false,
  onRatingSubmit = () => {},
  showText = true
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const { currentUser } = useAuth();

  const handleRatingClick = async (newRating) => {
    if (readOnly || !currentUser) return;

    setRating(newRating);
    setIsSubmitting(true);

    try {
      const response = await cartAPI.rateItem(productId, newRating);
      setHasRated(true);
      onRatingSubmit(response);
      
      // Show success message
      setTimeout(() => {
        alert('Thank you for your rating!');
      }, 100);
      
    } catch (error) {
      console.error('Failed to submit rating:', error);
      // Revert rating on error
      setRating(initialRating);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMouseEnter = (star) => {
    if (!readOnly) {
      setHoverRating(star);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  const getRatingText = (currentRating) => {
    const texts = {
      1: 'Poor',
      2: 'Fair', 
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
    return texts[currentRating] || '';
  };

  return (
    <div className={`star-rating ${size} ${readOnly ? 'readonly' : ''}`}>
      <div className="stars-container">
        {[...Array(maxRating)].map((_, index) => {
          const starNumber = index + 1;
          const isFilled = starNumber <= displayRating;
          
          return (
            <button
              key={starNumber}
              type="button"
              className={`star ${isFilled ? 'filled' : 'empty'} ${isSubmitting ? 'submitting' : ''}`}
              onClick={() => handleRatingClick(starNumber)}
              onMouseEnter={() => handleMouseEnter(starNumber)}
              onMouseLeave={handleMouseLeave}
              disabled={readOnly || isSubmitting || hasRated}
              title={readOnly ? `Rated ${rating} stars` : `Rate ${starNumber} star${starNumber > 1 ? 's' : ''}`}
            >
              <svg 
                viewBox="0 0 24 24" 
                fill={isFilled ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                strokeWidth="1"
              >
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
            </button>
          );
        })}
      </div>

      {showText && (
        <div className="rating-info">
          {!readOnly && currentUser && !hasRated && (
            <span className="rating-prompt">
              {hoverRating ? getRatingText(hoverRating) : 'Rate this product'}
            </span>
          )}
          
          {readOnly && rating > 0 && (
            <span className="rating-display">
              {rating} star{rating > 1 ? 's' : ''} ({getRatingText(rating)})
            </span>
          )}
          
          {!currentUser && !readOnly && (
            <span className="login-required">
              Please login to rate this product
            </span>
          )}
          
          {hasRated && (
            <span className="rating-submitted">
              ✓ Thanks for rating!
            </span>
          )}

          {isSubmitting && (
            <span className="rating-submitting">
              Submitting...
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StarRating;
