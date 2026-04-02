import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaSearch, FaShoppingBag, FaUser, FaTimes, FaChevronDown, FaStore } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/images/new-logo.png';
import api from '../../api/axios';

const PeterEnglandHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await api.get('/collections');
      setCollections(response.data.collections || []);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const accountInitial = useMemo(() => {
    return (user?.name || user?.email || '').trim().charAt(0).toUpperCase();
  }, [user]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Peter England Style Premium Light Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Left: More Brand Dropdown & Hamburger */}
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="p-2 text-gray-900 hover:text-[#C19A6B] transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>

              <div className="hidden lg:relative lg:block group">
                <button 
                  className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-900 hover:text-[#C19A6B] transition-colors duration-200"
                  onMouseEnter={() => setIsBrandsOpen(true)}
                >
                  MORE BRANDS <FaChevronDown size={12} />
                </button>
                
                {/* Dropdown Menu */}
                <div 
                  className={`absolute top-full left-0 w-72 bg-white shadow-2xl border border-gray-100 py-4 transition-all duration-300 transform ${isBrandsOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'}`}
                  onMouseLeave={() => setIsBrandsOpen(false)}
                >
                  <div className="px-6 py-2 border-b border-gray-50 mb-2">
                    <span className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">Our Collections</span>
                  </div>
                  <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
                    {collections.map((col) => (
                      <Link
                        key={col._id}
                        to={`/products?collection=${col.slug}`}
                        className="block px-6 py-3 text-[11px] font-bold text-gray-700 hover:bg-gray-50 hover:text-[#C19A6B] tracking-widest uppercase transition-all duration-200"
                        onClick={() => setIsBrandsOpen(false)}
                      >
                        {col.name}
                      </Link>
                    ))}
                  </div>
                  <Link
                    to="/products"
                    className="block px-6 py-4 text-[11px] font-black text-gray-900 hover:bg-gray-50 hover:text-[#C19A6B] transition-all duration-200 border-t border-gray-50 mt-2 tracking-[0.2em] uppercase"
                    onClick={() => setIsBrandsOpen(false)}
                  >
                    VIEW ALL PRODUCTS
                  </Link>
                </div>
              </div>
            </div>

            {/* Center: Logo */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Link to="/" className="flex items-center gap-3">
                <img 
                  src={logo} 
                  alt="Black Locust" 
                  className="h-10 lg:h-12 w-auto"
                />
                <span 
                  className="hidden lg:block text-2xl font-bold tracking-[0.2em] text-gray-900"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  BLACK LOCUST
                </span>
              </Link>
            </div>

            {/* Right: Store, Login, Cart, Profile */}
            <div className="flex items-center gap-2 lg:gap-6">
              {/* Store */}
              <button
                type="button"
                onClick={() => navigate('/stores')}
                className="hidden md:flex items-center gap-2 p-2 text-gray-700 hover:text-[#C19A6B] transition-colors duration-200"
                aria-label="Stores"
              >
                <FaStore size={18} />
                <span className="hidden lg:block text-[11px] font-bold uppercase tracking-wider">Store</span>
              </button>

              {/* Search */}
              <button
                type="button"
                onClick={() => navigate('/search')}
                className="p-2 text-gray-700 hover:text-[#C19A6B] transition-colors duration-200"
                aria-label="Search"
              >
                <FaSearch size={18} />
              </button>

              {/* Login / Profile */}
              <div className="flex items-center">
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => navigate('/profile')}
                    className="flex items-center gap-2 p-2 text-gray-700 hover:text-[#C19A6B] transition-colors duration-200"
                  >
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full border border-gray-200 overflow-hidden">
                      {accountInitial ? (
                        <span className="text-xs font-bold">{accountInitial}</span>
                      ) : (
                        <FaUser size={14} />
                      )}
                    </div>
                    <span className="hidden lg:block text-[11px] font-bold uppercase tracking-wider">Profile</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="flex items-center gap-2 p-2 text-gray-700 hover:text-[#C19A6B] transition-colors duration-200"
                  >
                    <FaUser size={18} />
                    <span className="hidden lg:block text-[11px] font-bold uppercase tracking-wider">Login</span>
                  </button>
                )}
              </div>

              {/* Cart */}
              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="relative flex items-center gap-2 p-2 text-gray-700 hover:text-[#C19A6B] transition-colors duration-200"
                aria-label="Cart"
              >
                <FaShoppingBag size={18} />
                <span className="hidden lg:block text-[11px] font-bold uppercase tracking-wider">Cart</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-black text-white text-[10px] font-bold px-1">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-20"></div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[100] lg:hidden transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      >
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={toggleMobileMenu}
        />
        <div 
          className={`absolute left-0 top-0 h-full w-[80%] max-w-sm bg-white shadow-2xl transition-transform duration-300 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <Link to="/" onClick={toggleMobileMenu} className="flex items-center gap-2">
                <img src={logo} alt="Logo" className="h-8 w-auto" />
                <span className="text-lg font-bold tracking-wider" style={{ fontFamily: 'Playfair Display' }}>BLACK LOCUST</span>
              </Link>
              <button onClick={toggleMobileMenu} className="p-2 text-gray-500"><FaTimes size={20} /></button>
            </div>

            <nav className="space-y-1">
              <div className="pb-2 mb-2 border-b border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Collections</span>
              </div>
              {collections.map((col) => (
                <Link
                  key={col._id}
                  to={`/collection/${col.slug}`}
                  onClick={toggleMobileMenu}
                  className="block py-3 text-base font-medium text-gray-900 border-b border-gray-50"
                >
                  {col.name}
                </Link>
              ))}
              <Link
                to="/products"
                onClick={toggleMobileMenu}
                className="block py-4 text-sm font-bold text-[#C19A6B] uppercase tracking-widest"
              >
                Shop All Products
              </Link>
            </nav>

            <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
              <Link to="/contact" onClick={toggleMobileMenu} className="flex items-center gap-3 text-gray-700">
                <FaStore size={18} /> <span className="text-sm font-bold uppercase">Our Stores</span>
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/profile" onClick={toggleMobileMenu} className="flex items-center gap-3 text-gray-700">
                    <FaUser size={18} /> <span className="text-sm font-bold uppercase">My Profile</span>
                  </Link>
                  <button onClick={() => { handleLogout(); toggleMobileMenu(); }} className="flex items-center gap-3 text-red-600 font-bold uppercase text-sm">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={toggleMobileMenu} className="flex items-center gap-3 text-gray-700">
                  <FaUser size={18} /> <span className="text-sm font-bold uppercase">Login / Register</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PeterEnglandHeader;
