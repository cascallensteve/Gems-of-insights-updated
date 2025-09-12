import React, { useState, useEffect } from 'react';
import { blogService } from '../services/blogService';
import './LikeButton.css';

const normalizeLikes = (value) => {
  if (Array.isArray(value)) return value.length;
  if (typeof value === 'number' && isFinite(value)) return value;
  if (value && typeof value === 'object') {
    // Common API shapes
    if (typeof value.count === 'number') return value.count;
    if (typeof value.total === 'number') return value.total;
    return 0;
  }
  const coerced = Number(value);
  return isFinite(coerced) ? coerced : 0;
};

const LikeButton = ({ blogId, initialLikes = 0, initialIsLiked = false, size = 'medium' }) => {
  const [likes, setLikes] = useState(normalizeLikes(initialLikes));
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is authenticated
  const isAuthenticated = () => {
    return localStorage.getItem('token') || localStorage.getItem('authToken');
  };

  useEffect(() => {
    // Skip automatic fetching to avoid CORS errors on page load
    // Like status will be fetched when user actually interacts with the button
    setLikes(normalizeLikes(initialLikes));
  }, [blogId, initialLikes]);

  const handleLike = async () => {
    // For now, let's allow testing without authentication
    // if (!isAuthenticated()) {
    //   alert('Please login to like blogs');
    //   return;
    // }

    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await blogService.likeBlog(blogId);
      
      // Update the UI optimistically
      if (isLiked) {
        setLikes(prev => Math.max(0, prev - 1));
        setIsLiked(false);
      } else {
        setLikes(prev => prev + 1);
        setIsLiked(true);
      }

      console.log('Like result:', result.message || result);
      
      // Refresh the like count from server
      setTimeout(async () => {
        try {
          const likeData = await blogService.getBlogLikes(blogId);
          setLikes(normalizeLikes(likeData.likes));
          // Don't update isLiked here to avoid flickering
        } catch (refreshError) {
          console.warn('Could not refresh like count:', refreshError);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error liking blog:', error);
      setError(error.message);
      
      // Show user-friendly error message
      if (error.message && error.message.includes('Authentication')) {
        alert('Please login to like blogs');
      } else if (error.message && error.message.includes('CORS')) {
        // For CORS issues, still update UI optimistically
        if (isLiked) {
          setLikes(prev => Math.max(0, prev - 1));
          setIsLiked(false);
        } else {
          setLikes(prev => prev + 1);
          setIsLiked(true);
        }
        console.warn('CORS issue, updated UI optimistically');
      } else {
        alert('Failed to like blog. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`like-button-container ${size}`}>
      <button
        className={`like-button ${isLiked ? 'liked' : ''} ${isLoading ? 'loading' : ''}`}
        onClick={handleLike}
        disabled={isLoading}
        title={isLiked ? 'Unlike this post' : 'Like this post'}
      >
        <span className="like-icon" aria-hidden="true">
          {isLiked ? '❤️' : '❤'}
        </span>
        <span className="like-count">{likes || 0}</span>
      </button>
      {error && <div className="like-error">{error}</div>}
    </div>
  );
};

export default LikeButton;
