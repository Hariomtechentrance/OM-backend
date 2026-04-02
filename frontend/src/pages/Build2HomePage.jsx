import React from 'react';
import { Link } from 'react-router-dom';
import './build2-homepage.css';

const Build2HomePage = () => {
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
            <div className="category-card">
              <div className="category-image">
                <img src="/images/collections/mens.jpg" alt="Men's Collection" />
              </div>
              <div className="category-info">
                <h3>Men's Collection</h3>
                <p>Explore our premium men's fashion</p>
                <Link to="/shop-collection" className="category-link">Shop Now</Link>
              </div>
            </div>
            <div className="category-card">
              <div className="category-image">
                <img src="/images/collections/kids.jpg" alt="Kids Collection" />
              </div>
              <div className="category-info">
                <h3>Kids Collection</h3>
                <p>Stylish and comfortable for kids</p>
                <Link to="/shop-collection" className="category-link">Shop Now</Link>
              </div>
            </div>
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
            <div className="product-card">
              <div className="product-image">
                <img src="/images/products/product1.jpg" alt="Product 1" />
                <div className="product-overlay">
                  <Link to="/product/1" className="quick-view">Quick View</Link>
                </div>
              </div>
              <div className="product-info">
                <h3>Premium Oxford Shirt</h3>
                <p className="price">₹3,499</p>
                <div className="product-actions">
                  <button className="add-to-cart">Add to Cart</button>
                  <button className="wishlist">❤️</button>
                </div>
              </div>
            </div>
            <div className="product-card">
              <div className="product-image">
                <img src="/images/products/product2.jpg" alt="Product 2" />
                <div className="product-overlay">
                  <Link to="/product/2" className="quick-view">Quick View</Link>
                </div>
              </div>
              <div className="product-info">
                <h3>Designer Denim Jacket</h3>
                <p className="price">₹4,299</p>
                <div className="product-actions">
                  <button className="add-to-cart">Add to Cart</button>
                  <button className="wishlist">❤️</button>
                </div>
              </div>
            </div>
            <div className="product-card">
              <div className="product-image">
                <img src="/images/products/product3.jpg" alt="Product 3" />
                <div className="product-overlay">
                  <Link to="/product/3" className="quick-view">Quick View</Link>
                </div>
              </div>
              <div className="product-info">
                <h3>Executive Wool Blazer</h3>
                <p className="price">₹8,999</p>
                <div className="product-actions">
                  <button className="add-to-cart">Add to Cart</button>
                  <button className="wishlist">❤️</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter">
        <div className="container">
          <div className="newsletter-content">
            <h2>Stay Updated</h2>
            <p>Subscribe to our newsletter for exclusive offers and new arrivals</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Build2HomePage;
