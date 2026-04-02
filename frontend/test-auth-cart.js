// Test authentication and cart integration
console.log('🔍 TESTING AUTH & CART INTEGRATION...');

// Check current authentication state
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');
const isAuthenticated = !!token;

console.log('🔑 Authentication Status:');
console.log('  - Token exists:', !!token);
console.log('  - User data:', !!user);
console.log('  - Is Authenticated:', isAuthenticated);

// Check cart state
const cartData = localStorage.getItem('blacklocust_cart');
console.log('🛒 Cart Status:');
console.log('  - Cart data exists:', !!cartData);
console.log('  - Cart items:', cartData ? JSON.parse(cartData).items?.length || 0 : 0);

// Instructions
console.log('\n📋 TEST INSTRUCTIONS:');
console.log('1. Login with: admin@test.com / Admin@123');
console.log('2. Check console for authentication logs');
console.log('3. Try adding product to cart');
console.log('4. Verify no "Please login" error appears');
console.log('5. Check cart count updates correctly');

console.log('\n🔄 If issues persist:');
console.log('- Clear browser cache (Ctrl+Shift+R)');
console.log('- Open browser console (F12)');
console.log('- Check Network tab for API calls');
console.log('- Verify token in localStorage');

console.log('\n✅ Expected behavior:');
console.log('- Login should update AuthContext');
console.log('- Add to cart should work without login prompt');
console.log('- Cart should persist for logged-in users');
