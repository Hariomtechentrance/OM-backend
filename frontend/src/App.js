import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/tailwind.css';
import './styles/main.css';

// Contexts
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { StockProvider } from './context/StockContext';

// Components
import Header from './components/Header/PeterEnglandHeader';
import Footer from './components/Footer/PeterEnglandFooter';
import PageLoader from './components/PageLoader/PageLoader';

// Pages (Lazy)
const HomePage = lazy(() => import('./pages/PeterEnglandHomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const AdminLogin = lazy(() => import('./pages/Admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));

const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const ShippingReturnPage = lazy(() => import('./pages/ShippingReturnPage'));
const StoreLocatorPage = lazy(() => import('./pages/StoreLocatorPage'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <StockProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="app-wrapper">
                <Header />
              <main style={{ paddingTop: 'var(--header-height)' }}>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    
                    {/* Info Routes */}
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="/privacy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms" element={<TermsOfServicePage />} />
                    <Route path="/shipping" element={<ShippingReturnPage />} />
                    <Route path="/returns" element={<ShippingReturnPage />} />
                    <Route path="/shipping-policy" element={<ShippingReturnPage />} />
                    <Route path="/return-policy" element={<ShippingReturnPage />} />
                    <Route path="/stores" element={<StoreLocatorPage />} />
                    
                    {/* Auth Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    
                    {/* User Routes */}
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-success" element={<OrderSuccessPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/*" element={<AdminDashboard />} />
                    
                    {/* Fallback */}
                    <Route path="*" element={<div className="container py-20 text-center"><h1>404 - Page Not Found</h1></div>} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
              <ToastContainer position="bottom-right" autoClose={3000} />
            </div>
          </WishlistProvider>
        </CartProvider>
      </StockProvider>
    </AuthProvider>
  </Router>
  );
}

export default App;
