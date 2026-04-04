import StoreOrder from '../models/StoreOrder.js';
import Product from '../models/Product.js';
import { getSiteSettingsDoc } from '../utils/siteSettings.js';
import { effectiveDiscountPercent, priceAfterDiscount } from '../utils/discountPricing.js';

const adminRoles = ['admin', 'super admin'];

function availableStock(product) {
  if (typeof product.totalStock === 'number') return product.totalStock;
  return (product.sizes || []).reduce((n, s) => n + (Number(s.stock) || 0), 0);
}

function reduceLineStock(product, quantity, size, color) {
  if (typeof product.totalStock === 'number') {
    product.totalStock = Math.max(0, product.totalStock - quantity);
  }
  const normSize = size && size !== 'default' ? size : null;
  if (normSize && Array.isArray(product.sizes)) {
    const row = product.sizes.find((s) => s.size === normSize);
    if (row) {
      row.stock = Math.max(0, (Number(row.stock) || 0) - quantity);
    }
  }
}

function restoreLineStock(product, quantity, size) {
  if (typeof product.totalStock === 'number') {
    product.totalStock += quantity;
  }
  const normSize = size && size !== 'default' ? size : null;
  if (normSize && Array.isArray(product.sizes)) {
    const row = product.sizes.find((s) => s.size === normSize);
    if (row) row.stock = (Number(row.stock) || 0) + quantity;
  }
}

// POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      codConfirmation,
      promoCode
    } = req.body;

    if (!orderItems?.length) {
      return res.status(400).json({ message: 'No order items' });
    }

    if (!shippingAddress || typeof shippingAddress !== 'object') {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    // Basic shipping address validation to reduce fraud & bad data.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneStr = String(shippingAddress.phone || '');
    
    // Check if we have either fullName OR both firstName and lastName
    const hasName = shippingAddress.fullName || (shippingAddress.firstName && shippingAddress.lastName);
    
    // Improved phone validation for Indian numbers
    const cleanPhone = phoneStr.replace(/\D/g, '');
    const isValidPhone = cleanPhone.length >= 10 && cleanPhone.length <= 12;
    
    if (
      !hasName ||
      !shippingAddress.email ||
      !emailRegex.test(shippingAddress.email) ||
      !phoneStr ||
      !isValidPhone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode ||
      !shippingAddress.country
    ) {
      return res.status(400).json({ 
        message: 'Invalid shipping address',
        missingFields: {
          name: !hasName ? 'fullName or firstName+lastName required' : null,
          email: !shippingAddress.email ? 'Valid email required' : null,
          phone: !isValidPhone ? 'Valid phone required (10-12 digits)' : null,
          address: !shippingAddress.address ? 'Address required' : null,
          city: !shippingAddress.city ? 'City required' : null,
          state: !shippingAddress.state ? 'State required' : null,
          pincode: !shippingAddress.pincode ? 'Pincode required' : null,
          country: !shippingAddress.country ? 'Country required' : null
        }
      });
    }

    const normalizedPaymentMethod = paymentMethod === 'cod' ? 'cod' : 'razorpay';

    if (normalizedPaymentMethod === 'cod') {
      if (
        !codConfirmation?.paid ||
        Number(codConfirmation?.amount) < 100
      ) {
        return res.status(400).json({
          message: 'COD requires a ₹100 confirmation payment'
        });
      }
    }

    const lines = [];
    const productsToSave = [];
    const siteSettings = await getSiteSettingsDoc();

    for (const item of orderItems) {
      const productId = item.product || item.productId;
      if (!productId) {
        return res.status(400).json({ message: 'Each item must include a product id' });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${productId}` });
      }

      const qty = Number(item.quantity) || 0;
      if (qty < 1) {
        return res.status(400).json({ message: 'Invalid quantity' });
      }

      if (availableStock(product) < qty) {
        return res.status(400).json({
          message: `Insufficient stock for: ${product.name}`
        });
      }

      // Prevent price tampering: list price from DB, discount computed server-side.
      const listPrice = Number(product.price);
      if (!Number.isFinite(listPrice) || listPrice < 0) {
        return res.status(400).json({ message: 'Invalid product price' });
      }
      const discPct = effectiveDiscountPercent(product, siteSettings);
      const unitPrice = priceAfterDiscount(listPrice, discPct);
      const size = item.size || 'Default';
      const color = item.color || 'Default';
      const name = item.name || product.name;
      const image =
        item.image ||
        (product.images?.[0]?.url ? product.images[0].url : '') ||
        (typeof product.images?.[0] === 'string' ? product.images[0] : '');
      const skuCode =
        typeof product.skuCode === 'string' && product.skuCode.trim()
          ? product.skuCode.trim()
          : '';

      reduceLineStock(product, qty, size, color);
      productsToSave.push(product);

      lines.push({
        product: product._id,
        name,
        skuCode,
        listPrice,
        discountPercentApplied: discPct,
        price: unitPrice,
        quantity: qty,
        size,
        color,
        image,
        subtotal: unitPrice * qty
      });
    }

    // Only allow known promo codes (client cannot force discounts).
    const normalizedPromo = typeof promoCode === 'string' ? promoCode.trim().toLowerCase() : '';
    const itemsPriceComputed = lines.reduce((sum, l) => sum + l.subtotal, 0);
    const shippingPriceComputed = itemsPriceComputed > 999 ? 0 : 50;
    const taxPriceComputed = 0;
    const discountComputed = normalizedPromo === 'save10' ? itemsPriceComputed * 0.1 : 0;
    const totalPriceComputed = Math.max(
      0,
      itemsPriceComputed + shippingPriceComputed - discountComputed
    );

    const order = await StoreOrder.create({
      orderNumber: StoreOrder.generateOrderNumber(),
      user: req.user._id,
      items: lines,
      shippingAddress,
      paymentMethod: normalizedPaymentMethod,
      paymentStatus: normalizedPaymentMethod === 'cod' ? 'paid' : 'pending',
      itemsPrice: Number(itemsPriceComputed) || 0,
      taxPrice: Number(taxPriceComputed) || 0,
      shippingPrice: Number(shippingPriceComputed) || 0,
      totalPrice: Math.round(totalPriceComputed * 100) / 100,
      codConfirmation: normalizedPaymentMethod === 'cod' ? codConfirmation : undefined,
      status: 'pending'
    });

    await Promise.all(productsToSave.map((p) => p.save()));

    return res.status(201).json(order.toObject());
  } catch (err) {
    console.error('createOrder:', err);
    return res.status(500).json({ message: err.message || 'Failed to create order' });
  }
};

// PUT /api/orders/:id/cancel
export const cancelOrder = async (req, res) => {
  try {
    const order = await StoreOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (
      String(order.user) !== String(req.user._id) &&
      !adminRoles.includes(req.user.role)
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (order.status === 'cancelled') {
      return res.json(order);
    }

    if (order.status !== 'pending' && order.paymentStatus !== 'pending') {
      return res.status(400).json({
        message: 'Only unpaid or pending orders can be cancelled this way'
      });
    }

    for (const line of order.items) {
      const product = await Product.findById(line.product);
      if (product) {
        restoreLineStock(product, line.quantity, line.size);
        await product.save();
      }
    }

    order.status = 'cancelled';
    await order.save();

    return res.json(order.toObject());
  } catch (err) {
    console.error('cancelOrder:', err);
    return res.status(500).json({ message: err.message || 'Cancel failed' });
  }
};

// GET /api/orders/my-orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await StoreOrder.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ success: true, orders });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await StoreOrder.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (
      String(order.user) !== String(req.user._id) &&
      !adminRoles.includes(req.user.role)
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// GET /api/orders/:id/track
export const getOrderTrack = async (req, res) => {
  try {
    const order = await StoreOrder.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (
      String(order.user) !== String(req.user._id) &&
      !adminRoles.includes(req.user.role)
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const trackingNumber = order.shiprocket?.awbNumber;
    const trackingUrl = order.shiprocket?.trackingUrl;

    const timeline = [
      {
        status: 'pending',
        title: 'Order Placed',
        description: 'Your order has been received',
        timestamp: order.createdAt,
        completed: true
      }
    ];

    if (['processing', 'shipped', 'delivered'].includes(order.status)) {
      timeline.push({
        status: 'processing',
        title: 'Order Processing',
        description: 'Your order is being prepared for shipment',
        timestamp: order.updatedAt,
        completed: true
      });
    }

    if (['shipped', 'delivered'].includes(order.status)) {
      timeline.push({
        status: 'shipped',
        title: 'Order Shipped',
        description: trackingNumber
          ? `Your order has shipped. AWB: ${trackingNumber}`
          : 'Your order has shipped',
        timestamp: order.updatedAt,
        completed: true
      });
    }

    if (order.status === 'delivered') {
      timeline.push({
        status: 'delivered',
        title: 'Order Delivered',
        description: 'Your order has been delivered successfully',
        timestamp: order.updatedAt,
        completed: true
      });
    }

    if (order.status === 'cancelled') {
      timeline.push({
        status: 'cancelled',
        title: 'Order Cancelled',
        description: 'Your order has been cancelled',
        timestamp: order.updatedAt,
        completed: true
      });
    }

    return res.json({
      success: true,
      tracking: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        trackingNumber,
        trackingUrl,
        timeline
      }
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Track failed' });
  }
};

// GET /api/orders/admin/all
export const getAllOrdersAdmin = async (req, res) => {
  try {
    if (!adminRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const orders = await StoreOrder.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ success: true, orders });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to fetch orders' });
  }
};

// PUT /api/orders/:id/status (admin)
export const updateOrderStatusAdmin = async (req, res) => {
  try {
    if (!adminRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { status } = req.body;
    const allowed = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await StoreOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    if (status === 'cancelled') order.paymentStatus = order.paymentStatus === 'paid' ? 'paid' : 'failed';
    await order.save();

    return res.json({ success: true, order: order.toObject() });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to update order status' });
  }
};
