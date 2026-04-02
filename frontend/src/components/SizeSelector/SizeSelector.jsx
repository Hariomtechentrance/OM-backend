import React, { useState } from 'react';
import { getAvailableSizes, getSizeLabel, getSizeDescription } from '../../utils/sizes';

const SizeSelector = ({ 
  product, 
  selectedSize, 
  onSizeChange, 
  className = ''
}) => {
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  
  // ✅ FIX: Use product sizes directly instead of utils
  const currentSizes = product.sizes || [];
  console.log("🔍 PRODUCT SIZES:", currentSizes); // Debug log

  const handleSizeSelect = (size) => {
    console.log("CLICKED SIZE:", size); // debug
    onSizeChange(size); // ✅ PASS RAW DATABASE SIZE OBJECT
  };

  const isSizeSelected = (size) => {
    return selectedSize && 
           selectedSize.size === size.size; // ✅ FIX: Compare size field
  };

  const isSizeAvailable = (size) => {
    const sizeObj = currentSizes.find(s => s.size === size.size); // ✅ FIX: Compare size field
    return sizeObj && sizeObj.stock > 0;
  };

  const getSizeStock = (size) => {
    const sizeObj = currentSizes.find(s => s.size === size.size); // ✅ FIX: Compare size field
    return sizeObj ? sizeObj.stock : 0;
  };

  const renderSizeOption = (size) => {
    const isSelected = isSizeSelected(size);
    const isAvailable = isSizeAvailable(size);
    const stock = getSizeStock(size);

    return (
      <button
        key={size.size}
        type="button"
        onClick={() => handleSizeSelect(size)}
        disabled={!isAvailable}
        className={`
          size-option
          ${isSelected ? 'selected' : ''}
          ${!isAvailable ? 'unavailable' : ''}
          ${className}
        `}
        title={size.size}
      >
        <span className="size-name">{size.size}</span>
        {!isAvailable && (
          <span className="out-of-stock">Out of Stock</span>
        )}
        {isAvailable && stock <= 5 && (
          <span className="low-stock">Only {stock} left</span>
        )}
      </button>
    );
  };

  const renderSizeSection = (title, sizes) => {
    if (!sizes || sizes.length === 0) return null;

    return (
      <div key={title} className="size-section">
        <h4 className="size-section-title">{title}</h4>
        <div className="size-options-grid">
          {sizes.map(size => renderSizeOption(size))}
        </div>
      </div>
    );
  };

  return (
    <div className="size-selector">
      <div className="size-selector-header">
        <h3>Select Size</h3>
        <button
          type="button"
          className="size-guide-btn"
          onClick={() => setShowSizeGuide(!showSizeGuide)}
        >
          Size Guide
        </button>
      </div>

      {selectedSize && (
        <div className="selected-size-display">
          <span className="selected-size-label">
            Selected: {selectedSize.size}
          </span>
        </div>
      )}

      <div className="size-options-container">
        {renderSizeSection('Available Sizes', currentSizes)}
      </div>

      {showSizeGuide && (
        <div className="size-guide-modal">
          <div className="size-guide-content">
            <div className="size-guide-header">
              <h3>Size Guide</h3>
              <button
                type="button"
                className="close-btn"
                onClick={() => setShowSizeGuide(false)}
              >
                ×
              </button>
            </div>
            
            <div className="size-guide-body">
              {renderSizeSection('Available Sizes', currentSizes)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SizeSelector;
