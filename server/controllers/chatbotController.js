const { TripCart, Booking } = require('../models/bookings');
const Service = require('../models/service');
const User = require('../models/user');

// Enhanced chatbot with booking system integration
exports.handleChatMessage = async (req, res) => {
  try {
    const { message, context } = req.body;
    const userId = req.user?.userId;
    
    const response = await processUserMessage(message, userId, context);
    
    res.json({
      success: true,
      response: response.text,
      actions: response.actions || [],
      suggestions: response.suggestions || []
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ 
      error: 'Sorry, I encountered an error. Please try again.',
      success: false 
    });
  }
};

async function processUserMessage(message, userId, context = {}) {
  const lowerMessage = message.toLowerCase();
  
  // Greeting patterns
  if (lowerMessage.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
    return {
      text: "Hello! 👋 Welcome to Kenya Tourism Hub! I'm here to help you plan your perfect Kenyan adventure. I can assist you with:\n\n🍽️ Finding amazing local meals\n🏨 Booking comfortable stays\n🎯 Discovering exciting experiences\n🛒 Managing your trip cart\n📋 Checking your bookings\n\nWhat would you like to explore today?",
      suggestions: ["Show me meals", "Find stays", "Browse experiences", "View my cart"]
    };
  }
  
  // Cart-related queries
  if (lowerMessage.includes('cart') || lowerMessage.includes('basket')) {
    if (userId) {
      const cart = await TripCart.findOne({ userId, status: 'active' }).populate('items.serviceId');
      
      if (!cart || cart.items.length === 0) {
        return {
          text: "Your trip cart is currently empty. 🛒\n\nStart building your perfect Kenyan adventure by browsing our services:",
          actions: [
            { type: 'navigate', url: '/meals', label: 'Browse Meals' },
            { type: 'navigate', url: '/stays', label: 'Find Stays' },
            { type: 'navigate', url: '/experiences', label: 'Discover Experiences' }
          ]
        };
      }
      
      const cartSummary = cart.items.map(item => 
        `• ${item.serviceId.title} - KES ${item.price} (${item.quantity}x, ${item.guests} guests)`
      ).join('\n');
      
      return {
        text: `Here's what's in your trip cart: 🛒\n\n${cartSummary}\n\n💰 Total: KES ${cart.totalAmount}\n\nReady to proceed to checkout?`,
        actions: [
          { type: 'navigate', url: '/checkout', label: 'Proceed to Checkout' },
          { type: 'navigate', url: '/cart', label: 'View Full Cart' }
        ]
      };
    } else {
      return {
        text: "Please log in to view your cart and start planning your trip! 🔐",
        actions: [{ type: 'navigate', url: '/login', label: 'Login' }]
      };
    }
  }
  
  // Booking-related queries
  if (lowerMessage.includes('booking') || lowerMessage.includes('reservation')) {
    if (userId) {
      const bookings = await Booking.find({ userId }).sort({ createdAt: -1 }).limit(3);
      
      if (bookings.length === 0) {
        return {
          text: "You don't have any bookings yet. 📅\n\nStart planning your Kenyan adventure today!",
          actions: [
            { type: 'navigate', url: '/services', label: 'Browse Services' }
          ]
        };
      }
      
      const bookingSummary = bookings.map(booking => 
        `• ${booking.bookingReference} - ${booking.status} (KES ${booking.totalAmount})`
      ).join('\n');
      
      return {
        text: `Here are your recent bookings: 📋\n\n${bookingSummary}\n\nWould you like to view more details?`,
        actions: [
          { type: 'navigate', url: '/dashboard', label: 'View All Bookings' }
        ]
      };
    } else {
      return {
        text: "Please log in to view your bookings! 🔐",
        actions: [{ type: 'navigate', url: '/login', label: 'Login' }]
      };
    }
  }
  
  // Service search queries
  if (lowerMessage.includes('meal') || lowerMessage.includes('food') || lowerMessage.includes('restaurant')) {
    const meals = await Service.find({ category: 'meals', isActive: true }).limit(3);
    const mealList = meals.map(meal => `• ${meal.title} - KES ${meal.price}`).join('\n');
    
    return {
      text: `Here are some popular Kenyan meals: 🍽️\n\n${mealList}\n\nWould you like to see more options?`,
      actions: [
        { type: 'navigate', url: '/meals', label: 'View All Meals' }
      ],
      suggestions: ["Add to cart", "Find stays", "Browse experiences"]
    };
  }
  
  if (lowerMessage.includes('stay') || lowerMessage.includes('hotel') || lowerMessage.includes('accommodation')) {
    const stays = await Service.find({ category: 'stays', isActive: true }).limit(3);
    const stayList = stays.map(stay => `• ${stay.title} - KES ${stay.price}`).join('\n');
    
    return {
      text: `Here are some great accommodation options: 🏨\n\n${stayList}\n\nWould you like to explore more?`,
      actions: [
        { type: 'navigate', url: '/stays', label: 'View All Stays' }
      ],
      suggestions: ["Add to cart", "Find meals", "Browse experiences"]
    };
  }
  
  if (lowerMessage.includes('experience') || lowerMessage.includes('activity') || lowerMessage.includes('tour')) {
    const experiences = await Service.find({ category: 'experiences', isActive: true }).limit(3);
    const expList = experiences.map(exp => `• ${exp.title} - KES ${exp.price}`).join('\n');
    
    return {
      text: `Discover amazing Kenyan experiences: 🎯\n\n${expList}\n\nReady for an adventure?`,
      actions: [
        { type: 'navigate', url: '/experiences', label: 'View All Experiences' }
      ],
      suggestions: ["Add to cart", "Find meals", "Find stays"]
    };
  }
  
  // Payment-related queries
  if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('mpesa') || lowerMessage.includes('stripe')) {
    return {
      text: "We support multiple payment methods for your convenience: 💳\n\n• M-Pesa (Mobile Money)\n• Credit/Debit Cards via Stripe\n• Secure online payments\n\nAll payments are processed securely. You can pay during checkout after adding items to your cart.",
      suggestions: ["View cart", "Browse services", "Check bookings"]
    };
  }
  
  // Help queries
  if (lowerMessage.includes('help') || lowerMessage.includes('how') || lowerMessage.includes('guide')) {
    return {
      text: "I'm here to help! 🤝 Here's how to use our platform:\n\n1️⃣ Browse meals, stays, and experiences\n2️⃣ Add items to your trip cart\n3️⃣ Proceed to checkout when ready\n4️⃣ Pay securely via M-Pesa or card\n5️⃣ Track your bookings in the dashboard\n\nWhat specific help do you need?",
      suggestions: ["Browse services", "View cart", "Check bookings", "Payment info"]
    };
  }
  
  // Location-based queries
  if (lowerMessage.includes('nairobi') || lowerMessage.includes('mombasa') || lowerMessage.includes('kisumu') || lowerMessage.includes('nakuru')) {
    const location = lowerMessage.match(/(nairobi|mombasa|kisumu|nakuru)/i)?.[0];
    const services = await Service.find({ 
      region: new RegExp(location, 'i'), 
      isActive: true 
    }).limit(5);
    
    if (services.length > 0) {
      const serviceList = services.map(service => 
        `• ${service.title} (${service.category}) - KES ${service.price}`
      ).join('\n');
      
      return {
        text: `Here are services available in ${location}: 📍\n\n${serviceList}\n\nWould you like to see more options in this area?`,
        actions: [
          { type: 'navigate', url: `/services?region=${location}`, label: `More in ${location}` }
        ]
      };
    }
  }
  
  // Price-related queries
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('budget')) {
    return {
      text: "Our services cater to all budgets! 💰\n\n🍽️ Meals: KES 500 - 5,000\n🏨 Stays: KES 2,000 - 15,000 per night\n🎯 Experiences: KES 1,000 - 10,000\n\nYou can filter services by price range when browsing. What's your budget range?",
      suggestions: ["Budget meals", "Mid-range stays", "Premium experiences", "View all services"]
    };
  }
  
  // Default response with context awareness
  const responses = [
    "I'd be happy to help you plan your Kenyan adventure! 🇰🇪 Could you tell me more about what you're looking for?",
    "That's interesting! Let me help you find the perfect services for your trip. What type of experience are you seeking?",
    "I'm here to assist with your Kenya travel plans! Would you like to browse meals, stays, or experiences?",
    "Great question! I can help you with bookings, payments, or finding services. What would you like to know more about?"
  ];
  
  return {
    text: responses[Math.floor(Math.random() * responses.length)],
    suggestions: ["Show me meals", "Find stays", "Browse experiences", "View my cart", "Help"]
  };
}

// Get chat history (if implementing chat persistence)
exports.getChatHistory = async (req, res) => {
  try {
    // For now, return empty history
    // In a full implementation, you'd store and retrieve chat messages
    res.json({
      success: true,
      messages: []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
