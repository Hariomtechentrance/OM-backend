import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useStock } from '../context/StockContext';
import SizeSelector from '../components/SizeSelector/SizeSelector';
import SizeChart from '../components/SizeChart/SizeChart';
import '../components/SizeSelector/SizeSelector.css';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { getStock } = useStock();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const [showSizeChart, setShowSizeChart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Mock product data - replace with actual API call
        const mockProduct = {
          _id: id,
          name: 'Premium Cotton T-Shirt',
          description: 'Experience ultimate comfort with our premium cotton t-shirt. Made from 100% organic cotton, this versatile piece features a perfect fit and exceptional durability. Ideal for casual wear or layering.',
          price: 2999,
          category: 'T-Shirts',
          brand: 'Black Locust',
          images: [
            { url: 'https://via.placeholder.com/600x600/333333/ffffff?text=Product+1', public_id: 'product1_1' },
            { url: 'https://via.placeholder.com/600x600/444444/ffffff?text=Product+2', public_id: 'product1_2' },
            { url: 'https://via.placeholder.com/600x600/555555/ffffff?text=Product+3', public_id: 'product1_3' }
          ],
          sizes: [
            { name: 'XS', type: 'standard', stock: 5, price: 2999 },
            { name: 'S', type: 'standard', stock: 12, price: 2999 },
            { name: 'M', type: 'standard', stock: 20, price: 2999 },
            { name: 'L', type: 'standard', stock: 15, price: 2999 },
            { name: 'XL', type: 'standard', stock: 8, price: 2999 },
            { name: 'XXL', type: 'standard', stock: 3, price: 3299 },
            { name: 'XXXL', type: 'standard', stock: 2, price: 3599 },
            { name: '1X', type: 'plus', stock: 6, price: 3299 },
            { name: '2X', type: 'plus', stock: 4, price: 3599 },
            { name: '3X', type: 'plus', stock: 2, price: 3899 }
          ],
          colors: ['Black', 'White', 'Navy', 'Gray', 'Forest Green'],
          stock: 75,
          rating: 4.5,
          numReviews: 128,
          tags: ['cotton', 'organic', 'casual', 'comfortable'],
          material: '100% Organic Cotton',
          careInstructions: 'Machine wash cold, tumble dry low, iron on medium heat',
          featured: true,
          isActive: true
        };

        setProduct(mockProduct);
        setMainImage(mockProduct.images[0]?.url || '');
        setSelectedColor(mockProduct.colors[0] || '');
      } catch (error) {
        toast.error('Failed to load product');
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (selectedSize?.stock || 10)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    if (!selectedColor) {
      toast.error('Please select a color');
      return;
    }

    const cartItem = {
      productId: product._id,
      name: product.name,
      price: selectedSize.price || product.price,
      image: product.images[0]?.url,
      size: selectedSize,
      color: selectedColor,
      quantity,
      maxQuantity: selectedSize.stock
    };

    addToCart(cartItem);
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    if (!selectedColor) {
      toast.error('Please select a color');
      return;
    }

    // Add to cart and navigate to checkout
    handleAddToCart();
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-container">
        <div className="error-message">
          <h2>Product Not Found</h2>
          <p>The product you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/shop')} className="btn btn-primary">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const currentPrice = selectedSize?.price || product.price;
  const currentStock = selectedSize ? getStock(product._id, selectedSize.name) : product.stock;
  const isInStock = currentStock > 0;

  return (
    <div className="page-container">
      <div className="product-detail">
        <div className="product-images">
          <div className="main-image">
            <img 
              src={mainImage} 
              alt={product.name}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x600/cccccc/666666?text=Image+Not+Available';
              }}
            />
          </div>
          <div className="thumbnail-images">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={`${product.name} ${index + 1}`}
                className={`thumbnail ${mainImage === image.url ? 'active' : ''}`}
                onClick={() => setMainImage(image.url)}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/100x100/cccccc/666666?text=Thumb';
                }}
              />
            ))}
          </div>
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          
          <div className="product-meta">
            <div className="rating">
              <span className="stars">{'★'.repeat(Math.floor(product.rating))}</span>
              <span className="rating-text">({product.numReviews} reviews)</span>
            </div>
            <div className="brand">Brand: {product.brand}</div>
          </div>

          <div className="price-section">
            <div className="price">
              ₹{currentPrice.toFixed(2)}
              {selectedSize && selectedSize.price !== product.price && (
                <span className="original-price">₹{product.price.toFixed(2)}</span>
              )}
            </div>
            {!isInStock && (
              <div className="out-of-stock-badge">Out of Stock</div>
            )}
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {/* Size Section with Chart */}
          <div className="size-section">
            <div className="size-selector-container">
              <h3>Select Size</h3>
              <SizeSelector
                product={product}
                selectedSize={selectedSize}
                onSizeChange={handleSizeChange}
                availableSizes={product.sizes}
              />
            </div>
            
            <div className="size-chart-container">
              <button 
                className="size-chart-trigger detail-page"
                onClick={() => setShowSizeChart(true)}
              >
                📏 View Size Chart
              </button>
            </div>
          </div>

          {/* Color Selector */}
          <div className="color-selector">
            <h3>Select Color</h3>
            <div className="color-options">
              {product.colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                  onClick={() => setSelectedColor(color)}
                  title={color}
                >
                  <span 
                    className="color-swatch" 
                    style={{ 
                      backgroundColor: color.toLowerCase() === 'black' ? '#000000' :
                                   color.toLowerCase() === 'white' ? '#ffffff' :
                                   color.toLowerCase() === 'navy' ? '#000080' :
                                   color.toLowerCase() === 'gray' ? '#808080' :
                                   color.toLowerCase() === 'forest green' ? '#228b22' : '#cccccc'
                    }}
                  />
                  <span className="color-name">{color}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="quantity-selector">
            <h3>Quantity</h3>
            <div className="quantity-controls">
              <input
                type="number"
                min="1"
                max={currentStock || 10}
                value={quantity}
                onChange={handleQuantityChange}
                className="quantity-input"
              />
              <span className="stock-info">
                {selectedSize ? `${currentStock} available` : `${product.stock} available`}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              onClick={handleAddToCart}
              disabled={!isInStock}
              className="btn btn-primary add-to-cart-btn"
            >
              {isInStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!isInStock}
              className="btn btn-secondary buy-now-btn"
            >
              Buy Now
            </button>
          </div>

          {/* Additional Information */}
          <div className="product-details">
            <div className="detail-section">
              <h4>Material</h4>
              <p>{product.material}</p>
            </div>
            <div className="detail-section">
              <h4>Care Instructions</h4>
              <p>{product.careInstructions}</p>
            </div>
            <div className="detail-section">
              <h4>Tags</h4>
              <div className="tags">
                {product.tags.map((tag, index) => (
                  <span key={index} className="tag">#{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Size Chart Modal */}
      <SizeChart 
        isOpen={showSizeChart}
        onClose={() => setShowSizeChart(false)}
        productCategory={product?.category}
        productName={product?.name}
      />
    </div>
  );
};

export default ProductDetailPage;
