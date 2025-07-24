const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment');
const auth = require('../middleware/auth');

// Stripe payment routes
router.post('/stripe/create-intent', auth, paymentController.createStripePaymentIntent);
router.post('/stripe/confirm', auth, paymentController.confirmStripePayment);

// M-Pesa payment routes
router.post('/mpesa/initiate', auth, paymentController.initiateMpesaPayment);
router.post('/mpesa/callback', paymentController.mpesaCallback); // No auth for callback

// General payment routes
router.get('/status/:paymentId', auth, paymentController.checkPaymentStatus);

module.exports = router;
