import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductView.css';

const ProductViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState('description');
  const [loading, setLoading] = useState(true);

  // Sample product data - in a real app, this would come from an API
  const sampleProducts = [
    {
      id: 1,
      name: "Premium Organic Green Tea Collection",
      price: "2,499",
      originalPrice: "3,499",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg",
      category: "Tea Blends",
      subCategory: "Green Tea",
      description: "Hand-picked organic green tea leaves from high-altitude gardens. Rich in antioxidants and natural compounds that support overall wellness. This premium collection features carefully selected leaves that are harvested at peak freshness and processed using traditional methods to preserve their natural benefits.",
      benefits: ["Immune Boosting", "Energy Boosting", "Antioxidant Rich"],
      diseases: ["Fatigue", "Low Immunity", "Oxidative Stress"],
      usage: "Steep 1 teaspoon in hot water (80°C) for 3-5 minutes. Drink 2-3 times daily.",
      ingredients: "100% Organic Green Tea Leaves, Natural Antioxidants",
      sale: true,
      rating: 4.8,
      inStock: true
    },
    {
      id: 2,
      name: "Himalayan Herbal Wellness Mix",
      price: "1,850",
      originalPrice: "2,500",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      category: "Herbs & Spices",
      subCategory: "Medicinal Herbs",
      description: "Ancient Himalayan blend of 12 powerful herbs known for their traditional healing properties. This carefully crafted mixture combines herbs that have been used for centuries in Ayurvedic medicine to promote balance and wellness.",
      benefits: ["Immune Boosting", "Stress and Anxiety Relief", "Natural Energy"],
      diseases: ["Stress", "Anxiety", "Low Immunity", "Fatigue"],
      usage: "Mix 1 teaspoon with warm water or honey. Take 2 times daily, preferably on an empty stomach.",
      ingredients: "Ashwagandha, Tulsi, Ginger, Turmeric, Cinnamon, Cardamom, Black Pepper, Honey",
      sale: true,
      rating: 4.9,
      inStock: true
    },
    {
      id: 3,
      name: "Pure Turmeric Capsules",
      price: "1,299",
      originalPrice: "1,800",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg",
      category: "Supplements",
      subCategory: "Herbal Supplements",
      description: "High-potency turmeric capsules with enhanced bioavailability. Contains pure turmeric extract standardized to 95% curcuminoids, the active compounds responsible for turmeric's powerful anti-inflammatory and antioxidant properties.",
      benefits: ["Anti-inflammatory", "Antioxidant", "Joint Health", "Digestive Support"],
      diseases: ["Inflammation", "Joint Pain", "Digestive Issues", "Oxidative Stress"],
      usage: "Take 1-2 capsules daily with meals. For best absorption, take with black pepper or healthy fats.",
      ingredients: "Turmeric Root Extract (95% Curcuminoids), Black Pepper Extract (Piperine), Organic Coconut Oil",
      sale: false,
      rating: 4.7,
      inStock: true
    },
    {
      id: 4,
      name: "Lavender Essential Oil",
      price: "899",
      originalPrice: "1,200",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg",
      category: "Extracts",
      subCategory: "Essential Oils",
      description: "Pure, therapeutic-grade lavender essential oil extracted from organically grown lavender flowers. Known for its calming and soothing properties, this oil is perfect for relaxation, stress relief, and promoting restful sleep.",
      benefits: ["Stress Relief", "Sleep Support", "Skin Soothing", "Aromatherapy"],
      diseases: ["Stress", "Insomnia", "Anxiety", "Skin Irritation"],
      usage: "Add 2-3 drops to a diffuser, or dilute with carrier oil for topical use. For sleep, apply 1-2 drops to pillow or use in evening bath.",
      ingredients: "100% Pure Lavender Essential Oil (Lavandula angustifolia)",
      sale: true,
      rating: 4.6,
      inStock: true
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchProduct = () => {
      setLoading(true);
      setTimeout(() => {
        const foundProduct = sampleProducts.find(p => p.id === parseInt(id));
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          // Product not found, redirect to shop
          navigate('/shop');
        }
        setLoading(false);
      }, 500);
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!currentUser) {
      if (window.confirm('Please login to add items to cart. Would you like to login now?')) {
        navigate('/login');
      }
      return;
    }

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

  if (loading) {
    return (
      <div className="product-view-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="product-view-page">
      <div className="product-view-container">
        <button className="back-to-shop-btn" onClick={() => navigate('/shop')}>
          ← Back to Shop
        </button>
        
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
                  {'⭐'.repeat(Math.floor(product.rating))}
                </div>
                <span className="rating-text">({product.rating}/5 - 127 reviews)</span>
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

            {product.diseases && (
              <div className="product-diseases">
                <h3>Treats These Conditions:</h3>
                <div className="diseases-list">
                  {product.diseases.map((disease, index) => (
                    <span key={index} className="disease-tag">{disease}</span>
                  ))}
                </div>
              </div>
            )}

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
                    {product.benefits && (
                      <div className="benefits-section">
                        <h4>Key Benefits:</h4>
                        <ul>
                          {product.benefits.map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                
                {selectedTab === 'usage' && (
                  <div className="tab-panel">
                    <h4>How to Use:</h4>
                    <p>{product.usage}</p>
                    <div className="usage-tips">
                      <h5>Tips for Best Results:</h5>
                      <ul>
                        <li>Store in a cool, dry place</li>
                        <li>Follow recommended dosage</li>
                        <li>Consult healthcare provider if pregnant or nursing</li>
                        <li>Discontinue if any adverse reactions occur</li>
                      </ul>
                    </div>
                  </div>
                )}
                
                {selectedTab === 'ingredients' && (
                  <div className="tab-panel">
                    <h4>Ingredients:</h4>
                    <p>{product.ingredients}</p>
                    <div className="ingredients-info">
                      <h5>Quality Assurance:</h5>
                      <ul>
                        <li>All ingredients are organic and natural</li>
                        <li>No artificial preservatives or additives</li>
                        <li>Third-party tested for purity and potency</li>
                        <li>GMP certified manufacturing facility</li>
                      </ul>
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

export default ProductViewPage;


