import express from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';
import { sendEmail } from '../utils/email.js';
import logger from '../utils/logger.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many attempts. Please try again later.'
});

// --- REGISTRATION (WITH MANDATORY VERIFICATION) ---
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('phone').optional().matches(/^\+254\d{9}$/).withMessage('Invalid Kenyan phone number')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation failed', { errors: errors.array() });
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }

  const { email } = req.body;

  // Check for existing user
  if (await User.findOne({ email })) {
    logger.warn('Duplicate registration attempt', { email });
    return res.status(409).json({ 
      success: false, 
      message: 'Email already registered' 
    });
  }

  // Create user with verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const user = await User.create({ 
    ...req.body,
    verificationToken,
    isVerified: false // Explicitly set to false
  });

  // Send verification email
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
  await sendEmail({
    to: email,
    subject: 'Verify Your Email',
    template: 'email-verification',
    data: { 
      name: user.name, 
      verificationUrl,
      expiryHours: 24 // Token expiry time
    }
  });

  // Respond with token (but restrict access until verified)
  const token = user.generateAuthToken({ isTemp: true }); // Temporary token

  res.status(201).json({
    success: true,
    message: 'Registration successful. Please check your email to verify your account.',
    token, // Temporary token (limited permissions)
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: false // Frontend should check this
    }
  });
}));

// --- LOGIN (BLOCK UNVERIFIED USERS) ---
router.post('/login', authLimiter, [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password +isVerified');
  if (!user || !(await user.comparePassword(password))) {
    logger.warn('Failed login attempt', { email });
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid credentials' 
    });
  }

  // Block unverified users
  if (!user.isVerified) {
    logger.warn('Unverified login attempt', { email });
    return res.status(403).json({
      success: false,
      message: 'Account not verified. Please check your email.',
      isVerified: false // Frontend can trigger resend verification
    });
  }

  // Successful login
  const token = user.generateAuthToken();
  user.lastLogin = new Date();
  await user.save();

  res.json({
    success: true,
    token,
    user: user.toProfileJSON() // Strips sensitive fields
  });
}));

// --- VERIFICATION FLOW ---
// 1. Verify Email Endpoint
router.get('/verify-email', asyncHandler(async (req, res) => {
  const { token } = req.query;
  if (!token) throw new BadRequestError('Missing token');

  const user = await User.findOne({ 
    verificationToken: token,
    verificationTokenExpiry: { $gt: Date.now() } // Token expires after 24h
  });

  if (!user) {
    logger.warn('Invalid verification token', { token });
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }

  // Mark as verified
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;
  await user.save();

  // Send welcome email
  await sendEmail({
    to: user.email,
    subject: 'Welcome!',
    template: 'welcome',
    data: { name: user.name }
  });

  res.json({ 
    success: true, 
    message: 'Email verified successfully' 
  });
}));

// 2. Resend Verification Email
router.post('/resend-verification', authLimiter, [
  body('email').isEmail().normalizeEmail()
], asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email, isVerified: false });

  if (!user) {
    return res.status(400).json({ 
      success: false, 
      message: 'Account already verified or does not exist' 
    });
  }

  // Generate new token (expires in 24h)
  user.verificationToken = crypto.randomBytes(32).toString('hex');
  user.verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24h
  await user.save();

  // Resend email
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${user.verificationToken}`;
  await sendEmail({
    to: email,
    subject: 'Verify Your Email',
    template: 'email-verification',
    data: { name: user.name, verificationUrl }
  });

  res.json({ 
    success: true, 
    message: 'Verification email resent' 
  });
}));

// --- MIDDLEWARE TO BLOCK UNVERIFIED USERS ---
export const checkVerified = (req, res, next) => {
  if (!req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Please verify your email to access this feature.',
      isVerified: false
    });
  }
  next();
};

// Apply to protected routes:
router.get('/me', auth, checkVerified, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ success: true, user });
}));

export default router;