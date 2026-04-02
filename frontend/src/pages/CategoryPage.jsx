import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/Products/ProductCard';
import GlobalProductFilters from '../components/GlobalProductFilters/GlobalProductFilters';
import { filtersToSearchParams, defaultProductFilterState } from '../utils/productFilters';
import '../components/Products/Products.css';
import './CategoryPage.css';

const CategoryPage = () => {
  const location = useLocation();
  const categoryType = (location.pathname || '').replace(/^\//, '').split('/')[0] || 'party-wear';
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { addToWishlist } = useWishlist();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listFilters, setListFilters] = useState({ ...defaultProductFilterState });

  // Category configurations
  const categoryConfig = {
    'party-wear': {
      name: 'Party Wear',
      description: 'Elegant outfits for special occasions',
      icon: '🎉',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Black', 'Navy', 'Burgundy', 'Gold', 'Silver', 'Red', 'Purple'],
      features: ['Premium Fabric', 'Designer Fit', 'Limited Edition'],
      priceRange: [1999, 8999]
    },
    'casual': {
      name: 'Casual Wear',
      description: 'Comfortable everyday fashion',
      icon: '👕',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['White', 'Black', 'Gray', 'Navy', 'Blue', 'Green', 'Brown'],
      features: ['Comfort Fit', 'Breathable', 'Easy Care'],
      priceRange: [799, 2999]
    },
    'polo-tshirts': {
      name: 'Polo T-Shirts',
      description: 'Classic polo shirts for all occasions',
      icon: '👔',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['White', 'Black', 'Navy', 'Red', 'Green', 'Blue', 'Yellow', 'Pink'],
      features: ['Cotton Pique', 'Collar Style', 'Classic Fit'],
      priceRange: [999, 2499]
    },
    'new-collection': {
      name: 'New Collection',
      description: 'Latest arrivals and trends',
      icon: '✨',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: ['All Colors'],
      features: ['New Arrivals', 'Trending', 'Exclusive'],
      priceRange: [1299, 5999]
    },
    'striped-collection': {
      name: 'Striped Collection',
      description: 'Stylish striped patterns',
      icon: '📊',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Navy/White', 'Black/White', 'Gray/White', 'Multi-color'],
      features: ['Striped Patterns', 'Classic Design', 'Versatile'],
      priceRange: [999, 3499]
    },
    'cargo-collection': {
      name: 'Cargo Collection',
      description: 'Functional and stylish cargo wear',
      icon: '🎒',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Khaki', 'Olive', 'Black', 'Navy', 'Brown'],
      features: ['Multiple Pockets', 'Durable', 'Utility Design'],
      priceRange: [1499, 4499]
    },
    'trousers-collection': {
      name: 'Trousers Collection',
      description: 'Professional and casual trousers',
      icon: '👖',
      sizes: ['28', '30', '32', '34', '36', '38', '40'],
      colors: ['Black', 'Gray', 'Navy', 'Brown', 'Khaki', 'Beige'],
      features: ['Perfect Fit', 'Quality Fabric', 'Versatile'],
      priceRange: [1299, 3999]
    },
    'denim-collection': {
      name: 'Denim Collection',
      description: 'Premium denim wear',
      icon: '💙',
      sizes: ['28', '30', '32', '34', '36', '38'],
      colors: ['Blue', 'Black', 'Gray', 'White', 'Light Blue'],
      features: ['Premium Denim', 'Perfect Fit', 'Durable'],
      priceRange: [1999, 4999]
    },
    'winter-collection': {
      name: 'Winter Collection',
      description: 'Warm and stylish winter wear',
      icon: '❄️',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Black', 'Gray', 'Navy', 'Brown', 'Burgundy', 'Forest Green'],
      features: ['Warm Fabric', 'Layering', 'Winter Ready'],
      priceRange: [1999, 6999]
    },
    'formal-pants': {
      name: 'Formal Pants',
      description: 'Professional formal wear',
      icon: '🤵',
      sizes: ['28', '30', '32', '34', '36', '38', '40'],
      colors: ['Black', 'Gray', 'Navy', 'Brown', 'Charcoal', 'Khaki'],
      features: ['Professional Fit', 'Office Ready', 'Classic Style'],
      priceRange: [1499, 3499]
    },
    'summer-final': {
      name: 'Summer Collection',
      description: 'Light and breezy summer wear',
      icon: '☀️',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['White', 'Light Blue', 'Yellow', 'Pink', 'Lime', 'Sky Blue'],
      features: ['Lightweight', 'Breathable', 'Summer Ready'],
      priceRange: [799, 2999]
    },
    'office-collection': {
      name: 'Office Collection',
      description: 'Professional office wear',
      icon: '💼',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['White', 'Light Blue', 'Pink', 'Yellow', 'Gray', 'Navy'],
      features: ['Office Ready', 'Professional', 'Comfortable'],
      priceRange: [1299, 3999]
    },
    'checked-collection': {
      name: 'Checked Collection',
      description: 'Stylish checked patterns',
      icon: '✅',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Black/White', 'Blue/White', 'Red/Black', 'Multi-check'],
      features: ['Checked Patterns', 'Classic Style', 'Versatile'],
      priceRange: [1299, 3999]
    }
  };

  const currentCategory = categoryConfig[categoryType] || {
    name: 'Collection',
    description: 'Explore our collection',
    icon: '🛍️',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Gray', 'Navy'],
    features: ['Quality Fabric', 'Perfect Fit'],
    priceRange: [999, 3999]
  };

  useEffect(() => {
    let cancelled = false;
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const params = filtersToSearchParams(listFilters, { category: categoryType });
        const response = await api.get(`/products?${params.toString()}`);
        if (cancelled) return;
        setProducts(response.data?.products || []);
      } catch (error) {
        if (!cancelled) toast.error('Failed to fetch products');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchCategoryProducts();
    return () => {
      cancelled = true;
    };
  }, [categoryType, listFilters]);

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      toast.info('Please log in to add items to your cart');
      return;
    }
    addToCart(product, 1, undefined, undefined);
  };

  const handleAddToWishlist = async (product) => {
    const result = await addToWishlist(product);
    if (result.success) {
      toast.success('Added to wishlist!');
    } else {
      toast.error(result.message || 'Failed to add to wishlist');
    }
  };

  if (loading) {
    return (
      <div className="category-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading {currentCategory.name}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      {/* Category Header */}
      <div className="category-header">
        <div className="category-hero">
          <div className="category-content">
            <span className="category-icon">{currentCategory.icon}</span>
            <h1>{currentCategory.name}</h1>
            <p>{currentCategory.description}</p>
            <div className="category-features">
              {currentCategory.features.map((feature, index) => (
                <span key={index} className="feature-tag">{feature}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="category-container category-container--filters-only">
        <GlobalProductFilters hideCategory onApply={setListFilters} />

        <div className="products-content">
          <div className="products-header">
            <h2>{products.length} Products Found</h2>
          </div>

          <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={() => handleAddToCart(product)}
                onQuickView={() => navigate(`/product/${product._id}`)}
                onAddToWishlist={handleAddToWishlist}
              />
            ))}
          </div>

          {products.length === 0 && (
            <div className="no-products">
              <h3>No products found</h3>
              <p>Try adjusting your filters or check back later</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
