import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaArrowRight, FaShoppingBag } from 'react-icons/fa';
import './OrderSuccessPage.css';

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || 'BL-' + Math.random().toString(36).substr(2, 9).toUpperCase();

  return (
    <div className="order-success-page">
      <div className="container">
        <div className="success-card">
          <div className="success-icon">
            <FaCheckCircle />
          </div>
          <h1>Order Placed Successfully!</h1>
          <p className="order-id">Order ID: <strong>{orderId}</strong></p>
          <p className="success-message">
            Thank you for shopping with Black Locust. Your order has been confirmed and is being prepared for shipment. 
            A confirmation email has been sent to your registered email address.
          </p>
          
          <div className="success-actions">
            <Link to="/profile" className="btn-secondary">
              TRACK ORDER <FaArrowRight />
            </Link>
            <Link to="/products" className="btn-primary">
              CONTINUE SHOPPING <FaShoppingBag />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
