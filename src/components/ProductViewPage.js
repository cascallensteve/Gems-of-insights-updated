import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
// Tailwind conversion: removed external CSS import

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
      <div className="min-h-[60vh] grid place-items-center p-6">
        <div className="text-center">
          <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"></div>
          <p className="text-sm text-gray-700">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <button
        className="mb-4 inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-50"
        onClick={() => navigate('/shop')}
      >
        ← Back to Shop
      </button>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-3">
          <div className="relative overflow-hidden rounded-lg">
            <img className="h-80 w-full object-cover" src={product.image} alt={product.name} />
            {product.sale && (
              <div className="absolute left-3 top-3 rounded-md bg-red-600 px-2 py-1 text-xs font-semibold text-white">SALE</div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="mb-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">{product.category}</span>
            <h1 className="mt-1 text-xl font-bold text-gray-900">{product.name}</h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-700">
              <div>{'⭐'.repeat(Math.floor(product.rating))}</div>
              <span className="text-gray-600">({product.rating}/5 - 127 reviews)</span>
            </div>
            <div className="mt-2 flex flex-wrap items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">KSH {product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">KSH {product.originalPrice}</span>
              )}
              {product.sale && (
                <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">
                  Save KSH {(parseFloat(product.originalPrice?.replace(',', '') || 0) - parseFloat(product.price.replace(',', ''))).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {product.diseases && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Treats These Conditions:</h3>
              <div className="mt-1 flex flex-wrap gap-2">
                {product.diseases.map((disease, index) => (
                  <span key={index} className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-800">{disease}</span>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Quantity:</label>
              <div className="inline-flex items-center gap-3 rounded-md border border-gray-200 bg-white px-2 py-1">
                <button className="h-7 w-7 rounded-md bg-gray-50 text-gray-800 hover:bg-gray-100" onClick={() => handleQuantityChange(-1)}>-</button>
                <span className="min-w-[16px] text-center text-sm">{quantity}</span>
                <button className="h-7 w-7 rounded-md bg-gray-50 text-gray-800 hover:bg-gray-100" onClick={() => handleQuantityChange(1)}>+</button>
              </div>
            </div>

            <button className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700" onClick={handleAddToCart}>
              Add to Cart - KSH {(parseFloat(product.price.replace(',', '')) * quantity).toLocaleString()}
            </button>
            <button
              className="inline-flex items-center justify-center rounded-md border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
              onClick={() => navigate('/shop')}
            >
              Shop More Products
            </button>
          </div>

          <div className="mt-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"><span>🌿</span><span>100% Natural</span></div>
              <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"><span>🚚</span><span>Free Delivery</span></div>
              <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"><span>💯</span><span>Money Back</span></div>
              <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"><span>🧪</span><span>Lab Tested</span></div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex flex-wrap gap-2">
              <button
                className={`rounded-md px-3 py-1.5 text-sm ${selectedTab === 'description' ? 'bg-emerald-600 text-white' : 'border border-gray-200 bg-white text-gray-800 hover:bg-gray-50'}`}
                onClick={() => setSelectedTab('description')}
              >
                Description
              </button>
              <button
                className={`rounded-md px-3 py-1.5 text-sm ${selectedTab === 'usage' ? 'bg-emerald-600 text-white' : 'border border-gray-200 bg-white text-gray-800 hover:bg-gray-50'}`}
                onClick={() => setSelectedTab('usage')}
              >
                Usage & Dosage
              </button>
              <button
                className={`rounded-md px-3 py-1.5 text-sm ${selectedTab === 'ingredients' ? 'bg-emerald-600 text-white' : 'border border-gray-200 bg-white text-gray-800 hover:bg-gray-50'}`}
                onClick={() => setSelectedTab('ingredients')}
              >
                Ingredients
              </button>
            </div>

            <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-800">
              {selectedTab === 'description' && (
                <div>
                  <p>{product.description}</p>
                  {product.benefits && (
                    <div className="mt-3">
                      <h4 className="text-sm font-semibold">Key Benefits:</h4>
                      <ul className="ml-4 list-disc">
                        {product.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              {selectedTab === 'usage' && (
                <div>
                  <h4 className="text-sm font-semibold">How to Use:</h4>
                  <p>{product.usage}</p>
                  <div className="mt-2">
                    <h5 className="text-sm font-semibold">Tips for Best Results:</h5>
                    <ul className="ml-4 list-disc">
                      <li>Store in a cool, dry place</li>
                      <li>Follow recommended dosage</li>
                      <li>Consult healthcare provider if pregnant or nursing</li>
                      <li>Discontinue if any adverse reactions occur</li>
                    </ul>
                  </div>
                </div>
              )}
              {selectedTab === 'ingredients' && (
                <div>
                  <h4 className="text-sm font-semibold">Ingredients:</h4>
                  <p>{product.ingredients}</p>
                  <div className="mt-2">
                    <h5 className="text-sm font-semibold">Quality Assurance:</h5>
                    <ul className="ml-4 list-disc">
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
  );
};

export default ProductViewPage;


