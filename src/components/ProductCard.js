import React from 'react';
import AddToCartButton from './AddToCartButton';
import StarRating from './StarRating';
// Tailwind conversion: removed external CSS import

const ProductCard = ({ product }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow">
      <div className="relative">
        <img
          className="h-48 w-full object-cover"
          src={product.photo || '/images/default-product.jpg'}
          alt={product.name}
          onError={(e) => {
            e.target.src = '/images/default-product.jpg';
          }}
        />
        {product.average_rating && (
          <div className="absolute left-3 top-3 rounded-md bg-black/70 px-2 py-0.5 text-xs font-semibold text-white">
            ⭐ {product.average_rating}
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          {product.category}
        </div>

        <h3 className="mt-1 line-clamp-2 text-lg font-semibold text-gray-900">
          {product.name}
        </h3>

        <p className="mt-1 line-clamp-3 text-sm text-gray-700">
          {product.description}
        </p>

        <div className="mt-2 text-base font-bold text-gray-900">
          KES {typeof product.price === 'number' ? product.price.toLocaleString() : product.price}
        </div>

        <div className="mt-2">
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

        <div className="mt-3">
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
