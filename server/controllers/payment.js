const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const axios = require('axios');
const { Payment, Booking } = require('../models/bookings');

// Create Stripe Payment Intent
exports.createStripePaymentIntent = async (req, res) => {
  try {
    const { bookingId, amount, currency = 'kes' } = req.body;
    
    // Verify booking exists and belongs to user
    const booking = await Booking.findOne({ 
      _id: bookingId, 
      userId: req.user.userId 
    });
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        bookingId: bookingId,
        userId: req.user.userId
      }
    });
    
    // Create payment record
    const payment = new Payment({
      bookingId,
      amount,
      currency: currency.toUpperCase(),
      method: 'stripe',
      stripePaymentIntentId: paymentIntent.id,
      status: 'pending'
    });
    
    await payment.save();
    
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id
    });
  } catch (error) {
    console.error('Stripe payment intent creation failed:', error);
    res.status(500).json({ error: error.message });
  }
};

// Confirm Stripe Payment
exports.confirmStripePayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    
    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      // Update payment record
      const payment = await Payment.findOne({ 
        stripePaymentIntentId: paymentIntentId 
      });
      
      if (payment) {
        payment.status = 'completed';
        payment.transactionId = paymentIntent.id;
        await payment.save();
        
        // Update booking payment status
        await Booking.findByIdAndUpdate(payment.bookingId, {
          paymentStatus: 'completed',
          paymentReference: paymentIntent.id
        });
        
        res.json({ 
          success: true, 
          message: 'Payment confirmed successfully',
          paymentId: payment._id
        });
      } else {
        res.status(404).json({ error: 'Payment record not found' });
      }
    } else {
      res.status(400).json({ error: 'Payment not successful' });
    }
  } catch (error) {
    console.error('Stripe payment confirmation failed:', error);
    res.status(500).json({ error: error.message });
  }
};

// Initiate M-Pesa Payment
exports.initiateMpesaPayment = async (req, res) => {
  try {
    const { bookingId, phoneNumber, amount } = req.body;
    
    // Verify booking
    const booking = await Booking.findOne({ 
      _id: bookingId, 
      userId: req.user.userId 
    });
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Format phone number (remove + and spaces)
    const formattedPhone = phoneNumber.replace(/[^0-9]/g, '');
    
    // M-Pesa STK Push request
    const mpesaResponse = await initiateSTKPush({
      phoneNumber: formattedPhone,
      amount: Math.round(amount),
      accountReference: booking.bookingReference,
      transactionDesc: `Payment for booking ${booking.bookingReference}`
    });
    
    if (mpesaResponse.success) {
      // Create payment record
      const payment = new Payment({
        bookingId,
        amount,
        currency: 'KES',
        method: 'mpesa',
        mpesaTransactionId: mpesaResponse.checkoutRequestID,
        status: 'processing',
        metadata: {
          phoneNumber: formattedPhone,
          checkoutRequestID: mpesaResponse.checkoutRequestID
        }
      });
      
      await payment.save();
      
      res.json({
        success: true,
        message: 'M-Pesa payment initiated. Please check your phone.',
        checkoutRequestID: mpesaResponse.checkoutRequestID,
        paymentId: payment._id
      });
    } else {
      res.status(400).json({ 
        error: 'M-Pesa payment initiation failed',
        details: mpesaResponse.errorMessage 
      });
    }
  } catch (error) {
    console.error('M-Pesa payment initiation failed:', error);
    res.status(500).json({ error: error.message });
  }
};

// M-Pesa Callback Handler
exports.mpesaCallback = async (req, res) => {
  try {
    const { Body } = req.body;
    const { stkCallback } = Body;
    
    const checkoutRequestID = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;
    
    // Find payment record
    const payment = await Payment.findOne({ 
      mpesaTransactionId: checkoutRequestID 
    });
    
    if (payment) {
      if (resultCode === 0) {
        // Payment successful
        const callbackMetadata = stkCallback.CallbackMetadata;
        const transactionId = callbackMetadata.Item.find(
          item => item.Name === 'MpesaReceiptNumber'
        )?.Value;
        
        payment.status = 'completed';
        payment.transactionId = transactionId;
        await payment.save();
        
        // Update booking
        await Booking.findByIdAndUpdate(payment.bookingId, {
          paymentStatus: 'completed',
          paymentReference: transactionId
        });
      } else {
        // Payment failed
        payment.status = 'failed';
        await payment.save();
        
        await Booking.findByIdAndUpdate(payment.bookingId, {
          paymentStatus: 'failed'
        });
      }
    }
    
    res.json({ ResultCode: 0, ResultDesc: 'Success' });
  } catch (error) {
    console.error('M-Pesa callback processing failed:', error);
    res.json({ ResultCode: 1, ResultDesc: 'Error' });
  }
};

// Check Payment Status
exports.checkPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await Payment.findById(paymentId)
      .populate('bookingId', 'bookingReference status');
    
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    res.json({
      payment,
      booking: payment.bookingId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function for M-Pesa STK Push
async function initiateSTKPush({ phoneNumber, amount, accountReference, transactionDesc }) {
  try {
    // Get M-Pesa access token
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString('base64');
    
    const tokenResponse = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`
        }
      }
    );
    
    const accessToken = tokenResponse.data.access_token;
    
    // Generate timestamp and password
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');
    
    // STK Push request
    const stkResponse = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phoneNumber,
        CallBackURL: `${process.env.BASE_URL}/api/payments/mpesa/callback`,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (stkResponse.data.ResponseCode === '0') {
      return {
        success: true,
        checkoutRequestID: stkResponse.data.CheckoutRequestID
      };
    } else {
      return {
        success: false,
        errorMessage: stkResponse.data.errorMessage || 'STK Push failed'
      };
    }
  } catch (error) {
    console.error('M-Pesa STK Push error:', error);
    return {
      success: false,
      errorMessage: error.message
    };
  }
}
