const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const https = require('https');
const crypto = require('crypto');

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: orderId
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ 
      message: 'Payment processing failed',
      error: error.message 
    });
  }
};

// @desc    Confirm payment
// @route   POST /api/payments/confirm
// @access  Private
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ 
        message: 'Payment not successful',
        status: paymentIntent.status 
      });
    }

    // Update order status
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: paymentIntent.id,
      status: paymentIntent.status,
      update_time: new Date().toISOString(),
      email_address: req.user.email
    };
    order.status = 'processing';

    await order.save();

    res.json({
      message: 'Payment confirmed successfully',
      order
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ 
      message: 'Payment confirmation failed',
      error: error.message 
    });
  }
};

// @desc    Process refund
// @route   POST /api/payments/refund
// @access  Private/Admin
exports.processRefund = async (req, res) => {
  try {
    const { orderId, amount, reason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!order.isPaid) {
      return res.status(400).json({ message: 'Order is not paid' });
    }

    // Create refund
    const refund = await stripe.refunds.create({
      payment_intent: order.paymentResult.id,
      amount: Math.round(amount * 100), // Convert to cents
      reason: 'requested_by_customer',
      metadata: {
        orderId: orderId,
        reason: reason
      }
    });

    // Update order status
    order.status = 'refunded';
    order.refund = {
      id: refund.id,
      amount: amount,
      reason: reason,
      status: refund.status,
      createdAt: new Date()
    };

    await order.save();

    res.json({
      message: 'Refund processed successfully',
      refund
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ 
      message: 'Refund failed',
      error: error.message 
    });
  }
};

// @desc    Get payment methods
// @route   GET /api/payments/methods
// @access  Private
exports.getPaymentMethods = async (req, res) => {
  try {
    // In a real application, you would retrieve saved payment methods from Stripe
    // For now, return available payment options
    res.json({
      methods: [
        {
          id: 'card',
          type: 'card',
          name: 'Credit/Debit Card',
          description: 'Visa, Mastercard, American Express',
          icon: 'credit-card'
        },
        {
          id: 'paypal',
          type: 'paypal',
          name: 'PayPal',
          description: 'Pay with PayPal account',
          icon: 'paypal'
        },
        {
          id: 'apple_pay',
          type: 'apple_pay',
          name: 'Apple Pay',
          description: 'Pay with Apple Pay',
          icon: 'apple'
        },
        {
          id: 'google_pay',
          type: 'google_pay',
          name: 'Google Pay',
          description: 'Pay with Google Pay',
          icon: 'google'
        }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Handle webhook from Stripe
// @route   POST /api/payments/webhook
// @access  Public
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!');
      
      // Update order status
      if (paymentIntent.metadata.orderId) {
        await Order.findByIdAndUpdate(paymentIntent.metadata.orderId, {
          isPaid: true,
          paidAt: new Date(),
          status: 'processing',
          paymentResult: {
            id: paymentIntent.id,
            status: paymentIntent.status,
            update_time: new Date().toISOString()
          }
        });
      }
      break;

    case 'payment_intent.payment_failed':
      console.log('PaymentIntent failed!');
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
};

const razorpayRequest = (method, path, body) => {
  return new Promise((resolve, reject) => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      reject(new Error('Razorpay keys are not configured'));
      return;
    }

    const payload = body ? JSON.stringify(body) : '';
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

    const reqOptions = {
      method,
      hostname: 'api.razorpay.com',
      path,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const request = https.request(reqOptions, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          if (response.statusCode && response.statusCode >= 400) {
            reject(new Error(parsed?.error?.description || parsed?.error?.reason || 'Razorpay request failed'));
            return;
          }
          resolve(parsed);
        } catch (e) {
          reject(e);
        }
      });
    });

    request.on('error', reject);

    if (payload) {
      request.write(payload);
    }
    request.end();
  });
};

// @desc    Get Razorpay public key
// @route   GET /api/payments/razorpay/key
// @access  Private
exports.getRazorpayKey = async (req, res) => {
  res.json({
    keyId: process.env.RAZORPAY_KEY_ID || null
  });
};

// @desc    Create Razorpay order
// @route   POST /api/payments/razorpay/order
// @access  Private
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    const order = await razorpayRequest('POST', '/v1/orders', {
      amount: Math.round(Number(amount) * 100),
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      payment_capture: 1
    });

    res.json({
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to create Razorpay order' });
  }
};

// @desc    Verify Razorpay payment signature and optionally mark order paid
// @route   POST /api/payments/razorpay/verify
// @access  Private
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
      purpose
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing Razorpay verification fields' });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'Razorpay keys are not configured' });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');

    if (expected !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    if (purpose === 'order_payment' && orderId) {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentMethod = 'razorpay';
      order.paymentResult = {
        id: razorpay_payment_id,
        status: 'succeeded',
        update_time: new Date().toISOString(),
        email_address: req.user.email
      };
      order.paymentResult.razorpay_order_id = razorpay_order_id;
      order.status = 'processing';
      await order.save();

      return res.json({ success: true, order });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Verification failed' });
  }
};
