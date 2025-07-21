const chatSessions = {};

// Simple response generator (replace with actual AI integration)
async function generateBotResponse(message, history) {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return "Hello! Welcome to Go2Bookings. How can I assist you with your Kenya travel plans today?";
    } else if (lowerMessage.includes('hotel') || lowerMessage.includes('accommodation')) {
        return "We have a wide range of hotels across Kenya. Could you tell me which city or region you're interested in?";
    } else if (lowerMessage.includes('tour') || lowerMessage.includes('safari')) {
        return "Kenya offers amazing safari experiences! Popular destinations include Maasai Mara and Amboseli.";
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        return "Prices vary by season and package. Could you be more specific?";
    } else {
        return "I'm happy to help with your Kenya travel questions. What would you like to know?";
    }
}

exports.processMessage = async (req, res) => {
    try {
        const { message, sessionId = 'default' } = req.body;

        if (!chatSessions[sessionId]) {
            chatSessions[sessionId] = {
                history: [{
                    role: 'system',
                    content: "You are a helpful travel assistant for Go2Bookings in Kenya."
                }]
            };
        }

        // Add user message
        chatSessions[sessionId].history.push({
            role: 'user',
            content: message
        });

        // Generate response
        const botResponse = await generateBotResponse(message, chatSessions[sessionId].history);

        // Add bot response
        chatSessions[sessionId].history.push({
            role: 'assistant',
            content: botResponse
        });

        res.json({
            success: true,
            response: botResponse
        });
    } catch (error) {
        console.error('Error processing message:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process message'
        });
    }
};

exports.getChatHistory = (req, res) => {
    try {
        const { sessionId = 'default' } = req.params;
        res.json({
            success: true,
            history: chatSessions[sessionId]?.history || []
        });
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch history'
        });
    }
};

exports.clearChatHistory = (req, res) => {
    try {
        const { sessionId = 'default' } = req.params;
        delete chatSessions[sessionId];
        res.json({
            success: true,
            message: 'Chat history cleared'
        });
    } catch (error) {
        console.error('Error clearing history:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to clear history'
        });
    }
};