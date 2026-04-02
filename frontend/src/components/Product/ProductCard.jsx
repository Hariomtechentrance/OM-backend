import React, { useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { formatPrice } from '../../utils/currency';
import { useStock } from '../../context/StockContext';
import './Products.css';

const ProductCard = ({ product, onAddToCart, onQuickView, onToggleWishlist, isInWishlist }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(isInWishlist || false);

  const { getStock } = useStock();

  // Calculate total stock from sizes or use totalStock
  const getTotalStock = () => {
    if (product.totalStock) return product.totalStock;
    if (product.sizes && product.sizes.length > 0) {
      return product.sizes.reduce((total, size) => total + (size.stock || 0), 0);
    }
    return product.stock || 0;
  };

  const totalStock = getTotalStock();

  const renderRatingStars = (rating) => {
    const safeRating = Number(rating) || 0;
    const stars = [];
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="star filled" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="star half" />);
    }
    
    const emptyStars = 5 - Math.ceil(safeRating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="star empty" />);
    }
    
    return stars;
  };

  const getImageUrl = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0]?.url || product.images[0];
    }
    if (product.image) {
      return product.image;
    }
    return 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop';
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    const newWishlistedState = !isWishlisted;
    setIsWishlisted(newWishlistedState);
    if (onToggleWishlist) {
      onToggleWishlist(product);
    }
  };

  const handleCardClick = () => {
    if (onQuickView) {
      onQuickView(product);
    }
  };

  const discountPercentage = product.originalPrice ? 
    Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div 
      className="product-card simple clickable"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="product-image-container">
        <div className="product-image">
          <img src={getImageUrl(product)} alt={product.name || 'Product'} />
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <span className="discount-badge">-{discountPercentage}%</span>
          )}
          
          {/* Quick Actions on Hover */}
          <div className={`quick-actions ${isHovered ? 'visible' : ''}`}>
            <button 
              className="quick-action-btn wishlist-btn"
              onClick={handleWishlist}
              title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <FaHeart className={isWishlisted ? 'active' : ''} />
            </button>
            <button 
              className="quick-action-btn cart-btn"
              onClick={handleAddToCart}
              title="Add to Cart"
            >
              <FaShoppingCart />
            </button>
          </div>
        </div>
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-rating">
          <div className="stars">
            {renderRatingStars(product.rating)}
          </div>
          <span className="rating-text">({Number(product.rating) || 0})</span>
        </div>
        
        <div className="product-price">
          <span className="current-price">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="original-price">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        
        <div className="product-brand">{product.brand}</div>
        
        {/* Product Variants Info */}
        {(product.sizes?.length > 0 || product.colors?.length > 0) && (
          <div className="product-variants">
            {product.sizes?.length > 0 && (
              <div className="sizes-info">
                <span className="variant-label">Sizes:</span>
                <span className="variant-values">
                  {product.sizes.slice(0, 3).map(size => size.name || size).join(', ')}
                  {product.sizes.length > 3 && '...'}
                </span>
              </div>
            )}
            
            {product.colors?.length > 0 && (
              <div className="colors-info">
                <span className="variant-label">Colors:</span>
                <div className="color-dots">
                  {product.colors.slice(0, 4).map((color, index) => (
                    <span 
                      key={index}
                      className="color-dot" 
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                  {product.colors.length > 4 && <span className="more-colors">+{product.colors.length - 4}</span>}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Stock Info */}
        <div className="stock-info">
          <span className={`stock-status ${totalStock > 0 ? 'in-stock' : 'out-of-stock'}`}>
            {totalStock > 0 ? `${totalStock} in stock` : 'Out of Stock'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
