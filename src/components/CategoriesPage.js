import React, { useState } from 'react';
import { naturalRemedyCategories } from '../data/categories';
import './CategoriesPage.css';

const CategoriesPage = ({ onNavigateToShop }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleShopCategory = (category) => {
    if (onNavigateToShop) {
      onNavigateToShop(category.name);
    }
  };

  return (
    <div className="categories-page">
      <div className="container">
        {/* Header */}
        <div className="categories-header">
          <h1 className="categories-title">Natural Remedy Categories</h1>
          <p className="categories-subtitle">
            Explore our comprehensive collection of natural healing approaches from around the world
          </p>
        </div>

        {/* Categories Grid */}
        <div className="categories-grid">
          {naturalRemedyCategories.map((category) => (
            <div 
              key={category.id} 
              className="category-card"
              onClick={() => handleCategorySelect(category)}
            >
              <div className="category-image">
                <img src={category.image} alt={category.name} />
                <div className="category-overlay">
                  <div className="category-icon">{category.icon}</div>
                  <button 
                    className="shop-category-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShopCategory(category);
                    }}
                  >
                    Shop Now
                  </button>
                </div>
              </div>
              <div className="category-content">
                <h3 className="category-name">
                  <span className="category-emoji">{category.icon}</span>
                  {category.name}
                </h3>
                <p className="category-description">{category.description}</p>
                <div className="category-examples">
                  <strong>Examples:</strong>
                  <div className="examples-tags">
                    {category.examples.slice(0, 3).map((example, index) => (
                      <span key={index} className="example-tag">{example}</span>
                    ))}
                    {category.examples.length > 3 && (
                      <span className="example-tag more">+{category.examples.length - 3} more</span>
                    )}
                  </div>
                </div>
                <div className="category-benefits">
                  <strong>Benefits:</strong>
                  <ul>
                    {category.benefits.slice(0, 2).map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Categories */}
        <div className="featured-categories">
          <h2>Most Popular Categories</h2>
          <div className="featured-grid">
            {naturalRemedyCategories.slice(0, 4).map((category) => (
              <div key={category.id} className="featured-category">
                <div className="featured-icon">{category.icon}</div>
                <h4>{category.name}</h4>
                <p>{category.examples.length} remedies available</p>
                <button 
                  className="explore-btn"
                  onClick={() => handleShopCategory(category)}
                >
                  Explore
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Detail Modal */}
      {selectedCategory && (
        <div className="category-modal-overlay" onClick={() => setSelectedCategory(null)}>
          <div className="category-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedCategory(null)}>×</button>
            <div className="modal-header">
              <div className="modal-icon">{selectedCategory.icon}</div>
              <h2>{selectedCategory.name}</h2>
              <p>{selectedCategory.description}</p>
            </div>
            <div className="modal-content">
              <div className="modal-section">
                <h3>Examples & Applications</h3>
                <div className="modal-examples">
                  {selectedCategory.examples.map((example, index) => (
                    <div key={index} className="modal-example">{example}</div>
                  ))}
                </div>
              </div>
              <div className="modal-section">
                <h3>Key Benefits</h3>
                <ul className="modal-benefits">
                  {selectedCategory.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
              <div className="modal-actions">
                <button 
                  className="modal-shop-btn"
                  onClick={() => {
                    handleShopCategory(selectedCategory);
                    setSelectedCategory(null);
                  }}
                >
                  Shop {selectedCategory.name}
                </button>
                <button 
                  className="modal-close-btn"
                  onClick={() => setSelectedCategory(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
