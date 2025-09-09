import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartAPI } from '../services/cartAPI';

const CartContext = createContext();

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const storedCart = localStorage.getItem('cartItems');
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};

// Save cart to localStorage
const saveCartToStorage = (items) => {
  try {
    localStorage.setItem('cartItems', JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id)
      };
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0)
      };
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };
    
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: loadCartFromStorage()
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    saveCartToStorage(state.items);
  }, [state.items]);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = async (productId) => {
    try {
      // Call API to remove item from cart
      const response = await cartAPI.removeFromCart(productId);
      console.log('Item removed from cart:', response);
      
      // Update local state after successful API call
      dispatch({ type: 'REMOVE_FROM_CART', payload: { id: productId } });
      
      // Show success message using alert for now (can be upgraded to toast later)
      if (response.message) {
        alert(response.message);
      } else {
        alert('Item removed from cart successfully!');
      }
      
      return response;
    } catch (error) {
      console.error('Error removing item from cart:', error);
      
      // Check if it's an auth error
      if (error.message && error.message.includes('Authentication credentials were not provided')) {
        alert('Authentication required. Please log in first.\n\nDebugging info:\n' + error.message);
      } else if (error.message && error.message.includes('403')) {
        alert('Access denied. Please check your login status.\n\nDebugging info:\n' + error.message);
      } else {
        alert('Failed to remove item from cart. Please try again.\n\nError: ' + (error.message || 'Unknown error'));
      }
      
      // Don't remove from local state if API fails due to auth
      // dispatch({ type: 'REMOVE_FROM_CART', payload: { id: productId } });
      throw error;
    }
  };

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => {
      let price;
      if (typeof item.price === 'string') {
        // Handle string prices like "KSh 2,499"
        price = parseFloat(item.price.replace(/[^\d.-]/g, ''));
      } else {
        // Handle numeric prices
        price = parseFloat(item.price);
      }
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
