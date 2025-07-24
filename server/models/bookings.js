const mongoose = require("mongoose");

// Cart Item Schema for individual items in cart
const cartItemSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  quantity: { type: Number, default: 1, min: 1 },
  price: { type: Number, required: true },
  startDate: Date,
  endDate: Date,
  guests: { type: Number, default: 1 },
  specialRequests: String
});

// Trip Cart Schema
const tripCartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [cartItemSchema],
  totalAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'checkout', 'completed'], default: 'active' },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 24*60*60*1000) } // 24 hours
}, { timestamps: true });

// Enhanced Booking Schema
const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tripCartId: { type: mongoose.Schema.Types.ObjectId, ref: "TripCart" },
  bookingReference: { type: String, unique: true },
  items: [{
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quantity: { type: Number, default: 1 },
    price: { type: Number, required: true },
    startDate: Date,
    endDate: Date,
    guests: { type: Number, default: 1 },
    specialRequests: String,
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' }
  }],
  contactInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'processing', 'completed', 'failed', 'refunded'], default: 'pending' },
  paymentMethod: String,
  paymentReference: String,
  notes: String
}, { timestamps: true });

// Payment Schema
const paymentSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'KES' },
  method: { type: String, enum: ['stripe', 'mpesa', 'card'], required: true },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed', 'refunded'], default: 'pending' },
  transactionId: String,
  stripePaymentIntentId: String,
  mpesaTransactionId: String,
  metadata: mongoose.Schema.Types.Mixed
}, { timestamps: true });

// Generate booking reference
bookingSchema.pre('save', function(next) {
  if (!this.bookingReference) {
    this.bookingReference = 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  next();
});

module.exports = {
  TripCart: mongoose.model("TripCart", tripCartSchema),
  Booking: mongoose.model("Booking", bookingSchema),
  Payment: mongoose.model("Payment", paymentSchema)
};