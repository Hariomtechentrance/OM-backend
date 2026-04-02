import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTruck, FaShieldAlt, FaUndo, FaHeart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/Products/ProductCard';
import AuthModal from '../components/AuthModal/AuthModal';
import GlobalProductFilters from '../components/GlobalProductFilters/GlobalProductFilters';
import api from '../api/axios';
import { filtersToSearchParams, defaultProductFilterState } from '../utils/productFilters';
import './NewArrivalsPage.css';
import '../components/Products/Products.css';

const PRESET = { isNewArrival: true };

const NewArrivalsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listFilters, setListFilters] = useState({ ...defaultProductFilterState });
  const [showAuth, setShowAuth] = useState(false);

  const { addToCart } = useCart();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const runFetch = async (filters) => {
    try {
      setLoading(true);
      const params = filtersToSearchParams(filters, PRESET);
      const res = await api.get(`/products?${params.toString()}`);
      if (res.data?.success) {
        setProducts(res.data.products || []);
      } else {
        setProducts([]);
      }
    } catch (e) {
      console.error('New arrivals fetch error:', e);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runFetch(listFilters);
  }, []);

  const handleApplyFilters = (next) => {
    setListFilters(next);
    runFetch(next);
  };

  const handleAddToCart = (product) => {
    if (authLoading) return;
    if (!isAuthenticated) {
      setShowAuth(true);
      return;
    }
    addToCart(product, 1, undefined, undefined);
  };

  const avgRating =
    products.length > 0
      ? (products.reduce((s, p) => s + (Number(p.rating) || 0), 0) / products.length).toFixed(1)
      : '—';

  const avgDiscountPct =
    products.length > 0
      ? Math.round(
          products.reduce((s, p) => {
            if (!p.originalPrice || p.originalPrice <= p.price) return s;
            return s + Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
          }, 0) / products.length
        )
      : null;

  return (
    <div className="new-arrivals-page">
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">NEW COLLECTION</div>
          <h1>Discover Our Latest Arrivals</h1>
          <p>
            Fresh styles from our catalog — updated from the database when you mark products as new
            arrivals.
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">{loading ? '…' : products.length}</span>
              <span className="stat-label">New items</span>
            </div>
            <div className="stat">
              <span className="stat-number">{avgDiscountPct != null ? `${avgDiscountPct}%` : '—'}</span>
              <span className="stat-label">Avg. savings</span>
            </div>
            <div className="stat">
              <span className="stat-number">{avgRating}★</span>
              <span className="stat-label">Avg. rating</span>
            </div>
          </div>
        </div>
        <div className="hero-image-overlay"></div>
      </section>

      <section className="features-bar">
        <div className="feature">
          <FaTruck className="feature-icon" />
          <span>Free Shipping</span>
        </div>
        <div className="feature">
          <FaShieldAlt className="feature-icon" />
          <span>Secure Payment</span>
        </div>
        <div className="feature">
          <FaUndo className="feature-icon" />
          <span>7-Day Returns</span>
        </div>
        <div className="feature">
          <FaHeart className="feature-icon" />
          <span>Premium Quality</span>
        </div>
      </section>

      <div className="main-content">
        <main className="products-section">
          <GlobalProductFilters onApply={handleApplyFilters} />

          <div className="products-toolbar">
            <div className="toolbar-left">
              <span className="results-count">
                {loading ? 'Loading…' : `${products.length} new item${products.length === 1 ? '' : 's'}`}
              </span>
            </div>
          </div>

          <div className="products-grid">
            {loading ? (
              <p className="new-arrivals-loading">Loading new arrivals…</p>
            ) : products.length === 0 ? (
              <p className="new-arrivals-empty">No new arrivals match your filters. Try resetting filters.</p>
            ) : (
              products.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                  onAddToCart={() => handleAddToCart(product)}
                  onQuickView={() => navigate(`/product/${product._id || product.id}`)}
                />
              ))
            )}
          </div>
        </main>
      </div>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onLogin={() => navigate('/login')}
        onRegister={() => navigate('/register')}
      />
    </div>
  );
};

export default NewArrivalsPage;
