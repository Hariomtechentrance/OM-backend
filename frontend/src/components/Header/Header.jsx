import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaHeart, FaRegHeart, FaSearch, FaShoppingBag, FaUser } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/images/new-logo.png';
import HamburgerMenu from './HamburgerMenu';

const Header = () => {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const accountInitial = useMemo(() => {
    return (user?.name || user?.email || '').trim().charAt(0).toUpperCase();
  }, [user]);

  const toggleHamburger = () => {
    setHamburgerOpen(!hamburgerOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[1000] border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="bl-container">
          <div className="flex h-[76px] items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleHamburger}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition duration-300 hover:bg-white/10"
                aria-label="Open collections menu"
              >
                <FaBars />
              </button>

              <Link to="/" className="flex items-center gap-2">
                <img src={logo} alt="Blacklocust" className="h-8 w-auto" />
                <span className="hidden text-[15px] font-semibold tracking-[0.18em] text-white/90 sm:inline">
                  BLACKLOCUST
                </span>
              </Link>
            </div>

            <nav className="hidden items-center gap-8 md:flex">
              <Link to="/products" className="text-sm font-medium tracking-[0.14em] text-white/80 hover:text-white transition">
                MEN
              </Link>
              <Link to="/products" className="text-sm font-medium tracking-[0.14em] text-white/80 hover:text-white transition">
                KIDS
              </Link>
              <Link to="/new-arrivals" className="text-sm font-medium tracking-[0.14em] text-white/80 hover:text-white transition">
                NEW
              </Link>
              <Link to="/products" className="text-sm font-medium tracking-[0.14em] text-white/80 hover:text-white transition">
                SALE
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/search')}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition duration-300 hover:bg-white/10"
                aria-label="Search"
              >
                <FaSearch />
              </button>

              <button
                type="button"
                onClick={() => navigate(isAuthenticated ? '/profile' : '/login')}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition duration-300 hover:bg-white/10"
                aria-label="Profile"
              >
                {isAuthenticated ? (
                  <span className="text-sm font-semibold">{accountInitial || <FaUser />}</span>
                ) : (
                  <FaUser />
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition duration-300 hover:bg-white/10"
                aria-label="Cart"
              >
                <FaShoppingBag />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blacklocust-gold px-1 text-[11px] font-bold text-black">
                    {totalItems}
                  </span>
                )}
              </button>

              {isAuthenticated && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="hidden rounded-full border border-white/15 bg-transparent px-4 py-2 text-xs font-semibold tracking-[0.14em] text-white/85 transition hover:border-blacklocust-gold hover:text-blacklocust-gold md:inline-flex"
                >
                  LOGOUT
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Slide-out collections menu (mobile + desktop) */}
      <HamburgerMenu isOpen={hamburgerOpen} onClose={() => setHamburgerOpen(false)} />
    </>
  );
};

export default Header;
