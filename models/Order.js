const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    size: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    image: {
      type: String
    },
    subtotal: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: 'India' }
  },
  billingAddress: {
    name: { type: String },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String, default: 'India' }
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['credit_card', 'debit_card', 'upi', 'net_banking', 'wallet', 'cod']
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  paymentGateway: {
    type: String,
    enum: ['stripe', 'razorpay', 'cod', null]
  },
  gatewayTransactionId: {
    type: String,
    sparse: true
  },
  paymentIntentId: {
    type: String,
    sparse: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'canceled', 'refunded'],
    default: 'pending'
  },
  orderDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  confirmedAt: {
    type: Date
  },
  processingAt: {
    type: Date
  },
  shippedAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  canceledAt: {
    type: Date
  },
  refundedAt: {
    type: Date
  },
  estimatedDelivery: {
    type: Date
  },
  trackingNumber: {
    type: String,
    sparse: true
  },
  cancellationReason: {
    type: String
  },
  refundAmount: {
    type: Number,
    min: 0
  },
  refundReason: {
    type: String
  },
  notes: {
    type: String,
    maxlength: 500
  },
  adminNotes: {
    type: String,
    maxlength: 500
  },
  // Security fields
  securityContext: {
    ipAddress: { type: String },
    userAgent: { type: String },
    timestamp: { type: String }
  },
  // Audit fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastModifiedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
orderSchema.index({ userId: 1, orderDate: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ orderDate: 1 });

// Virtuals
orderSchema.virtual('isCancellable').get(function() {
  const cancelableStatuses = ['pending', 'confirmed'];
  return cancelableStatuses.includes(this.status);
});

orderSchema.virtual('isRefundable').get(function() {
  return this.paymentStatus === 'paid' && 
         !['refunded', 'partially_refunded'].includes(this.paymentStatus);
});

orderSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    'pending': 'Pending',
    'confirmed': 'Confirmed',
    'processing': 'Processing',
    'shipped': 'Shipped',
    'delivered': 'Delivered',
    'canceled': 'Canceled',
    'refunded': 'Refunded'
  };
  return statusMap[this.status] || this.status;
});

orderSchema.virtual('paymentStatusDisplay').get(function() {
  const statusMap = {
    'pending': 'Pending',
    'paid': 'Paid',
    'failed': 'Failed',
    'refunded': 'Refunded',
    'partially_refunded': 'Partially Refunded'
  };
  return statusMap[this.paymentStatus] || this.paymentStatus;
});

// Pre-save middleware
orderSchema.pre('save', function(next) {
  this.lastModifiedAt = new Date();
  next();
});

// Static methods
orderSchema.statics.generateOrderNumber = function() {
  return 'BL' + Date.now() + Math.floor(Math.random() * 1000);
};

orderSchema.statics.findByOrderNumber = function(orderNumber) {
  return this.findOne({ orderNumber: orderNumber });
};

orderSchema.statics.findUserOrders = function(userId, options = {}) {
  const query = { userId };
  
  if (options.status) {
    query.status = options.status;
  }
  
  if (options.paymentStatus) {
    query.paymentStatus = options.paymentStatus;
  }
  
  if (options.startDate || options.endDate) {
    query.orderDate = {};
    if (options.startDate) query.orderDate.$gte = new Date(options.startDate);
    if (options.endDate) query.orderDate.$lte = new Date(options.endDate);
  }
  
  return this.find(query)
    .sort({ orderDate: -1 })
    .limit(options.limit || 10)
    .skip(options.skip || 0);
};

// Instance methods
orderSchema.methods.canBeCanceled = function() {
  const cancelableStatuses = ['pending', 'confirmed'];
  return cancelableStatuses.includes(this.status);
};

orderSchema.methods.canBeRefunded = function() {
  return this.paymentStatus === 'paid' && 
         !['refunded', 'partially_refunded'].includes(this.paymentStatus);
};

orderSchema.methods.updateStatus = function(newStatus, adminId) {
  const validTransitions = {
    'pending': ['confirmed', 'canceled'],
    'confirmed': ['processing', 'canceled'],
    'processing': ['shipped', 'canceled'],
    'shipped': ['delivered'],
    'delivered': [],
    'canceled': [],
    'refunded': []
  };
  
  if (!validTransitions[this.status]?.includes(newStatus)) {
    throw new Error(`Invalid status transition from ${this.status} to ${newStatus}`);
  }
  
  this.status = newStatus;
  this.lastModifiedBy = adminId;
  this.lastModifiedAt = new Date();
  
  // Set timestamps based on status
  const now = new Date();
  switch (newStatus) {
    case 'confirmed':
      this.confirmedAt = now;
      break;
    case 'processing':
      this.processingAt = now;
      break;
    case 'shipped':
      this.shippedAt = now;
      break;
    case 'delivered':
      this.deliveredAt = now;
      break;
    case 'canceled':
      this.canceledAt = now;
      break;
    case 'refunded':
      this.refundedAt = now;
      break;
  }
  
  return this;
};

orderSchema.methods.addTracking = function(trackingNumber, adminId) {
  this.trackingNumber = trackingNumber;
  this.lastModifiedBy = adminId;
  this.lastModifiedAt = new Date();
  return this;
};

orderSchema.methods.processRefund = function(refundAmount, reason, adminId) {
  if (!this.canBeRefunded()) {
    throw new Error('Order cannot be refunded');
  }
  
  this.refundAmount = refundAmount;
  this.refundReason = reason;
  this.paymentStatus = refundAmount >= this.totalAmount ? 'refunded' : 'partially_refunded';
  this.refundedAt = new Date();
  this.lastModifiedBy = adminId;
  this.lastModifiedAt = new Date();
  
  return this;
};

// Query helpers
orderSchema.query.byStatus = function(status) {
  return this.where({ status });
};

orderSchema.query.byPaymentStatus = function(paymentStatus) {
  return this.where({ paymentStatus });
};

orderSchema.query.byDateRange = function(startDate, endDate) {
  const query = {};
  if (startDate) query.orderDate = { $gte: new Date(startDate) };
  if (endDate) query.orderDate = { ...query.orderDate, $lte: new Date(endDate) };
  return this.where(query);
};

module.exports = mongoose.model('Order', orderSchema);
