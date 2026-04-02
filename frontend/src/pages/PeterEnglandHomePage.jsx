import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaShoppingBag, FaStar, FaRegHeart, FaShippingFast, FaUndo, FaShieldAlt } from 'react-icons/fa';
import PeterEnglandHero from '../components/Hero/PeterEnglandHero';
import PeterEnglandProductCard from '../components/Product/PeterEnglandProductCard';
import api from '../api/axios';

const PeterEnglandHomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    window.scrollTo(0, 0);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      if (response.data.success) {
        setProducts(response.data.products || []);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const newArrivals = useMemo(() => products.filter(p => p.isNewArrival).slice(0, 4), [products]);
  const featured = useMemo(() => products.slice(0, 8), [products]);

  const topCategories = [
    { name: 'Shirts', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop', link: '/products?category=shirts' },
    { name: 'Trousers', image: 'https://images.unsplash.com/photo-1624371414361-e6e8ea02c1e0?w=400&h=400&fit=crop', link: '/products?category=trousers' },
    { name: 'Suits', image: 'https://images.unsplash.com/photo-1594932224828-b4b05a832fe3?w=400&h=400&fit=crop', link: '/products?category=suits' },
    { name: 'Casuals', image: 'https://images.unsplash.com/photo-1516257984877-a03a01ae1b89?w=400&h=400&fit=crop', link: '/products?category=t-shirts' },
    { name: 'Kids', image: 'https://images.unsplash.com/photo-1519457431-7571f018272b?w=400&h=400&fit=crop', link: '/products?category=kids-wear' },
  ];

  const featuredCollections = [
    { name: 'The Wedding Store', image: 'https://images.unsplash.com/photo-1594932224828-b4b05a832fe3?w=800&h=1000&fit=crop', link: '/products?collection=wedding' },
    { name: 'Modern Office', image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800&h=1000&fit=crop', link: '/products?collection=office' },
    { name: 'Linen Luxe', image: 'https://images.unsplash.com/photo-1523381235200-62947558d447?w=800&h=1000&fit=crop', link: '/products?collection=linen' },
  ];

  return (
    <div className="bg-white">
      {/* Hero Slider */}
      <PeterEnglandHero />

      {/* Featured Categories - Responsive Grid (Snitch Style) */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 uppercase tracking-widest" style={{ fontFamily: 'Playfair Display, serif' }}>Featured Categories</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 lg:gap-6">
            {topCategories.map((cat, i) => (
              <Link key={i} to={cat.link} className="relative group aspect-[3/4] overflow-hidden">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent pt-10">
                  <span className="text-white text-xs lg:text-lg font-black uppercase tracking-[0.2em]">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Categories - Circle Shape (Desktop) */}
      <section className="hidden lg:block py-16 bg-[#FAFAFA]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 lg:gap-16">
            {topCategories.map((cat, i) => (
              <Link key={i} to={cat.link} className="flex flex-col items-center group">
                <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#C19A6B] transition-all duration-300 shadow-md mb-4">
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <span className="text-xs lg:text-sm font-bold uppercase tracking-widest text-gray-900 group-hover:text-[#C19A6B] transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collection - Rectangle Shape */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-[#C19A6B] font-bold tracking-[0.3em] uppercase text-sm mb-4 block">Handpicked for you</span>
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Featured Collections</h2>
            </div>
            <Link to="/products" className="hidden lg:flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-900 hover:text-[#C19A6B] transition-colors group">
              EXPLORE ALL <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCollections.map((col, i) => (
              <Link key={i} to={col.link} className="relative group overflow-hidden aspect-[4/5]">
                <img src={col.image} alt={col.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display' }}>{col.name}</h3>
                  <span className="inline-block px-6 py-2 bg-white text-black text-[10px] font-bold tracking-widest uppercase">SHOP NOW</span>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 text-center lg:hidden">
            <Link to="/products" className="inline-block px-8 py-4 border-2 border-black text-black text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-all">
              EXPLORE ALL
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-20 lg:py-32 bg-[#FAFAFA]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-[#C19A6B] font-bold tracking-[0.3em] uppercase text-sm mb-4 block">Just In</span>
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>New Arrivals</h2>
            </div>
            <Link to="/products?sort=newest" className="hidden lg:flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-900 hover:text-[#C19A6B] transition-colors group">
              VIEW ALL <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
            {newArrivals.map((product) => (
              <PeterEnglandProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="mt-12 text-center lg:hidden">
            <Link to="/products?sort=newest" className="inline-block px-8 py-4 border-2 border-black text-black text-xs font-bold tracking-widest uppercase hover:bg-black hover:text-white transition-all">
              VIEW ALL
            </Link>
          </div>
        </div>
      </section>

      {/* Shop the Look Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#C19A6B] font-bold tracking-[0.3em] uppercase text-sm mb-4 block">Style Guide</span>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Shop The Look</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative group aspect-[4/5] overflow-hidden rounded-sm">
              <img src="https://images.unsplash.com/photo-1555069519-127a3f177c8d?w=1000&q=80" alt="Shop the look" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
            </div>
            <div className="space-y-10 lg:pl-12">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display' }}>The Modern Corporate</h3>
                <p className="text-gray-600 text-lg leading-relaxed max-w-md">Master the art of office dressing with our sharpest shirts and perfectly tailored trousers. Elegance meet productivity.</p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-6 p-4 border border-gray-100 hover:border-[#C19A6B] transition-colors rounded-sm group cursor-pointer">
                  <div className="w-20 h-24 bg-gray-50 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200" alt="Item" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1">Premium Cotton Shirt</h4>
                    <span className="text-[#C19A6B] font-bold">₹2,499</span>
                  </div>
                  <button className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full group-hover:bg-[#C19A6B] transition-colors">
                    <FaShoppingBag size={14} />
                  </button>
                </div>
                
                <div className="flex items-center gap-6 p-4 border border-gray-100 hover:border-[#C19A6B] transition-colors rounded-sm group cursor-pointer">
                  <div className="w-20 h-24 bg-gray-50 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1624371414361-e6e8ea02c1e0?w=200" alt="Item" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1">Tailored Fit Chinos</h4>
                    <span className="text-[#C19A6B] font-bold">₹1,999</span>
                  </div>
                  <button className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full group-hover:bg-[#C19A6B] transition-colors">
                    <FaShoppingBag size={14} />
                  </button>
                </div>
              </div>

              <Link to="/products" className="inline-block px-10 py-4 bg-black text-white text-xs font-bold tracking-widest uppercase hover:bg-[#C19A6B] transition-all duration-300 shadow-xl">
                SHOP THIS LOOK
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 flex items-center justify-center bg-[#FAFAFA] rounded-full text-[#C19A6B] mb-2">
                <FaShippingFast size={28} />
              </div>
              <h4 className="text-sm font-bold uppercase tracking-widest">Free Shipping</h4>
              <p className="text-xs text-gray-500 uppercase tracking-wider">On all orders above ₹999</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 flex items-center justify-center bg-[#FAFAFA] rounded-full text-[#C19A6B] mb-2">
                <FaUndo size={28} />
              </div>
              <h4 className="text-sm font-bold uppercase tracking-widest">30-Day Returns</h4>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Hassle free exchange & returns</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 flex items-center justify-center bg-[#FAFAFA] rounded-full text-[#C19A6B] mb-2">
                <FaShieldAlt size={28} />
              </div>
              <h4 className="text-sm font-bold uppercase tracking-widest">100% Secure</h4>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Trusted payment gateways</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PeterEnglandHomePage;
