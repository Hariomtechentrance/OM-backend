import React, { useState, useEffect, useRef } from 'react';
import ProductCard from '../components/Products/ProductCard';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import AuthModal from '../components/AuthModal/AuthModal';
import GlobalProductFilters from '../components/GlobalProductFilters/GlobalProductFilters';
import { filtersToSearchParams, defaultProductFilterState } from '../utils/productFilters';
import './ShopCollectionPage.css';

const ShopCollectionPage = () => {
  const [collections, setCollections] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [listFilters, setListFilters] = useState({ ...defaultProductFilterState });
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const initialBootstrapDone = useRef(false);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    let cancelled = false;
    const preset =
      selectedCollection === 'all' ? {} : { collection: selectedCollection };
    const params = filtersToSearchParams(listFilters, preset);

    const fetchProductsOnly = async () => {
      try {
        setProductsLoading(true);
        const res = await api.get(`/products?${params.toString()}`);
        if (cancelled) return;
        if (res.data?.success) {
          setProducts(res.data.products || []);
        } else {
          setProducts([]);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Error fetching products:', error);
          setProducts([]);
        }
      } finally {
        if (!cancelled) setProductsLoading(false);
      }
    };

    const bootstrap = async () => {
      setCollectionsLoading(true);
      setProductsLoading(true);
      try {
        const [colRes, prodRes] = await Promise.all([
          api.get('/collections'),
          api.get(`/products?${params.toString()}`),
        ]);
        if (cancelled) return;
        if (colRes.data?.success) {
          setCollections(colRes.data.collections || []);
        }
        if (prodRes.data?.success) {
          setProducts(prodRes.data.products || []);
        } else {
          setProducts([]);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Error loading shop collections page:', error);
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setCollectionsLoading(false);
          setProductsLoading(false);
          initialBootstrapDone.current = true;
        }
      }
    };


    if (!initialBootstrapDone.current) {
      bootstrap();
    } else {
      fetchProductsOnly();
    }

    return () => {
      cancelled = true;
    };
  }, [selectedCollection, listFilters]);

  const handleCollectionClick = (collectionSlug) => {
    setSelectedCollection(collectionSlug);
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      setShowAuth(true);
      return;
    }
    addToCart(product, 1, undefined, undefined);
  };

  return (
    <div className="shop-collection-page">
      <div className="shop-collections-hero">
        <div className="shop-collections-hero__content">
          <div className="shop-collections-hero__icon">👔</div>
          <h1>SHOP COLLECTIONS</h1>
          <p>Curated collections for every style and occasion</p>
          <div className="shop-collections-hero__stats">
            <div className="stat">
              <span className="stat-number">
                {collectionsLoading ? '—' : collections.length}
              </span>
              <span className="stat-label">Collections</span>
            </div>
            <div className="stat">
              <span className="stat-number">
                {productsLoading && products.length === 0 ? '—' : products.length}
              </span>
              <span className="stat-label">Products</span>
            </div>
            <div className="stat">
              <span className="stat-number">100%</span>
              <span className="stat-label">Quality</span>
            </div>
          </div>
        </div>
      </div>

      <div className="shop-collections-container">
        <div className="collection-filters">
          {collectionsLoading ? (
            <span className="collection-filters-loading">Loading collections…</span>
          ) : (
            <>
              <button
                type="button"
                className={`filter-btn ${selectedCollection === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCollection('all')}
              >
                All Collections
              </button>
              {collections.map((collection) => (
                <button
                  type="button"
                  key={collection._id}
                  className={`filter-btn ${selectedCollection === collection.slug ? 'active' : ''}`}
                  onClick={() => handleCollectionClick(collection.slug)}
                >
                  {collection.name}
                </button>
              ))}
            </>
          )}
        </div>

        <GlobalProductFilters
          hideCollection
          onApply={setListFilters}
        />

        <div className="shop-collections-products">
          <div className="shop-collections-products__header">
            <h2>
              {selectedCollection === 'all' 
                ? 'All Products' 
                : collections.find(c => c.slug === selectedCollection)?.name || 'Products'
              }
            </h2>
            <p className="product-count">
              {products.length} products found
            </p>
          </div>

          {productsLoading ? (
            <div className="loading-skeleton">
              <div className="products-grid">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="product-card loading-skeleton">
                    <div className="product-image">
                      <div className="skeleton-loader"></div>
                    </div>
                    <div className="product-info">
                      <h3><div className="skeleton-loader"></div></h3>
                      <p><div className="skeleton-loader"></div></p>
                      <div className="product-price">
                        <span className="current-price">Loading...</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : products.length > 0 ? (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                  onAddToCart={() => handleAddToCart(product)}
                  onQuickView={() => navigate(`/product/${product._id || product.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="no-products">
              <div className="no-products-icon">🔍</div>
              <h3>No products found</h3>
              <p>
                {selectedCollection === 'all' 
                  ? 'No products available at the moment.' 
                  : 'No products available in this collection.'
                }
              </p>
              <button 
                className="btn-primary"
                onClick={() => setSelectedCollection('all')}
              >
                View All Products
              </button>
            </div>
          )}
        </div>
      </div>

      {showAuth && (
        <AuthModal
          isOpen={showAuth}
          onClose={() => setShowAuth(false)}
          onLogin={() => navigate('/login')}
          onRegister={() => navigate('/register')}
        />
      )}
    </div>
  );
};

export default ShopCollectionPage;
