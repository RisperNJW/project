const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
const User = require('../models/user');
const AppError = require('./appError');

// Promisify JWT functions
const signToken = promisify(jwt.sign);
const verifyToken = promisify(jwt.verify);

// Generate access and refresh tokens
const createTokens = async (userId) => {
  // Create access token (15 minutes)
  const accessToken = await signToken(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
  );

  // Create refresh token (7 days)
  const refreshToken = await signToken(
    { id: userId, tokenVersion: crypto.randomBytes(16).toString('hex') },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  return { accessToken, refreshToken };
};

// Verify access token
const verifyAccessToken = async (token) => {
  try {
    if (!token) {
      throw new AppError('You are not logged in! Please log in to get access.', 401);
    }

    // Verify token
    const decoded = await verifyToken(token, process.env.JWT_SECRET);
    
    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw new AppError('The user belonging to this token no longer exists.', 401);
    }

    // Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      throw new AppError('User recently changed password! Please log in again.', 401);
    }

    return currentUser;
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      throw new AppError('Invalid token. Please log in again!', 401);
    }
    if (err.name === 'TokenExpiredError') {
      throw new AppError('Your token has expired! Please log in again.', 401);
    }
    throw err;
  }
};

// Verify refresh token
const verifyRefreshToken = async (token) => {
  try {
    if (!token) {
      throw new AppError('No refresh token provided', 401);
    }

    const decoded = await verifyToken(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // In a real app, you might want to check the token version here
    // if (user.tokenVersion !== decoded.tokenVersion) {
    //   throw new AppError('Invalid token version', 401);
    // }

    return user;
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      throw new AppError('Invalid refresh token', 401);
    }
    if (err.name === 'TokenExpiredError') {
      throw new AppError('Refresh token has expired', 401);
    }
    throw err;
  }
};

// Generate password reset token
const createPasswordResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return { resetToken, passwordResetToken, passwordResetExpires };
};

// Generate email verification token
const createEmailVerificationToken = () => {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  const emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  return { verificationToken, emailVerificationToken, emailVerificationExpires };
};

module.exports = {
  createTokens,
  verifyAccessToken,
  verifyRefreshToken,
  createPasswordResetToken,
  createEmailVerificationToken,
};
