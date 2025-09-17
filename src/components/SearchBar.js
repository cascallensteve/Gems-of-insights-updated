import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  // Sample searchable items
  const searchableItems = [
    // Products
    { type: 'product', title: 'Turmeric Powder', category: 'Herbs & Spices', path: '/shop/herbs-spices' },
    { type: 'product', title: 'Ginger Extract', category: 'Extracts', path: '/shop/extracts' },
    { type: 'product', title: 'Vitamin D Supplements', category: 'Supplements', path: '/shop/supplements' },
    { type: 'product', title: 'Green Tea Blend', category: 'Tea Blends', path: '/shop/tea-blends' },
    { type: 'product', title: 'Almonds', category: 'Nuts & Seeds', path: '/shop/nuts-seeds' },
    { type: 'product', title: 'Coconut Oil', category: 'Fats & Oils', path: '/shop/fats-oils' },
    
    // Pages
    { type: 'page', title: 'Natural Remedies Classes', category: 'Courses', path: '/courses' },
    { type: 'page', title: 'Expert Consultation', category: 'Services', path: '/consultation' },
    { type: 'page', title: 'About Us', category: 'Information', path: '/about' },
    { type: 'page', title: 'Contact Us', category: 'Information', path: '/contact' },
    { type: 'page', title: 'Blog', category: 'Content', path: '/blog' },
    { type: 'page', title: 'Shop', category: 'Shopping', path: '/shop' },
    
    // Categories
    { type: 'category', title: 'Herbs & Spices', category: 'Shop Category', path: '/shop/herbs-spices' },
    { type: 'category', title: 'Supplements', category: 'Shop Category', path: '/shop/supplements' },
    { type: 'category', title: 'Essential Oils', category: 'Shop Category', path: '/shop/extracts' },
    { type: 'category', title: 'Tea Blends', category: 'Shop Category', path: '/shop/tea-blends' },
    
    // Health Topics
    { type: 'topic', title: 'Natural Healing', category: 'Health Topic', path: '/blog' },
    { type: 'topic', title: 'Herbal Medicine', category: 'Health Topic', path: '/courses' },
    { type: 'topic', title: 'Wellness', category: 'Health Topic', path: '/consultation' },
    { type: 'topic', title: 'Nutrition', category: 'Health Topic', path: '/blog' },
  ];

  const handleSearch = (query) => {
    setIsLoading(true);
    
    setTimeout(() => {
      if (query.trim() === '') {
        setSearchResults([]);
      } else {
        const filtered = searchableItems.filter(item =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered.slice(0, 12));
      }
      setIsLoading(false);
    }, 300);
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleResultClick = (result) => {
    navigate(result.path);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  };

  const handlePopularTagClick = (tag) => {
    setSearchQuery(tag);
    setIsSearchOpen(true);
    handleSearch(tag);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchInputRef.current && !searchInputRef.current.closest('.search-container').contains(event.target)) {
        setIsSearchOpen(false);
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getResultIcon = (type) => {
    switch (type) {
      case 'product': return '🛍️';
      case 'page': return '📄';
      case 'category': return '🏷️';
      case 'topic': return '💡';
      default: return '🔍';
    }
  };

  return (
    <section className="search-section">
      <div className="search-container">
        <div className="search-header">
          <h2>FIND WHAT YOU NEED</h2>
          <p>Search for products, services, or health topics</p>
        </div>
        
        <div className={`search-bar-wrapper ${isSearchOpen ? 'expanded' : ''}`}>
          <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="search-input-container">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search for herbs, supplements, classes, consultations..."
                className="search-input"
                autoComplete="off"
                spellCheck="false"
                autoCorrect="off"
                autoCapitalize="off"
              />
              
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="clear-button"
                >
                  ✕
                </button>
              )}
            </div>
            
            <button type="submit" className="search-submit-btn" aria-label="Search">
            </button>
          </form>

          {isSearchOpen && (searchQuery || searchResults.length > 0) && (
            <div className="search-results">
              {isLoading ? (
                <div className="search-loading">
                  <div className="loading-spinner"></div>
                  <span>Searching...</span>
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <div className="results-header">
                    <span>Found {searchResults.length} results</span>
                  </div>
                  <ul className="results-list">
                    {searchResults.map((result, index) => (
                      <li
                        key={index}
                        className="result-item"
                        onClick={() => handleResultClick(result)}
                      >
                        <span className="result-icon">{getResultIcon(result.type)}</span>
                        <div className="result-content">
                          <span className="result-title">{result.title}</span>
                          <span className="result-category">{result.category}</span>
                        </div>
                        <svg className="result-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </li>
                    ))}
                  </ul>
                  {searchQuery && (
                    <div className="search-footer">
                      <button
                        onClick={handleSearchSubmit}
                        className="view-all-btn"
                      >
                        View all results for "{searchQuery}"
                      </button>
                    </div>
                  )}
                </>
              ) : searchQuery ? (
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <span>No results found for "{searchQuery}"</span>
                  <p>Try searching for something else or browse our categories</p>
                </div>
              ) : null}
            </div>
          )}
        </div>

        <div className="quick-access">
          <span className="quick-access-label">Popular searches:</span>
          <div className="quick-buttons">
            <button onClick={() => handlePopularTagClick('Herbs & Spices')} className="quick-btn">
              Herbs & Spices
            </button>
            <button onClick={() => handlePopularTagClick('Supplements')} className="quick-btn">
              Supplements
            </button>
            <button onClick={() => handlePopularTagClick('Classes')} className="quick-btn">
              Classes
            </button>
            <button onClick={() => handlePopularTagClick('Consultation')} className="quick-btn">
              Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchBar;