import express from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import { auth } from '../middleware/auth.js';
import logger from '../utils/logger.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import redisClient from '../utils/redis.js';

const router = express.Router();

// Rate limiting for booking creation
const createBookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each user to 5 booking requests per window
  message: 'Too many booking attempts. Please try again later.',
  skip: (req) => req.user?.role === 'admin' // Admins are exempt
});

// --- GET USER BOOKINGS (WITH CACHING) ---
router.get('/', auth, asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  // Build cache key
  const cacheKey = `bookings:${req.user.id}:${status || 'all'}:${page}:${limit}`;

  // Try cache first
  const cached = await redisClient.get(cacheKey);
  if (cached) {
    logger.debug('Serving bookings from cache');
    return res.json(JSON.parse(cached));
  }

  // Build query
  const filter = { user: req.user.id };
  if (status) filter.status = status;

  const [bookings, total] = await Promise.all([
    Booking.find(filter)
      .populate('service', 'title images location pricing')
      .populate('provider', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit),
    Booking.countDocuments(filter)
  ]);

  // Cache for 5 minutes
  await redisClient.setEx(
    cacheKey,
    300,
    JSON.stringify({
      success: true,
      data: bookings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  );

  res.json({
    success: true,
    data: bookings,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// --- GET SINGLE BOOKING (WITH AUTHORIZATION) ---
router.get('/:id', auth, asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({
    $or: [
      { bookingId: req.params.id },
      { _id: req.params.id }
    ]
  })
    .populate('service', 'title description pricing')
    .populate('provider', 'name email phone')
    .populate('user', 'name email');

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  // Authorization check
  if (
    booking.user._id.toString() !== req.user.id &&
    booking.provider._id.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    throw new AuthorizationError('Not authorized to view this booking');
  }

  res.json({
    success: true,
    data: booking
  });
}));

// --- CREATE BOOKING (WITH DATE CONFLICT CHECK) ---
router.post('/', auth, createBookingLimiter, [
  body('serviceId').isMongoId().withMessage('Invalid service ID'),
  body('startDate').isISO8601().custom(date => {
    if (new Date(date) < new Date()) {
      throw new Error('Start date must be in the future');
    }
    return true;
  }),
  body('endDate').optional().isISO8601().custom((endDate, { req }) => {
    if (endDate && new Date(endDate) <= new Date(req.body.startDate)) {
      throw new Error('End date must be after start date');
    }
    return true;
  }),
  body('adults').isInt({ min: 1 }).withMessage('At least 1 adult required'),
  body('children').optional().isInt({ min: 0 }),
  body('infants').optional().isInt({ min: 0 }),
  body('contactInfo.phone').isMobilePhone().withMessage('Invalid phone number'),
  body('contactInfo.email').isEmail().normalizeEmail()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError(errors.array());
  }

  const { serviceId, startDate, endDate, adults, children = 0, infants = 0 } = req.body;

  // Verify service exists and is available
  const service = await Service.findById(serviceId);
  if (!service || service.status !== 'approved') {
    throw new NotFoundError('Service not available for booking');
  }

  // Check for booking conflicts
  const conflictFilter = {
    service: serviceId,
    status: { $nin: ['cancelled', 'rejected'] },
    $or: [
      { 'bookingDetails.startDate': { $lte: endDate || startDate } },
      { 'bookingDetails.endDate': { $gte: startDate } }
    ]
  };

  const conflictingBooking = await Booking.findOne(conflictFilter);
  if (conflictingBooking) {
    throw new ConflictError('These dates are already booked');
  }

  // Calculate pricing
  const totalGuests = adults + (children * 0.7) + (infants * 0.1);
  const baseAmount = service.pricing.basePrice * totalGuests;
  const totalAmount = Math.round(baseAmount * 100) / 100; // Round to 2 decimals

  // Create booking
  const booking = new Booking({
    user: req.user.id,
    service: serviceId,
    provider: service.provider,
    bookingDetails: {
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      participants: { adults, children, infants },
      specialRequests: req.body.specialRequests,
      contactInfo: req.body.contactInfo
    },
    pricing: {
      baseAmount,
      totalAmount,
      currency: service.pricing.currency || 'USD',
      taxes: service.pricing.taxes || []
    },
    payment: {
      status: 'pending',
      dueDate: new Date(new Date(startDate).getTime() - (3 * 24 * 60 * 60 * 1000)) // 3 days before
    }
  });

  await booking.save();

  // Invalidate cache for user's bookings
  await redisClient.del(`bookings:${req.user.id}:*`);

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: {
      bookingId: booking.bookingId,
      service: booking.service,
      startDate: booking.bookingDetails.startDate,
      totalAmount: booking.pricing.totalAmount,
      paymentDue: booking.payment.dueDate
    }
  });
}));

// --- UPDATE BOOKING STATUS (PROVIDER/ADMIN ONLY) ---
router.patch('/:id/status', auth, [
  body('status').isIn(['confirmed', 'cancelled', 'completed', 'no_show'])
], asyncHandler(async (req, res) => {
  const { status } = req.body;

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  // Authorization check
  if (
    booking.provider.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    throw new AuthorizationError('Not authorized to update this booking');
  }

  // Business logic checks
  if (status === 'completed' && booking.payment.status !== 'completed') {
    throw new PaymentRequiredError('Payment must be completed first');
  }

  booking.status = status;
  await booking.save();

  // Invalidate relevant caches
  await Promise.all([
    redisClient.del(`bookings:${booking.user}:*`),
    redisClient.del(`bookings:${req.user.id}:*`)
  ]);

  res.json({
    success: true,
    message: `Booking ${status} successfully`,
    data: booking
  });
}));

// --- CANCEL BOOKING (WITH REFUND CALCULATION) ---
router.patch('/:id/cancel', auth, [
  body('reason').optional().trim().isLength({ max: 500 })
], asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  // Authorization check
  if (
    booking.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    throw new AuthorizationError('Not authorized to cancel this booking');
  }

  // Business rules
  if (booking.status === 'cancelled') {
    throw new ConflictError('Booking is already cancelled');
  }

  const now = new Date();
  const hoursUntilStart = (booking.bookingDetails.startDate - now) / (1000 * 60 * 60);

  // Calculate refund based on cancellation time
  let refundAmount = 0;
  if (hoursUntilStart > 48) {
    refundAmount = booking.pricing.totalAmount; // Full refund
  } else if (hoursUntilStart > 24) {
    refundAmount = booking.pricing.totalAmount * 0.5; // 50% refund
  }

  // Update booking
  booking.status = 'cancelled';
  booking.cancellation = {
    cancelledBy: req.user.id,
    cancelledAt: now,
    reason: req.body.reason,
    refundAmount
  };
  booking.payment.refundAmount = refundAmount;
  booking.payment.refundStatus = refundAmount > 0 ? 'pending' : 'none';

  await booking.save();

  // Invalidate caches
  await Promise.all([
    redisClient.del(`bookings:${booking.user}:*`),
    redisClient.del(`bookings:${booking.provider}:*`)
  ]);

  res.json({
    success: true,
    message: 'Booking cancelled successfully',
    refundAmount,
    refundStatus: booking.payment.refundStatus
  });
}));

export default router;