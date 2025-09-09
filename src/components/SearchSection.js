import React, { useState } from 'react';
import './SearchSection.css';

const SearchSection = ({ onSearch, categories = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ searchTerm, category: selectedCategory });
  };

  const handlePopularTagClick = (tag) => {
    setSearchTerm(tag);
    // Optionally trigger search immediately
    onSearch({ searchTerm: tag, category: selectedCategory });
  };

  const defaultCategories = [
    'All Categories',
    'Anti-Inflammatory',
    'Digestive Health', 
    'Immune Support',
    'Skin & Wound Care',
    'Stress & Anxiety',
    'Pain Management',
    'Cardiovascular',
    'Sleep & Relaxation',
    'Urinary Health',
    'Brain Health',
    'Detox & Cleanse',
    'Spices & Seasonings',
    'Superfoods',
    'Natural Flavoring'
  ];

  const categoryList = categories.length > 0 ? categories : defaultCategories;

  return (
    <section className="search-section">
      <div className="search-container">
        <div className="search-header">
          <h2 className="search-title">FIND WHAT YOU NEED</h2>
          <p className="search-subtitle">Search for products, services, or health topics</p>
        </div>
        
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <div className="search-input-wrapper">
              <div className="search-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for products, remedies, herbs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              {categoryList.map((category, index) => (
                <option key={index} value={category.toLowerCase().replace(' ', '-')}>
                  {category}
                </option>
              ))}
            </select>
            
            <button type="submit" className="search-btn">
              Search
            </button>
          </div>
        </form>

        <div className="popular-searches">
          <span className="popular-label">Popular searches:</span>
          <div className="popular-tags">
            {['Herbs & Spices', 'Supplements', 'Classes', 'Consultation'].map((tag, index) => (
              <button 
                key={index} 
                className="popular-tag"
                onClick={() => handlePopularTagClick(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
