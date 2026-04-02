import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaFilter, FaSortAmountDown } from 'react-icons/fa';
import ProductCard from '../components/Product/PeterEnglandProductCard';
import GlobalProductFilters from '../components/GlobalProductFilters/GlobalProductFilters';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import { filtersToSearchParams, defaultProductFilterState } from '../utils/productFilters';
import './ProductsPage.css';

function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [listFilters, setListFilters] = useState({ ...defaultProductFilterState });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { isAuthenticated, loading: authLoading } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories?active=true');
      setCategories(res.data?.categories || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const cat = searchParams.get('category') || '';
    const col = searchParams.get('collection') || '';
    setListFilters((prev) => ({
      ...prev,
      category: cat,
      collection: col,
    }));
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = filtersToSearchParams(listFilters);
        const response = await api.get(`/products?${params.toString()}`);
        if (cancelled) return;
        if (response.data?.success) {
          setProducts(response.data.products || []);
        } else {
          setProducts([]);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Error fetching products:', err);
          setError('Failed to fetch products');
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [listFilters]);

  const getPageTitle = () => {
    const collection = searchParams.get('collection');
    const category = searchParams.get('category');

    if (collection) return collection.replace(/-/g, ' ').toUpperCase();
    if (category) return category.replace(/-/g, ' ').toUpperCase();
    return 'ALL PRODUCTS';
  };

  const initialFilterSync = {
    category: searchParams.get('category') || '',
    collection: searchParams.get('collection') || '',
  };

  return (
    <div className="plp-page">
      {/* Category Chips - Snitch/Peter England style */}
      <div className="category-chips-container border-b border-gray-100 py-6 bg-white sticky top-20 z-30">
        <div className="container">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
            <button 
              className={`chip ${!listFilters.category ? 'active' : ''}`}
              onClick={() => setListFilters(prev => ({ ...prev, category: '' }))}
            >
              ALL
            </button>
            {categories.map(cat => (
              <button 
                key={cat._id}
                className={`chip ${listFilters.category === cat.slug ? 'active' : ''}`}
                onClick={() => setListFilters(prev => ({ ...prev, category: cat.slug }))}
              >
                {cat.name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container pt-8">
        {/* Header */}
        <header className="plp-header text-left flex justify-between items-end mb-10">
          <div>
            <h1 className="plp-title-small font-black tracking-widest text-2xl uppercase mb-2">{getPageTitle()}</h1>
            <span className="item-count-text text-xs font-bold text-gray-400 uppercase tracking-widest">{products.length} Items found</span>
          </div>
          
          {/* Filter Trigger - Peter England Style */}
          <div className="flex gap-4">
            <button 
              className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-[10px] font-bold tracking-[0.2em] uppercase hover:border-black transition-all"
              onClick={() => setIsFilterOpen(true)}
            >
              <FaFilter size={12} /> FILTER
            </button>
            <div className="hidden lg:block">
              <select 
                className="px-6 py-3 border border-gray-200 text-[10px] font-bold tracking-[0.2em] uppercase bg-white outline-none cursor-pointer"
                value={listFilters.sortBy}
                onChange={(e) => setListFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              >
                <option value="newest">NEWEST FIRST</option>
                <option value="price-low">PRICE: LOW TO HIGH</option>
                <option value="price-high">PRICE: HIGH TO LOW</option>
                <option value="rating">POPULARITY</option>
              </select>
            </div>
          </div>
        </header>

        <div className="plp-layout-modern">
          {/* Filter Sidebar - Now a Slide-out Drawer */}
          <div className={`filter-drawer ${isFilterOpen ? 'open' : ''}`}>
            <div className="filter-drawer-overlay" onClick={() => setIsFilterOpen(false)}></div>
            <div className="filter-drawer-content">
              <div className="drawer-header p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-black tracking-widest uppercase text-sm">Filters</h3>
                <button onClick={() => setIsFilterOpen(false)} className="text-xl">&times;</button>
              </div>
              <div className="drawer-body p-6">
                <GlobalProductFilters
                  key={`${initialFilterSync.category}-${initialFilterSync.collection}`}
                  initialFilters={initialFilterSync}
                  onApply={(filters) => {
                    setListFilters(filters);
                    setIsFilterOpen(false);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <main className="plp-main-wide">
            {loading ? (
              <div className="plp-loader">
                <div className="spinner"></div>
              </div>
            ) : error ? (
              <div className="plp-error">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
                {products.map((item) => (
                  <ProductCard
                    key={item._id || item.id}
                    product={item}
                  />
                ))}
              </div>
            ) : (
              <div className="plp-empty">
                <h3 className="font-bold uppercase tracking-widest">No products found</h3>
                <p className="text-gray-400 mt-2">Try adjusting your filters to find what you're looking for.</p>
                <button 
                  className="mt-8 px-10 py-4 bg-black text-white text-xs font-bold tracking-widest"
                  onClick={() => setListFilters({ ...defaultProductFilterState })}
                >
                  RESET FILTERS
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
