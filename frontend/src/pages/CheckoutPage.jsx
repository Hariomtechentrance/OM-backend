import React, { useMemo, useState } from 'react';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/currency';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();

  const GST_RATE = 0;
  const DELIVERY_CHARGE = 0;
  const COD_CONFIRMATION_AMOUNT = 100;

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    alternatePhone: '',
    street: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [codConfirmation, setCodConfirmation] = useState({
    paid: false,
    amount: COD_CONFIRMATION_AMOUNT,
    razorpayOrderId: '',
    razorpayPaymentId: '',
    paidAt: ''
  });

  const itemsPrice = useMemo(() => totalAmount || 0, [totalAmount]);
  const taxPrice = useMemo(() => Math.round(itemsPrice * GST_RATE), [itemsPrice, GST_RATE]);
  const shippingPrice = DELIVERY_CHARGE;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  const onChangeAddress = (e) => {
    setShippingAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const validate = () => {
    if (!items || items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return false;
    }

    if (!termsAccepted) {
      toast.error('Please accept the Terms & Conditions');
      return false;
    }

    const required = ['fullName', 'phone', 'street', 'city', 'state', 'zipCode', 'country'];
    for (const key of required) {
      if (!shippingAddress[key] || String(shippingAddress[key]).trim().length === 0) {
        toast.error('Please fill your shipping address');
        return false;
      }
    }

    if (String(shippingAddress.phone).trim().length < 8) {
      toast.error('Please enter a valid mobile number');
      return false;
    }

    return true;
  };

  const lineImage = (item) => {
    if (typeof item.image === 'string' && item.image.trim()) return item.image;
    return 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop';
  };

  const createBackendOrder = async ({ paymentMethodToUse, codConfirmationToUse }) => {
    const orderItems = items.map((item) => ({
      product: item.product || item.productId || item.id,
      quantity: item.quantity,
      size: item.size ?? 'Default',
      color: item.color ?? 'Default',
      name: item.name,
      price: item.price,
      image: lineImage(item)
    }));

    const payload = {
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethodToUse,
      codConfirmation: codConfirmationToUse,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    };

    const res = await api.post('/orders', payload);
    return res.data;
  };

  const cancelPendingOrder = async (orderId) => {
    if (!orderId) return;
    try {
      await api.put(`/orders/${orderId}/cancel`);
    } catch (e) {
      // ignore
    }
  };

  const payWithRazorpay = async ({ amount, description, purpose, orderId }) => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error('Failed to load Razorpay');
      return null;
    }

    const keyRes = await api.get('/payments/razorpay/key');
    const keyId = keyRes.data?.keyId;
    if (!keyId) {
      toast.error('Razorpay is not configured on the server');
      return null;
    }

    const orderRes = await api.post('/payments/razorpay/order', {
      amount,
      currency: 'INR',
      receipt: `${purpose}_${Date.now()}`
    });

    const razorpayOrder = orderRes.data?.order;
    if (!razorpayOrder?.id) {
      toast.error('Failed to create Razorpay order');
      return null;
    }

    return new Promise((resolve) => {
      const rzp = new window.Razorpay({
        key: keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Black Locust',
        description,
        order_id: razorpayOrder.id,
        prefill: {
          name: shippingAddress.fullName,
          email: user?.email,
          contact: shippingAddress.phone
        },
        theme: {
          color: '#c09345'
        },
        handler: async (response) => {
          try {
            await api.post('/payments/razorpay/verify', {
              ...response,
              purpose,
              orderId
            });
            resolve({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id
            });
          } catch (e) {
            toast.error(e.response?.data?.message || 'Payment verification failed');
            await cancelPendingOrder(orderId);
            resolve(null);
          }
        },
        modal: {
          ondismiss: async () => {
            await cancelPendingOrder(orderId);
            resolve(null);
          }
        }
      });

      rzp.open();
    });
  };

  const handlePayNowAndPlaceOrder = async () => {
    if (!validate()) return;

    setPlacingOrder(true);
    try {
      const order = await createBackendOrder({ paymentMethodToUse: 'razorpay' });

      const payment = await payWithRazorpay({
        amount: totalPrice,
        description: 'Order Payment',
        purpose: 'order_payment',
        orderId: order?._id
      });

      if (!payment) return;

      clearCart();
      toast.success('Order placed successfully');
      navigate(`/order-success?orderId=${order._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleCodConfirmationPayment = async () => {
    if (!validate()) return;

    setPlacingOrder(true);
    try {
      const payment = await payWithRazorpay({
        amount: COD_CONFIRMATION_AMOUNT,
        description: 'COD Confirmation Fee',
        purpose: 'cod_confirmation'
      });

      if (!payment) return;

      setCodConfirmation({
        paid: true,
        amount: COD_CONFIRMATION_AMOUNT,
        razorpayOrderId: payment.razorpayOrderId,
        razorpayPaymentId: payment.razorpayPaymentId,
        paidAt: new Date().toISOString()
      });

      toast.success('COD enabled');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to enable COD');
    } finally {
      setPlacingOrder(false);
    }
  };

  const handlePlaceCodOrder = async () => {
    if (!validate()) return;

    if (!codConfirmation.paid) {
      toast.error('Please pay ₹100 to enable COD');
      return;
    }

    setPlacingOrder(true);
    try {
      await createBackendOrder({
        paymentMethodToUse: 'cod',
        codConfirmationToUse: codConfirmation
      });

      clearCart();
      toast.success('COD order placed successfully');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place COD order');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="checkout-page">
      {/* Header Section */}
      <div className="checkout-header">
        <div className="header-content">
          <div className="header-left">
            <Link to="/cart" className="back-link">
              <span className="back-arrow">←</span>
              <span className="back-text">Back to Cart</span>
            </Link>
            <h1 className="page-title">Secure Checkout</h1>
            <p className="page-subtitle">Complete your order with confidence</p>
          </div>
          <div className="header-right">
            <div className="security-badge">
              <span className="security-icon">🔒</span>
              <span className="security-text">Secure Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="progress-section">
        <div className="progress-container">
          <div className="progress-steps">
            <div className="step completed">
              <div className="step-number">1</div>
              <div className="step-label">Cart</div>
            </div>
            <div className="step-connector completed"></div>
            <div className="step active">
              <div className="step-number">2</div>
              <div className="step-label">Checkout</div>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-label">Confirmation</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="checkout-content">
        <div className="checkout-container">
          <div className="checkout-grid">
            {/* Left Column - Shipping & Payment */}
            <div className="checkout-left">
              {/* Shipping Address */}
              <div className="section-card">
                <div className="section-header">
                  <div className="section-icon">📍</div>
                  <div className="section-title">
                    <h2>Shipping Address</h2>
                    <p>Where should we deliver your order?</p>
                  </div>
                </div>
                
                <div className="form-grid">
                  <div className="form-row">
                    <div className="form-group">
                      <input 
                        name="fullName" 
                        value={shippingAddress.fullName} 
                        onChange={onChangeAddress} 
                        placeholder="Full Name" 
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <input 
                        name="phone" 
                        value={shippingAddress.phone} 
                        onChange={onChangeAddress} 
                        placeholder="Mobile Number" 
                        className="form-input"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <input 
                      name="alternatePhone" 
                      value={shippingAddress.alternatePhone} 
                      onChange={onChangeAddress} 
                      placeholder="Alternate Mobile Number (Optional)" 
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <input 
                      name="street" 
                      value={shippingAddress.street} 
                      onChange={onChangeAddress} 
                      placeholder="Address Line 1" 
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <input 
                      name="addressLine2" 
                      value={shippingAddress.addressLine2} 
                      onChange={onChangeAddress} 
                      placeholder="Address Line 2 (Optional)" 
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <input 
                      name="landmark" 
                      value={shippingAddress.landmark} 
                      onChange={onChangeAddress} 
                      placeholder="Landmark (Optional)" 
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <input 
                        name="city" 
                        value={shippingAddress.city} 
                        onChange={onChangeAddress} 
                        placeholder="City" 
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <input 
                        name="state" 
                        value={shippingAddress.state} 
                        onChange={onChangeAddress} 
                        placeholder="State" 
                        className="form-input"
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <input 
                        name="zipCode" 
                        value={shippingAddress.zipCode} 
                        onChange={onChangeAddress} 
                        placeholder="ZIP / Postal Code" 
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <input 
                        name="country" 
                        value={shippingAddress.country} 
                        onChange={onChangeAddress} 
                        placeholder="Country" 
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="section-card">
                <div className="section-header">
                  <div className="section-icon">💳</div>
                  <div className="section-title">
                    <h2>Payment Method</h2>
                    <p>Choose your preferred payment option</p>
                  </div>
                </div>
                
                <div className="payment-options">
                  <label className={`payment-option ${paymentMethod === 'razorpay' ? 'active' : ''}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="razorpay" 
                      checked={paymentMethod === 'razorpay'} 
                      onChange={(e) => setPaymentMethod(e.target.value)} 
                    />
                    <div className="payment-content">
                      <div className="payment-info">
                        <div className="payment-title">Pay Now</div>
                        <div className="payment-description">Secure online payment via Razorpay</div>
                      </div>
                      <div className="payment-icons">
                        <span className="payment-icon">💳</span>
                        <span className="payment-icon">🔒</span>
                      </div>
                    </div>
                  </label>
                  
                  <label className={`payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="cod" 
                      checked={paymentMethod === 'cod'} 
                      onChange={(e) => setPaymentMethod(e.target.value)} 
                    />
                    <div className="payment-content">
                      <div className="payment-info">
                        <div className="payment-title">Cash on Delivery</div>
                        <div className="payment-description">Pay when you receive your order</div>
                      </div>
                      <div className="payment-badge">
                        <span className="badge-text">+₹{COD_CONFIRMATION_AMOUNT}</span>
                      </div>
                    </div>
                  </label>
                </div>

                {paymentMethod === 'cod' && (
                  <div className="cod-notice">
                    <div className="cod-header">
                      <span className="cod-icon">💰</span>
                      <div className="cod-title">COD Confirmation Required</div>
                    </div>
                    <div className="cod-description">
                      To use Cash on Delivery, you must pay <strong>₹{COD_CONFIRMATION_AMOUNT}</strong> online first as a confirmation fee.
                    </div>
                    <div className="cod-status">
                      Status: <span className={`status-badge ${codConfirmation.paid ? 'paid' : 'pending'}`}>
                        {codConfirmation.paid ? '✓ Paid' : '○ Pending'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="section-card">
                <div className="section-header">
                  <div className="section-icon">📋</div>
                  <div className="section-title">
                    <h2>Terms & Conditions</h2>
                  </div>
                </div>
                
                <div className="terms-content">
                  <div className="terms-list">
                    <div className="term-item">
                      <span className="term-number">1</span>
                      <span className="term-text">7-day replacement policy for unused items in original packaging</span>
                    </div>
                    <div className="term-item">
                      <span className="term-number">2</span>
                      <span className="term-text">Delivery charges: {DELIVERY_CHARGE === 0 ? 'Free' : formatPrice(DELIVERY_CHARGE)}</span>
                    </div>
                    <div className="term-item">
                      <span className="term-number">3</span>
                      <span className="term-text">GST: {GST_RATE > 0 ? `Applied (${Math.round(GST_RATE * 100)}%)` : 'Not applied'}</span>
                    </div>
                    <div className="term-item">
                      <span className="term-number">4</span>
                      <span className="term-text">COD available only after successful ₹{COD_CONFIRMATION_AMOUNT} confirmation payment</span>
                    </div>
                  </div>
                  
                  <label className="terms-checkbox">
                    <input 
                      type="checkbox" 
                      checked={termsAccepted} 
                      onChange={(e) => setTermsAccepted(e.target.checked)} 
                    />
                    <span className="checkbox-text">I accept the Terms & Conditions</span>
                  </label>
                </div>
              </div>

              {/* Return Policy */}
              <div className="section-card return-policy">
                <div className="policy-header">
                  <div className="policy-icon">↩️</div>
                  <div className="policy-content">
                    <h3>7-Day Return Policy</h3>
                    <p>Returns accepted for unused items in original packaging</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="checkout-right">
              <div className="order-summary">
                <div className="summary-header">
                  <h2>Order Summary</h2>
                  <div className="item-count">{items.length} {items.length === 1 ? 'item' : 'items'}</div>
                </div>

                <div className="order-items">
                  {items.map((item) => (
                    <div key={item.id} className="order-item">
                      <div className="item-image">
                        {item.image ? (
                          <img src={lineImage(item)} alt={item.name} />
                        ) : (
                          <div className="placeholder-image">📦</div>
                        )}
                      </div>
                      <div className="item-details">
                        <div className="item-name">{item.name}</div>
                        <div className="item-quantity">Quantity: {item.quantity}</div>
                      </div>
                      <div className="item-price">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>

                <div className="price-breakdown">
                  <div className="price-row">
                    <span>Items</span>
                    <span>{formatPrice(itemsPrice)}</span>
                  </div>
                  <div className="price-row">
                    <span>Delivery Charges</span>
                    <span>{formatPrice(shippingPrice)}</span>
                  </div>
                  <div className="price-row">
                    <span>GST</span>
                    <span>{formatPrice(taxPrice)}</span>
                  </div>
                  <div className="price-row total">
                    <span>Total</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                  {paymentMethod === 'razorpay' ? (
                    <button
                      onClick={handlePayNowAndPlaceOrder}
                      disabled={placingOrder || !termsAccepted}
                      className="btn-primary"
                    >
                      {placingOrder ? 'Processing...' : 'Pay Now & Place Order'}
                    </button>
                  ) : (
                    <>
                      {!codConfirmation.paid ? (
                        <button
                          onClick={handleCodConfirmationPayment}
                          disabled={placingOrder || !termsAccepted}
                          className="btn-secondary"
                        >
                          {placingOrder ? 'Processing...' : `Pay ₹${COD_CONFIRMATION_AMOUNT} to Enable COD`}
                        </button>
                      ) : (
                        <button
                          onClick={handlePlaceCodOrder}
                          disabled={placingOrder || !termsAccepted}
                          className="btn-primary"
                        >
                          {placingOrder ? 'Placing Order...' : 'Place COD Order'}
                        </button>
                      )}
                    </>
                  )}
                </div>

                {/* Security Badge */}
                <div className="security-info">
                  <div className="security-item">
                    <span className="security-icon">🔒</span>
                    <span className="security-text">Secure Payment</span>
                  </div>
                  <div className="security-item">
                    <span className="security-icon">🛡️</span>
                    <span className="security-text">SSL Encrypted</span>
                  </div>
                  <div className="security-item">
                    <span className="security-icon">✓</span>
                    <span className="security-text">Safe Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
