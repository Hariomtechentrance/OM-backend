import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShippingFast, FaUndo, FaShieldAlt, FaArrowRight } from 'react-icons/fa';
import ProductCard from '../components/Products/ProductCard';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../api/axios';
import './HomePage.css';

function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  useEffect(() => {
    fetchProducts();
    setCategories([
      {
        _id: '1',
        name: 'Men\'s Collection',
        slug: 'men',
        image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800&q=80',
        description: 'Luxury minimalism for the modern man.'
      },
      {
        _id: '2',
        name: 'Kids Collection',
        slug: 'kids',
        image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&q=80',
        description: 'Premium style for young adventurers.'
      }
    ]);
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      if (response.data.success) {
        setProducts(response.data.products || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const newArrivals = useMemo(() => products.slice(0, 4), [products]);
  const trending = useMemo(() => products.slice(4, 8), [products]);

  return (
    <div className="homepage-light">
      {/* HERO SECTION */}
      <section className="hero-premium">
        <div className="hero-image-wrapper">
          <img
            src="https://images.unsplash.com/photo-1520975958225-30b650bbf3c5?w=2400&q=80"
            alt="Black Locust Premium Fashion"
            className="hero-image"
          />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="container">
            <span className="hero-subtitle">PREMIUM MEN & KIDS</span>
            <h1 className="hero-title">Luxury minimal. <br />Built to turn heads.</h1>
            <p className="hero-description">
              Discover elevated essentials with luxury branding, premium spacing, and a fit that feels custom.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => navigate('/products')}>SHOP NOW</button>
              <button className="btn-outline" onClick={() => navigate('/products?sort=newest')}>NEW ARRIVALS</button>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-item">
              <FaShippingFast className="trust-icon" />
              <div className="trust-text">
                <h3>FREE SHIPPING</h3>
                <p>On all orders above ₹999</p>
              </div>
            </div>
            <div className="trust-item">
              <FaUndo className="trust-icon" />
              <div className="trust-text">
                <h3>EASY RETURNS</h3>
                <p>30-day return policy</p>
              </div>
            </div>
            <div className="trust-item">
              <FaShieldAlt className="trust-icon" />
              <div className="trust-text">
                <h3>SECURE PAYMENT</h3>
                <p>100% secure transactions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY SECTION */}
      <section className="category-section py-20">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Shop by Collection</h2>
            <Link to="/collections" className="view-all">VIEW ALL <FaArrowRight /></Link>
          </div>
          <div className="category-grid">
            {categories.map((category) => (
              <Link key={category._id} to={`/products?category=${category.slug}`} className="category-card">
                <div className="category-image-wrapper">
                  <img src={category.image} alt={category.name} />
                  <div className="category-overlay"></div>
                </div>
                <div className="category-content">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <span className="shop-link">SHOP NOW <FaArrowRight /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="products-section bg-surface py-20">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">New Arrivals</h2>
            <Link to="/products" className="view-all">VIEW ALL <FaArrowRight /></Link>
          </div>
          <div className="products-grid">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="brand-story py-20">
        <div className="container">
          <div className="brand-story-grid">
            <div className="brand-story-image">
              <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200" alt="Brand Story" />
            </div>
            <div className="brand-story-content">
              <span className="subtitle">OUR STORY</span>
              <h2 className="title">Luxury Minimalism. <br />Sophisticated Style.</h2>
              <p>
                Black Locust is more than a brand; it's a statement of elegance and quality. 
                We believe in creating timeless pieces that blend luxury minimalism with 
                modern functionality.
              </p>
              <button className="btn-primary" onClick={() => navigate('/about')}>READ MORE</button>
            </div>
          </div>
        </div>
      </section>

      {/* TRENDING SECTION */}
      <section className="trending-section py-20">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Trending Now</h2>
            <div className="trending-badges">
              <span className="badge">Best Seller</span>
              <span className="badge">Trending</span>
              <span className="badge">Under ₹999</span>
            </div>
          </div>
          <div className="products-grid">
            {trending.length > 0 ? trending.map((product) => (
              <ProductCard key={product._id} product={product} />
            )) : (
              products.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
