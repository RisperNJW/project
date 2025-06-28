import express from 'express';
import Stripe from 'stripe';
import axios from 'axios';
import { auth } from '../middleware/auth.js';
import Booking from '../models/Booking.js';
import { body, validationResult } from 'express-validator';
import logger from '../utils/logger.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();
const stripe = new Stripe('kjk');

// Rate limiting for payment endpoints
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many payment attempts. Please try again later.'
});

// --- M-PESA PAYMENT INTEGRATION ---

/**
 * @swagger
 * /api/payments/mpesa/stk-push:
 *   post:
 *     summary: Initiate M-Pesa STK Push payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phoneNumber
 *               - amount
 *               - bookingId
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 example: "+254712345678"
 *               amount:
 *                 type: number
 *                 example: 5000
 *               bookingId:
 *                 type: string
 *                 example: "BK-123456"
 *     responses:
 *       200:
 *         description: STK Push initiated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Booking not found
 */
router.post('/mpesa/stk-push', auth, paymentLimiter, [
  body('phoneNumber').matches(/^\+254[0-9]{9}$/).withMessage('Invalid Kenyan phone number format'),
  body('amount').isFloat({ min: 10 }).withMessage('Amount must be at least 10'),
  body('bookingId').isString().notEmpty().withMessage('Booking ID is required')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('M-Pesa validation failed', { errors: errors.array() });
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { phoneNumber, amount, bookingId } = req.body;

  // Verify booking exists and belongs to user
  const booking = await Booking.findOne({
    bookingId,
    user: req.user.id,
    status: { $ne: 'cancelled' }
  });

  if (!booking) {
    logger.warn('Booking not found', { bookingId, userId: req.user.id });
    throw new NotFoundError('Booking not found or already cancelled');
  }

  // Verify amount matches booking total (with 5% tolerance)
  const amountDifference = Math.abs(amount - booking.pricing.totalAmount);
  if (amountDifference > (booking.pricing.totalAmount * 0.05)) {
    throw new BadRequestError('Payment amount does not match booking total');
  }

  // Generate M-Pesa credentials
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
  const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64');

  // Get OAuth token
  const authResponse = await axios.get(process.env.MPESA_AUTH_URL, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64')}`
    }
  });

  // Initiate STK Push
  const stkResponse = await axios.post(
    process.env.MPESA_STK_PUSH_URL,
    {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: phoneNumber,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: phoneNumber,
      CallBackURL: `${process.env.BASE_URL}/api/payments/mpesa/callback`,
      AccountReference: `BOOKING-${bookingId}`,
      TransactionDesc: `Payment for booking ${bookingId}`
    },
    {
      headers: {
        Authorization: `Bearer ${authResponse.data.access_token}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10 second timeout
    }
  );

  // Update booking with payment details
  booking.payment = {
    method: 'mpesa',
    status: 'processing',
    transactionId: stkResponse.data.CheckoutRequestID,
    amount: amount,
    currency: 'KES',
    initiatedAt: new Date()
  };

  await booking.save();

  logger.info('M-Pesa STK Push initiated', {
    bookingId,
    amount,
    checkoutRequestId: stkResponse.data.CheckoutRequestID
  });

  res.json({
    success: true,
    message: 'Payment request sent to your phone',
    data: {
      checkoutRequestId: stkResponse.data.CheckoutRequestID,
      amount: amount,
      currency: 'KES'
    }
  });
}));

/**
 * @swagger
 * /api/payments/mpesa/callback:
 *   post:
 *     summary: M-Pesa payment callback (internal)
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MpesaCallback'
 *     responses:
 *       200:
 *         description: Callback processed successfully
 */
router.post('/mpesa/callback', express.json(), asyncHandler(async (req, res) => {
  const callback = req.body;

  if (!callback.Body?.stkCallback) {
    logger.warn('Invalid M-Pesa callback format', { callback });
    return res.status(400).json({ status: 'Invalid callback format' });
  }

  const { CheckoutRequestID, ResultCode, CallbackMetadata } = callback.Body.stkCallback;

  // Find booking by checkout request ID
  const booking = await Booking.findOne({
    'payment.transactionId': CheckoutRequestID
  }).populate('user');

  if (!booking) {
    logger.error('Booking not found for M-Pesa callback', { CheckoutRequestID });
    return res.status(200).json({ status: 'OK' });
  }

  if (ResultCode === 0) {
    // Payment successful
    const metadata = CallbackMetadata.Item.reduce((acc, item) => {
      acc[item.Name] = item.Value;
      return acc;
    }, {});

    booking.payment.status = 'completed';
    booking.payment.mpesaReceiptNumber = metadata.MpesaReceiptNumber;
    booking.payment.transactionDate = new Date(metadata.TransactionDate);
    booking.payment.phoneNumber = metadata.PhoneNumber;
    booking.status = 'confirmed';

    await booking.save();

    logger.info('M-Pesa payment completed', {
      bookingId: booking.bookingId,
      amount: booking.payment.amount,
      receipt: metadata.MpesaReceiptNumber
    });

    // TODO: Send confirmation email/notification
  } else {
    // Payment failed
    booking.payment.status = 'failed';
    booking.payment.failureReason = callback.Body.stkCallback.ResultDesc;
    await booking.save();

    logger.warn('M-Pesa payment failed', {
      bookingId: booking.bookingId,
      reason: callback.Body.stkCallback.ResultDesc
    });
  }

  res.status(200).json({ status: 'OK' });
}));

// --- STRIPE PAYMENT INTEGRATION ---

/**
 * @swagger
 * /api/payments/stripe/create-payment-intent:
 *   post:
 *     summary: Create Stripe payment intent
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingId
 *             properties:
 *               bookingId:
 *                 type: string
 *                 example: "BK-123456"
 *     responses:
 *       200:
 *         description: Payment intent created
 *       400:
 *         description: Validation error
 *       404:
 *         description: Booking not found
 */
router.post('/stripe/create-payment-intent', auth, paymentLimiter, [
  body('bookingId').isString().notEmpty().withMessage('Booking ID is required')
], asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  // Verify booking
  const booking = await Booking.findOne({
    bookingId,
    user: req.user.id,
    status: { $ne: 'cancelled' }
  }).populate(['service', 'user']);

  if (!booking) {
    throw new NotFoundError('Booking not found or already cancelled');
  }

  // Create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(booking.pricing.totalAmount * 100), // Convert to cents
    currency: booking.pricing.currency.toLowerCase(),
    metadata: {
      bookingId: booking.bookingId,
      userId: booking.user._id.toString(),
      serviceId: booking.service._id.toString()
    },
    description: `Booking ${booking.bookingId} for ${booking.service.title}`,
    receipt_email: booking.user.email,
    automatic_payment_methods: { enabled: true }
  });

  // Update booking
  booking.payment = {
    method: 'stripe',
    status: 'processing',
    stripePaymentIntentId: paymentIntent.id,
    amount: booking.pricing.totalAmount,
    currency: booking.pricing.currency,
    initiatedAt: new Date()
  };

  await booking.save();

  logger.info('Stripe payment intent created', {
    bookingId,
    paymentIntentId: paymentIntent.id,
    amount: booking.pricing.totalAmount
  });

  res.json({
    success: true,
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id
  });
}));

/**
 * @swagger
 * /api/payments/stripe/webhook:
 *   post:
 *     summary: Stripe webhook handler
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StripeEvent'
 *     responses:
 *       200:
 *         description: Webhook processed
 */
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    logger.error('Stripe webhook verification failed', { error: err.message });
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await handleSuccessfulStripePayment(paymentIntent.id);
        break;

      case 'payment_intent.payment_failed':
        const failedIntent = event.data.object;
        await handleFailedStripePayment(failedIntent.id);
        break;

      default:
        logger.debug('Unhandled Stripe event type', { type: event.type });
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('Stripe webhook processing failed', { error: error.message });
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}));

// --- PAYMENT VERIFICATION ---

/**
 * @swagger
 * /api/payments/verify/{bookingId}:
 *   get:
 *     summary: Verify payment status
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment status
 *       404:
 *         description: Booking not found
 */
router.get('/verify/:bookingId', auth, asyncHandler(async (req, res) => {
  const { bookingId } = req.params;

  const booking = await Booking.findOne({
    bookingId,
    user: req.user.id
  }).populate('service');

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  // Additional verification for Stripe payments
  if (booking.payment.method === 'stripe' && booking.payment.status === 'processing') {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      booking.payment.stripePaymentIntentId
    );

    if (paymentIntent.status === 'succeeded') {
      booking.payment.status = 'completed';
      booking.status = 'confirmed';
      await booking.save();
    } else if (paymentIntent.status === 'canceled') {
      booking.payment.status = 'failed';
      await booking.save();
    }
  }

  res.json({
    success: true,
    paymentStatus: booking.payment.status,
    bookingStatus: booking.status,
    amountPaid: booking.payment.amount,
    currency: booking.payment.currency,
    service: booking.service.title
  });
}));

// --- HELPER FUNCTIONS ---

async function handleSuccessfulStripePayment(paymentIntentId) {
  const booking = await Booking.findOne({
    'payment.stripePaymentIntentId': paymentIntentId
  }).populate(['user', 'service']);

  if (!booking) {
    logger.error('Booking not found for successful Stripe payment', { paymentIntentId });
    return;
  }

  booking.payment.status = 'completed';
  booking.payment.paymentDate = new Date();
  booking.status = 'confirmed';
  await booking.save();

  logger.info('Stripe payment completed', {
    bookingId: booking.bookingId,
    paymentIntentId,
    amount: booking.payment.amount
  });

  // TODO: Send confirmation
}

async function handleFailedStripePayment(paymentIntentId) {
  const booking = await Booking.findOne({
    'payment.stripePaymentIntentId': paymentIntentId
  });

  if (!booking) {
    logger.error('Booking not found for failed Stripe payment', { paymentIntentId });
    return;
  }

  booking.payment.status = 'failed';
  await booking.save();

  logger.warn('Stripe payment failed', {
    bookingId: booking.bookingId,
    paymentIntentId
  });
}

export default router;