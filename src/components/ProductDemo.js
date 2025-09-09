import React from 'react';
import ProductCard from './ProductCard';
import './ProductDemo.css';

// Sample product data to demonstrate the functionality
const sampleProducts = [
  {
    id: 1,
    name: "Packaged Activated Charcoal",
    description: "1000gms Black activated charcoal for natural detox and wellness",
    price: 500,
    photo: "https://res.cloudinary.com/dqvsjtkqw/image/upload/v1755512011/acourses_rqbgul.webp",
    category: "Extracts",
    average_rating: 4.5
  },
  {
    id: 2,
    name: "Herbal Tea Blend",
    description: "Premium organic herbal tea for relaxation and wellness",
    price: 750,
    photo: "https://res.cloudinary.com/dqvsjtkqw/image/upload/v1753882302/beautiful-african-female-florist-smiling-cutting-stems-working-flower-shop-white-wall_2_l3ozdi.webp",
    category: "Tea Blends",
    average_rating: 4.2
  },
  {
    id: 3,
    name: "Natural Wellness Kit",
    description: "Complete starter kit for natural health and wellness journey",
    price: 1200,
    photo: "https://res.cloudinary.com/dqvsjtkqw/image/upload/v1750921889/logs_co58wn.jpg",
    category: "Kits & Bundles",
    average_rating: 4.8
  }
];

const ProductDemo = () => {
  return (
    <div className="product-demo">
      <div className="demo-header">
        <h2>Product Showcase</h2>
        <p>Demonstrating enhanced cart and rating functionality</p>
      </div>
      
      <div className="products-grid">
        {sampleProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="demo-features">
        <div className="feature-list">
          <h3>New Features:</h3>
          <ul>
            <li>✅ <strong>Persistent Cart:</strong> Items now save to localStorage</li>
            <li>✅ <strong>API Integration:</strong> Cart syncs with backend when logged in</li>
            <li>✅ <strong>Star Ratings:</strong> Rate products (login required)</li>
            <li>✅ <strong>Smart Fallback:</strong> Works offline with local storage</li>
            <li>✅ <strong>Better UI:</strong> Improved "Back to Shopping" button</li>
          </ul>
        </div>
        
        <div className="api-endpoints">
          <h3>API Endpoints:</h3>
          <ul>
            <li><code>POST /add-to-cart/item_id/</code> - Add to cart</li>
            <li><code>GET /view-cart</code> - View cart items</li>
            <li><code>POST /remove-from-cart/item_id/</code> - Remove from cart</li>
            <li><code>POST /rate-item/item_id/</code> - Rate product</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDemo;
