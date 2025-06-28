import express from 'express';
import OpenAI from 'openai';
import { auth } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import logger from '../utils/logger.js';
import Conversation from '../models/Conversation.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import User from '../models/User.js';

const router = express.Router();

// Initialize OpenAI with timeout
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 5000 // 5 second timeout
});

// Rate limiting for chat endpoints
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: 'Too many chat requests. Please wait a moment.'
});

// Go2Bookings knowledge base (enhanced)
const TOURISM_CONTEXT = `
Role: Go2Bookings Expert Assistant

Knowledge Areas:
1. DESTINATIONS:
- Safaris: Maasai Mara (Great Migration: Jul-Oct), Amboseli (elephants), Tsavo (red elephants)
- Beaches: Diani (best beaches), Watamu (marine park), Lamu (Swahili culture)
- Mountains: Mt. Kenya (technical climbs), Mt. Longonot (day hike)
- Cities: Nairobi (Karen Blixen, Giraffe Centre), Mombasa (Old Town)

2. BOOKING INFORMATION:
- Payment: M-Pesa (Kenya), Credit Cards (Stripe)
- Cancellation: 48h+ full refund, <48h 50% refund
- Requirements: Passport, Vaccinations (Yellow Fever for some areas)

3. TRAVEL TIPS:
- Best time: Dry seasons (Jan-Feb, Jun-Oct)
- Packing: Neutral colors for safari, reef-safe sunscreen for beaches
- Safety: Avoid walking at night in cities, use registered guides

Response Guidelines:
- Be concise but informative
- Always suggest booking through our platform when relevant
- For prices, say "Prices vary but average $X. Check our booking platform for exact rates."
- Never share personal contact information
- If unsure, say "For the most current information, I recommend checking our official website."
`;

// --- CHAT WITH AI ASSISTANT ---
router.post('/message', auth, chatLimiter, [
  body('message').trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Message must be between 1-500 characters'),
  body('conversationId').optional().isMongoId()
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation failed', { errors: errors.array() });
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { message, conversationId } = req.body;
  const userId = req.user.id;

  try {
    // Get or create conversation
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation || conversation.user.toString() !== userId) {
        throw new Error('Conversation not found');
      }
    } else {
      conversation = new Conversation({
        user: userId,
        messages: [{
          role: 'system',
          content: TOURISM_CONTEXT
        }]
      });
    }

    // Add user message
    conversation.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Get AI response (with timeout fallback)
    let aiResponse;
    try {
      const completion = await Promise.race([
        openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: conversation.messages.slice(-6), // Last 3 exchanges
          max_tokens: 300,
          temperature: 0.7
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('AI timeout')), 4000)
        )
      ]);

      aiResponse = completion.choices[0].message.content;
    } catch (aiError) {
      logger.error('AI service error', { error: aiError.message });
      aiResponse = generateFallbackResponse(message);
    }

    // Add AI response
    conversation.messages.push({
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    });

    // Save conversation
    await conversation.save();

    res.json({
      success: true,
      response: aiResponse,
      conversationId: conversation._id,
      timestamp: new Date()
    });

  } catch (error) {
    logger.error('Chat processing failed', { error: error.message });
    res.json({
      success: true, // Still success to keep UX smooth
      response: generateFallbackResponse(message),
      fallback: true
    });
  }
}));

// --- CONVERSATION HISTORY ---
router.get('/conversations', auth, asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ user: req.user.id })
    .sort('-updatedAt')
    .limit(10)
    .select('_id createdAt updatedAt');

  res.json({
    success: true,
    data: conversations
  });
}));

// --- SMART SUGGESTIONS ---
router.get('/suggestions', auth, asyncHandler(async (req, res) => {
  // Get user's interests from profile if available
  const user = await User.findById(req.user.id).select('preferences');
  const interests = user?.preferences?.interests || [];

  // Dynamic suggestions based on user interests
  const suggestions = {
    general: [
      "What are the best safari destinations in Kenya?",
      "When is the best time to visit Maasai Mara?",
      "How do I book a safari tour?",
      "What payment methods do you accept?"
    ],
    safari: [
      "What should I pack for a safari?",
      "How much does a 3-day safari cost?",
      "Which parks are best for seeing lions?"
    ],
    beach: [
      "Which Kenyan beach has the clearest water?",
      "Are there family-friendly beach resorts?",
      "What water sports are available?"
    ],
    mountain: [
      "How difficult is Mount Kenya?",
      "What gear do I need for Mt. Kenya?",
      "Are there guided climbs available?"
    ]
  };

  // Combine suggestions
  const result = [
    ...suggestions.general,
    ...(interests.includes('safari') ? suggestions.safari : []),
    ...(interests.includes('beach') ? suggestions.beach : []),
    ...(interests.includes('mountain') ? suggestions.mountain : [])
  ].slice(0, 10); // Limit to 10

  res.json({
    success: true,
    data: result
  });
}));

// Helper function for fallback responses
function generateFallbackResponse(userMessage) {
  const keywords = {
    safari: "For safari information, visit our Safari Experiences page.",
    beach: "Our Beach Getaways section has details on coastal destinations.",
    booking: "You can make bookings directly on our platform. Need help with a specific booking?",
    payment: "We accept M-Pesa and credit cards. See Payment Methods for details."
  };

  const matchedKeyword = Object.keys(keywords).find(key =>
    userMessage.toLowerCase().includes(key)
  );

  return matchedKeyword
    ? `I'm having trouble accessing detailed information right now. ${keywords[matchedKeyword]}`
    : `I'm currently unable to access that information. For immediate help, please contact our support team at support@kenyatourism.com or call +254700000000.`;
}

export default router;