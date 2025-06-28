import express from 'express';
import { body, validationResult } from 'express-validator';
import Service from '../models/Service.js';
import { auth, authorize } from '../middleware/auth.js';
import logger from '../utils/logger.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting for service creation
const serviceLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 service creations per hour
  message: 'Too many service creations. Please try again later.',
  skip: (req) => req.user?.role === 'admin' // Admins are exempt
});

// Service categories
const SERVICE_CATEGORIES = [
  'safari', 'beach', 'mountain', 'cultural',
  'accommodation', 'transport', 'activities'
];

// --- GET SERVICES WITH ADVANCED FILTERING ---
router.get('/', asyncHandler(async (req, res) => {
  const {
    category,
    location,
    minPrice,
    maxPrice,
    rating,
    page = 1,
    limit = 12,
    sort = '-createdAt',
    search
  } = req.query;

  // Build filter object
  const filter = { status: 'approved' };

  // Category filter
  if (category && category !== 'all' && SERVICE_CATEGORIES.includes(category)) {
    filter.category = category;
  }

  // Location filter
  if (location) {
    filter['location.name'] = { $regex: location, $options: 'i' };
  }

  // Price range filter
  if (minPrice || maxPrice) {
    filter['pricing.basePrice'] = {};
    if (minPrice) filter['pricing.basePrice'].$gte = Number(minPrice);
    if (maxPrice) filter['pricing.basePrice'].$lte = Number(maxPrice);
  }

  // Rating filter
  if (rating) {
    filter['rating.average'] = { $gte: Number(rating) };
  }

  // Search filter
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { 'location.name': { $regex: search, $options: 'i' } }
    ];
  }

  // Execute query with pagination
  const [services, total] = await Promise.all([
    Service.find(filter)
      .populate('provider', 'name avatar rating')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean(), // Convert to plain JS objects for faster response
    Service.countDocuments(filter)
  ]);

  res.json({
    success: true,
    data: services,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// --- GET SINGLE SERVICE WITH ANALYTICS ---
router.get('/:id', asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(
    req.params.id,
    { $inc: { 'analytics.views': 1 } }, // Increment view count
    { new: true }
  )
    .populate('provider', 'name avatar rating verified')
    .populate({
      path: 'reviews.user',
      select: 'name avatar',
      options: { limit: 5, sort: { createdAt: -1 } } // Only get latest 5 reviews
    });

  if (!service) {
    throw new NotFoundError('Service not found');
  }

  res.json({
    success: true,
    data: service
  });
}));

// --- CREATE SERVICE (PROVIDERS ONLY) ---
router.post('/', auth, authorize('provider', 'admin'), serviceLimiter, [
  body('title').trim().isLength({ min: 5, max: 100 }).escape(),
  body('description').trim().isLength({ min: 20, max: 2000 }).escape(),
  body('category').isIn(SERVICE_CATEGORIES),
  body('pricing.basePrice').isFloat({ min: 0 }),
  body('location.name').notEmpty().trim().escape(),
  body('location.coordinates.latitude').isFloat({ min: -90, max: 90 }),
  body('location.coordinates.longitude').isFloat({ min: -180, max: 180 }),
  body('images').optional().isArray({ max: 10 }),
  body('availability.startDate').optional().isISO8601(),
  body('availability.endDate').optional().isISO8601()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array());
  }

  const serviceData = {
    ...req.body,
    provider: req.user.id,
    status: req.user.role === 'admin' ? 'approved' : 'pending'
  };

  const service = await Service.create(serviceData);

  logger.info('Service created', {
    serviceId: service._id,
    providerId: req.user.id
  });

  res.status(201).json({
    success: true,
    message: `Service ${req.user.role === 'admin' ? 'approved' : 'submitted for approval'}`,
    data: service
  });
}));

// --- UPDATE SERVICE ---
router.put('/:id', auth, [
  body('status').optional().isIn(['pending', 'approved', 'rejected']),
  body('rejectionReason').optional().trim().isLength({ max: 500 })
], asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    throw new NotFoundError('Service not found');
  }

  // Authorization check
  if (service.provider.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new AuthorizationError('Not authorized to update this service');
  }

  // Admin-only fields
  if (req.body.status && req.user.role !== 'admin') {
    throw new AuthorizationError('Only admins can change service status');
  }

  const updatedService = await Service.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  logger.info('Service updated', {
    serviceId: service._id,
    updatedBy: req.user.id
  });

  res.json({
    success: true,
    message: 'Service updated successfully',
    data: updatedService
  });
}));

// --- DELETE SERVICE ---
router.delete('/:id', auth, asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    throw new NotFoundError('Service not found');
  }

  // Authorization check
  if (service.provider.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new AuthorizationError('Not authorized to delete this service');
  }

  await Service.findByIdAndDelete(req.params.id);

  logger.info('Service deleted', {
    serviceId: service._id,
    deletedBy: req.user.id
  });

  res.json({
    success: true,
    message: 'Service deleted successfully'
  });
}));

// --- ADD REVIEW ---
router.post('/:id/reviews', auth, [
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').optional().trim().isLength({ max: 500 }).escape()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array());
  }

  const service = await Service.findById(req.params.id);

  if (!service) {
    throw new NotFoundError('Service not found');
  }

  // Check if user already reviewed this service
  const existingReviewIndex = service.reviews.findIndex(
    review => review.user.toString() === req.user.id
  );

  if (existingReviewIndex !== -1) {
    // Update existing review
    service.reviews[existingReviewIndex] = {
      user: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment,
      updatedAt: new Date()
    };
  } else {
    // Add new review
    service.reviews.push({
      user: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment
    });
  }

  // Recalculate average rating
  service.calculateAverageRating();
  await service.save();

  logger.info('Review added/updated', {
    serviceId: service._id,
    userId: req.user.id
  });

  res.json({
    success: true,
    message: existingReviewIndex !== -1 ? 'Review updated successfully' : 'Review added successfully'
  });
}));

// --- GET SERVICE REVIEWS ---
router.get('/:id/reviews', asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const service = await Service.findById(req.params.id)
    .select('reviews')
    .populate({
      path: 'reviews.user',
      select: 'name avatar',
      options: {
        limit: limit * 1,
        skip: (page - 1) * limit,
        sort: { createdAt: -1 }
      }
    });

  if (!service) {
    throw new NotFoundError('Service not found');
  }

  res.json({
    success: true,
    data: service.reviews,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total: service.reviews.length,
      pages: Math.ceil(service.reviews.length / limit)
    }
  });
}));

export default router;