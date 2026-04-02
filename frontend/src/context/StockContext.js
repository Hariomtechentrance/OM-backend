import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Stock management context
const StockContext = createContext();

// Initial stock data - this would come from your backend API
const initialStock = {
  // Product 1 - Classic Oxford Shirt
  '1': {
    'S': { stock: 15, originalStock: 15 },
    'M': { stock: 20, originalStock: 20 },
    'L': { stock: 12, originalStock: 12 },
    'XL': { stock: 8, originalStock: 8 },
    'XXL': { stock: 5, originalStock: 5 }
  },
  // Product 2 - Executive Wool Blazer
  '2': {
    'S': { stock: 8, originalStock: 8 },
    'M': { stock: 12, originalStock: 12 },
    'L': { stock: 6, originalStock: 6 },
    'XL': { stock: 3, originalStock: 3 }
  },
  // Product 3 - Designer Denim Jacket
  '3': {
    'S': { stock: 10, originalStock: 10 },
    'M': { stock: 15, originalStock: 15 },
    'L': { stock: 8, originalStock: 8 },
    'XL': { stock: 5, originalStock: 5 },
    'XXL': { stock: 2, originalStock: 2 }
  },
  // Product 4 - Luxury Cotton Polo
  '4': {
    'S': { stock: 18, originalStock: 18 },
    'M': { stock: 25, originalStock: 25 },
    'L': { stock: 20, originalStock: 20 },
    'XL': { stock: 12, originalStock: 12 },
    'XXL': { stock: 6, originalStock: 6 }
  },
  // Product 5 - Tailored Chino Pants
  '5': {
    '28': { stock: 8, originalStock: 8 },
    '30': { stock: 12, originalStock: 12 },
    '32': { stock: 15, originalStock: 15 },
    '34': { stock: 10, originalStock: 10 },
    '36': { stock: 7, originalStock: 7 },
    '38': { stock: 4, originalStock: 4 }
  },
  // Product 6 - Premium Leather Belt
  '6': {
    'S': { stock: 25, originalStock: 25 },
    'M': { stock: 30, originalStock: 30 },
    'L': { stock: 20, originalStock: 20 },
    'XL': { stock: 15, originalStock: 15 }
  },
  // Product 7 - Classic Canvas Sneakers
  '7': {
    '7': { stock: 12, originalStock: 12 },
    '8': { stock: 15, originalStock: 15 },
    '9': { stock: 18, originalStock: 18 },
    '10': { stock: 20, originalStock: 20 },
    '11': { stock: 15, originalStock: 15 }
  },
  // Product 8 - Wool Winter Coat
  '8': {
    'S': { stock: 6, originalStock: 6 },
    'M': { stock: 10, originalStock: 10 },
    'L': { stock: 8, originalStock: 8 },
    'XL': { stock: 4, originalStock: 4 },
    'XXL': { stock: 2, originalStock: 2 }
  },
  // Product 9 - Casual Shorts
  '9': {
    '28': { stock: 20, originalStock: 20 },
    '30': { stock: 25, originalStock: 25 },
    '32': { stock: 30, originalStock: 30 },
    '34': { stock: 18, originalStock: 18 },
    '36': { stock: 12, originalStock: 12 }
  },
  // Product 10 - Formal Dress Shirt
  '10': {
    'S': { stock: 14, originalStock: 14 },
    'M': { stock: 22, originalStock: 22 },
    'L': { stock: 16, originalStock: 16 },
    'XL': { stock: 10, originalStock: 10 },
    'XXL': { stock: 6, originalStock: 6 }
  },
  // Product 11 - Sports Jacket
  '11': {
    'S': { stock: 8, originalStock: 8 },
    'M': { stock: 12, originalStock: 12 },
    'L': { stock: 9, originalStock: 9 },
    'XL': { stock: 5, originalStock: 5 },
    'XXL': { stock: 3, originalStock: 3 }
  },
  // Product 12 - Classic Jeans
  '12': {
    '28': { stock: 15, originalStock: 15 },
    '30': { stock: 20, originalStock: 20 },
    '32': { stock: 25, originalStock: 25 },
    '34': { stock: 18, originalStock: 18 },
    '36': { stock: 10, originalStock: 10 },
    '38': { stock: 6, originalStock: 6 }
  },
  // Product 6 - Explorer Kids Jacket (Note: ID 6 in HomePage)
  '6': {
    'XS': { stock: 12, originalStock: 12 },
    'S': { stock: 18, originalStock: 18 },
    'M': { stock: 15, originalStock: 15 },
    'L': { stock: 10, originalStock: 10 },
    'XL': { stock: 8, originalStock: 8 }
  },
  // Product 7 - Premium Leather Belt (Note: ID 7 in HomePage)
  '7': {
    'S': { stock: 25, originalStock: 25 },
    'M': { stock: 30, originalStock: 30 },
    'L': { stock: 20, originalStock: 20 },
    'XL': { stock: 15, originalStock: 15 }
  },
  // Product 8 - Summer Linen Shirt (Note: ID 8 in HomePage)
  '8': {
    'S': { stock: 16, originalStock: 16 },
    'M': { stock: 22, originalStock: 22 },
    'L': { stock: 18, originalStock: 18 },
    'XL': { stock: 12, originalStock: 12 },
    'XXL': { stock: 7, originalStock: 7 }
  },
  // Product 13 - Wool Winter Coat
  '13': {
    'S': { stock: 6, originalStock: 6 },
    'M': { stock: 10, originalStock: 10 },
    'L': { stock: 8, originalStock: 8 },
    'XL': { stock: 4, originalStock: 4 },
    'XXL': { stock: 2, originalStock: 2 }
  },
  // Product 14 - Casual Shorts
  '14': {
    '28': { stock: 20, originalStock: 20 },
    '30': { stock: 25, originalStock: 25 },
    '32': { stock: 30, originalStock: 30 },
    '34': { stock: 18, originalStock: 18 },
    '36': { stock: 12, originalStock: 12 }
  },
  // Product 15 - Formal Dress Shirt
  '15': {
    'S': { stock: 14, originalStock: 14 },
    'M': { stock: 22, originalStock: 22 },
    'L': { stock: 16, originalStock: 16 },
    'XL': { stock: 10, originalStock: 10 },
    'XXL': { stock: 6, originalStock: 6 }
  },
  // Product 16 - Sports Jacket
  '16': {
    'S': { stock: 8, originalStock: 8 },
    'M': { stock: 12, originalStock: 12 },
    'L': { stock: 9, originalStock: 9 },
    'XL': { stock: 5, originalStock: 5 },
    'XXL': { stock: 3, originalStock: 3 }
  },
  // Product 17 - Classic Jeans
  '17': {
    '28': { stock: 15, originalStock: 15 },
    '30': { stock: 20, originalStock: 20 },
    '32': { stock: 25, originalStock: 25 },
    '34': { stock: 18, originalStock: 18 },
    '36': { stock: 10, originalStock: 10 },
    '38': { stock: 6, originalStock: 6 }
  }
};

// Stock reducer
const stockReducer = (state, action) => {
  switch (action.type) {
    case 'DECREASE_STOCK':
      const { productId, size, quantity } = action.payload;
      const currentStock = state[productId]?.[size]?.stock || 0;
      
      if (currentStock >= quantity) {
        return {
          ...state,
          [productId]: {
            ...state[productId],
            [size]: {
              ...state[productId][size],
              stock: currentStock - quantity
            }
          }
        };
      }
      return state; // Don't update if insufficient stock

    case 'INCREASE_STOCK':
      const { productId: incProductId, size: incSize, quantity: incQuantity } = action.payload;
      const incCurrentStock = state[incProductId]?.[incSize]?.stock || 0;
      const originalStock = state[incProductId]?.[incSize]?.originalStock || 0;
      
      // Don't exceed original stock
      const newStock = Math.min(incCurrentStock + incQuantity, originalStock);
      
      return {
        ...state,
        [incProductId]: {
          ...state[incProductId],
          [incSize]: {
            ...state[incProductId][incSize],
            stock: newStock
          }
        }
      };

    case 'RESET_STOCK':
      // Reset all stock to original values
      const resetState = {};
      Object.keys(state).forEach(productId => {
        resetState[productId] = {};
        Object.keys(state[productId]).forEach(size => {
          resetState[productId][size] = {
            stock: state[productId][size].originalStock,
            originalStock: state[productId][size].originalStock
          };
        });
      });
      return resetState;

    case 'INITIALIZE_STOCK':
      // Initialize stock for a new product
      const { productId: initProductId, sizes } = action.payload;
      const productStock = {};
      
      sizes.forEach(sizeObj => {
        productStock[sizeObj.name] = {
          stock: sizeObj.stock,
          originalStock: sizeObj.stock
        };
      });
      
      return {
        ...state,
        [initProductId]: productStock
      };

    default:
      return state;
  }
};

// Stock provider component
export const StockProvider = ({ children }) => {
  const [stockState, dispatch] = useReducer(stockReducer, initialStock);

  // Save stock to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('productStock', JSON.stringify(stockState));
  }, [stockState]);

  // Actions
  const decreaseStock = (productId, size, quantity = 1) => {
    dispatch({
      type: 'DECREASE_STOCK',
      payload: { productId, size, quantity }
    });
  };

  const increaseStock = (productId, size, quantity = 1) => {
    dispatch({
      type: 'INCREASE_STOCK',
      payload: { productId, size, quantity }
    });
  };

  const getStock = (productId, size) => {
    return stockState[productId]?.[size]?.stock || 0;
  };

  const getOriginalStock = (productId, size) => {
    return stockState[productId]?.[size]?.originalStock || 0;
  };

  const initializeProductStock = (productId, sizes) => {
    dispatch({
      type: 'INITIALIZE_STOCK',
      payload: { productId, sizes }
    });
  };

  const resetAllStock = () => {
    dispatch({ type: 'RESET_STOCK' });
  };

  const value = {
    stockState,
    decreaseStock,
    increaseStock,
    getStock,
    getOriginalStock,
    initializeProductStock,
    resetAllStock
  };

  return (
    <StockContext.Provider value={value}>
      {children}
    </StockContext.Provider>
  );
};

// Hook to use stock context
export const useStock = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
};

export default StockContext;
