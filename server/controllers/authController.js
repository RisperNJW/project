const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const rateLimit = require('express-rate-limit');
const { createTokens, verifyRefreshToken } = require('../utils/tokenUtils');

// Generate JWT tokens
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  
  // Generate refresh token
  const refreshToken = crypto.randomBytes(32).toString('hex');
  const hashedRefreshToken = crypto
    .createHash('sha256')
    .update(refreshToken)
    .digest('hex');
  
  // Save refresh token to user
  user.refreshToken = hashedRefreshToken;
  user.refreshTokenExpires = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  user.save({ validateBeforeSave: false });

  // Set JWT in HTTP-only cookie
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    sameSite: 'strict',
  };

  // Set refresh token in HTTP-only cookie
  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  // Remove sensitive data from output
  user.password = undefined;
  user.active = undefined;
  user.refreshToken = undefined;
  user.refreshTokenExpires = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// Rate limiting for auth endpoints
exports.limiter = rateLimit({
  max: process.env.AUTH_RATE_LIMIT_MAX || 10, // 10 requests per window
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many login attempts from this IP, please try again in 15 minutes',
  skipSuccessfulRequests: true, // Only count failed requests
  message: 'Too many login attempts from this IP, please try again in 15 minutes',
});

// Input validation for registration
exports.validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[0-9]/)
    .withMessage('Password must contain a number')
    .matches(/[a-z]/)
    .withMessage('Password must contain a lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an uppercase letter'),
  body('passwordConfirm').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  })
];

// Register a new user
exports.register = async (req, res, next) => {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already in use', 400));
    }
    
    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });
    
    // Generate verification token
    const verificationToken = user.createVerificationToken();
    await user.save({ validateBeforeSave: false });
    
    // Send welcome email with verification link
    const verificationUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/verify-email/${verificationToken}`;
    await new Email(user, verificationUrl).sendWelcome();
    
    // Generate tokens
    const { accessToken, refreshToken } = await createTokens(user._id);
    
    // Set secure HTTP-only cookies
    res.cookie('jwt', accessToken, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
      sameSite: 'strict',
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : undefined
    });
    
    res.cookie('refreshToken', refreshToken, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
      sameSite: 'strict',
      path: '/api/v1/auth/refresh-token',
      domain: process.env.NODE_ENV === 'production' ? '.yourdomain.com' : undefined
    });
    
    // Remove sensitive data from output
    user.password = undefined;
    user.refreshToken = undefined;
    user.verificationToken = undefined;
    
    res.status(201).json({
      status: 'success',
      data: {
        user,
        accessToken,
        refreshToken
      }
    });
    
  } catch (err) {
    next(err);
  }
  try {
    const { name, email, password, passwordConfirm, role } = req.body;

    // 1) Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(
        new AppError('Email already in use. Please use a different email.', 400)
      );
    }

    // 2) Create new user
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      role,
    });

    // 3) Generate email verification token
    const verificationToken = newUser.createEmailVerificationToken();
    await newUser.save({ validateBeforeSave: false });

    // 4) Send welcome email with verification link
    const verificationUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/auth/verify-email/${verificationToken}`;

    try {
      await new Email(
        newUser,
        verificationUrl
      ).sendWelcome();

      // 5) Create and send token
      createSendToken(newUser, 201, req, res);
    } catch (err) {
      // If email sending fails, delete the user
      await User.findByIdAndDelete(newUser._id);
      return next(
        new AppError(
          'There was an error sending the welcome email. Please try again later!',
          500
        )
      );
    }
  } catch (err) {
    next(err);
  }
};

// Input validation for login
exports.validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Please provide a password')
];

// Login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password +active');

    if (!user || !(await user.correctPassword(password, user.password))) {
      // Increment login attempts
      if (user) {
        await user.incrementLoginAttempts();
      }
      return next(new AppError('Incorrect email or password', 401));
    }

    // 3) Check if account is locked
    if (user.isLocked) {
      return next(
        new AppError(
          'Account locked due to too many failed login attempts. Please try again later or reset your password.',
          401
        )
      );
    }

    // 4) If everything ok, reset login attempts and send token
    await user.resetLoginAttempts();
    
    // 5) Update last login
    user.lastLogin = Date.now();
    user.lastLoginIp = req.ip;
    await user.save({ validateBeforeSave: false });

    // 6) Send token to client
    createSendToken(user, 200, req, res);
  } catch (err) {
    next(err);
  }
};