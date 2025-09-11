import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import Checkout from './Checkout';
// Tailwind conversion: removed external CSS import

const Cart = ({ isOpen, onClose, onOpenQuickView }) => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    window.location.href = '/checkout';
  };

  const handleOrderComplete = (orderData) => {
    alert(`Order confirmed! Order ID: ${orderData.id}\nTotal: KSH ${orderData.total.toLocaleString()}\nThank you for your order!`);
    clearCart();
    setShowCheckout(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold text-gray-900">Shopping Cart ({cartItems.length} items)</h2>
          <button className="text-2xl leading-none text-gray-600 hover:text-emerald-700" onClick={onClose}>×</button>
        </div>

        <div className="p-4">
          {cartItems.length === 0 ? (
            <div className="rounded-xl border border-emerald-100 bg-white p-6 text-center text-gray-700">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-2xl">🛒</div>
              <h3 className="text-lg font-semibold text-gray-900">Your cart is empty</h3>
              <p>Add some natural remedies to your cart to get started!</p>
              <button className="mt-3 inline-flex items-center justify-center rounded-md border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-[64px_1fr_auto] items-center gap-3 rounded-lg border border-emerald-100 bg-white p-3 shadow-sm">
                    <img className="h-16 w-16 rounded object-cover" src={item.image} alt={item.name} />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{item.name}</h4>
                      <p className="text-xs text-gray-600">{item.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center rounded-md border border-gray-300">
                        <button className="px-2 py-1 text-lg disabled:opacity-40" onClick={() => handleQuantityChange(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                        <span className="px-3 text-sm">{item.quantity}</span>
                        <button className="px-2 py-1 text-lg" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <div className="text-sm text-gray-700">KSH {(parseFloat(item.price.replace(',', '')) * item.quantity).toLocaleString()}</div>
                      <button className="text-xs text-red-600 hover:underline" onClick={() => removeFromCart(item.id)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
 
              <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>KSH {getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="mt-2 flex items-center justify-between border-t pt-2 text-base font-semibold">
                  <span>Total:</span>
                  <span>KSH {getCartTotal().toLocaleString()}</span>
                </div>
                
                <div className="mt-3 flex items-center justify-between gap-2">
                  <button className="inline-flex items-center justify-center rounded-md border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50" onClick={onClose}>
                    Continue Shopping
                  </button>
                  <button className="inline-flex items-center justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600" onClick={handleCheckout}>
                    Proceed to Checkout
                  </button>
                </div>
                
                <button className="mt-3 text-sm text-red-600 hover:underline" onClick={clearCart}>
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      {showCheckout && (
        <Checkout
          cartItems={cartItems}
          onClose={() => setShowCheckout(false)}
          onOrderComplete={handleOrderComplete}
        />
      )}
    </div>
  );
};

export default Cart;
