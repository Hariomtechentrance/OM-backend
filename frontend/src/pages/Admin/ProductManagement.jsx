import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../../api/axios'; // ✅ FIXED: Use shared axios instance
import './ProductManagement.css';

const ProductManagement = () => {
  
  // Convert Dropbox preview URL to direct download URL
  const convertDropboxUrl = (url) => {
    if (!url || !url.includes('dropbox.com')) return url;
    return url
      .replace('www.dropbox.com', 'dl.dropboxusercontent.com')
      .replace('?dl=0', '');
  };

  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [collections, setCollections] = useState([]); 
  const [categories, setCategories] = useState([]); 
  const [editProduct, setEditProduct] = useState(null); 
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCollection, setFilterCollection] = useState('');
  const [filterAvailability, setFilterAvailability] = useState(''); 
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '', // Collection selection
    collection: '', // Explicit collection field
    brand: 'Black Locust',
    subcategory: '',
    sizes: [],
    colors: [],
    images: [],
    stock: '',
    featured: false,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false,
    tags: [],
    // New fields you requested
    skuCode: '',
    h1Heading: '',
    specifications: '', // Detailed specifications text
    productLink: '', // Dropbox link
    availability: 'in_stock',
    // Enhanced product specifications
    productSpecs: {
      fit: 'Regular Fit',
      availableSizes: [
        { size: 'S', stock: 0 },
        { size: 'M', stock: 0 },
        { size: 'L', stock: 0 },
        { size: 'XL', stock: 0 },
        { size: 'XXL', stock: 0 }
      ],
      marketingDescription: '',
      technicalSpecs: {
        fabric: '',
        sleeves: '',
        collar: '',
        pocket: '',
        occasion: ''
      }
    },
    measurements: {
      chest: '',
      length: '',
      shoulders: '',
      sleeves: '',
      waist: '',
      hips: '',
      inseam: '',
      rise: ''
    },
    variants: []
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Clothing categories with their specific measurements
  const clothingCategories = {
    'T-Shirts': {
      measurements: ['chest', 'length', 'shoulders', 'sleeves'],
      variants: ['S', 'M', 'L', 'XL', 'XXL'],
      specifications: ['material', 'care', 'origin', 'season', 'fit', 'weight', 'style']
    },
    'Shirts': {
      measurements: ['chest', 'length', 'shoulders', 'sleeves', 'collar'],
      variants: ['S', 'M', 'L', 'XL', 'XXL'],
      specifications: ['material', 'care', 'origin', 'season', 'fit', 'weight', 'style']
    },
    'Pants': {
      measurements: ['waist', 'hips', 'inseam', 'rise', 'length'],
      variants: ['28', '30', '32', '34', '36', '38'],
      specifications: ['material', 'care', 'origin', 'season', 'fit', 'weight', 'style']
    },
    'Jeans': {
      measurements: ['waist', 'hips', 'inseam', 'rise', 'length'],
      variants: ['28', '30', '32', '34', '36', '38'],
      specifications: ['material', 'care', 'origin', 'season', 'fit', 'weight', 'style']
    },
    'Jackets': {
      measurements: ['chest', 'length', 'shoulders', 'sleeves'],
      variants: ['S', 'M', 'L', 'XL', 'XXL'],
      specifications: ['material', 'care', 'origin', 'season', 'fit', 'weight', 'style']
    },
    'Sweaters': {
      measurements: ['chest', 'length', 'shoulders', 'sleeves'],
      variants: ['S', 'M', 'L', 'XL', 'XXL'],
      specifications: ['material', 'care', 'origin', 'season', 'fit', 'weight', 'style']
    },
    'Accessories': {
      measurements: ['length', 'width', 'height'],
      variants: ['One Size'],
      specifications: ['material', 'care', 'origin', 'season', 'fit', 'weight', 'style']
    },
    'Shoes': {
      measurements: ['length', 'width'],
      variants: ['7', '8', '9', '10', '11', '12'],
      specifications: ['material', 'care', 'origin', 'season', 'fit', 'weight', 'style']
    }
  };

  const materials = [
    'Cotton', 'Polyester', 'Wool', 'Silk', 'Linen', 'Denim', 
    'Leather', 'Suede', 'Nylon', 'Spandex', 'Rayon', 'Viscose',
    'Modal', 'Bamboo', 'Hemp', 'Cashmere', 'Merino Wool'
  ];

  const seasons = ['Spring', 'Summer', 'Fall', 'Winter', 'All Season'];
  const fits = ['Slim', 'Regular', 'Relaxed', 'Oversized', 'Skinny', 'Straight', 'Bootcut'];
  const styles = ['Casual', 'Formal', 'Business', 'Sport', 'Street', 'Vintage', 'Modern', 'Classic'];
  const careInstructions = ['Machine Wash', 'Hand Wash', 'Dry Clean Only', 'Spot Clean', 'Professional Clean'];

  useEffect(() => {
    fetchProducts();
    fetchCategories(); // Fetch categories from API
    fetchCollections(); // Fetch collections from API
    
    // Listen for storage changes to update collections when new ones are added
    const handleStorageChange = (e) => {
      if (e.key === 'collections') {
        fetchCollections();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // ✅ ONLY ONCE - no dependencies to prevent infinite loop

  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get("/categories");
      console.log("Categories:", response.data);
      setCategories(response.data.categories);
    } catch (error) {
      console.error(error);
      setCategories([]); // Don't show alert for categories as they might not exist
    }
  }, []);

  const fetchCollections = useCallback(async () => {
    try {
      const response = await api.get("/collections?showInNavbar=true&isActive=true&sortBy=order&sortOrder=asc");
      console.log("Collections:", response.data);
      setCollections(response.data.collections);
    } catch (err) {
      console.error(err);
      setCollections([]); // Don't show alert for collections as they might not exist
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await api.get("/products");
      console.log("Products:", response.data);
      setProducts(response.data.products);
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch products");
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log("🔍 INPUT CHANGE:", { name, value, type, checked });
    
    if (name.startsWith('productSpecs.technicalSpecs.')) {
      // ✅ Three-level deep: productSpecs.technicalSpecs.fabric
      const field = name.split('.')[2];
      setFormData(prev => ({
        ...prev,
        productSpecs: {
          ...prev.productSpecs,
          technicalSpecs: {
            ...prev.productSpecs.technicalSpecs,
            [field]: type === 'checkbox' ? checked : value
          }
        }
      }));
    } else if (name.startsWith('productSpecs.')) {
      // ✅ Two-level deep: productSpecs.marketingDescription
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        productSpecs: {
          ...prev.productSpecs,
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else if (name.includes('specifications.') || name.includes('measurements.')) {
      const [category, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSizeChange = (sizeName) => {
    setFormData(prev => {
      const existingSize = prev.sizes.find(s => s.size === sizeName);
      if (existingSize) {
        // Remove size if it exists
        return {
          ...prev,
          sizes: prev.sizes.filter(s => s.size !== sizeName)
        };
      } else {
        // Add size with default stock of 0
        return {
          ...prev,
          sizes: [...prev.sizes, { size: sizeName, stock: 0 }]
        };
      }
    });
  };

  const handleSizeStockChange = (sizeName, stock) => {
    setFormData(prev => ({
      ...prev,
      sizes: (prev.sizes || []).map(size => 
        size.size === sizeName ? { ...size, stock: parseInt(stock) || 0 } : size
      )
    }));
  };

  const handleColorChange = (color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const handleImageAdd = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { url: '', public_id: '' }]
    }));
  };

  const addImage = (url) => {
    setFormData(prev => ({
      ...prev,
      images: [
        ...prev.images,
        {
          url: url,
          public_id: "manual_" + Date.now()
        }
      ]
    }));
  };

  const handleImageChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).map((img, i) => 
        i === index ? { ...img, [field]: value } : img
      )
    }));
  };

  const handleImageRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }));
  };

  const uploadImages = async (files) => {
    const uploadedImages = [];
    setUploading(true);
    
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file', files[i]);
      formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
      
      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData,
        });
        
        const data = await res.json();
        if (data.secure_url) {
          uploadedImages.push({
            url: data.secure_url,
            public_id: data.public_id
          });
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error(`Failed to upload image ${i + 1}`);
      }
    }
    
    setUploading(false);
    return uploadedImages;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validation
      if (!formData.name.trim()) {
        toast.error('Product name is required');
        return;
      }
      
      if (!formData.skuCode.trim()) {
        toast.error('SKU code is required');
        return;
      }
      
      if (!formData.h1Heading.trim()) {
        toast.error('H1 heading is required');
        return;
      }
      
      if (!formData.specifications.trim()) {
        toast.error('Product specifications are required');
        return;
      }
      
      if (!formData.price || formData.price <= 0) {
        toast.error('Valid price is required');
        return;
      }
      
      if (!formData.category) {
        toast.error('Please select a collection');
        return;
      }
      
      if (formData.sizes.length === 0) {
        toast.error('Please select at least one size');
        return;
      }
      
      const totalStock = formData.sizes.reduce((total, size) => total + (size.stock || 0), 0);
      if (totalStock === 0) {
        toast.error('Please add stock for at least one size');
        return;
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: "69b9147bbe3f9e9f0fd25647", // ✅ TEMP FIX: Hardcoded for testing
        collection: formData.category, // Use selected collection
        brand: formData.brand,
        images: formData.images.map(img => ({
          ...img,
          url: convertDropboxUrl(img.url)
        })),
        
        // New fields you requested
        skuCode: formData.skuCode,
        h1Heading: formData.h1Heading,
        specifications: formData.specifications,
        productLink: formData.productLink,
        availability: formData.availability,
        
        // Enhanced product specifications
        productSpecs: formData.productSpecs,

        sizes: formData.sizes, // already array
        colors: formData.colors, // already array from input

        isFeatured: formData.isFeatured,
        isNewArrival: formData.isNewArrival,
        isTrending: formData.isTrending,

        tags: formData.tags,
        material: formData.specifications?.material,
        careInstructions: formData.specifications?.care,
        isActive: true
      };

      if (selectedProduct) {
        await api.put(`/products/${selectedProduct._id}`, payload);
        toast.success('Product updated successfully');
      } else {
        await api.post("/products", payload);
        toast.success('Product added successfully');
      }

      fetchProducts();
      setShowAddModal(false);
      setShowEditModal(false);
      resetForm();
    } catch (error) {
      console.error('❌ Product save error:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error message:', error.message);
      toast.error(error.response?.data?.message || error.message || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    console.log("DEBUG PRODUCT:", product);
    console.log("DEBUG SIZES:", product?.sizes);
    console.log("DEBUG PRODUCT SPECS:", product?.productSpecs);
    
    setSelectedProduct(product);
    setFormData({
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || '',
      category: product?.category || '',
      collection: product?.collection || '',
      brand: product?.brand || 'Black Locust',
      subcategory: product?.subcategory || '',
      sizes: product?.sizes || [],
      colors: product?.colors || [],
      images: product?.images || [],
      stock: product?.stock || '',
      featured: product?.featured || false,
      isFeatured: product?.isFeatured || false,
      isNewArrival: product?.isNewArrival || false,
      isTrending: product?.isTrending || false,
      tags: product?.tags || [],
      // New fields you requested
      skuCode: product?.skuCode || '',
      h1Heading: product?.h1Heading || '',
      specifications: product?.specifications || '',
      productLink: product?.productLink || '',
      availability: product?.availability || 'in_stock',
      // Enhanced product specifications
      productSpecs: product?.productSpecs || {
        fit: product?.productSpecs?.fit || 'Regular Fit',
        availableSizes: product?.productSpecs?.availableSizes || [
          { size: 'S', stock: 0 },
          { size: 'M', stock: 0 },
          { size: 'L', stock: 0 },
          { size: 'XL', stock: 0 },
          { size: 'XXL', stock: 0 }
        ],
        marketingDescription: product?.productSpecs?.marketingDescription || '',
        technicalSpecs: {
          fabric: product?.productSpecs?.technicalSpecs?.fabric || '',
          sleeves: product?.productSpecs?.technicalSpecs?.sleeves || '',
          collar: product?.productSpecs?.technicalSpecs?.collar || '',
          pocket: product?.productSpecs?.technicalSpecs?.pocket || '',
          occasion: product?.productSpecs?.technicalSpecs?.occasion || ''
        }
      },
      measurements: product?.measurements || {
        chest: product?.measurements?.chest || '',
        length: product?.measurements?.length || '',
        shoulders: product?.measurements?.shoulders || '',
        sleeves: product?.measurements?.sleeves || '',
        waist: product?.measurements?.waist || '',
        hips: product?.measurements?.hips || '',
        inseam: product?.measurements?.inseam || '',
        rise: product?.measurements?.rise || ''
      },
      variants: []
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        name: editProduct.name,
        description: editProduct.description,
        price: Number(editProduct.price),
        category: editProduct.category,
        collection: editProduct.collection,
        brand: editProduct.brand,
        images: editProduct.images.map(img => ({
          ...img,
          url: convertDropboxUrl(img.url)
        })),
        sizes: editProduct.sizes,
        colors: editProduct.colors,
        isFeatured: editProduct.isFeatured,
        isNewArrival: editProduct.isNewArrival,
        isTrending: editProduct.isTrending,
        material: editProduct.specifications?.material,
        careInstructions: editProduct.specifications?.care,
        isActive: true
      };

      await api.put(
        `/products/${editProduct._id}`,
        payload
      );

      fetchProducts();
      setEditProduct(null);
      toast.success('Product updated successfully');
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const handleToggleFeatured = async (product) => {
    try {
      await api.put(`/products/${product?._id}`, {
        isFeatured: !product?.isFeatured
      });
      fetchProducts();
      toast.success('Product featured status updated');
    } catch (error) {
      toast.error('Failed to update featured status');
    }
  };

  const toggleNewArrival = async (product) => {
    try {
      await api.put(
        `/products/${product?._id}`,
        {
          isNewArrival: !product?.isNewArrival
        }
      );

      fetchProducts();
      toast.success('Product arrival status updated');
    } catch (error) {
      toast.error('Failed to update arrival status');
    }
  };

  const toggleTrending = async (product) => {
    try {
      await api.put(
        `/products/${product?._id}`,
        {
          isTrending: !product?.isTrending
        }
      );

      fetchProducts();
    } catch (error) {
      toast.error('Failed to toggle trending status');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '', // Collection selection
      collection: '', // Explicit collection field
      brand: 'Black Locust',
      subcategory: '',
      sizes: [],
      colors: [],
      images: [],
      stock: '',
      featured: false,
      isFeatured: false,
      isNewArrival: false,
      isTrending: false,
      tags: [],
      // New fields you requested
      skuCode: '',
      h1Heading: '',
      specifications: '', // Detailed specifications text
      productLink: '', // Dropbox link
      availability: 'in_stock',
      // Enhanced product specifications - FIXED: was techSpecs, now productSpecs
      productSpecs: {
        fit: 'Regular Fit',
        availableSizes: [
          { size: 'S', stock: 0 },
          { size: 'M', stock: 0 },
          { size: 'L', stock: 0 },
          { size: 'XL', stock: 0 },
          { size: 'XXL', stock: 0 }
        ],
        marketingDescription: '',
        technicalSpecs: {
          fabric: '',
          sleeves: '',
          collar: '',
          pocket: '',
          occasion: ''
        }
      },
      measurements: {
        chest: '',
        length: '',
        shoulders: '',
        sleeves: '',
        waist: '',
        hips: '',
        inseam: '',
        rise: ''
      },
      variants: []
    });
    setImageFiles([]);
    setSelectedProduct(null);
  };

  const currentCategorySpecs = clothingCategories['T-Shirts'] || {
    measurements: [],
    variants: [],
    specifications: []
  };

  // Check if selected category is actually a collection
  const selectedCollection = collections.find(c => c._id === formData.category);
  const isCollection = selectedCollection !== undefined;
  
  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
      product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (product?.skuCode && product?.skuCode?.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (product?.description && product?.description?.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (product?.h1Heading && product?.h1Heading?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCollection = !filterCollection || product?.collection === filterCollection;
    const matchesAvailability = !filterAvailability || product?.availability === filterAvailability;
    
    return matchesSearch && matchesCollection && matchesAvailability;
  });
  
  // For collections, use default specs (can be customized later)
  const collectionSpecs = isCollection ? {
    measurements: ['chest', 'length', 'shoulders', 'sleeves'], // Default for collections
    variants: ['S', 'M', 'L', 'XL', 'XXL'],
    specifications: ['material', 'care', 'origin', 'season', 'fit', 'weight', 'style']
  } : null;

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="product-management">
      <div className="page-header">
        <h2>Product Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            try {
              console.log(" Add Product button clicked");
              resetForm();
              console.log(" Form reset completed");
              setShowAddModal(true);
              console.log(" Modal should show now");
            } catch (error) {
              console.error(" Error opening Add Product modal:", error);
              alert(`Error opening Add Product modal: ${error.message}`);
            }
          }}
        >
          <i className="fas fa-plus"></i> Add Product
        </button>
      </div>

      <div className="products-table">
        <div className="table-info">
          <p>Showing {filteredProducts.length} of {products.length} products</p>
          <button className="btn btn-secondary btn-sm" onClick={fetchProducts}>
            <i className="fas fa-refresh"></i> Refresh
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="search-filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search products by name, SKU, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <i className="fas fa-search search-icon"></i>
          </div>
          
          <div className="filter-options">
            <select
              value={filterCollection}
              onChange={(e) => setFilterCollection(e.target.value)}
              className="filter-select"
            >
              <option value="">All Collections</option>
              {collections.map(collection => (
                <option key={collection._id} value={collection._id}>
                  {collection.name}
                </option>
              ))}
            </select>
            
            <select
              value={filterAvailability}
              onChange={(e) => setFilterAvailability(e.target.value)}
              className="filter-select"
            >
              <option value="">All Availability</option>
              <option value="in_stock">In Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="limited">Limited Stock</option>
            </select>
            
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearchTerm('');
                setFilterCollection('');
                setFilterAvailability('');
              }}
            >
              <i className="fas fa-times"></i> Clear Filters
            </button>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>SKU Code</th>
              <th>Collection</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Availability</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product?._id} className={!product?.isActive ? 'inactive-product' : ''}>
                  <td>
                    {product?.images?.[0] ? (
                      <img 
                        src={product?.images[0]?.url} 
                        alt={product?.name}
                        width="50"
                        className="product-thumbnail"
                      />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </td>
                  <td>
                    <div className="product-info">
                      <strong>{product?.name}</strong>
                      {product?.h1Heading && (
                        <small className="text-muted">{product?.h1Heading}</small>
                      )}
                    </div>
                  </td>
                  <td>{product?.skuCode || 'N/A'}</td>
                  <td>
                    <span className="collection-badge">
                      {collections.find(c => c._id === product?.collection)?.name || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="price">₹{product?.price}</td>
                  <td>
                    <span className={`stock-badge ${product?.totalStock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                      {product?.totalStock || 0}
                    </span>
                  </td>
                  <td>
                    <span className={`availability-badge ${product?.availability || 'in_stock'}`}>
                      {product?.availability ? product?.availability.replace('_', ' ').toUpperCase() : 'IN STOCK'}
                    </span>
                  </td>
                  <td>
                    <div className="toggle-group">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={product?.isFeatured || false}
                          onChange={() => handleToggleFeatured(product)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleEdit(product)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => window.open(`/product/${product?._id}`, '_blank')}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => toggleNewArrival(product)}
                      >
                        <i className={`fas fa-star ${product?.isNewArrival ? 'active' : ''}`}></i>
                      </button>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => toggleTrending(product)}
                      >
                        <i className={`fas fa-fire ${product?.isTrending ? 'active' : ''}`}></i>
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(product?._id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-products">
                  <div className="no-products-message">
                    <i className="fas fa-box"></i>
                    <h3>No products found</h3>
                    <p>Start by adding your first product using the "Add Product" button above.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Product Modal */}
      {console.log("🔍 Modal render check:", { showAddModal, showEditModal })}
      {(showAddModal || showEditModal) && (
        <div className="modal">
          <div className="modal-content product-form">
            <div className="modal-header">
              <h3>{selectedProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  try {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    resetForm();
                  } catch (error) {
                    console.error("❌ Error closing modal:", error);
                  }
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="product-form-content">
              <div className="form-instructions">
                <h4>📝 Instructions:</h4>
                <ol>
                  <li>Fill in basic product information (name, description, price)</li>
                  <li>Select a category to see available sizes</li>
                  <li>Check the sizes you want to offer and set stock for each</li>
                  <li>Add colors and upload product images</li>
                  <li>Click "Add Product" to save</li>
                </ol>
              </div>
              
              <div className="form-sections">
                {/* Basic Information */}
                <div className="form-section">
                  <h4>Basic Information</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Product Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Category/Collection *</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Category/Collection</option>
                        
                        {/* Categories from API */}
                        {(categories || []).map(cat => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                        
                        {/* Collections from Admin Panel */}
                        {(collections || []).length > 0 && (
                          <optgroup label="Collections">
                            {(collections || []).map(collection => (
                              <option key={collection._id} value={collection._id}>
                                📁 {collection.name}
                              </option>
                            ))}
                          </optgroup>
                        )}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Brand</label>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Price *</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>SKU Code *</label>
                      <input
                        type="text"
                        name="skuCode"
                        value={formData.skuCode}
                        onChange={handleInputChange}
                        placeholder="e.g., BL-SHIRT-001"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>H1 Heading *</label>
                      <input
                        type="text"
                        name="h1Heading"
                        value={formData.h1Heading}
                        onChange={handleInputChange}
                        placeholder="SEO-friendly heading"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Availability</label>
                      <select
                        name="availability"
                        value={formData.availability}
                        onChange={handleInputChange}
                      >
                        <option value="in_stock">In Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                        <option value="limited">Limited Stock</option>
                      </select>
                    </div>
                    <div className="form-group full-width">
                      <label>Product Link (Dropbox)</label>
                      <input
                        type="url"
                        name="productLink"
                        value={formData.productLink}
                        onChange={handleInputChange}
                        placeholder="https://www.dropbox.com/s/..."
                      />
                    </div>
                  </div>
                </div>

                {/* Product Description */}
                <div className="form-section">
                  <h4>Product Description</h4>
                  <div className="form-group">
                    <label>Product Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Describe your product in detail..."
                      required
                    ></textarea>
                  </div>
                </div>

                {/* Detailed Specifications */}
                <div className="form-section">
                  <h4>Detailed Specifications</h4>
                  <div className="form-group">
                    <label>Product Specifications *</label>
                    <textarea
                      name="specifications"
                      value={formData.specifications}
                      onChange={handleInputChange}
                      rows="6"
                      placeholder="Enter detailed product specifications, materials, features, etc..."
                      required
                    ></textarea>
                  </div>
                </div>

                {/* Enhanced Product Specifications */}
                <div className="form-section">
                  <h4>Product Details & Marketing</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Fit Type</label>
                      <select
                        name="productSpecs.fit"
                        value={formData.productSpecs?.fit || 'Regular Fit'}
                        onChange={handleInputChange}
                      >
                        <option value="Regular Fit">Regular Fit</option>
                        <option value="Tailored Fit">Tailored Fit</option>
                        <option value="Slim Fit">Slim Fit</option>
                        <option value="Relaxed Fit">Relaxed Fit</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Marketing Description *</label>
                    <textarea
                      name="productSpecs.marketingDescription"
                      value={formData.productSpecs?.marketingDescription ?? ''}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Upgrade your everyday wardrobe with this Men's..."
                      required
                    ></textarea>
                  </div>

                  <div className="form-section">
                    <h4>Available Sizes</h4>
                    <div className="sizes-management">
                      <div className="default-sizes">
                        {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                          <div key={size} className="size-item">
                            <label>
                              <input
                                type="checkbox"
                                checked={formData.productSpecs.availableSizes.some(s => s.size === size)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    const existingSize = formData.productSpecs.availableSizes.find(s => s.size === size);
                                    if (!existingSize) {
                                      handleInputChange({
                                        target: {
                                          name: 'productSpecs.availableSizes',
                                          value: [...formData.productSpecs.availableSizes, { size, stock: 0 }]
                                        }
                                      });
                                    }
                                  } else {
                                    handleInputChange({
                                      target: {
                                        name: 'productSpecs.availableSizes',
                                        value: formData.productSpecs.availableSizes.filter(s => s.size !== size)
                                      }
                                    });
                                  }
                                }}
                              />
                              {size}
                            </label>
                            {formData.productSpecs.availableSizes.find(s => s.size === size) && (
                              <input
                                type="number"
                                placeholder="Stock"
                                value={formData.productSpecs.availableSizes.find(s => s.size === size)?.stock || 0}
                                onChange={(e) => {
                                  const updatedSizes = formData.productSpecs.availableSizes.map(s => 
                                    s.size === size ? { ...s, stock: parseInt(e.target.value) || 0 } : s
                                  );
                                  handleInputChange({
                                    target: {
                                      name: 'productSpecs.availableSizes',
                                      value: updatedSizes
                                    }
                                  });
                                }}
                                className="size-stock-input"
                                min="0"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="custom-size">
                        <input
                          type="text"
                          placeholder="Add custom size..."
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && e.target.value.trim()) {
                              e.preventDefault();
                              const newSize = e.target.value.trim().toUpperCase();
                              if (!formData.productSpecs.availableSizes.some(s => s.size === newSize)) {
                                handleInputChange({
                                  target: {
                                    name: "productSpecs.availableSizes",
                                    value: [...formData.productSpecs.availableSizes, { size: newSize, stock: 0 }]
                                  }
                                });
                                e.target.value = "";
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h4>Technical Specifications</h4>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Fabric</label>
                        <input
                          type="text"
                          name="productSpecs.technicalSpecs.fabric"
                          value={formData.productSpecs.technicalSpecs.fabric}
                          onChange={handleInputChange}
                          placeholder="e.g., 100% Cotton"
                        />
                      </div>
                      <div className="form-group">
                        <label>Sleeves</label>
                        <input
                          type="text"
                          name="productSpecs.technicalSpecs.sleeves"
                          value={formData.productSpecs.technicalSpecs.sleeves}
                          onChange={handleInputChange}
                          placeholder="e.g., Full, Short, Sleeveless"
                        />
                      </div>
                      <div className="form-group">
                        <label>Collar</label>
                        <input
                          type="text"
                          name="productSpecs.technicalSpecs.collar"
                          value={formData.productSpecs.technicalSpecs.collar}
                          onChange={handleInputChange}
                          placeholder="e.g., Spread Collar, Mandarin Collar"
                        />
                      </div>
                      <div className="form-group">
                        <label>Pocket</label>
                        <input
                          type="text"
                          name="productSpecs.technicalSpecs.pocket"
                          value={formData.productSpecs.technicalSpecs.pocket}
                          onChange={handleInputChange}
                          placeholder="e.g., One with logo embroidery"
                        />
                      </div>
                      <div className="form-group">
                        <label>Occasion</label>
                        <input
                          type="text"
                          name="productSpecs.technicalSpecs.occasion"
                          value={formData.productSpecs.technicalSpecs.occasion}
                          onChange={handleInputChange}
                          placeholder="e.g., Formal & Casual"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Status */}
                <div className="form-section">
                  <h4>Product Status</h4>
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleInputChange}
                      />
                      Featured Product
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="isNewArrival"
                        checked={formData.isNewArrival}
                        onChange={handleInputChange}
                      />
                      New Arrival
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="isTrending"
                        checked={formData.isTrending}
                        onChange={handleInputChange}
                      />
                      Trending
                    </label>
                  </div>
                </div>

                {!isCollection && (
                <div className="form-section">
                  <h4>Specifications</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Material</label>
                      <select
                        name="specifications.material"
                        value={formData.specifications.material}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Material</option>
                        {(materials || []).map(material => (
                          <option key={material} value={material}>{material}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Care Instructions</label>
                      <select
                        name="specifications.care"
                        value={formData.specifications.care}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Care</option>
                        {(careInstructions || []).map(care => (
                          <option key={care} value={care}>{care}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Origin</label>
                      <input
                        type="text"
                        name="specifications.origin"
                        value={formData.specifications.origin}
                        onChange={handleInputChange}
                        placeholder="e.g., Made in USA"
                      />
                    </div>
                    <div className="form-group">
                      <label>Season</label>
                      <select
                        name="specifications.season"
                        value={formData.specifications.season}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Season</option>
                        {(seasons || []).map(season => (
                          <option key={season} value={season}>{season}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Fit</label>
                      <select
                        name="specifications.fit"
                        value={formData.specifications?.fit || ''}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Fit</option>
                        {(fits || []).map(fit => (
                          <option key={fit} value={fit}>{fit}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Style</label>
                      <select
                        name="specifications.style"
                        value={formData.specifications.style}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Style</option>
                        {(styles || []).map(style => (
                          <option key={style} value={style}>{style}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                )}

                {!isCollection && currentCategorySpecs.measurements.length > 0 && (
                <div className="form-section">
                  <h4>Measurements (in inches)</h4>
                  <div className="form-grid">
                    {(currentCategorySpecs.measurements || []).map(measurement => (
                      <div key={measurement} className="form-group">
                        <label>{measurement.charAt(0).toUpperCase() + measurement.slice(1)}</label>
                        <input
                          type="number"
                          name={`measurements.${measurement}`}
                          value={formData.measurements[measurement] || ''}
                          onChange={handleInputChange}
                          placeholder="0"
                          step="0.1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {isCollection && (
                <div className="form-section">
                  <h4>Collection Product Specifications</h4>
                  <p style={{color: '#666', fontSize: '0.9em', marginBottom: '15px'}}>
                    This product belongs to the <strong>{selectedCollection?.name}</strong> collection.
                    Standard clothing measurements will be used.
                  </p>
                </div>
              )}

                {/* Sizes */}
                <div className="form-section">
                  <h4>Available Sizes & Stock Management</h4>
                  <div className="sizes-stock-management">
                    {(isCollection ? collectionSpecs : currentCategorySpecs).variants?.map(size => {
                      const sizeData = (formData.sizes || []).find(s => s.size === size);
                      return (
                        <div key={size} className="size-stock-row">
                          <label className="size-checkbox">
                            <input
                              type="checkbox"
                              checked={(formData.sizes || []).some(s => s.size === size)}
                              onChange={() => handleSizeChange(size)}
                            />
                            <span className="size-label">{size}</span>
                          </label>
                          <div className="stock-input-group">
                            <label className="stock-label">Stock:</label>
                            <input
                              type="number"
                              min="0"
                              value={sizeData?.stock || 0}
                              onChange={(e) => handleSizeStockChange(size, e.target.value)}
                              className="stock-input"
                              placeholder="0"
                            />
                            <span className="stock-unit">pieces</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="total-stock-info">
                    <strong>Total Stock: {formData.sizes.reduce((total, size) => total + (size.stock || 0), 0)} pieces</strong>
                  </div>
                </div>

                {/* Colors */}
                <div className="form-section">
                  <h4>Available Colors</h4>
                  <div className="colors-input">
                    <input
                      type="text"
                      placeholder="Enter colors separated by commas"
                      value={(formData.colors || []).join(', ')}
                      onChange={(e) => {
                        const colors = e.target.value.split(',').map(c => c.trim()).filter(c => c);
                        setFormData(prev => ({ ...prev, colors: colors || [] }));
                      }}
                    />
                  </div>
                </div>

                {/* Images */}
                <div className="form-section">
                  <h4>Product Images</h4>
                  <div className="images-section">
                    {/* Existing images */}
                    {(formData.images || []).map((image, index) => (
                      <div key={`existing-${index}`} className="image-input-group">
                        <input
                          type="text"
                          placeholder="Image URL"
                          value={image.url}
                          onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Image ID (optional)"
                          value={image.public_id}
                          onChange={(e) => handleImageChange(index, 'public_id', e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => handleImageRemove(index)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    ))}
                    
                    {/* File upload */}
                    <div className="image-upload-section">
                      <label className="file-upload-label">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => setImageFiles([...e.target.files])}
                          disabled={uploading}
                        />
                        <i className="fas fa-cloud-upload-alt"></i>
                        {uploading ? 'Uploading...' : 'Upload Images'}
                      </label>
                      {imageFiles.length > 0 && (
                        <div className="selected-files">
                          Selected: {imageFiles.length} file(s)
                        </div>
                      )}
                    </div>
                    
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleImageAdd}
                    >
                      <i className="fas fa-plus"></i> Add Image URL
                    </button>
                  </div>
                </div>

                {/* Tags */}
                <div className="form-section">
                  <h4>Tags</h4>
                  <div className="tags-input">
                    <input
                      type="text"
                      placeholder="Enter tags separated by commas"
                      value={(formData.tags || []).join(', ')}
                      onChange={(e) => {
                        const tags = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                        setFormData(prev => ({ ...prev, tags: tags || [] }));
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {selectedProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
