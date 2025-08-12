const SupportTicket = require('../models/SupportTicket');
const User = require('../models/user');
const AppError = require('../utils/appError');
const { sendEmail } = require('../utils/email');
const { logger } = require('../utils/monitoring');

// Create a new support ticket
exports.createTicket = async (req, res, next) => {
  try {
    const { subject, message, priority = 'medium', category } = req.body;
    const userId = req.user.id;

    const ticket = await SupportTicket.create({
      user: userId,
      subject,
      message,
      priority,
      category,
      status: 'open'
    });

    // Notify support team
    await sendEmail({
      email: 'support@kenyatourism.com',
      subject: `New Support Ticket: ${ticket.ticketId}`,
      message: `A new support ticket has been created.\n\nSubject: ${subject}\nMessage: ${message}`
    });

    // Log the ticket creation
    logger.info(`New support ticket created`, { ticketId: ticket._id, userId });

    res.status(201).json({
      status: 'success',
      data: {
        ticket
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all tickets (for support agents)
exports.getAllTickets = async (req, res, next) => {
  try {
    const { status, priority, category, sort = '-createdAt' } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    const tickets = await SupportTicket.find(filter)
      .sort(sort)
      .populate('user', 'name email');

    res.status(200).json({
      status: 'success',
      results: tickets.length,
      data: {
        tickets
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user's tickets
exports.getMyTickets = async (req, res, next) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user.id })
      .sort('-createdAt')
      .populate('assignedTo', 'name email');

    res.status(200).json({
      status: 'success',
      results: tickets.length,
      data: {
        tickets
      }
    });
  } catch (error) {
    next(error);
  }
};

// Add response to ticket
exports.addResponse = async (req, res, next) => {
  try {
    const { message } = req.body;
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return next(new AppError('No ticket found with that ID', 404));
    }

    // Check if user is authorized
    if (ticket.user.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'support') {
      return next(new AppError('Not authorized to respond to this ticket', 403));
    }

    const response = {
      user: req.user.id,
      message,
      isInternal: req.user.role !== 'user'
    };

    ticket.responses.push(response);
    
    // Update status if it's a customer response
    if (req.user.role === 'user') {
      ticket.status = 'waiting';
    } else {
      ticket.status = 'in_progress';
    }

    await ticket.save();

    // Notify the other party
    const recipient = req.user.role === 'user' ? 'support@kenyatourism.com' : ticket.user.email;
    await sendEmail({
      email: recipient,
      subject: `Update on Ticket #${ticket.ticketId}: ${ticket.subject}`,
      message: `New response: ${message}\n\nYou can view the full conversation in your dashboard.`
    });

    res.status(200).json({
      status: 'success',
      data: {
        ticket
      }
    });
  } catch (error) {
    next(error);
  }
};

// Close ticket
exports.closeTicket = async (req, res, next) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return next(new AppError('No ticket found with that ID', 404));
    }

    // Only support agents and admins can close tickets
    if (req.user.role !== 'admin' && req.user.role !== 'support') {
      return next(new AppError('Not authorized to close this ticket', 403));
    }

    ticket.status = 'closed';
    ticket.closedAt = Date.now();
    ticket.closedBy = req.user.id;
    
    await ticket.save();

    // Notify the user
    await sendEmail({
      email: ticket.user.email,
      subject: `Ticket #${ticket.ticketId} has been closed`,
      message: `Your support ticket has been marked as resolved.\n\nIf you have any further questions, please don't hesitate to contact us.`
    });

    res.status(200).json({
      status: 'success',
      data: {
        ticket
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get ticket statistics
exports.getTicketStats = async (req, res, next) => {
  try {
    const stats = await SupportTicket.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgResponseTime: { $avg: '$firstResponseTime' }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$count' },
          open: {
            $sum: {
              $cond: [{ $eq: ['$_id', 'open'] }, '$count', 0]
            }
          },
          inProgress: {
            $sum: {
              $cond: [{ $eq: ['$_id', 'in_progress'] }, '$count', 0]
            }
          },
          closed: {
            $sum: {
              $cond: [{ $eq: ['$_id', 'closed'] }, '$count', 0]
            }
          },
          avgResponseTime: { $avg: '$avgResponseTime' }
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats: stats[0] || { total: 0, open: 0, inProgress: 0, closed: 0, avgResponseTime: 0 }
      }
    });
  } catch (error) {
    next(error);
  }
};
