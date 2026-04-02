import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShoppingBag, FaShareAlt } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const PeterEnglandProductDetail = ({ product }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    setIsAddingToCart(true);
    try {
      await addToCart({
        ...product,
        selectedSize,
        selectedColor: selectedColor || product.colors?.[0] || '',
        quantity
      });
      setIsAddingToCart(false);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsAddingToCart(false);
    }
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getDiscountPercentage = () => {
    if (product.discountedPrice && product.discountedPrice < product.price) {
      return Math.round(((product.price - product.discountedPrice) / product.price) * 100);
    }
    return 0;
  };

  const discountPercentage = getDiscountPercentage();
  const isInWishlistItem = isInWishlist(product._id);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-white">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] py-8 lg:py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-[4/5] lg:aspect-[3/4] overflow-hidden bg-gray-900 rounded-lg">
              <img
                src={product.images?.[selectedImage]?.url || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=750&fit=crop'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-[4/5] overflow-hidden rounded-md border-2 transition-all duration-200 ${
                      selectedImage === index
                        ? 'border-[#B8972E]'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="space-y-6">
            {/* Product Title */}
            <div>
              <h1 
                className="text-3xl lg:text-4xl font-bold text-white mb-2"
                style={{ fontFamily: 'Cormorant Garamond, serif' }}
              >
                {product.name}
              </h1>
              <p 
                className="text-gray-400 text-sm uppercase tracking-wider"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                {product.h1Heading}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              {product.discountedPrice && product.discountedPrice < product.price ? (
                <>
                  <span 
                    className="text-2xl lg:text-3xl font-bold text-white"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    {formatPrice(product.discountedPrice)}
                  </span>
                  <span 
                    className="text-lg text-gray-500 line-through"
                    style={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    {formatPrice(product.price)}
                  </span>
                  {discountPercentage > 0 && (
                    <span className="bg-red-600 text-white px-2 py-1 rounded-md text-sm font-semibold">
                      {discountPercentage}% OFF
                    </span>
                  )}
                </>
              ) : (
                <span 
                  className="text-2xl lg:text-3xl font-bold text-white"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <p 
                className="text-gray-300 leading-relaxed"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 
                  className="text-white font-semibold mb-3"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  SELECT SIZE
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size.size}
                      type="button"
                      onClick={() => handleSizeSelect(size.size)}
                      disabled={size.stock === 0}
                      className={`px-4 py-2 border rounded-md font-medium transition-all duration-200 ${
                        selectedSize === size.size
                          ? 'border-[#B8972E] bg-[#B8972E] text-white'
                          : size.stock === 0
                          ? 'border-gray-700 text-gray-600 cursor-not-allowed'
                          : 'border-gray-600 text-white hover:border-[#B8972E] hover:text-[#B8972E]'
                      }`}
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      {size.size}
                      {size.stock === 0 && ' (Out of Stock)'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 
                  className="text-white font-semibold mb-3"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  SELECT COLOR
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorSelect(color)}
                      className={`flex items-center gap-2 px-3 py-2 border rounded-md transition-all duration-200 ${
                        selectedColor === color
                          ? 'border-[#B8972E] bg-[#B8972E] text-white'
                          : 'border-gray-600 text-white hover:border-[#B8972E] hover:text-[#B8972E]'
                      }`}
                      style={{ fontFamily: 'Roboto, sans-serif' }}
                    >
                      <div
                        className="w-4 h-4 rounded-full border border-gray-400"
                        style={{
                          backgroundColor: color.toLowerCase().includes('blue') ? '#3B82F6' :
                                         color.toLowerCase().includes('red') ? '#EF4444' :
                                         color.toLowerCase().includes('green') ? '#10B981' :
                                         color.toLowerCase().includes('black') ? '#000000' :
                                         color.toLowerCase().includes('white') ? '#FFFFFF' :
                                         color.toLowerCase().includes('yellow') ? '#F59E0B' :
                                         color.toLowerCase().includes('brown') ? '#92400E' :
                                         color.toLowerCase().includes('grey') || color.toLowerCase().includes('gray') ? '#6B7280' :
                                         '#6B7280'
                        }}
                      />
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 
                className="text-white font-semibold mb-3"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                QUANTITY
              </h3>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 border border-gray-600 rounded-md text-white hover:border-[#B8972E] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  -
                </button>
                <span 
                  className="text-white font-medium min-w-[3rem] text-center"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 10}
                  className="w-10 h-10 border border-gray-600 rounded-md text-white hover:border-[#B8972E] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Add to Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAddingToCart || !selectedSize}
                className="w-full bg-black text-white py-4 px-6 font-semibold uppercase tracking-wider hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-xl"
                style={{ fontFamily: 'Roboto, sans-serif' }}
              >
                {isAddingToCart ? 'ADDING TO CART...' : 'ADD TO CART'}
              </button>

              {/* Wishlist and Share */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  className="flex-1 border border-gray-600 text-white py-3 px-6 font-semibold uppercase tracking-wider hover:bg-[#B8972E] hover:border-[#B8972E] transition-all duration-300"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  {isInWishlistItem ? (
                    <>
                      <FaHeart className="inline mr-2" />
                      REMOVE FROM WISHLIST
                    </>
                  ) : (
                    <>
                      <FaRegHeart className="inline mr-2" />
                      ADD TO WISHLIST
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="border border-gray-600 text-white p-3 hover:bg-[#B8972E] hover:border-[#B8972E] transition-all duration-300"
                >
                  <FaShareAlt />
                </button>
              </div>
            </div>

            {/* Product Specifications */}
            {product.productSpecs && (
              <div className="border-t border-gray-800 pt-6">
                <h3 
                  className="text-white font-semibold mb-4"
                  style={{ fontFamily: 'Roboto, sans-serif' }}
                >
                  PRODUCT DETAILS
                </h3>
                <div className="space-y-2">
                  {product.productSpecs.fit && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Fit:</span>
                      <span className="text-white">{product.productSpecs.fit}</span>
                    </div>
                  )}
                  {product.productSpecs.technicalSpecs?.fabric && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Fabric:</span>
                      <span className="text-white">{product.productSpecs.technicalSpecs.fabric}</span>
                    </div>
                  )}
                  {product.productSpecs.technicalSpecs?.sleeves && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Sleeves:</span>
                      <span className="text-white">{product.productSpecs.technicalSpecs.sleeves}</span>
                    </div>
                  )}
                  {product.productSpecs.technicalSpecs?.collar && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Collar:</span>
                      <span className="text-white">{product.productSpecs.technicalSpecs.collar}</span>
                    </div>
                  )}
                  {product.productSpecs.technicalSpecs?.pocket && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Pocket:</span>
                      <span className="text-white">{product.productSpecs.technicalSpecs.pocket}</span>
                    </div>
                  )}
                  {product.productSpecs.technicalSpecs?.occasion && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Occasion:</span>
                      <span className="text-white">{product.productSpecs.technicalSpecs.occasion}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeterEnglandProductDetail;
