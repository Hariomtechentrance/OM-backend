const express = require('express');
const crypto = require('crypto');
const Order = require('../models/Order');
const { validatePayment, validateOrder, generateSecureToken } = require('../middleware/security');

const router = express.Router();

// Payment gateway configurations
const paymentGateways = {
  stripe: {
    publicKey: process.env.STRIPE_PUBLIC_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET
  }
};

// Create payment intent
router.post('/create-intent', async (req, res) => {
  try {
    const { amount, currency = 'INR', method, orderId } = req.body;

    // Validate payment data
    const paymentValidation = validatePayment({ amount, method });
    if (!paymentValidation.isValid) {
      return res.status(400).json({
        error: 'Invalid payment data',
        details: paymentValidation.errors
      });
    }

    // Verify order exists and belongs to user
    const order = await Order.findById(orderId);
    if (!order || order.userId !== req.user.userId) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Create payment intent based on method
    let paymentIntent;

    if (method === 'stripe') {
      // Stripe payment intent
      const stripe = require('stripe')(paymentGateways.stripe.secretKey);
      
      paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        metadata: {
          orderId: orderId,
          userId: req.user.userId
        },
        automatic_payment_methods: {
          enabled: true
        }
      });

    } else if (method === 'razorpay') {
      // Razorpay order
      const Razorpay = require('razorpay');
      const razorpay = new Razorpay({
        key_id: paymentGateways.razorpay.keyId,
        key_secret: paymentGateways.razorpay.keySecret
      });

      paymentIntent = await razorpay.orders.create({
        amount: Math.round(amount * 100), // Convert to paise
        currency: currency,
        receipt: orderId,
        notes: {
          userId: req.user.userId,
          orderId: orderId
        }
      });
    } else {
      return res.status(400).json({ error: 'Unsupported payment method' });
    }

    // Update order with payment intent ID
    order.paymentIntentId = paymentIntent.id;
    order.paymentMethod = method;
    await order.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: amount,
      currency: currency
    });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Confirm payment
router.post('/confirm', async (req, res) => {
  try {
    const { paymentIntentId, paymentMethod, orderId } = req.body;

    // Verify order exists
    const order = await Order.findById(orderId);
    if (!order || order.userId !== req.user.userId) {
      return res.status(404).json({ error: 'Order not found' });
    }

    let paymentStatus;

    if (paymentMethod === 'stripe') {
      const stripe = require('stripe')(paymentGateways.stripe.secretKey);
      
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      paymentStatus = paymentIntent.status;

    } else if (paymentMethod === 'razorpay') {
      const Razorpay = require('razorpay');
      const razorpay = new Razorpay({
        key_id: paymentGateways.razorpay.keyId,
        key_secret: paymentGateways.razorpay.keySecret
      });

      const payment = await razorpay.payments.fetch(paymentIntentId);
      paymentStatus = payment.status === 'captured' ? 'succeeded' : 'failed';
    }

    if (paymentStatus === 'succeeded') {
      // Update order status
      order.status = 'confirmed';
      order.paymentStatus = 'paid';
      order.paidAt = new Date();
      await order.save();

      // Send confirmation email
      // await emailService.sendOrderConfirmation(order);

      res.json({
        success: true,
        message: 'Payment successful',
        orderId: order._id
      });

    } else {
      // Update order with failed payment
      order.paymentStatus = 'failed';
      order.status = 'payment_failed';
      await order.save();

      res.status(400).json({
        success: false,
        message: 'Payment failed',
        status: paymentStatus
      });
    }

  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

// Stripe webhook handler
router.post('/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const stripe = require('stripe')(paymentGateways.stripe.secretKey);
    event = stripe.webhooks.constructEvent(req.body, sig, paymentGateways.stripe.webhookSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await handleSuccessfulPayment(paymentIntent, 'stripe');
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      await handleFailedPayment(failedPayment, 'stripe');
      break;

    case 'payment_intent.canceled':
      const canceledPayment = event.data.object;
      await handleCanceledPayment(canceledPayment, 'stripe');
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// Razorpay webhook handler
router.post('/razorpay-webhook', async (req, res) => {
  const secret = paymentGateways.razorpay.webhookSecret;
  const crypto = require('crypto');

  // Verify webhook signature
  const shasum = crypto.createHmac('sha256', secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  if (digest !== req.headers['x-razorpay-signature']) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  const event = req.body.event;

  switch (event) {
    case 'payment.captured':
      const payment = req.body.payload.payment.entity;
      await handleSuccessfulPayment(payment, 'razorpay');
      break;

    case 'payment.failed':
      const failedPayment = req.body.payload.payment.entity;
      await handleFailedPayment(failedPayment, 'razorpay');
      break;

    default:
      console.log(`Unhandled Razorpay event: ${event}`);
  }

  res.json({ status: 'ok' });
});

// Handle successful payment
const handleSuccessfulPayment = async (payment, gateway) => {
  try {
    const orderId = payment.metadata?.orderId || payment.receipt;
    
    const order = await Order.findById(orderId);
    if (!order) return;

    order.status = 'confirmed';
    order.paymentStatus = 'paid';
    order.paidAt = new Date();
    order.paymentGateway = gateway;
    order.gatewayTransactionId = payment.id;
    
    await order.save();

    // Log successful payment
    console.log(`Payment successful via ${gateway}:`, {
      orderId: order._id,
      amount: payment.amount,
      transactionId: payment.id
    });

    // Send confirmation email
    // await emailService.sendOrderConfirmation(order);

  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
};

// Handle failed payment
const handleFailedPayment = async (payment, gateway) => {
  try {
    const orderId = payment.metadata?.orderId || payment.receipt;
    
    const order = await Order.findById(orderId);
    if (!order) return;

    order.paymentStatus = 'failed';
    order.status = 'payment_failed';
    order.paymentGateway = gateway;
    order.gatewayTransactionId = payment.id;
    
    await order.save();

    // Log failed payment
    console.error(`Payment failed via ${gateway}:`, {
      orderId: order._id,
      amount: payment.amount,
      transactionId: payment.id,
      error: payment.error
    });

    // Send failure notification
    // await emailService.sendPaymentFailureNotification(order);

  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
};

// Handle canceled payment
const handleCanceledPayment = async (payment, gateway) => {
  try {
    const orderId = payment.metadata?.orderId;
    
    const order = await Order.findById(orderId);
    if (!order) return;

    order.paymentStatus = 'canceled';
    order.status = 'canceled';
    order.paymentGateway = gateway;
    order.gatewayTransactionId = payment.id;
    
    await order.save();

    console.log(`Payment canceled via ${gateway}:`, {
      orderId: order._id,
      transactionId: payment.id
    });

  } catch (error) {
    console.error('Error handling canceled payment:', error);
  }
};

// Refund payment
router.post('/refund', async (req, res) => {
  try {
    const { orderId, amount, reason } = req.body;

    // Verify order exists and belongs to user
    const order = await Order.findById(orderId);
    if (!order || order.userId !== req.user.userId) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.paymentStatus !== 'paid') {
      return res.status(400).json({ 
        error: 'Order must be paid to process refund' 
      });
    }

    let refund;

    if (order.paymentGateway === 'stripe') {
      const stripe = require('stripe')(paymentGateways.stripe.secretKey);
      
      refund = await stripe.refunds.create({
        payment_intent: order.gatewayTransactionId,
        amount: amount ? Math.round(amount * 100) : undefined,
        reason: reason || 'requested_by_customer',
        metadata: {
          orderId: orderId,
          userId: req.user.userId
        }
      });

    } else if (order.paymentGateway === 'razorpay') {
      const Razorpay = require('razorpay');
      const razorpay = new Razorpay({
        key_id: paymentGateways.razorpay.keyId,
        key_secret: paymentGateways.razorpay.keySecret
      });

      refund = await razorpay.payments.refund(order.gatewayTransactionId, {
        amount: amount ? Math.round(amount * 100) : undefined
      });
    }

    // Update order status
    order.status = 'refunded';
    order.refundAmount = amount || order.totalAmount;
    order.refundedAt = new Date();
    order.refundReason = reason;
    
    await order.save();

    res.json({
      success: true,
      message: 'Refund processed successfully',
      refundId: refund.id,
      amount: refund.amount / 100
    });

  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ error: 'Failed to process refund' });
  }
});

// Get payment methods
router.get('/methods', (req, res) => {
  const methods = [
    {
      id: 'stripe',
      name: 'Credit/Debit Card',
      type: 'card',
      supported: true,
      icon: 'credit-card'
    },
    {
      id: 'razorpay',
      name: 'Razorpay',
      type: 'wallet',
      supported: true,
      icon: 'wallet'
    },
    {
      id: 'upi',
      name: 'UPI',
      type: 'upi',
      supported: true,
      icon: 'smartphone'
    },
    {
      id: 'net_banking',
      name: 'Net Banking',
      type: 'bank',
      supported: true,
      icon: 'university'
    }
  ];

  res.json({ methods });
});

module.exports = router;
