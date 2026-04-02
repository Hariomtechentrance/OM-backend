import React, { useState, useEffect } from 'react';
import { FaTimes, FaFilter } from 'react-icons/fa';
import './FilterPanel.css';

const FilterPanel = ({ isOpen, onClose, onFilterChange, currentFilters }) => {
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    priceRange: [0, 10000],
    sizes: [],
    colors: [],
    brand: '',
    material: '',
    sortBy: 'featured'
  });

  const clothingCategories = [
    { value: 'T-Shirts', label: 'T-Shirts' },
    { value: 'Shirts', label: 'Shirts' },
    { value: 'Pants', label: 'Pants' },
    { value: 'Jeans', label: 'Jeans' },
    { value: 'Jackets', label: 'Jackets' },
    { value: 'Sweaters', label: 'Sweaters' },
    { value: 'Accessories', label: 'Accessories' },
    { value: 'shoes', label: 'Shoes' }
  ];

  const subcategories = {
    'T-Shirts': ['casual', 'polo-tshirts', 'graphic'],
    'Shirts': ['party-wear', 'formal', 'casual'],
    'Pants': ['formal-pants', 'cargo', 'trousers'],
    'Jeans': ['denim-collection', 'skinny', 'regular'],
    'Jackets': ['winter-collection', 'leather', 'casual'],
    'Sweaters': ['winter-collection', 'cardigans', 'pullover'],
    'Accessories': ['belts', 'watches', 'bags'],
    'shoes': ['formal', 'casual', 'sports']
  };

  const sizes = ['S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', '38'];
  const colors = ['Black', 'White', 'Gray', 'Navy', 'Blue', 'Red', 'Green', 'Brown', 'Beige', 'Pink'];
  const materials = ['Cotton', 'Polyester', 'Wool', 'Denim', 'Silk', 'Linen', 'Leather', 'Synthetic'];
  const brands = ['Black Locust', 'Nike', 'Adidas', 'Puma', 'Tommy Hilfiger', 'Calvin Klein'];

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'name-asc', label: 'Name: A-Z' },
    { value: 'name-desc', label: 'Name: Z-A' }
  ];

  useEffect(() => {
    if (currentFilters) {
      setFilters(currentFilters);
    }
  }, [currentFilters]);

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters };
    
    if (filterType === 'priceRange') {
      newFilters.priceRange = value;
    } else if (filterType === 'sizes' || filterType === 'colors') {
      const currentArray = newFilters[filterType] || [];
      if (currentArray.includes(value)) {
        newFilters[filterType] = currentArray.filter(item => item !== value);
      } else {
        newFilters[filterType] = [...currentArray, value];
      }
    } else {
      newFilters[filterType] = value;
    }
    
    setFilters(newFilters);
  };

  const applyFilters = () => {
    onFilterChange(filters);
    onClose();
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      subcategory: '',
      priceRange: [0, 10000],
      sizes: [],
      colors: [],
      brand: '',
      material: '',
      sortBy: 'featured'
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
    onClose();
  };

  const activeFilterCount = 
    (filters.category ? 1 : 0) +
    (filters.subcategory ? 1 : 0) +
    (filters.sizes && filters.sizes.length > 0 ? 1 : 0) +
    (filters.colors && filters.colors.length > 0 ? 1 : 0) +
    (filters.brand ? 1 : 0) +
    (filters.material ? 1 : 0) +
    (filters.priceRange && (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) ? 1 : 0);

  return (
    <>
      <div className={`filter-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
      <div className={`filter-panel ${isOpen ? 'active' : ''}`}>
        <div className="filter-header">
          <h3>Filters <span className="filter-count">({activeFilterCount})</span></h3>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="filter-content">
          {/* Category Filter */}
          <div className="filter-section">
            <h4>Category</h4>
            <select 
              value={filters.category} 
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {clothingCategories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Subcategory Filter */}
          {filters.category && subcategories[filters.category] && (
            <div className="filter-section">
              <h4>Subcategory</h4>
              <select 
                value={filters.subcategory} 
                onChange={(e) => handleFilterChange('subcategory', e.target.value)}
                className="filter-select"
              >
                <option value="">All Subcategories</option>
                {subcategories[filters.category].map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>
          )}

          {/* Price Range Filter */}
          <div className="filter-section">
            <h4>Price Range</h4>
            <div className="price-range">
              <div className="price-inputs">
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={filters.priceRange ? filters.priceRange[0] : 0}
                  onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value) || 0, filters.priceRange ? filters.priceRange[1] : 10000])}
                  min="0"
                  max="10000"
                />
                <span>-</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={filters.priceRange ? filters.priceRange[1] : 10000}
                  onChange={(e) => handleFilterChange('priceRange', [filters.priceRange ? filters.priceRange[0] : 0, parseInt(e.target.value) || 10000])}
                  min="0"
                  max="10000"
                />
              </div>
              <div className="price-slider">
                <input 
                  type="range" 
                  min="0" 
                  max="10000" 
                  value={filters.priceRange ? filters.priceRange[0] : 0}
                  onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value), filters.priceRange ? filters.priceRange[1] : 10000])}
                />
                <input 
                  type="range" 
                  min="0" 
                  max="10000" 
                  value={filters.priceRange ? filters.priceRange[1] : 10000}
                  onChange={(e) => handleFilterChange('priceRange', [filters.priceRange ? filters.priceRange[0] : 0, parseInt(e.target.value)])}
                />
              </div>
            </div>
          </div>

          {/* Size Filter */}
          <div className="filter-section">
            <h4>Size</h4>
            <div className="size-options">
              {sizes.map(size => (
                <label key={size} className="size-checkbox">
                  <input 
                    type="checkbox" 
                    checked={filters.sizes && filters.sizes.includes(size)}
                    onChange={() => handleFilterChange('sizes', size)}
                  />
                  <span>{size}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div className="filter-section">
            <h4>Color</h4>
            <div className="color-options">
              {colors.map(color => (
                <label key={color} className="color-checkbox">
                  <input 
                    type="checkbox" 
                    checked={filters.colors && filters.colors.includes(color)}
                    onChange={() => handleFilterChange('colors', color)}
                  />
                  <span className="color-swatch" style={{ backgroundColor: color.toLowerCase() }}></span>
                  <span>{color}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="filter-section">
            <h4>Brand</h4>
            <select 
              value={filters.brand} 
              onChange={(e) => handleFilterChange('brand', e.target.value)}
              className="filter-select"
            >
              <option value="">All Brands</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          {/* Material Filter */}
          <div className="filter-section">
            <h4>Material</h4>
            <select 
              value={filters.material} 
              onChange={(e) => handleFilterChange('material', e.target.value)}
              className="filter-select"
            >
              <option value="">All Materials</option>
              {materials.map(material => (
                <option key={material} value={material}>{material}</option>
              ))}
            </select>
          </div>

          {/* Sort By Filter */}
          <div className="filter-section">
            <h4>Sort By</h4>
            <select 
              value={filters.sortBy} 
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="filter-select"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-actions">
          <button className="clear-btn" onClick={clearFilters}>Clear All</button>
          <button className="apply-btn" onClick={applyFilters}>Apply Filters</button>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;
