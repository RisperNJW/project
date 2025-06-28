import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Service category is required'],
    enum: ['safari', 'beach', 'mountain', 'cultural', 'accommodation', 'transport', 'activities']
  },
  subcategory: {
    type: String,
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    name: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    address: String,
    city: String,
    county: String
  },
  pricing: {
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      enum: ['USD', 'KES'],
      default: 'USD'
    },
    priceType: {
      type: String,
      enum: ['per-person', 'per-group', 'per-night', 'per-hour', 'fixed'],
      default: 'per-person'
    },
    discounts: [{
      type: {
        type: String,
        enum: ['early-bird', 'group', 'seasonal', 'loyalty']
      },
      percentage: Number,
      minQuantity: Number,
      validFrom: Date,
      validTo: Date
    }]
  },
  availability: {
    schedule: [{
      dayOfWeek: {
        type: Number,
        min: 0,
        max: 6
      },
      startTime: String,
      endTime: String,
      available: Boolean
    }],
    blackoutDates: [Date],
    maxCapacity: {
      type: Number,
      default: 1
    },
    minBookingNotice: {
      type: Number,
      default: 24 // hours
    }
  },
  images: [{
    url: String,
    caption: String,
    isPrimary: Boolean
  }],
  amenities: [String],
  inclusions: [String],
  exclusions: [String],
  requirements: {
    minAge: Number,
    maxAge: Number,
    fitnessLevel: {
      type: String,
      enum: ['easy', 'moderate', 'challenging', 'extreme']
    },
    equipment: [String],
    documents: [String]
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: String,
    images: [String],
    date: {
      type: Date,
      default: Date.now
    },
    helpful: {
      type: Number,
      default: 0
    }
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  seoData: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  analytics: {
    views: { type: Number, default: 0 },
    bookings: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
serviceSchema.index({ category: 1, status: 1 });
serviceSchema.index({ 'location.coordinates': '2dsphere' });
serviceSchema.index({ 'rating.average': -1 });
serviceSchema.index({ featured: -1, createdAt: -1 });

// Calculate average rating
serviceSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
    return;
  }
  
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  this.rating.average = Math.round((sum / this.reviews.length) * 10) / 10;
  this.rating.count = this.reviews.length;
};

export default mongoose.model('Service', serviceSchema);