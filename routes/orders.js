const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { validateOrder, generateSecureToken } = require('../middleware/security');

const router = express.Router();

// Create new order with security checks
router.post('/create', async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      const orderData = req.body;

      // Validate order data
      const orderValidation = validateOrder(orderData);
      if (!orderValidation.isValid) {
        return res.status(400).json({
          error: 'Invalid order data',
          details: orderValidation.errors
        });
      }

      // Calculate total amount
      let totalAmount = 0;
      const orderItems = [];

      // Check product availability and calculate total
      for (const item of orderData.items) {
        const product = await Product.findById(item.productId).session(session);
        
        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        // Check stock
        const sizeStock = product.sizes.find(s => 
          s.name === item.size || s.size === item.size
        );
        
        if (!sizeStock || sizeStock.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        // Calculate item total
        const itemPrice = sizeStock.price || product.price;
        const itemTotal = itemPrice * item.quantity;
        totalAmount += itemTotal;

        orderItems.push({
          productId: product._id,
          name: product.name,
          price: itemPrice,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: product.images[0],
          subtotal: itemTotal
        });

        // Update stock atomically
        sizeStock.stock -= item.quantity;
        await product.save({ session });
      }

      // Generate unique order number
      const orderNumber = 'BL' + Date.now() + Math.floor(Math.random() * 1000);

      // Create order
      const order = new Order({
        orderNumber,
        userId: req.user.userId,
        items: orderItems,
        totalAmount,
        shippingAddress: orderData.shippingAddress,
        billingAddress: orderData.billingAddress || orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        status: 'pending',
        paymentStatus: 'pending',
        orderDate: new Date(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        trackingNumber: null,
        notes: orderData.notes || '',
        securityContext: {
          ipAddress: req.securityContext?.clientIP,
          userAgent: req.securityContext?.userAgent,
          timestamp: req.securityContext?.timestamp
        }
      });

      await order.save({ session });

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          status: order.status,
          estimatedDelivery: order.estimatedDelivery
        }
      });
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Order creation error:', error);
    
    if (error.message.includes('not found') || error.message.includes('Insufficient stock')) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ 
      error: 'Failed to create order',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    session.endSession();
  }
});

// Get user orders with pagination
router.get('/my-orders', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ userId: req.user.userId })
      .sort({ orderDate: -1 })
      .skip(skip)
      .limit(limit)
      .select('-securityContext'); // Exclude security context from response

    const total = await Order.countDocuments({ userId: req.user.userId });

    res.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order details
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ 
      _id: orderId, 
      userId: req.user.userId 
    }).select('-securityContext');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Cancel order with security checks
router.post('/:orderId/cancel', async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      const { orderId } = req.params;
      const { reason } = req.body;

      const order = await Order.findOne({ 
        _id: orderId, 
        userId: req.user.userId 
      }).session(session);

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Check if order can be canceled
      const cancelableStatuses = ['pending', 'confirmed'];
      if (!cancelableStatuses.includes(order.status)) {
        return res.status(400).json({ 
          error: 'Order cannot be canceled at this stage' 
        });
      }

      // Restore stock
      for (const item of order.items) {
        const product = await Product.findById(item.productId).session(session);
        
        if (product) {
          const sizeStock = product.sizes.find(s => 
            s.name === item.size || s.size === item.size
          );
          
          if (sizeStock) {
            sizeStock.stock += item.quantity;
            await product.save({ session });
          }
        }
      }

      // Update order status
      order.status = 'canceled';
      order.canceledAt = new Date();
      order.cancellationReason = reason || 'Customer requested cancellation';
      
      await order.save({ session });

      res.json({
        success: true,
        message: 'Order canceled successfully',
        refundInfo: order.paymentStatus === 'paid' ? 
          'Refund will be processed within 5-7 business days' : 
          'No payment to refund'
      });
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Order cancellation error:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  } finally {
    session.endSession();
  }
});

// Update order status (admin only)
router.put('/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber, notes } = req.body;

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Validate status transition
    const validTransitions = {
      'pending': ['confirmed', 'canceled'],
      'confirmed': ['processing', 'canceled'],
      'processing': ['shipped', 'canceled'],
      'shipped': ['delivered'],
      'delivered': [], // Final state
      'canceled': [], // Final state
      'refunded': [] // Final state
    };

    if (!validTransitions[order.status]?.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status transition' 
      });
    }

    // Update order
    order.status = status;
    
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    
    if (status === 'shipped') {
      order.shippedAt = new Date();
    }
    
    if (status === 'delivered') {
      order.deliveredAt = new Date();
    }

    if (notes) {
      order.adminNotes = notes;
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        trackingNumber: order.trackingNumber
      }
    });

  } catch (error) {
    console.error('Order status update error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Track order
router.get('/:orderId/track', async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ 
      _id: orderId, 
      userId: req.user.userId 
    }).select('orderNumber status trackingNumber shippedAt deliveredAt estimatedDelivery items');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const tracking = {
      orderNumber: order.orderNumber,
      status: order.status,
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery,
      shippedAt: order.shippedAt,
      deliveredAt: order.deliveredAt,
      timeline: generateOrderTimeline(order)
    };

    res.json({ tracking });

  } catch (error) {
    console.error('Order tracking error:', error);
    res.status(500).json({ error: 'Failed to track order' });
  }
});

// Generate order timeline
const generateOrderTimeline = (order) => {
  const timeline = [
    {
      status: 'pending',
      title: 'Order Placed',
      description: 'Your order has been received',
      timestamp: order.orderDate,
      completed: true
    }
  ];

  if (order.status === 'confirmed' || ['processing', 'shipped', 'delivered'].includes(order.status)) {
    timeline.push({
      status: 'confirmed',
      title: 'Order Confirmed',
      description: 'Your order has been confirmed and is being processed',
      timestamp: order.confirmedAt || order.orderDate,
      completed: true
    });
  }

  if (order.status === 'processing' || ['shipped', 'delivered'].includes(order.status)) {
    timeline.push({
      status: 'processing',
      title: 'Order Processing',
      description: 'Your order is being prepared for shipment',
      timestamp: order.processingAt,
      completed: true
    });
  }

  if (order.status === 'shipped' || order.status === 'delivered') {
    timeline.push({
      status: 'shipped',
      title: 'Order Shipped',
      description: `Your order has been shipped. Tracking: ${order.trackingNumber}`,
      timestamp: order.shippedAt,
      completed: true
    });
  }

  if (order.status === 'delivered') {
    timeline.push({
      status: 'delivered',
      title: 'Order Delivered',
      description: 'Your order has been delivered successfully',
      timestamp: order.deliveredAt,
      completed: true
    });
  }

  if (order.status === 'canceled') {
    timeline.push({
      status: 'canceled',
      title: 'Order Canceled',
      description: order.cancellationReason || 'Order was canceled',
      timestamp: order.canceledAt,
      completed: true
    });
  }

  return timeline;
};

// Get order analytics (admin only)
router.get('/analytics/summary', async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.orderDate = {};
      if (startDate) dateFilter.orderDate.$gte = new Date(startDate);
      if (endDate) dateFilter.orderDate.$lte = new Date(endDate);
    }

    const summary = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: '$count' },
          totalRevenue: { $sum: '$totalAmount' },
          statusBreakdown: {
            $push: {
              status: '$_id',
              count: '$count',
              amount: '$totalAmount'
            }
          }
        }
      }
    ]);

    res.json({
      summary: summary[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        statusBreakdown: []
      }
    });

  } catch (error) {
    console.error('Order analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch order analytics' });
  }
});

module.exports = router;
