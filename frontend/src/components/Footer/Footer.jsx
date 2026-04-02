import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaPinterest, FaYoutube } from 'react-icons/fa';
import logo from '../../assets/images/new-logo.png';

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-white/10 bg-black">
      <div className="bl-container">
        <div className="grid gap-10 py-12 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Blacklocust" className="h-9 w-auto" />
              <div className="leading-tight">
                <div className="font-heading text-lg font-semibold tracking-[0.14em] text-white">
                  Blacklocust
                </div>
                <div className="text-sm text-white/60">Premium Fashion for Men & Kids</div>
              </div>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-white/60">
              Luxury minimal essentials with a modern fit. Designed for confidence, built for daily wear.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3 md:col-span-6">
            <div>
              <h4 className="text-xs font-semibold tracking-[0.18em] text-white/80">SHOP</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link className="bl-link" to="/new-arrivals">New Arrivals</Link></li>
                <li><Link className="bl-link" to="/shop-summer">Shop Summer</Link></li>
                <li><Link className="bl-link" to="/collections">Collections</Link></li>
                <li><Link className="bl-link" to="/products">All Products</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold tracking-[0.18em] text-white/80">HELP</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link className="bl-link" to="/contact">Contact Us</Link></li>
                <li><Link className="bl-link" to="/about">About Us</Link></li>
                <li><Link className="bl-link" to="/faq">FAQ</Link></li>
                <li><Link className="bl-link" to="/shipping">Shipping & Returns</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold tracking-[0.18em] text-white/80">LEGAL</h4>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link className="bl-link" to="/privacy">Privacy Policy</Link></li>
                <li><Link className="bl-link" to="/terms">Terms of Service</Link></li>
                <li><Link className="bl-link" to="/sitemap">Sitemap</Link></li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold tracking-[0.18em] text-white/80">FOLLOW</h4>
            <div className="mt-4 flex items-center gap-3">
              <a className="rounded-full border border-white/10 bg-white/5 p-2 text-white/80 transition hover:border-blacklocust-gold hover:text-blacklocust-gold" href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook /></a>
              <a className="rounded-full border border-white/10 bg-white/5 p-2 text-white/80 transition hover:border-blacklocust-gold hover:text-blacklocust-gold" href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
              <a className="rounded-full border border-white/10 bg-white/5 p-2 text-white/80 transition hover:border-blacklocust-gold hover:text-blacklocust-gold" href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
              <a className="rounded-full border border-white/10 bg-white/5 p-2 text-white/80 transition hover:border-blacklocust-gold hover:text-blacklocust-gold" href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest"><FaPinterest /></a>
              <a className="rounded-full border border-white/10 bg-white/5 p-2 text-white/80 transition hover:border-blacklocust-gold hover:text-blacklocust-gold" href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube /></a>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-white/10 py-6 text-sm text-white/50 md:flex-row md:items-center">
          <p>&copy; 2026 Blacklocust. All rights reserved.</p>
          <p className="text-white/40">Crafted for a premium experience.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;