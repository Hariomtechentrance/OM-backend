import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useStock } from './StockContext';
import api from '../api/axios';

// LocalStorage keys
const CART_STORAGE_KEY = 'blacklocust_cart';

// LocalStorage helper functions
const saveCartToLocalStorage = (cartState) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
  } catch (error) {
    console.warn('Failed to save cart to LocalStorage:', error);
  }
};

const loadCartFromLocalStorage = () => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  } catch (error) {
    console.warn('Failed to load cart from LocalStorage:', error);
  }
  return null;
};

const clearCartFromLocalStorage = () => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear cart from LocalStorage:', error);
  }
};

// Initial cart state
const initialState = {
  items: [],
  totalItems: 0,
  totalAmount: 0
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const payload = action.payload;
      
      const existingItem = state.items.find(item => item.uniqueId === payload.uniqueId);
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.uniqueId === payload.uniqueId
              ? { ...item, quantity: payload.quantity }
              : item
          ),
          totalItems: state.totalItems + (payload.quantity - existingItem.quantity),
          totalAmount: state.totalAmount + (payload.price * (payload.quantity - existingItem.quantity))
        };
      } else {
        return {
          ...state,
          items: [...state.items, payload],
          totalItems: state.totalItems + payload.quantity,
          totalAmount: state.totalAmount + (payload.price * payload.quantity)
        };
      }

    case 'REMOVE_FROM_CART':
      const uniqueId = action.payload;
      const itemToRemove = state.items.find(item => item.uniqueId === uniqueId);
      
      if (!itemToRemove) return state;
      
      return {
        ...state,
        items: state.items.filter(item => item.uniqueId !== uniqueId),
        totalItems: state.totalItems - itemToRemove.quantity,
        totalAmount: state.totalAmount - (itemToRemove.price * itemToRemove.quantity)
      };

    case 'UPDATE_QUANTITY':
      const { uniqueId: updateId, quantity } = action.payload;
      const itemToUpdate = state.items.find(item => item.uniqueId === updateId);
      
      if (!itemToUpdate) return state;
      
      const quantityDifference = quantity - itemToUpdate.quantity;
      
      return {
        ...state,
        items: state.items.map(item =>
          item.uniqueId === updateId
            ? { ...item, quantity }
            : item
        ),
        totalItems: state.totalItems + quantityDifference,
        totalAmount: state.totalAmount + (itemToUpdate.price * quantityDifference)
      };

    case 'CLEAR_CART':
      return initialState;

    case 'SET_CART':
      return {
        ...action.payload,
        totalItems: action.payload.items.length,
        totalAmount: action.payload.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };

    default:
      return state;
  }
};

// Create context
const CartContext = createContext();

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Get image URL helper
const getImageUrl = (product) => {
  if (product.images && product.images.length > 0) {
    return product.images[0]?.url || product.images[0];
  }
  if (product.image) {
    return product.image;
  }
  return "https://dummyimage.com/600x600/cccccc/000000&text=Product";
};

// Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { decreaseStock, increaseStock } = useStock();

  // Load cart from LocalStorage or backend on mount
  useEffect(() => {
    const loadCart = async () => {
      const token = localStorage.getItem("token");
      
      // For both guest and logged-in users, start with empty cart
      // Only load from backend if user has active session items
      const sessionCart = sessionStorage.getItem('sessionCart');
      if (sessionCart) {
        // User has items in current session
        const cartData = JSON.parse(sessionCart);
        dispatch({
          type: 'SET_CART',
          payload: cartData
        });
        
        // If logged in, sync to backend
        if (token) {
          try {
            await saveCartToBackend();
          } catch (error) {
            console.error('❌ Cart sync error:', error);
          }
        }
      } else {
        // Start with empty cart for all users
        dispatch({
          type: 'CLEAR_CART'
        });
      }
    };

    loadCart();
  }, []);

  // Save cart to sessionStorage and backend for logged-in users
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // Save to sessionStorage for current session
    if (state.items.length > 0) {
      sessionStorage.setItem('sessionCart', JSON.stringify(state));
    }
    
    // Also save to backend if user is logged in
    if (token && state.items.length > 0) {
      saveCartToBackend();
    }
  }, [state]);

  // Merge carts function
  const mergeCarts = (localCart, backendCart) => {
    const mergedItems = [...localCart.items];
    
    // Add backend items that aren't in local cart
    backendCart.items.forEach(backendItem => {
      const existingItem = mergedItems.find(item => item.uniqueId === backendItem.uniqueId);
      if (!existingItem) {
        mergedItems.push(backendItem);
      }
    });
    
    return {
      items: mergedItems,
      totalItems: mergedItems.length,
      totalAmount: mergedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
  };

  const saveCartToBackend = async () => {
    // Cart is persisted via add/update/remove endpoints; no bulk sync route on API.
  };

  // Add to cart function
  const addToCart = async (product, quantity = 1, size, color) => {
    const token = localStorage.getItem("token");
    
    console.log('🛒 ADD TO CART - Token exists:', !!token);
    console.log('🛒 ADD TO CART - Product:', product.name);
    
    if (!token) {
      console.error('❌ No token found, user not authenticated');
      toast.error('Please login to add items to cart');
      return;
    }
    
    try {
      const uniqueId = `${product._id}-${size || 'default'}-${color || 'default'}`;
      
      const cartItem = {
        uniqueId,
        product: product._id,
        name: product.name,
        price: product.price,
        image: getImageUrl(product),
        quantity,
        size,
        color
      };
      
      // Add to local state (works for both logged-in and guest users)
      dispatch({
        type: 'ADD_TO_CART',
        payload: cartItem
      });

      // If user is logged in, also sync to backend
      if (token) {
        try {
          const res = await api.post('/cart/add', {
            productId: product._id,
            quantity,
            size,
            color
          });
          console.log('✅ Added to cart (backend):', res.data);
        } catch (backendError) {
          console.error('❌ Backend cart add error:', backendError.response?.data || backendError.message);
          // Don't show error to user since local cart still works
          console.log('🔄 Cart saved locally only');
        }
      }
      
      toast.success(`${product.name} added to cart!`);
      
    } catch (error) {
      console.error('❌ Cart add error:', error.response?.data || error.message);
      toast.error('Failed to add to cart');
    }
  };

  // Remove from cart function
  const removeFromCart = async (uniqueId) => {
    const itemToRemove = state.items.find(item => item.uniqueId === uniqueId);
    if (!itemToRemove) return;

    const token = localStorage.getItem("token");

    try {
      // Decrease stock back when item is removed
      decreaseStock(itemToRemove.product, itemToRemove.size, itemToRemove.quantity);
      
      // Remove from local state (works for both logged-in and guest users)
      dispatch({
        type: 'REMOVE_FROM_CART',
        payload: uniqueId
      });

      // If user is logged in, also remove from backend
      if (token) {
        try {
          await api.delete('/cart/line', {
            data: {
              productId: typeof itemToRemove.product === 'object' && itemToRemove.product?._id
                ? itemToRemove.product._id
                : itemToRemove.product,
              size: itemToRemove.size,
              color: itemToRemove.color
            }
          });
          console.log('✅ Removed from cart (backend)');
        } catch (backendError) {
          console.error('❌ Backend cart remove error:', backendError.response?.data || backendError.message);
          console.log('🔄 Cart removed locally only');
        }
      }
      
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('❌ Cart remove error:', error);
      toast.error('Failed to remove item');
    }
  };

  // Update quantity function
  const updateQuantity = async (uniqueId, quantity) => {
    if (quantity < 1) return;

    const item = state.items.find(item => item.uniqueId === uniqueId);
    if (!item) return;

    const quantityDifference = quantity - item.quantity;
    const token = localStorage.getItem("token");

    try {
      if (quantityDifference > 0) {
        // Decrease stock
        decreaseStock(item.product, item.size, quantityDifference);
      } else if (quantityDifference < 0) {
        // Increase stock
        increaseStock(item.product, item.size, Math.abs(quantityDifference));
      }
      
      // Update local state (works for both logged-in and guest users)
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: {
          uniqueId,
          quantity
        }
      });

      // If user is logged in, also update backend
      if (token) {
        try {
          await api.put('/cart/line', {
            productId: typeof item.product === 'object' && item.product?._id
              ? item.product._id
              : item.product,
            size: item.size,
            color: item.color,
            quantity
          });
          console.log('✅ Updated quantity (backend)');
        } catch (backendError) {
          console.error('❌ Backend cart update error:', backendError.response?.data || backendError.message);
          console.log('🔄 Cart updated locally only');
        }
      }
      
    } catch (error) {
      console.error('❌ Cart update error:', error);
      toast.error('Failed to update quantity');
    }
  };

  // Clear cart function
  const clearCart = async () => {
    const token = localStorage.getItem("token");
    
    try {
      // Return all stock to original levels
      state.items.forEach(item => {
        increaseStock(item.product, item.size, item.quantity);
      });
      
      // Clear local state (works for both logged-in and guest users)
      dispatch({ type: 'CLEAR_CART' });
      
      // Clear LocalStorage
      clearCartFromLocalStorage();
      
      // If user is logged in, also clear backend
      if (token) {
        try {
          await api.delete('/cart');
          console.log('✅ Cart cleared (backend)');
        } catch (backendError) {
          console.error('❌ Backend cart clear error:', backendError.response?.data || backendError.message);
          console.log('🔄 Cart cleared locally only');
        }
      }
      
      toast.success('Cart cleared');
    } catch (error) {
      console.error('❌ Cart clear error:', error);
      toast.error('Failed to clear cart');
    }
  };

  const value = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
