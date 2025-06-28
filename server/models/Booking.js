import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingDetails: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: Date,
    duration: Number, // in hours or days
    participants: {
      adults: { type: Number, default: 1, min: 1 },
      children: { type: Number, default: 0, min: 0 },
      infants: { type: Number, default: 0, min: 0 }
    },
    specialRequests: String,
    contactInfo: {
      phone: String,
      email: String,
      emergencyContact: {
        name: String,
        phone: String,
        relationship: String
      }
    }
  },
  pricing: {
    baseAmount: { type: Number, required: true },
    discounts: [{
      type: String,
      amount: Number,
      percentage: Number
    }],
    taxes: [{
      name: String,
      amount: Number,
      percentage: Number
    }],
    fees: [{
      name: String,
      amount: Number
    }],
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: 'USD' }
  },
  payment: {
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['stripe', 'mpesa', 'bank_transfer', 'cash']
    },
    transactionId: String,
    mpesaReceiptNumber: String,
    stripePaymentIntentId: String,
    paidAmount: { type: Number, default: 0 },
    refundAmount: { type: Number, default: 0 },
    paymentDate: Date,
    dueDate: Date
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'],
    default: 'pending'
  },
  cancellation: {
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cancelledAt: Date,
    reason: String,
    refundAmount: Number,
    refundStatus: {
      type: String,
      enum: ['pending', 'processed', 'failed']
    }
  },
  communication: [{
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['message', 'system', 'reminder']
    }
  }],
  review: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    images: [String],
    reviewDate: Date
  },
  metadata: {
    source: String, // web, mobile, api
    userAgent: String,
    ipAddress: String,
    referrer: String
  }
}, {
  timestamps: true
});

// Generate unique booking ID
bookingSchema.pre('save', async function(next) {
  if (!this.bookingId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.bookingId = `BK-${timestamp}-${random}`.toUpperCase();
  }
  next();
});

// Indexes
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ provider: 1, status: 1 });
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ 'bookingDetails.startDate': 1 });

export default mongoose.model('Booking', bookingSchema);