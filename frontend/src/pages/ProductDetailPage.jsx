import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaRegHeart, FaHeart, FaChevronDown, FaChevronUp, FaStar, FaShareAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../utils/currency';
import ProductCard from '../components/Product/PeterEnglandProductCard';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

  const isWishlisted = isInWishlist(id);

  const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        const productData = response.data.product;
        setProduct(productData);
        
        if (productData?.sizes?.length > 0) {
          const firstAvailable = productData.sizes.find(s => s.stock > 0);
          if (firstAvailable) setSelectedSize(firstAvailable);
        }

        // Fetch related products
        const relatedRes = await api.get(`/products?category=${productData.categoryName}&limit=5`);
        setRelatedProducts(relatedRes.data.products.filter(p => p._id !== id).slice(0, 4));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const galleryImages = useMemo(() => {
    if (!product?.images?.length) return [PLACEHOLDER_IMAGE];
    return product.images.map(img => typeof img === 'string' ? img : img.url || PLACEHOLDER_IMAGE);
  }, [product]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to bag');
      navigate('/login');
      return;
    }

    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    const cartItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      image: galleryImages[0],
      size: selectedSize.size,
      color: product.colors?.[0] || 'Default',
      quantity: 1
    };

    addToCart(cartItem);
    toast.success('Added to bag');
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(id);
    } else {
      addToWishlist(product);
    }
  };

  if (loading) return <div className="pdp-loader-container"><div className="spinner"></div></div>;
  if (!product) return <div className="pdp-error-container"><h2>Product Not Found</h2><button onClick={() => navigate('/products')}>Back to Shop</button></div>;

  return (
    <div className="pdp-modern-page">
      <div className="container">
        <div className="pdp-modern-layout">
          {/* Left Side: Images */}
          <div className="pdp-modern-gallery">
            <div className="pdp-modern-main-image">
              <img src={galleryImages[activeIndex]} alt={product.name} />
              
              <button className="gallery-arrow prev lg:hidden" onClick={() => setActiveIndex(prev => prev === 0 ? galleryImages.length - 1 : prev - 1)}>
                <FaChevronLeft />
              </button>
              <button className="gallery-arrow next lg:hidden" onClick={() => setActiveIndex(prev => (prev + 1) % galleryImages.length)}>
                <FaChevronRight />
              </button>

              <div className="gallery-actions-mobile lg:hidden">
                <button className="action-circle" onClick={handleWishlistToggle}>
                  {isWishlisted ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                </button>
                <button className="action-circle">
                  <FaShareAlt />
                </button>
              </div>
            </div>

            <div className="pdp-modern-thumbnails hidden lg:flex">
              {galleryImages.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`modern-thumb ${activeIndex === idx ? 'active' : ''}`}
                  onClick={() => setActiveIndex(idx)}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Info */}
          <div className="pdp-modern-info">
            <div className="pdp-modern-header">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-xl lg:text-3xl font-black uppercase tracking-wider text-gray-900 mb-2">{product.name}</h1>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{product.categoryName || 'PREMIUM COLLECTION'}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-gray-900">{formatPrice(product.price)}</span>
                </div>
              </div>

              <div className="pdp-modern-rating mt-4 flex items-center gap-2">
                <div className="flex text-yellow-400 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.floor(product.rating || 4) ? 'filled' : 'opacity-20'} />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">({product.numReviews || 0} REVIEWS)</span>
              </div>
            </div>

            <div className="pdp-modern-section mt-10">
              <label className="text-[11px] font-black uppercase tracking-widest mb-4 block">Colors</label>
              <div className="flex gap-3">
                {galleryImages.slice(0, 4).map((img, idx) => (
                  <button 
                    key={idx}
                    className={`color-swatch-img ${activeIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveIndex(idx)}
                  >
                    <img src={img} alt="color" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pdp-modern-section mt-10">
              <div className="flex justify-between items-center mb-4">
                <label className="text-[11px] font-black uppercase tracking-widest">Select Size</label>
                <button 
                  onClick={() => setIsSizeChartOpen(true)}
                  className="text-[10px] font-bold uppercase tracking-widest underline text-gray-400"
                >
                  Size Chart
                </button>
              </div>
              <div className="size-modern-grid">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => {
                  const sizeData = product.sizes?.find(s => s.size === size);
                  const isAvailable = sizeData ? sizeData.stock > 0 : true;
                  return (
                    <button 
                      key={size}
                      className={`size-modern-btn ${selectedSize?.size === size ? 'active' : ''} ${!isAvailable ? 'disabled' : ''}`}
                      onClick={() => isAvailable && setSelectedSize({ size })}
                      disabled={!isAvailable}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] font-bold text-gray-400 mt-4 uppercase tracking-widest">Free 1-2 day delivery on 5k+ pincodes</p>
            </div>

            <div className="pdp-modern-actions hidden lg:flex gap-4 mt-12">
              <button className="add-to-bag-btn flex-1 bg-black text-white font-black py-5 tracking-[0.2em] uppercase hover:bg-gray-800 transition-all" onClick={handleAddToCart}>
                ADD TO BAG
              </button>
              <button 
                className={`wishlist-btn-modern w-20 flex items-center justify-center border border-gray-200 transition-all ${isWishlisted ? 'text-red-500 border-red-200 bg-red-50' : 'hover:border-black'}`}
                onClick={handleWishlistToggle}
              >
                {isWishlisted ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
              </button>
            </div>

            <div className="pdp-modern-accordions mt-12 border-t border-gray-100">
              {[
                { id: 'description', title: 'Details', content: product.description },
                { id: 'reviews', title: 'Reviews', content: 'Customer reviews will be displayed here.' },
                { id: 'delivery', title: 'Delivery', content: 'Standard delivery in 3-5 business days.' },
                { id: 'returns', title: 'Returns', content: 'Easy 30-day returns and exchanges.' }
              ].map((item) => (
                <div key={item.id} className={`modern-accordion ${activeAccordion === item.id ? 'active' : ''}`}>
                  <button 
                    className="modern-accordion-header py-6 w-full flex justify-between items-center text-left"
                    onClick={() => setActiveAccordion(activeAccordion === item.id ? '' : item.id)}
                  >
                    <span className="text-xs font-black uppercase tracking-[0.2em]">{item.title}</span>
                    {activeAccordion === item.id ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                  </button>
                  <div className="modern-accordion-content overflow-hidden transition-all duration-300">
                    <p className="pb-6 text-sm text-gray-500 leading-relaxed font-medium">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="pdp-modern-related py-20 border-t border-gray-100">
            <h2 className="text-center font-black uppercase tracking-[0.3em] text-lg mb-12">You May Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
              {relatedProducts.map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-100 z-50 flex gap-4">
        <div className="flex-1">
          <button className="w-full bg-black text-white font-black py-4 text-sm tracking-[0.2em] uppercase" onClick={handleAddToCart}>
            ADD TO BAG
          </button>
        </div>
      </div>

      {isSizeChartOpen && (
        <div className="size-chart-modal-overlay" onClick={() => setIsSizeChartOpen(false)}>
          <div className="size-chart-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setIsSizeChartOpen(false)}>&times;</button>
            <h2>Size Chart</h2>
            <table>
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chest (in)</th>
                  <th>Waist (in)</th>
                  <th>Length (in)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>S</td><td>36-38</td><td>30-32</td><td>28</td></tr>
                <tr><td>M</td><td>38-40</td><td>32-34</td><td>29</td></tr>
                <tr><td>L</td><td>40-42</td><td>34-36</td><td>30</td></tr>
                <tr><td>XL</td><td>42-44</td><td>36-38</td><td>31</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
