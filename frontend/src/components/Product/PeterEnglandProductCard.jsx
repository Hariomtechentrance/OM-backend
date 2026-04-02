import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaEye, FaShoppingBag } from 'react-icons/fa';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice } from '../../utils/currency';

const PeterEnglandProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  
  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const getImageUrl = (index = 0) => {
    if (product.images && product.images.length > index) {
      const img = product.images[index];
      return typeof img === 'string' ? img : img.url;
    }
    return 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop';
  };

  const discountPercentage = product.mrp && product.mrp > product.price 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
    : 0;

  const isWishlisted = isInWishlist(product._id);

  return (
    <div 
      className="group flex flex-col bg-white overflow-hidden transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${product._id}`)}
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#FAFAFA]">
        {/* Main Image */}
        <img
          src={getImageUrl(0)}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
            isHovered && product.images?.length > 1 ? 'scale-110 opacity-0' : 'scale-100 opacity-100'
          }`}
        />
        
        {/* Hover Image */}
        {product.images?.length > 1 && (
          <img
            src={getImageUrl(1)}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
              isHovered ? 'scale-105 opacity-100' : 'scale-100 opacity-0'
            }`}
          />
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.isNewArrival && (
            <span className="bg-black text-white text-[10px] font-bold px-3 py-1 tracking-widest uppercase rounded-sm">NEW</span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-[#C19A6B] text-white text-[10px] font-bold px-3 py-1 tracking-widest uppercase rounded-sm">{discountPercentage}% OFF</span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-all duration-300 ${
            isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-black'
          } ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
        >
          {isWishlisted ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
        </button>

        {/* Quick Add Button */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-500 transform ${
          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}>
          <button className="w-full bg-black/90 backdrop-blur-md text-white py-3 text-[11px] font-bold tracking-widest uppercase hover:bg-[#C19A6B] transition-colors flex items-center justify-center gap-2">
            <FaShoppingBag size={12} /> QUICK ADD
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="py-4 space-y-1 text-left">
        <h3 className="text-[11px] lg:text-sm font-bold text-gray-900 uppercase tracking-wider line-clamp-1 group-hover:text-[#C19A6B] transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm lg:text-base font-black text-gray-900">{formatPrice(product.price)}</span>
            {product.mrp > product.price && (
              <span className="text-[10px] lg:text-xs font-bold text-gray-400 line-through">{formatPrice(product.mrp)}</span>
            )}
          </div>
          {discountPercentage > 0 && (
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{discountPercentage}% OFF</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeterEnglandProductCard;
