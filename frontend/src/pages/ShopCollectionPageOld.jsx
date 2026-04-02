import React, { useState, useEffect } from 'react';
import ProductCard from '../components/Products/ProductCard';
import { formatPrice } from '../utils/currency';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './ShopCollectionPage.css';

const ShopCollectionPage = () => {
  const [collections, setCollections] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    if (selectedCollection) {
      fetchProducts();
    }
  }, [selectedCollection]);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const res = await api.get('/collections');
      if (res.data.success) {
        setCollections(res.data);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      let res;
      
      if (selectedCollection === 'all') {
        // Fetch all products
        res = await api.get('/products');
      } else {
        // Fetch products for specific collection
        res = await api.get(`/collections/${selectedCollection}/products`);
      }
      
      if (res.data.success) {
        setProducts(res.data.products || res.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleCollectionClick = (collectionSlug) => {
    setSelectedCollection(collectionSlug);
  };

  const handleExploreCollection = (collectionType) => {
    navigate(`/products?category=${collectionType}`);
  };

  const handleQuickView = (collectionType) => {
    navigate(`/products?category=${collectionType}&view=quick`);
  };

  const filteredCollections = selectedCollection === 'all' 
    ? collections 
    : collections.filter(collection => collection.collection === selectedCollection);

  // Return loading state with same layout structure (only on initial load)
  if (loading && initialLoad) {
    return (
      <div className="shop-collection-page">
        <div className="hero-section">
          <div className="hero-content">
            <div className="collection-icon">👔</div>
            <h1>SHOP COLLECTIONS</h1>
            <p>Curated collections for every style and occasion</p>
            <div className="collection-stats">
              <div className="stat">
                <span className="stat-number">12</span>
                <span className="stat-label">Collections</span>
              </div>
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Products</span>
              </div>
              <div className="stat">
                <span className="stat-number">100%</span>
                <span className="stat-label">Quality</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="collection-filters">
            <button className="filter-btn active">All Collections</button>
            <button className="filter-btn">Premium</button>
            <button className="filter-btn">Denim</button>
            <button className="filter-btn">Streetwear</button>
            <button className="filter-btn">Formal</button>
            <button className="filter-btn">Sports</button>
            <button className="filter-btn">Minimal</button>
            <button className="filter-btn">Eco-Friendly</button>
          </div>

          <div className="collections-grid">
            {/* Loading skeleton cards */}
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="collection-card loading-skeleton">
                <div className="collection-badge">LOADING</div>
                <div className="collection-image">
                  <div className="skeleton-loader"></div>
                </div>
                <div className="collection-info">
                  <h3><div className="skeleton-loader"></div></h3>
                  <p><div className="skeleton-loader"></div></p>
                  <div className="collection-meta">
                    <div className="collection-rating">
                      <span className="rating-text">⭐ Loading...</span>
                    </div>
                    <div className="collection-price">
                      Starting from Loading...
                    </div>
                  </div>
                  <div className="collection-actions">
                    <button className="explore-btn" disabled>Loading...</button>
                    <button className="quick-view-btn" disabled>Loading...</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-collection-page">
      <div className="hero-section">
        <div className="hero-content">
          <div className="collection-icon">👔</div>
          <h1>SHOP COLLECTIONS</h1>
          <p>Curated collections for every style and occasion</p>
          <div className="collection-stats">
            <div className="stat">
              <span className="stat-number">12</span>
              <span className="stat-label">Collections</span>
            </div>
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Products</span>
            </div>
            <div className="stat">
              <span className="stat-number">100%</span>
              <span className="stat-label">Quality</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="collection-filters">
          <button 
            className={`filter-btn ${selectedCollection === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCollection('all')}
          >
            All Collections
          </button>
          <button 
            className={`filter-btn ${selectedCollection === 'premium' ? 'active' : ''}`}
            onClick={() => setSelectedCollection('premium')}
          >
            Premium
          </button>
          <button 
            className={`filter-btn ${selectedCollection === 'denim' ? 'active' : ''}`}
            onClick={() => setSelectedCollection('denim')}
          >
            Denim
          </button>
          <button 
            className={`filter-btn ${selectedCollection === 'streetwear' ? 'active' : ''}`}
            onClick={() => setSelectedCollection('streetwear')}
          >
            Streetwear
          </button>
          <button 
            className={`filter-btn ${selectedCollection === 'formal' ? 'active' : ''}`}
            onClick={() => setSelectedCollection('formal')}
          >
            Formal
          </button>
          <button 
            className={`filter-btn ${selectedCollection === 'sports' ? 'active' : ''}`}
            onClick={() => setSelectedCollection('sports')}
          >
            Sports
          </button>
          <button 
            className={`filter-btn ${selectedCollection === 'minimal' ? 'active' : ''}`}
            onClick={() => setSelectedCollection('minimal')}
          >
            Minimal
          </button>
          <button 
            className={`filter-btn ${selectedCollection === 'eco' ? 'active' : ''}`}
            onClick={() => setSelectedCollection('eco')}
          >
            Eco-Friendly
          </button>
        </div>

        <div className="collections-grid">
          {filteredCollections.map(collection => (
            <div key={collection._id} className="collection-card">
              <div className="collection-badge">
                {collection.collection.toUpperCase()}
              </div>
              <div className="collection-image">
                <img src={collection.image} alt={collection.name} />
              </div>
              <div className="collection-info">
                <h3>{collection.name}</h3>
                <p>{collection.description}</p>
                <div className="collection-meta">
                  <div className="collection-rating">
                    <span className="rating-text">⭐ {collection.rating}</span>
                  </div>
                  <div className="collection-price">
                    Starting from {formatPrice(1999)}
                  </div>
                </div>
                <div className="collection-actions">
                  <button 
                    className="explore-btn" 
                    onClick={() => handleExploreCollection(collection.collection)}
                  >
                    Explore Collection
                  </button>
                  <button 
                    className="quick-view-btn"
                    onClick={() => handleQuickView(collection)}
                  >
                    Quick View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="collection-highlights">
          <h2>Collection Highlights</h2>
          <div className="highlights-grid">
            <div className="highlight-card">
              <div className="highlight-icon">🏆</div>
              <h3>Premium Quality</h3>
              <p>Only the finest materials and craftsmanship</p>
            </div>
            <div className="highlight-card">
              <div className="highlight-icon">🌍</div>
              <h3>Sustainable Fashion</h3>
              <p>Eco-friendly options for conscious consumers</p>
            </div>
            <div className="highlight-card">
              <div className="highlight-icon">🎨</div>
              <h3>Unique Designs</h3>
              <p>Exclusive patterns and modern aesthetics</p>
            </div>
            <div className="highlight-card">
              <div className="highlight-icon">👔</div>
              <h3>Perfect Fit</h3>
              <p>Tailored for comfort and style</p>
            </div>
          </div>
        </div>

        <div className="style-guide">
          <h2>Find Your Style</h2>
          <div className="style-quiz">
            <p>Not sure which collection is right for you?</p>
            <button className="style-quiz-btn">Take Style Quiz</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopCollectionPage;
