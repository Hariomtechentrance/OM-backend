import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaPinterest, FaYoutube } from 'react-icons/fa';
import logo from '../../assets/images/new-logo.png';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-brand">
            <img src={logo} alt="Black Locust" className="footer-logo-img" />
            <h3>Black Locust</h3>
            <p>Premium Fashion for Men & Kids</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h4>Shop</h4>
              <ul>
                <li><Link to="/new-arrivals">New Arrivals</Link></li>
                <li><Link to="/shop-summer">Shop Summer</Link></li>
                <li><Link to="/shop-collection">Collections</Link></li>
                <li><Link to="/products">All Products</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Help</h4>
              <ul>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/shipping">Shipping & Returns</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4>Legal</h4>
              <ul>
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
                <li><Link to="/sitemap">Sitemap</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-social">
            <h4>Follow Us</h4>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer">
                <FaPinterest />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2026 Black Locust. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;