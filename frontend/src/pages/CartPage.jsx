import React from 'react';
import { useCart } from '../context/CartContext';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/currency';
import './CartPage.css';

const CartPage = () => {
  const { items, totalItems, totalAmount, removeFromCart, updateQuantity } = useCart();
  
  console.log("CART ITEMS IN PAGE:", items); // 🔥 DEBUG LOG

  const GST_RATE = 0;
  const DELIVERY_CHARGE = 0;
  const COD_CONFIRMATION_AMOUNT = 100;

  const gstAmount = Math.round((totalAmount || 0) * GST_RATE);
  const deliveryAmount = DELIVERY_CHARGE;
  const grandTotal = (totalAmount || 0) + gstAmount + deliveryAmount;

  const handleQuantityChange = (uniqueId, newQuantity) => {
    updateQuantity(uniqueId, newQuantity);
  };

  const handleRemoveItem = (uniqueId) => {
    removeFromCart(uniqueId);
  };

  if (!items || items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <Link to="/products" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Shopping Cart</h1>
        
        <div className="cart-content">
          <div className="cart-items">
            {(items || []).map(item => (
              <div key={item.uniqueId} className="cart-item">
                <div className="item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                
                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <div className="item-variants">
                    {item.size && (
                      <span className="item-size">Size: {item.size}</span>
                    )}
                    {item.color && (
                      <span className="item-color">Color: {item.color}</span>
                    )}
                  </div>
                  <p className="item-price">{formatPrice(item.price)}</p>
                </div>
                
                <div className="item-quantity">
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.uniqueId, item.quantity - 1)}
                  >
                    <FaMinus />
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.uniqueId, item.quantity + 1)}
                  >
                    <FaPlus />
                  </button>
                </div>
                
                <div className="item-total">
                  {formatPrice(item.price * item.quantity)}
                </div>
                
                <button 
                  className="remove-btn"
                  onClick={() => removeFromCart(item.uniqueId)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="summary-box">
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal ({totalItems} items)</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
              
              <div className="summary-row">
                <span>Delivery Charges</span>
                <span>{DELIVERY_CHARGE === 0 ? 'Free' : formatPrice(deliveryAmount)}</span>
              </div>

              <div className="summary-row">
                <span>GST</span>
                <span>{GST_RATE > 0 ? formatPrice(gstAmount) : 'Not applied'}</span>
              </div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>

              <div style={{ marginTop: '0.75rem', fontSize: 13, color: 'rgba(0,0,0,0.75)' }}>
                7-day replacement policy. COD available only after ₹{COD_CONFIRMATION_AMOUNT} confirmation payment.
              </div>
              
              <Link to="/checkout" className="checkout-btn">
                Pay Now
              </Link>
              
              <Link to="/products" className="continue-shopping-btn">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;