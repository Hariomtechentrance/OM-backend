// Clear all cart data to fix guest cart issue
console.log('🗑️ CLEARING GUEST CART DATA...');

// Clear all cart-related localStorage data
localStorage.removeItem('blacklocust_cart');
localStorage.removeItem('token');
localStorage.removeItem('refreshToken');
localStorage.removeItem('tokenExpiry');
localStorage.removeItem('isAuthenticated');
localStorage.removeItem('user');

// Clear any other potential cart keys
Object.keys(localStorage).forEach(key => {
  if (key.toLowerCase().includes('cart')) {
    localStorage.removeItem(key);
    console.log('🗑️ Removed cart key:', key);
  }
});

console.log('✅ Guest cart data cleared!');
console.log('🔄 Please refresh the browser page');
console.log('🛒 Cart should now be empty for non-logged-in users');
