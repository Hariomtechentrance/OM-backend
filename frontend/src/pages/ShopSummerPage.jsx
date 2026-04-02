import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthModal from '../components/AuthModal/AuthModal';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/Products/ProductCard';
import { formatPrice } from '../utils/currency';
import api from '../api/axios';
import './ShopSummerPage.css';
import '../components/Products/Products.css';

const ShopSummerPage = () => {
  const [summerProducts, setSummerProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAuth, setShowAuth] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchSummerProducts();
  }, []);

  const fetchSummerProducts = async () => {
    try {
      setLoading(true);
      
      // Fetch products with summer filter
      const response = await api.get('/products?season=summer');
      
      if (response.data && response.data.success) {
        setSummerProducts(response.data.products || []);
      } else {
        setSummerProducts([]);
      }
    } catch (error) {
      console.error('Error fetching summer products:', error);
      setSummerProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      setShowAuth(true);
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  const filteredProducts = selectedCategory === 'all' 
    ? summerProducts 
    : summerProducts.filter(product => product.category === selectedCategory);

  if (loading) {
    return (
      <div className="shop-summer-page">
        <div className="loading">Loading summer collection...</div>
      </div>
    );
  }

  return (
    <div className="shop-summer-page">
      <div className="summer-header">
        <h1>Summer Collection</h1>
        <p>Beat the heat in style with our summer essentials</p>
      </div>

      <div className="summer-filters">
        <button 
          className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => handleCategoryFilter('all')}
        >
          All Items
        </button>
        <button 
          className={`filter-btn ${selectedCategory === 'shirts' ? 'active' : ''}`}
          onClick={() => handleCategoryFilter('shirts')}
        >
          Shirts
        </button>
        <button 
          className={`filter-btn ${selectedCategory === 'pants' ? 'active' : ''}`}
          onClick={() => handleCategoryFilter('pants')}
        >
          Pants
        </button>
        <button 
          className={`filter-btn ${selectedCategory === 'shoes' ? 'active' : ''}`}
          onClick={() => handleCategoryFilter('shoes')}
        >
          Shoes
        </button>
        <button 
          className={`filter-btn ${selectedCategory === 'accessories' ? 'active' : ''}`}
          onClick={() => handleCategoryFilter('accessories')}
        >
          Accessories
        </button>
      </div>

      <div className="summer-products">
        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <h3>No summer products found</h3>
            <p>Check back later for new arrivals!</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product._id} 
                product={product}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
        )}
      </div>

      {showAuth && (
        <AuthModal 
          onClose={() => setShowAuth(false)}
          onSuccess={() => setShowAuth(false)}
        />
      )}
    </div>
  );
};

export default ShopSummerPage;
