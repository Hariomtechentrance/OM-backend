import React, { useState, useEffect, useMemo } from 'react';
import api from '../../api/axios';
import { defaultProductFilterState } from '../../utils/productFilters';
import './GlobalProductFilters.css';

const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL'];
const COLOR_OPTIONS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Gray', hex: '#808080' },
  { name: 'Navy', hex: '#000080' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Gold', hex: '#C19A6B' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
];

const GlobalProductFilters = ({ onApply, initialFilters = null }) => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(() => ({ ...defaultProductFilterState, ...initialFilters }));

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories?active=true');
      const catList = res.data?.data || res.data?.categories || [];
      setCategories(catList);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleArray = (key, value) => {
    setForm((prev) => {
      const arr = prev[key] || [];
      const next = arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
      return { ...prev, [key]: next };
    });
  };

  const handleApply = () => onApply(form);
  const handleReset = () => {
    const reset = { ...defaultProductFilterState };
    setForm(reset);
    onApply(reset);
  };

  return (
    <div className="global-product-filters">
      <div className="gpf-expanded-content">
        {/* Sort */}
        <div className="gpf-section">
          <label className="gpf-section-title">Sort By</label>
          <div className="gpf-field">
            <select value={form.sortBy} onChange={(e) => setField('sortBy', e.target.value)}>
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="gpf-section">
          <label className="gpf-section-title">Categories</label>
          <div className="gpf-checkbox-group">
            {categories.map(cat => (
              <label key={cat._id} className="gpf-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={(form.category || '').includes(cat.slug)}
                  onChange={() => toggleArray('category', cat.slug)}
                />
                {cat.name}
              </label>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div className="gpf-section">
          <label className="gpf-section-title">Size</label>
          <div className="gpf-size-grid">
            {SIZE_OPTIONS.map(size => (
              <button
                key={size}
                className={`gpf-size-btn ${form.sizes?.includes(size) ? 'active' : ''}`}
                onClick={() => toggleArray('sizes', size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="gpf-section">
          <label className="gpf-section-title">Color</label>
          <div className="gpf-color-grid">
            {COLOR_OPTIONS.map(color => (
              <div
                key={color.name}
                className={`gpf-color-swatch ${form.colors?.includes(color.name) ? 'active' : ''}`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
                onClick={() => toggleArray('colors', color.name)}
              />
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="gpf-section">
          <label className="gpf-section-title">Price Range</label>
          <div className="gpf-price-inputs">
            <input 
              type="number" 
              placeholder="Min" 
              value={form.minPrice || ''}
              onChange={(e) => setField('minPrice', e.target.value)}
            />
            <span className="gpf-price-separator">-</span>
            <input 
              type="number" 
              placeholder="Max" 
              value={form.maxPrice || ''}
              onChange={(e) => setField('maxPrice', e.target.value)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="gpf-actions">
          <button className="gpf-btn-apply" onClick={handleApply}>Apply</button>
          <button className="gpf-btn-reset" onClick={handleReset}>Reset</button>
        </div>
      </div>
    </div>
  );
};

export default GlobalProductFilters;
