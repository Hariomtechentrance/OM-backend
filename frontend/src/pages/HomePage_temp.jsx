import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProductCard from '../components/Products/ProductCard';
import AuthModal from '../components/AuthModal/AuthModal';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('login');
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Sample products data
  const featuredProducts = [
    {
      id: 1,
      name: 'Premium Oxford Shirt',
      price: 3499,
      originalPrice: 4999,
      image: 'https://images.unsplash.com/photo-1596755096918-a042d8e29050?w=600',
      category: 'Men\'s Shirts',
      rating: 4.8,
      reviews: 127,
      newArrival: true,
      badge: 'NEW',
      discount: 30,
      inStock: true
    },
    {
      id: 2,
      name: 'Executive Wool Blazer',
      price: 8999,
      originalPrice: 12999,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
      category: 'Men\'s Outerwear',
      rating: 4.9,
      reviews: 89,
      badge: 'TRENDING',
      discount: 30,
      inStock: true
    },
    {
      id: 3,
      name: 'Designer Denim Jacket',
      price: 4299,
      originalPrice: 5999,
      image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600',
      category: 'Men\'s Outerwear',
      rating: 4.7,
      reviews: 156,
      badge: 'TRENDING',
      discount: 28,
      inStock: true
    }
  ];

  const categories = [
    {
      id: 1,
      name: 'Men\'s Collection',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600',
      description: 'Elevate your wardrobe with our premium men\'s collection',
      link: '/shop-collection'
    },
    {
      id: 2,
      name: 'Kids Collection',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600',
      description: 'Stylish and comfortable fashion for kids',
      link: '/shop-collection'
    }
  ];

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      setIsModalOpen(true);
      setModalType('login');
      return;
    }
    toast.success(`${product.name} added to cart!`);
  };

  const handleQuickView = (product) => {
    navigate(`/product/${product.id}`);
  };

  const handleCategoryClick = (link) => {
    navigate(link);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSwitch = (type) => {
    setModalType(type);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Elevate Your Style</h1>
          <p>Premium clothing for the modern individual</p>
          <Link to="/shop-collection" className="cta-button">Shop Collection</Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <p>Discover our curated collections</p>
          </div>
          <div className="categories-grid">
            {categories.map((category) => (
              <div key={category.id} className="category-card" onClick={() => handleCategoryClick(category.link)}>
                <div className="category-image">
                  <img src={category.image} alt={category.name} />
                </div>
                <div className="category-info">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <Link to={category.link} className="category-link">Shop Now</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <p>Handpicked selections from our collection</p>
          </div>
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <div className="product-overlay">
                    <button onClick={() => handleQuickView(product)} className="quick-view">Quick View</button>
                  </div>
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="price">₹{product.price.toLocaleString('en-IN')}</p>
                  <div className="product-actions">
                    <button onClick={() => handleAddToCart(product)} className="add-to-cart">Add to Cart</button>
                    <button className="wishlist">❤️</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter">
        <div className="container">
          <div className="newsletter-content">
            <h2>Stay Updated</h2>
            <p>Subscribe to our newsletter for exclusive offers and new arrivals</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email" required />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSwitch={handleModalSwitch}
        initialType={modalType}
      />
    </div>
  );
};

export default HomePage;
