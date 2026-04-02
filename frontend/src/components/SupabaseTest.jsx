import React, { useState, useEffect } from 'react';
import { supabaseHelpers } from '../config/supabase';

const SupabaseTest = () => {
  const [status, setStatus] = useState('Testing connection...');
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    testSupabaseConnection();
  }, []);

  const testSupabaseConnection = async () => {
    try {
      // Test 1: Check if we can connect to Supabase
      const { data, error } = await supabaseHelpers.products.getAll();
      
      if (error) {
        setError(error.message);
        setStatus('❌ Connection failed');
        return;
      }

      setProducts(data || []);
      setStatus('✅ Connected successfully!');
      
      // Test 2: Check if we can insert data
      const testProduct = {
        name: 'Test Product',
        price: 999.99,
        category: 'test',
        description: 'This is a test product',
        image_url: '/images/test.jpg',
        stock: 10,
        rating: 5.0,
        featured: false
      };

      const { data: insertData, error: insertError } = await supabaseHelpers.products.create(testProduct);
      
      if (insertError) {
        console.log('Insert test failed:', insertError.message);
      } else {
        console.log('Insert test passed:', insertData);
        // Clean up test data
        if (insertData && insertData[0]) {
          await supabaseHelpers.products.delete(insertData[0].id);
        }
      }

    } catch (err) {
      setError(err.message);
      setStatus('❌ Connection failed');
    }
  };

  const testAuth = async () => {
    try {
      const { data, error } = await supabaseHelpers.auth.getCurrentUser();
      if (error) {
        console.log('Auth test:', error.message);
      } else {
        console.log('Auth test passed:', data);
      }
    } catch (err) {
      console.log('Auth test error:', err.message);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      padding: '10px', 
      border: '1px solid #ccc', 
      borderRadius: '5px',
      zIndex: 9999,
      fontSize: '12px'
    }}>
      <h4>Supabase Test Panel</h4>
      <p><strong>Status:</strong> {status}</p>
      {error && <p style={{ color: 'red' }}><strong>Error:</strong> {error}</p>}
      <p><strong>Products found:</strong> {products.length}</p>
      <button onClick={testSupabaseConnection} style={{ marginRight: '5px' }}>
        Test Connection
      </button>
      <button onClick={testAuth}>
        Test Auth
      </button>
      <div style={{ marginTop: '10px' }}>
        <small>
          {products.length > 0 && (
            <div>
              <strong>Sample products:</strong>
              <ul style={{ margin: '5px 0', paddingLeft: '15px' }}>
                {products.slice(0, 3).map(product => (
                  <li key={product.id}>{product.name} - ₹{product.price}</li>
                ))}
              </ul>
            </div>
          )}
        </small>
      </div>
    </div>
  );
};

export default SupabaseTest;
