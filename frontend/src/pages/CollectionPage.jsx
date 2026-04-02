import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductCard from '../components/Products/ProductCard';
import GlobalProductFilters from '../components/GlobalProductFilters/GlobalProductFilters';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { filtersToSearchParams, defaultProductFilterState } from '../utils/productFilters';
import './CollectionPage.css';

const CollectionPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [collectionName, setCollectionName] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listFilters, setListFilters] = useState({ ...defaultProductFilterState });

  useEffect(() => {
    const loadMeta = async () => {
      if (!slug) return;
      try {
        const colRes = await api.get(`/collections/${encodeURIComponent(slug)}`);
        if (colRes.data?.success && colRes.data.collection) {
          setCollectionName(colRes.data.collection.name || slug);
        } else {
          setCollectionName(slug.replace(/-/g, ' '));
        }
      } catch {
        setCollectionName(slug.replace(/-/g, ' '));
      }
    };
    loadMeta();
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const params = filtersToSearchParams(listFilters, { collection: slug });
        const prodRes = await api.get(`/products?${params.toString()}`);
        if (cancelled) return;
        if (prodRes.data?.success) {
          setProducts(prodRes.data.products || []);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('Collection load error:', err);
        if (!cancelled) {
          toast.error('Could not load this collection');
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
  }, [slug, listFilters]);

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      toast.info('Please log in to add items to your cart');
      return;
    }
    addToCart(product, 1, undefined, undefined);
  };

  return (
    <div className="collection-page collection-page--slug">
      <div className="collection-page-inner">
        <nav className="collection-breadcrumb">
          <Link to="/">Home</Link>
          <span> / </span>
          <Link to="/collections">Collections</Link>
          <span> / </span>
          <span>{collectionName || slug}</span>
        </nav>

        <header className="collection-page-header">
          <h1>{collectionName || slug}</h1>
          <p className="collection-product-count">
            {loading ? 'Loading…' : `${products.length} product${products.length === 1 ? '' : 's'}`}
          </p>
        </header>

        <GlobalProductFilters hideCollection onApply={setListFilters} />

        {loading ? (
          <p className="collection-loading-text">Loading products…</p>
        ) : products.length === 0 ? (
          <div className="collection-empty">
            <p>No products in this collection yet.</p>
            <Link to="/shop-collection" className="btn-primary">
              Shop all collections
            </Link>
          </div>
        ) : (
          <div className="collection-products-grid">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={() => handleAddToCart(product)}
                onQuickView={() => navigate(`/product/${product._id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
