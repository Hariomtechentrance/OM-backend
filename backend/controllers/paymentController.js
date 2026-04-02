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

    const { amount, currency = 'INR', receipt } = req.body;
    const rupees = Number(amount);
    if (!Number.isFinite(rupees) || rupees <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const amountPaise = Math.round(rupees * 100);

    const Razorpay = (await import('razorpay')).default;
    const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await rzp.orders.create({
      amount: amountPaise,
      currency,
      receipt: (receipt || `bl_${Date.now()}`).slice(0, 40)
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

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');

    if (expected !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    if (orderId) {
      await StoreOrder.findByIdAndUpdate(orderId, {
        paymentStatus: 'paid',
        status: 'processing',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id
      });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('verifyRazorpayPayment:', err);
    return res.status(500).json({ message: err.message || 'Verification failed' });
  }
};
