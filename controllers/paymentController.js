import crypto from 'crypto';
import StoreOrder from '../models/StoreOrder.js';

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
