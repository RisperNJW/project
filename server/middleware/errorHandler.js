import logger from '../utils/logger.js';

const sendError = (res, status, message, errors = []) => {
  res.status(status).json({ success: false, message, errors });
};

export const errorHandler = (err, req, res, next) => {
  // Log error (sanitized)
  logger.error('Error:', { message: err.message, stack: err.stack });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return sendError(res, 400, 'Validation Error', errors);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendError(res, 409, `${field} already exists`);
  }

  // Mongoose invalid ID (CastError)
  if (err.name === 'CastError') {
    return sendError(res, 400, 'Invalid ID format');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 401, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 401, 'Token expired');
  }

  // Default error (500 Internal Server Error)
  sendError(res, err.statusCode || 500, err.message || 'Internal Server Error');
};