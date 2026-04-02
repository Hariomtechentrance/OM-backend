import React from 'react';
import './Products.css';

const ProductFilter = ({ filters, onFilterChange, productCount }) => {
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'shirts', label: 'Shirts' },
    { value: 'pants', label: 'Pants' },
    { value: 'jackets', label: 'Jackets' },
    { value: 'shoes', label: 'Shoes' },
    { value: 'accessories', label: 'Accessories' }
  ];

  const sortOptions = [
    { value: 'name-asc', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'featured', label: 'Featured' }
  ];

  return (
    <div className="product-filter">
      <div className="filter-header">
        <h2>Filters</h2>
        <span className="product-count">{productCount} products</span>
      </div>
      
      <div className="filter-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={filters.category}
          onChange={(e) => onFilterChange && onFilterChange('category', e.target.value)}
        >
          {categories.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="filter-group">
        <label>Price Range</label>
        <div className="price-range">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => onFilterChange && onFilterChange('minPrice', Number(e.target.value))}
            min="0"
          />
          <span>to</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange && onFilterChange('maxPrice', Number(e.target.value))}
            min="0"
          />
        </div>
      </div>
      
      <div className="filter-group">
        <label htmlFor="sort">Sort By</label>
        <select
          id="sort"
          value={filters.sortBy}
          onChange={(e) => onFilterChange && onFilterChange('sortBy', e.target.value)}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      <button 
        className="clear-filters-btn"
        onClick={() => onFilterChange && onFilterChange('reset', {
          category: 'all',
          minPrice: 0,
          maxPrice: 50000,
          sortBy: 'featured'
        })}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default ProductFilter;