import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/axios'; // ✅ FIXED: Use shared axios instance

// Initial wishlist state
const initialState = {
  items: [],
  totalItems: 0,
  loading: false
};

// Wishlist reducer
const wishlistReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    
    case 'SET_WISHLIST':
      return {
        ...state,
        items: action.payload,
        totalItems: action.payload.length,
        loading: false
      };
    
    case 'ADD_TO_WISHLIST':
      const existingItem = state.items.find(item => item.productId === action.payload.productId);
      
      if (existingItem) {
        return state; // Item already in wishlist
      }
      
      return {
        ...state,
        items: [...state.items, action.payload],
        totalItems: state.totalItems + 1
      };
    
    case 'REMOVE_FROM_WISHLIST':
      const filteredItems = state.items.filter(item => item.productId !== action.payload);
      
      return {
        ...state,
        items: filteredItems,
        totalItems: filteredItems.length
      };
    
    case 'CLEAR_WISHLIST':
      return {
        ...state,
        items: [],
        totalItems: 0
      };
    
    default:
      return state;
  }
};

// Create context
const WishlistContext = createContext();

// Wishlist provider component
export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wishlistReducer, initialState);
  const { isAuthenticated, user } = useAuth();

  // Fetch wishlist from server
  const fetchWishlist = async () => {
    if (!isAuthenticated) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // ✅ TEMPORARILY DISABLED: Wishlist API not implemented yet
      // const response = await api.get('/users/wishlist');
      // dispatch({ type: 'SET_WISHLIST', payload: response.data.wishlist || [] });
      
      // Load from localStorage for now
      const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      dispatch({ type: 'SET_WISHLIST', payload: localWishlist });
      
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      dispatch({ type: 'SET_WISHLIST', payload: [] });
    }
  };

  // Add item to wishlist
  const addToWishlist = async (product) => {
    if (!isAuthenticated) {
      // Handle guest wishlist (localStorage)
      const guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
      const existingItem = guestWishlist.find(item => item.productId === product._id);
      
      if (existingItem) {
        return { success: false, message: 'Item already in wishlist' };
      }

      const wishlistItem = {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.url || product.image,
        addedAt: new Date().toISOString()
      };

      guestWishlist.push(wishlistItem);
      localStorage.setItem('guestWishlist', JSON.stringify(guestWishlist));
      dispatch({ type: 'ADD_TO_WISHLIST', payload: wishlistItem });
      
      return { success: true };
    }

    try {
      const wishlistItem = {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.url || product.image,
        addedAt: new Date().toISOString()
      };

      // ✅ TEMPORARILY DISABLED: Wishlist API not implemented yet
      // await api.post('/api/users/wishlist', wishlistItem);
      
      // Use localStorage for now
      const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      localWishlist.push(wishlistItem);
      localStorage.setItem('wishlist', JSON.stringify(localWishlist));
      dispatch({ type: 'ADD_TO_WISHLIST', payload: wishlistItem });
      
      return { success: true };
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      return { success: false, message: 'Failed to add to wishlist' };
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) {
      // Handle guest wishlist (localStorage)
      const guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
      const filteredWishlist = guestWishlist.filter(item => item.productId !== productId);
      
      localStorage.setItem('guestWishlist', JSON.stringify(filteredWishlist));
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
      
      return { success: true };
    }

    try {
      // ✅ TEMPORARILY DISABLED: Wishlist API not implemented yet
      // await api.delete(`/api/users/wishlist/${productId}`);
      
      // Use localStorage for now
      const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const filteredWishlist = localWishlist.filter(item => item.productId !== productId);
      localStorage.setItem('wishlist', JSON.stringify(filteredWishlist));
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
      
      return { success: true };
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      return { success: false, message: 'Failed to remove from wishlist' };
    }
  };

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    return state.items.some(item => item.productId === productId);
  };

  // Move item from wishlist to cart
  const moveToCart = async (productId, addToCartFunction) => {
    const wishlistItem = state.items.find(item => item.productId === productId);
    
    if (!wishlistItem) {
      return { success: false, message: 'Item not found in wishlist' };
    }

    // Add to cart
    const cartResult = await addToCartFunction({
      productId: wishlistItem.productId,
      name: wishlistItem.name,
      price: wishlistItem.price,
      image: wishlistItem.image,
      quantity: 1
    });

    if (cartResult.success) {
      // Remove from wishlist
      await removeFromWishlist(productId);
      return { success: true };
    }

    return { success: false, message: 'Failed to add to cart' };
  };

  // Clear wishlist
  const clearWishlist = async () => {
    if (!isAuthenticated) {
      localStorage.removeItem('guestWishlist');
      dispatch({ type: 'CLEAR_WISHLIST' });
      return { success: true };
    }

    try {
      // ✅ TEMPORARILY DISABLED: Wishlist API not implemented yet
      // await api.delete('/api/users/wishlist');
      
      // Use localStorage for now
      localStorage.removeItem('wishlist');
      dispatch({ type: 'CLEAR_WISHLIST' });
      
      return { success: true };
    } catch (error) {
      console.error('Failed to clear wishlist:', error);
      return { success: false, message: 'Failed to clear wishlist' };
    }
  };

  // Load guest wishlist from localStorage on mount
  useEffect(() => {
    if (!isAuthenticated) {
      const guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
      dispatch({ type: 'SET_WISHLIST', payload: guestWishlist });
    }
  }, [isAuthenticated]);

  // Fetch wishlist when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchWishlist();
    }
  }, [isAuthenticated, user]);

  const value = {
    ...state,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    moveToCart,
    clearWishlist,
    fetchWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook to use wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext;
