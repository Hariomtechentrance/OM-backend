import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/Product/PeterEnglandProductCard';
import './SearchPage.css';

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../api/axios';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = (searchParams.get('q') || '').trim();

  const [inputValue, setInputValue] = useState(q);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    setInputValue(q);
  }, [q]);

  const runSearch = useCallback(async (term) => {
    if (!term) {
      setSearchResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/products?search=${encodeURIComponent(term)}&limit=50`);
      if (response.data?.success) {
        setSearchResults(response.data.products || []);
      } else {
        setError(response.data?.message || 'Search failed');
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Unable to connect to search service. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    runSearch(q);
  }, [q, runSearch]);

  const applyQuery = (term) => {
    const t = term.trim();
    if (t) {
      setSearchParams({ q: t });
    } else {
      setSearchParams({});
    }
  };

  const handleSearchChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    applyQuery(inputValue);
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      setShowAuth(true);
      return;
    }

    addToCart({
      id: product.id || product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url,
      quantity: 1
    });
  };

  const displayQuery = q;

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>Search Results</h1>
        <form className="search-box" onSubmit={handleSubmit} role="search">
          <input
            type="search"
            placeholder="Search for products..."
            value={inputValue}
            onChange={handleSearchChange}
            className="search-input"
            aria-label="Search products"
            autoComplete="off"
          />
          <button type="submit" className="search-btn" aria-label="Search">
            🔍
          </button>
        </form>
      </div>

      <div className="search-content">
        {loading ? (
          <div className="search-loading">
            <div className="loading-spinner"></div>
            <p>Searching...</p>
          </div>
        ) : error ? (
          <div className="search-error">
            <h3>Search Error</h3>
            <p>{error}</p>
            <button type="button" onClick={() => runSearch(displayQuery)} className="retry-btn">
              Try Again
            </button>
          </div>
        ) : (
          <>
            {displayQuery && (
              <div className="search-info">
                <p>
                  Found {searchResults.length} results for &quot;{displayQuery}&quot;
                </p>
              </div>
            )}

            {searchResults.length > 0 ? (
              <div className="products-grid">
                {searchResults.map((product) => (
                  <ProductCard
                    key={String(product._id || product.id)}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : displayQuery ? (
              <div className="no-results">
                <h3>No results found</h3>
                <p>Try searching with different keywords</p>
              </div>
            ) : (
              <div className="search-prompt">
                <h3>Start searching</h3>
                <p>Enter a product name, category, or brand to find what you&apos;re looking for</p>
              </div>
            )}
          </>
        )}
      </div>

      {showAuth && (
        <div className="auth-modal-overlay" onClick={() => setShowAuth(false)}>
          <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="close-modal" onClick={() => setShowAuth(false)}>
              ×
            </button>
            <p>Please login to add items to cart</p>
            <div className="auth-buttons">
              <button type="button" onClick={() => navigate('/login')}>
                Login
              </button>
              <button type="button" onClick={() => navigate('/register')}>
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
