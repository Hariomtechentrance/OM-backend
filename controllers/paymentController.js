import crypto from 'crypto';
import StoreOrder from '../models/StoreOrder.js';

/**
 * POST /api/payments/razorpay/create-upi-order
 * Creates a Razorpay order specifically for UPI payment
 */
export const createUPIOrder = async (req, res) => {
  try {
    console.log('🔵 createUPIOrder called');
    console.log('Request body:', req.body);
    console.log('User:', req.user?._id);
    
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    
    console.log('Razorpay Key ID:', keyId ? `${keyId.substring(0, 10)}...` : 'NOT SET');
    console.log('Razorpay Secret:', keySecret ? 'SET' : 'NOT SET');
    
    if (!keyId || !keySecret) {
      console.error('❌ Razorpay credentials not configured');
      return res.status(503).json({
        message: 'Razorpay is not configured (set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET)'
      });
    }

    const { amount, currency = 'INR', receipt, notes } = req.body;
    
    console.log('Amount received:', amount, 'Type:', typeof amount);
    
    if (!amount || amount <= 0) {
      console.error('❌ Invalid amount:', amount);
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    // Amount should already be in rupees from frontend
    const amountPaise = Math.round(amount * 100);
    
    console.log('Amount in paise:', amountPaise);

    const Razorpay = (await import('razorpay')).default;
    const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });

    console.log('Creating Razorpay order...');
    
    const orderOptions = {
      amount: amountPaise,
      currency,
      receipt: receipt || `upi_${Date.now()}`,
      notes: notes || {}
    };
    
    console.log('Order options:', orderOptions);

    const order = await rzp.orders.create(orderOptions);
    
    console.log('✅ Razorpay order created:', order.id);

    return res.json({ 
      success: true,
      order 
    });
  } catch (err) {
    console.error('❌ createUPIOrder error:', err);
    console.error('Error stack:', err.stack);
    return res.status(500).json({ 
      message: err.message || 'Failed to create UPI order',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * POST /api/payments/razorpay/verify-upi
 * Verifies UPI payment signature
 */
export const verifyUPIPayment = async (req, res) => {
  try {
    console.log('🔵 verifyUPIPayment called');
    console.log('Request body:', req.body);
    
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error('❌ Razorpay secret not configured');
      return res.status(503).json({ message: 'Razorpay not configured' });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error('❌ Missing Razorpay fields');
      return res.status(400).json({ message: 'Missing Razorpay fields' });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');

    console.log('Signature verification:');
    console.log('Expected:', expected);
    console.log('Received:', razorpay_signature);
    console.log('Match:', expected === razorpay_signature);

    if (expected !== razorpay_signature) {
      console.error('❌ Invalid payment signature');
      return res.status(400).json({ 
        success: false,
        message: 'Invalid payment signature' 
      });
    }

    console.log('✅ UPI payment verified successfully');

    return res.json({ 
      success: true,
      message: 'UPI payment verified successfully',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    });
  } catch (err) {
    console.error('❌ verifyUPIPayment error:', err);
    console.error('Error stack:', err.stack);
    return res.status(500).json({ 
      message: err.message || 'Verification failed',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/** GET /api/payments/razorpay/key — publishable key only */
export const getRazorpayKey = async (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  return res.json({
    keyId: keyId || null,
    configured: Boolean(keyId)
  });
};

/** POST /api/payments/razorpay/order — amount in INR (rupees) from client */
export const createRazorpayOrder = async (req, res) => {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return res.status(503).json({
        message: 'Razorpay is not configured (set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET)'
      });
    }

    const { orderId, currency = 'INR' } = req.body;
    if (!orderId) {
      return res.status(400).json({ message: 'orderId is required' });
    }

    const storeOrder = await StoreOrder.findById(orderId).lean();
    if (!storeOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (String(storeOrder.user) !== String(req.user?._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (storeOrder.paymentStatus === 'paid') {
      return res.status(409).json({ message: 'Order payment already completed' });
    }

    const rupees = Number(storeOrder.totalPrice);
    if (!Number.isFinite(rupees) || rupees <= 0) {
      return res.status(400).json({ message: 'Invalid order totalPrice' });
    }

    const amountPaise = Math.round(rupees * 100);

    const Razorpay = (await import('razorpay')).default;
    const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await rzp.orders.create({
      amount: amountPaise,
      currency,
      receipt: (storeOrder.orderNumber || `bl_${Date.now()}`).slice(0, 40)
    });

    // Store Razorpay order id so verify can enforce integrity.
    await StoreOrder.findByIdAndUpdate(orderId, {
      razorpayOrderId: order.id,
      paymentStatus: 'pending',
      status: 'pending'
    });

    return res.json({ order });
  } catch (err) {
    console.error('createRazorpayOrder:', err);
    return res.status(500).json({ message: err.message || 'Razorpay order failed' });
  }
};

/** POST /api/payments/razorpay/verify */
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return res.status(503).json({ message: 'Razorpay not configured' });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing Razorpay fields' });
    }

    if (!orderId) {
      return res.status(400).json({ message: 'orderId is required' });
    }

    const storeOrder = await StoreOrder.findById(orderId);
    if (!storeOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (String(storeOrder.user) !== String(req.user?._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');

    if (expected !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Enforce payment->order integrity (prevents attaching random payments to someone else's order).
    if (
      storeOrder.razorpayOrderId &&
      String(storeOrder.razorpayOrderId) !== String(razorpay_order_id)
    ) {
      return res.status(400).json({ message: 'Razorpay order mismatch' });
    }

    if (storeOrder.paymentStatus === 'paid') {
      // Idempotent: verification can be called multiple times by client/network.
      return res.json({ success: true });
    }

    const updated = await StoreOrder.findOneAndUpdate(
      { _id: orderId, user: req.user._id, paymentStatus: 'pending' },
      {
        paymentStatus: 'paid',
        status: 'processing',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id
      }
    );

    if (!updated) {
      return res.status(409).json({ message: 'Order payment already completed' });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('verifyRazorpayPayment:', err);
    return res.status(500).json({ message: err.message || 'Verification failed' });
  }
};

/**
 * POST /api/payments/cod/confirmation-order
 * Creates a Razorpay order for the ₹100 COD confirmation fee.
 * This is called BEFORE the store order is created — the user must pay ₹100
 * to prove intent before the COD order is accepted.
 */
export const createCODConfirmationOrder = async (req, res) => {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return res.status(503).json({
        message: 'Razorpay is not configured (set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET)'
      });
    }

    const COD_FEE_RUPEES = 100;
    const amountPaise = COD_FEE_RUPEES * 100; // 10000 paise

    const Razorpay = (await import('razorpay')).default;
    const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await rzp.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `cod_confirm_${req.user?._id || 'guest'}_${Date.now()}`.slice(0, 40),
      notes: {
        purpose: 'COD Confirmation Fee',
        userId: String(req.user?._id || ''),
        amount_rupees: COD_FEE_RUPEES
      }
    });

    return res.json({
      success: true,
      order,
      orderId: order.id,
      amount: COD_FEE_RUPEES,
      amountPaise
    });
  } catch (err) {
    console.error('createCODConfirmationOrder:', err);
    return res.status(500).json({ message: err.message || 'Failed to create COD confirmation order' });
  }
};
