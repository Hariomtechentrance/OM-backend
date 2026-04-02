import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String, default: 'Default' },
    color: { type: String, default: 'Default' },
    image: { type: String, default: '' },
    subtotal: { type: Number, required: true, min: 0 }
  },
  { _id: true }
);

const storeOrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    items: [orderItemSchema],
    shippingAddress: { type: mongoose.Schema.Types.Mixed, required: true },
    paymentMethod: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    itemsPrice: { type: Number, default: 0 },
    taxPrice: { type: Number, default: 0 },
    shippingPrice: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    codConfirmation: { type: mongoose.Schema.Types.Mixed },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String }
  },
  { timestamps: true }
);

storeOrderSchema.statics.generateOrderNumber = function gen() {
  return `BL-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
};

export default mongoose.model('StoreOrder', storeOrderSchema);
