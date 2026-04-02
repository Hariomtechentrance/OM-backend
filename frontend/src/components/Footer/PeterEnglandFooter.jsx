import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCcVisa, FaCcMastercard, FaApplePay, FaGooglePay } from 'react-icons/fa';
import logo from '../../assets/images/new-logo.png';

const PeterEnglandFooter = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    setEmail('');
    alert('Thank you for joining the community!');
  };

  const footerLinks = {
    'NEED HELP?': [
      { name: 'Order Status', to: '/profile' },
      { name: 'Delivery', to: '/shipping-policy' },
      { name: 'Returns', to: '/return-policy' },
      { name: 'FAQs', to: '/faq' },
      { name: 'Contact Us', to: '/contact' }
    ],
    'ABOUT US': [
      { name: 'Our Story', to: '/about' },
      { name: 'Store Locator', to: '/stores' },
      { name: 'Bulk Orders', to: '/contact' },
      { name: 'Careers', to: '/contact' }
    ],
    'SHOP BY': [
      { name: 'Men\'s Wear', to: '/products?category=men' },
      { name: 'Kids\' Wear', to: '/products?category=kids' },
      { name: 'New Arrivals', to: '/products?isNewArrival=true' },
      { name: 'Sales', to: '/products?onSale=true' }
    ],
    'POLICIES': [
      { name: 'Terms & Conditions', to: '/terms' },
      { name: 'Privacy Policy', to: '/privacy' },
      { name: 'Shipping Policy', to: '/shipping-policy' },
      { name: 'Return Policy', to: '/return-policy' }
    ]
  };

  return (
    <footer className="bg-[#FAFAFA] pt-20 border-t border-gray-200">
      <div className="container mx-auto px-4 lg:px-16">
        {/* Newsletter Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pb-20 border-b border-gray-200">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display' }}>Join the community</h2>
            <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Be the first to know about new arrivals and exclusive offers.</p>
          </div>
          <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="YOUR EMAIL ADDRESS"
              className="flex-1 bg-white border border-gray-200 px-6 py-4 text-xs font-bold tracking-widest focus:outline-none focus:border-black"
            />
            <button type="submit" className="bg-black text-white px-8 py-4 text-xs font-bold tracking-widest hover:bg-[#C19A6B] transition-colors">JOIN</button>
          </form>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-20">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-[11px] font-black text-gray-900 tracking-[0.2em] uppercase mb-8">{title}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.to} className="text-xs font-bold text-gray-500 hover:text-[#C19A6B] tracking-wider transition-colors uppercase">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="py-12 border-t border-gray-200 flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-4">
            <img src={logo} alt="Logo" className="h-8 grayscale" />
            <span className="text-[10px] font-bold text-gray-400 tracking-widest">© 2024 BLACK LOCUST. ALL RIGHTS RESERVED.</span>
          </div>

          <div className="flex gap-8">
            <a href="#" className="text-gray-400 hover:text-black transition-colors"><FaFacebookF size={18} /></a>
            <a href="#" className="text-gray-400 hover:text-black transition-colors"><FaInstagram size={18} /></a>
            <a href="#" className="text-gray-400 hover:text-black transition-colors"><FaTwitter size={18} /></a>
            <a href="#" className="text-gray-400 hover:text-black transition-colors"><FaYoutube size={18} /></a>
          </div>

          <div className="flex gap-4 text-gray-300">
            <FaCcVisa size={32} />
            <FaCcMastercard size={32} />
            <FaApplePay size={32} />
            <FaGooglePay size={32} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PeterEnglandFooter;
