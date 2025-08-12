const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Response must belong to a user']
  },
  message: {
    type: String,
    required: [true, 'Please provide a message']
  },
  isInternal: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const supportTicketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Ticket must belong to a user']
  },
  subject: {
    type: String,
    required: [true, 'Please provide a subject'],
    trim: true,
    maxlength: [200, 'Subject cannot be more than 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Please provide a message']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: {
      values: ['booking', 'payment', 'account', 'service', 'other'],
      message: 'Category is either: booking, payment, account, service, other'
    }
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'waiting', 'resolved', 'closed'],
    default: 'open'
  },
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  responses: [responseSchema],
  firstResponseTime: Number,
  closedAt: Date,
  closedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate ticket ID before saving
supportTicketSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await this.constructor.countDocuments();
    this.ticketId = `TKT-${10000 + count}`;
  }
  next();
});

// Calculate first response time
supportTicketSchema.methods.calculateFirstResponseTime = function() {
  if (this.responses.length === 1 && this.status === 'in_progress') {
    const responseTime = this.responses[0].createdAt - this.createdAt;
    this.firstResponseTime = responseTime / (1000 * 60); // in minutes
  }
};

// Update first response time after saving responses
supportTicketSchema.post('save', function(doc) {
  if (doc.responses && doc.responses.length === 1) {
    doc.calculateFirstResponseTime();
    if (doc.isModified('firstResponseTime')) {
      return doc.constructor.findByIdAndUpdate(doc._id, { 
        firstResponseTime: doc.firstResponseTime 
      });
    }
  }
  return Promise.resolve();
});

// Populate user and assignedTo fields
supportTicketSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name email'
  }).populate({
    path: 'assignedTo',
    select: 'name email'
  });
  
  next();
});

const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);

module.exports = SupportTicket;
