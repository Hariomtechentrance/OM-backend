import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaRegStar, FaRegHeart, FaHeart, FaEye } from 'react-icons/fa';
import { formatPrice } from '../../utils/currency';
import './Products.css';

const ProductCard = ({ product, onAddToCart, onQuickView, onAddToWishlist }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const renderRatingStars = (rating) => {
    const safeRating = Math.round(Number(rating)) || 0;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar key={i} className={`star ${i <= safeRating ? 'filled' : 'empty'}`} />
      );
    }
    return stars;
  };

  const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop';

  const getImageUrl = (product) => {
    if (product.images && product.images.length > 0) {
      const first = product.images[0];
      return typeof first === 'string' ? first : first?.url || PLACEHOLDER_IMG;
    }
    return product.image || PLACEHOLDER_IMG;
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    if (onAddToWishlist) onAddToWishlist(product);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  return (
    <div className="product-card" onClick={() => navigate(`/product/${product._id || product.id}`)}>
      <div className="product-image-container">
        <img 
          src={getImageUrl(product)} 
          alt={product.name} 
          className="product-image"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="product-badges">
          {product.isNewArrival && <span className="badge-new">New</span>}
          {product.isTrending && <span className="badge-trending">Trending</span>}
        </div>

        {/* Hover Actions */}
        <div className="product-overlay">
          <button className="overlay-btn" onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${product._id || product.id}`);
          }}>
            Quick Add
          </button>
          <button className="wishlist-btn-overlay" onClick={handleWishlist}>
            {isWishlisted ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
          </button>
          <button className="wishlist-btn-overlay" onClick={handleQuickView}>
            <FaEye />
          </button>
        </div>
      </div>

      <div className="product-info">
        <span className="product-category">{product.categoryName || 'Fashion'}</span>
        <h3 className="product-name">{product.name}</h3>
        
        <div className="price-container">
          <span className="product-price">{formatPrice(product.price)}</span>
          {product.mrp && product.mrp > product.price && (
            <span className="product-mrp">{formatPrice(product.mrp)}</span>
          )}
        </div>

        <div className="product-rating">
          {renderRatingStars(product.rating || 4)}
          <span className="text-xs text-gray-400 ml-1">({product.numReviews || 0})</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
