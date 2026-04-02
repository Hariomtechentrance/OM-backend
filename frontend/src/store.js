import { configureStore } from '@reduxjs/toolkit';

// Import slices (to be created)
// import productReducer from './slices/productSlice';
// import cartReducer from './slices/cartSlice';
// import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    // products: productReducer,
    // cart: cartReducer,
    // user: userReducer,
  },
});

export default store;
