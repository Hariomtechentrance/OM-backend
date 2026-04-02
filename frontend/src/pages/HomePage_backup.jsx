import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Hero from '../components/Hero/Hero';
import ProductCard from '../components/Products/ProductCard';
import AuthModal from '../components/AuthModal/AuthModal';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './HomePage.css';

// Professional featured products data with complete information
const professionalFeaturedItems = [
  {
    id: '1',
    name: 'Classic Oxford Shirt',
    price: 3499,
    originalPrice: 4999,
    category: 'Men\'s Shirts',
    subcategory: 'Formal',
    brand: 'Black Locust',
    images: [
      'https://images.unsplash.com/photo-1596755096918-a042d8e29050?w=600',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600'
    ],
    description: 'Elevate your wardrobe with our premium Oxford shirt, crafted from the finest cotton with meticulous attention to detail.',
    features: ['100% Premium Cotton', 'Classic Fit', 'Machine Washable', 'Imported'],
    rating: 4.8,
    reviews: 127,
    newArrival: true,
    trending: true,
    badge: 'NEW',
    discount: 30,
    colors: ['White', 'Blue', 'Black', 'Gray'],
    sizes: [
      { name: 'S', type: 'standard', stock: 15, price: 3499 },
      { name: 'M', type: 'standard', stock: 20, price: 3499 },
      { name: 'L', type: 'standard', stock: 12, price: 3499 },
      { name: 'XL', type: 'standard', stock: 8, price: 3499 },
      { name: 'XXL', type: 'standard', stock: 4, price: 3799 }
    ],
    inStock: true,
    fastShipping: true
  },
  {
    id: '2',
    name: 'Executive Wool Blazer',
    price: 8999,
    originalPrice: 12999,
    category: 'Men\'s Outerwear',
    subcategory: 'Blazers',
    brand: 'Black Locust',
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600'
    ],
    description: 'Command attention with our executive wool blazer, designed for the modern professional who values style and sophistication.',
    features: ['Premium Wool Blend', 'Slim Fit', 'Fully Lined', 'Dry Clean Only'],
    rating: 4.9,
    reviews: 89,
    newArrival: true,
    trending: true,
    badge: 'EXCLUSIVE',
    discount: 31,
    colors: ['Navy', 'Charcoal', 'Black'],
    sizes: [
      { name: 'S', type: 'standard', stock: 8, price: 8999 },
      { name: 'M', type: 'standard', stock: 12, price: 8999 },
      { name: 'L', type: 'standard', stock: 6, price: 8999 },
      { name: 'XL', type: 'standard', stock: 3, price: 8999 }
    ],
    inStock: true,
    fastShipping: true
  },
  {
    id: '3',
    name: 'Designer Denim Jacket',
    price: 4299,
    originalPrice: 5999,
    category: 'Men\'s Outerwear',
    subcategory: 'Jackets',
    brand: 'Black Locust',
    images: [
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600',
      'https://images.unsplash.com/photo-1551488833-7dd5bdc0a8e1?w=600'
    ],
    description: 'Make a statement with our designer denim jacket, combining classic style with contemporary design elements.',
    features: ['Premium Denim', 'Classic Fit', 'Multiple Pockets', 'Machine Washable'],
    rating: 4.7,
    reviews: 156,
    newArrival: true,
    trending: false,
    badge: 'TRENDING',
    discount: 28,
    colors: ['Classic Blue', 'Black', 'Light Wash'],
    sizes: [
      { name: 'S', type: 'standard', stock: 10, price: 4299 },
      { name: 'M', type: 'standard', stock: 15, price: 4299 },
      { name: 'L', type: 'standard', stock: 8, price: 4299 },
      { name: 'XL', type: 'standard', stock: 5, price: 4299 },
      { name: 'XXL', type: 'standard', stock: 2, price: 4599 }
    ],
    inStock: true,
    fastShipping: false
  },
  {
    id: '4',
    name: 'Luxury Cotton Polo',
    price: 2499,
    originalPrice: 3499,
    category: 'Men\'s Shirts',
    subcategory: 'Casual',
    brand: 'Black Locust',
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600',
      'https://images.unsplash.com/photo-1596755096918-a042d8e29050?w=600'
    ],
    description: 'Experience comfort and style with our luxury cotton polo, perfect for both casual and semi-formal occasions.',
    features: ['Pima Cotton', 'Classic Fit', 'Ribbed Collar', 'Machine Washable'],
    rating: 4.6,
    reviews: 203,
    newArrival: true,
    trending: false,
    badge: 'BESTSELLER',
    discount: 29,
    colors: ['White', 'Navy', 'Black', 'Gray'],
    sizes: [
      { name: 'S', type: 'standard', stock: 18, price: 2499 },
      { name: 'M', type: 'standard', stock: 25, price: 2499 },
      { name: 'L', type: 'standard', stock: 20, price: 2499 },
      { name: 'XL', type: 'standard', stock: 12, price: 2499 },
      { name: 'XXL', type: 'standard', stock: 6, price: 2799 }
    ],
    inStock: true,
    fastShipping: true
  },
  {
    id: '5',
    name: 'Tailored Chino Pants',
    price: 3799,
    originalPrice: 5299,
    category: 'Men\'s Bottoms',
    subcategory: 'Pants',
    brand: 'Black Locust',
    images: [
      'https://images.unsplash.com/photo-1594634319159-ec19e1c396f1?w=600',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'
    ],
    description: 'Achieve the perfect balance of comfort and style with our tailored chino pants, designed for the modern gentleman.',
    features: ['Premium Cotton Twill', 'Slim Fit', 'Stretch Comfort', 'Machine Washable'],
    rating: 4.8,
    reviews: 178,
    newArrival: true,
    trending: true,
    badge: 'NEW',
    discount: 28,
    colors: ['Khaki', 'Navy', 'Black', 'Gray', 'Olive'],
    sizes: ['28', '30', '32', '34', '36', '38'],
    inStock: true,
    fastShipping: true
  },
  {
    id: '6',
    name: 'Explorer Kids Jacket',
    price: 1999,
    originalPrice: 2999,
    category: 'Kids\'s Outerwear',
    subcategory: 'Jackets',
    brand: 'Black Locust Junior',
    images: [
      'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600',
      'https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=600'
    ],
    description: 'Adventure-ready jacket designed for young explorers, combining durability with style for everyday adventures.',
    features: ['Water-Resistant', 'Lightweight', 'Multiple Pockets', 'Easy Clean'],
    rating: 4.9,
    reviews: 92,
    newArrival: true,
    trending: false,
    badge: 'KIDS FAVORITE',
    discount: 33,
    colors: ['Blue', 'Red', 'Green', 'Black'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    fastShipping: true
  },
  {
    id: '7',
    name: 'Premium Leather Belt',
    price: 1299,
    originalPrice: 1899,
    category: 'Men\'s Accessories',
    subcategory: 'Belts',
    brand: 'Black Locust',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
      'https://images.unsplash.com/photo-1594634319159-ec19e1c396f1?w=600'
    ],
    description: 'Complete your look with our premium leather belt, crafted from genuine leather with attention to detail.',
    features: ['Genuine Leather', 'Classic Buckle', 'Adjustable Length', 'Durable'],
    rating: 4.7,
    reviews: 145,
    newArrival: true,
    trending: false,
    badge: 'ESSENTIAL',
    discount: 32,
    colors: ['Black', 'Brown', 'Tan'],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    fastShipping: true
  },
  {
    id: '8',
    name: 'Summer Linen Shirt',
    price: 2799,
    originalPrice: 3999,
    category: 'Men\'s Shirts',
    subcategory: 'Casual',
    brand: 'Black Locust',
    images: [
      'https://images.unsplash.com/photo-151676268803-be716536a3f1?w=600',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600'
    ],
    description: 'Stay cool and stylish with our summer linen shirt, perfect for warm weather and casual occasions.',
    features: ['Premium Linen', 'Breathable', 'Classic Fit', 'Machine Washable'],
    rating: 4.6,
    reviews: 167,
    newArrival: true,
    trending: true,
    badge: 'SUMMER ESSENTIAL',
    discount: 30,
    colors: ['White', 'Beige', 'Light Blue', 'Pink'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    fastShipping: false
  }
];

function HomePage() {
  const [products, setProducts] = useState(professionalFeaturedItems);
  const [showAuth, setShowAuth] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Initialize products on mount
  useEffect(() => {
    setProducts(professionalFeaturedItems);
    
    // Intersection Observer for reveal animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    // Observe all reveal elements
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    // Cleanup
    return () => {
      revealElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  // Handle add to cart with auth check
  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      setShowAuth(true);
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleQuickView = (product) => {
    // Navigate to product detail page
    navigate(`/product/${product.id || product._id}`);
  };

  const handleAddToWishlist = (product) => {
    if (!isAuthenticated) {
      setShowAuth(true);
      return;
    }
    // Add to wishlist functionality - save to localStorage or state
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const exists = wishlist.find(item => item.id === (product.id || product._id));
    
    if (!exists) {
      wishlist.push({
        id: product.id || product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || product.image,
        category: product.category,
        addedAt: new Date().toISOString()
      });
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      toast.success(`${product.name} added to wishlist!`);
    } else {
      // Remove from wishlist
      const updatedWishlist = wishlist.filter(item => item.id !== (product.id || product._id));
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      toast.success(`${product.name} removed from wishlist!`);
    }
  };

  const handleCompare = (product) => {
    // Add to compare functionality
    const compare = JSON.parse(localStorage.getItem('compare') || '[]');
    if (compare.length < 4) {
      const exists = compare.find(item => item.id === (product.id || product._id));
      if (!exists) {
        compare.push({
          id: product.id || product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || product.image,
          category: product.category
        });
        localStorage.setItem('compare', JSON.stringify(compare));
        toast.success(`${product.name} added to compare!`);
      } else {
        toast.info('Product already in compare list!');
      }
    } else {
      toast.error('You can compare up to 4 products at a time!');
    }
  };

  const handleQuickViewModal = (product) => {
    setSelectedProduct(product);
  };

  // Navigation handlers
  const goToLogin = () => {
    navigate('/login');
  };

  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="home-page">
      <Hero />
      
      {/* Categories Section - Directly Below Hero */}
      <section className="categories" id="categories">
        <div className="categories-grid">
          <div className="category-card reveal">
            <img src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=800&q=80" alt="Men's Collection" className="category-image" />
            <div className="category-overlay">
              <h3>Men's Collection</h3>
              <p>Refined elegance meets contemporary style</p>
              <Link to="/products?category=men" className="category-link">Explore Men →</Link>
            </div>
          </div>
          <div className="category-card reveal">
            <img src="https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&q=80" alt="Kids Collection" className="category-image" />
            <div className="category-overlay">
              <h3>Kids Collection</h3>
              <p>Adventure-ready style for young minds</p>
              <Link to="/products?category=kids" className="category-link">Explore Kids →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured products section */}
      <section className="featured" id="featured">
        <div className="products-container">
          <div className="section-header">
            <h2 className="section-title reveal">FEATURED COLLECTION</h2>
            <p>Discover our handpicked selection of premium items</p>
          </div>
          
          <div className="products-grid">
            {products.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                onAddToCart={handleAddToCart}
                onQuickView={handleQuickView}
                onAddToWishlist={handleAddToWishlist}
                onCompare={handleCompare}
              />
            ))}
          </div>
          
          <div className="view-all-container">
            <Link to="/shop" className="btn btn-primary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter" id="newsletter">
        <h2>JOIN THE BLACK LOCUST FAMILY</h2>
        <p>Subscribe to receive exclusive offers, style updates, and new arrivals</p>
        <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing!'); }}>
          <input 
            type="email" 
            className="newsletter-input" 
            placeholder="Enter your email address" 
            required 
          />
          <button type="submit" className="newsletter-btn">Subscribe</button>
        </form>
      </section>

      {/* Auth modal */}
      <AuthModal 
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onLogin={() => navigate('/login')}
        onRegister={() => navigate('/register')}
      />

      {/* Quick View Modal */}
      {selectedProduct && (
        <div className="quick-view-modal" onClick={() => setSelectedProduct(null)}>
          <div className="quick-view-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-quick-view" onClick={() => setSelectedProduct(null)}>×</button>
            <div className="quick-view-grid">
              <div className="quick-view-images">
                <img src={selectedProduct.images[0]} alt={selectedProduct.name} />
              </div>
              <div className="quick-view-details">
                <h2>{selectedProduct.name}</h2>
                <div className="quick-view-rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(selectedProduct.rating) ? 'filled' : ''}>★</span>
                    ))}
                  </div>
                  <span className="rating-text">({selectedProduct.rating})</span>
                </div>
                <div className="quick-view-price">
                  <span className="current-price">₹{selectedProduct.price.toLocaleString('en-IN')}</span>
                  {selectedProduct.originalPrice && (
                    <span className="original-price">₹{selectedProduct.originalPrice.toLocaleString('en-IN')}</span>
                  )}
                </div>
                <p className="quick-view-description">{selectedProduct.description}</p>
                <div className="quick-view-features">
                  <h4>Features:</h4>
                  <ul>
                    {selectedProduct.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="quick-view-actions">
                  <button 
                    className="quick-view-add-to-cart"
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                  >
                    🛒 Add to Cart
                  </button>
                  <Link to={`/product/${selectedProduct.id}`} className="view-full-details">
                    View Full Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
