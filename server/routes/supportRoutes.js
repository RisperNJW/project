const express = require('express');
const supportController = require('../controllers/supportController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

// Routes for ticket creation and management by users
router
  .route('/tickets')
  .post(supportController.createTicket)
  .get(supportController.getMyTickets);

// Routes for support agents and admins
router.use(authController.restrictTo('support', 'admin'));

router
  .route('/tickets/all')
  .get(supportController.getAllTickets);

router
  .route('/tickets/stats')
  .get(supportController.getTicketStats);

router
  .route('/tickets/:id')
  .post(supportController.addResponse)
  .patch(supportController.closeTicket);

// Webhook for support notifications
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  supportController.handleSupportWebhook
);

module.exports = router;
