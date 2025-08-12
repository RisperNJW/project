const FraudDetection = require('fraudlabspro-node')(process.env.FRAUDLABS_PRO_KEY);
const AppError = require('../utils/appError');

// Rate limiting for suspicious activities
const rateLimit = require('express-rate-limit')({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

const detectFraud = async (req, res, next) => {
  try {
    // Skip in development
    if (process.env.NODE_ENV === 'development') return next();

    const ip = req.ip || req.connection.remoteAddress;
    const data = {
      ip,
      user_agent: req.headers['user-agent'],
      user_language: req.headers['accept-language'] ? req.headers['accept-language'].split(',')[0] : '',
      amount: req.body.amount,
      currency: req.body.currency,
      email: req.body.email || req.user?.email,
      order_id: req.body.orderId,
      payment_mode: req.body.paymentMethod,
      txn_type: 'payment'
    };

    const result = await FraudDetection.validate(data);
    
    // Log fraud detection result
    req.fraudScore = result.fraudlabspro_score;
    
    if (result.status === 'APPROVE') {
      return next();
    } else if (result.status === 'REVIEW') {
      // Additional verification needed
      req.requiresVerification = true;
      return next();
    } else {
      // Block suspicious activity
      return next(new AppError('Transaction flagged as potentially fraudulent', 400));
    }
  } catch (err) {
    console.error('Fraud detection error:', err);
    // Allow but log the error
    return next();
  }
};

module.exports = {
  detectFraud,
  fraudRateLimit: rateLimit
};
