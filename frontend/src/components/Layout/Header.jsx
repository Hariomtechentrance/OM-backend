import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaSearch, FaRegHeart, FaShoppingBag, FaUser } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import logo from '../../assets/images/new-logo.png';
import HamburgerMenu from '../Header/HamburgerMenu';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const wishlistCount = wishlist?.length || 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Men', path: '/products?category=Men' },
    { name: 'Kids', path: '/products?category=Kids' },
    { name: 'New', path: '/products?sort=newest' },
    { name: 'Sale', path: '/products?onSale=true' },
  ];

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Left - Logo */}
        <div className="nav-left">
          <Link to="/" className="logo">
            <img src={logo} alt="Black Locust Logo" />
          </Link>
        </div>

        {/* Center - Navigation Links (Desktop) */}
        <nav className="nav-center desktop-nav">
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  to={link.path} 
                  className={location.pathname + location.search === link.path ? 'active' : ''}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right - Icons */}
        <div className="nav-right">
          <div className="nav-icons">
            <button className="icon-btn search-btn" onClick={() => navigate('/search')} aria-label="Search">
              <FaSearch />
            </button>
            <button className="icon-btn wishlist-btn" onClick={() => navigate('/wishlist')} aria-label="Wishlist">
              <FaRegHeart />
              {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
            </button>
            <button className="icon-btn cart-btn" onClick={() => navigate('/cart')} aria-label="Cart">
              <FaShoppingBag />
              {totalItems > 0 && <span className="badge">{totalItems}</span>}
            </button>
            <button 
              className="icon-btn account-btn desktop-only" 
              onClick={() => isAuthenticated ? navigate('/profile') : navigate('/login')}
              aria-label="Account"
            >
              <FaUser />
            </button>
            <button 
              className="icon-btn mobile-menu-btn" 
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Menu"
            >
              <FaBars />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <HamburgerMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </header>
  );
};

export default Header;
