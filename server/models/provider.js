const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['Stays', 'Meals', 'Transport', 'Tours', 'Culture', 'Events']
  },
  region: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String
  },
  // Additional fields for approved providers
  isVerified: {
    type: Boolean,
    default: false
  },
  businessLicense: {
    type: String
  },
  contactPhone: {
    type: String
  },
  address: {
    type: String
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }]
}, {
  timestamps: true
});

// Index for efficient queries
providerSchema.index({ email: 1 });
providerSchema.index({ status: 1 });
providerSchema.index({ serviceType: 1 });
providerSchema.index({ submittedAt: -1 });

module.exports = mongoose.model('Provider', providerSchema);
