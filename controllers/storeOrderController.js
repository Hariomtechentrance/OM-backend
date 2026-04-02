import StoreOrder from '../models/StoreOrder.js';
import Product from '../models/Product.js';

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
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    if (!orderItems?.length) {
      return res.status(400).json({ message: 'No order items' });
    }

    if (paymentMethod === 'cod') {
      if (
        !codConfirmation?.paid ||
        Number(codConfirmation?.amount) < 100 ||
        !codConfirmation?.razorpayPaymentId
      ) {
        return res.status(400).json({
          message: 'COD requires a ₹100 confirmation payment'
        });
      }
    }

    const lines = [];
    const productsToSave = [];

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

      const price = Number(item.price) || product.price;
      const size = item.size || 'Default';
      const color = item.color || 'Default';
      const name = item.name || product.name;
      const image =
        item.image ||
        (product.images?.[0]?.url ? product.images[0].url : '') ||
        (typeof product.images?.[0] === 'string' ? product.images[0] : '');

      reduceLineStock(product, qty, size, color);
      productsToSave.push(product);

      lines.push({
        product: product._id,
        name,
        price,
        quantity: qty,
        size,
        color,
        image,
        subtotal: price * qty
      });
    }

    const order = await StoreOrder.create({
      orderNumber: StoreOrder.generateOrderNumber(),
      user: req.user._id,
      items: lines,
      shippingAddress,
      paymentMethod: paymentMethod || 'razorpay',
      paymentStatus: paymentMethod === 'cod' ? 'paid' : 'pending',
      itemsPrice: Number(itemsPrice) || 0,
      taxPrice: Number(taxPrice) || 0,
      shippingPrice: Number(shippingPrice) || 0,
      totalPrice: Number(totalPrice) || lines.reduce((s, l) => s + l.subtotal, 0),
      codConfirmation: paymentMethod === 'cod' ? codConfirmation : undefined,
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
