import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Simulated chatbot responses for better user experience
const CHATBOT_RESPONSES = {
  greetings: [
    "Hello! I'm your Kenya tourism assistant. How can I help you plan your adventure?",
    "Hi there! Ready to explore Kenya? I can help you find safaris, beaches, cultural tours, and more!",
    "Welcome! I'm here to help you discover the best of Kenya. What are you interested in?"
  ],
  safari: [
    "Kenya offers amazing safari experiences! The Maasai Mara is famous for the Great Migration. Would you like to know about safari packages or specific parks?",
    "For safaris, I recommend Maasai Mara, Amboseli, or Tsavo. Each offers unique wildlife experiences. What type of animals are you most excited to see?"
  ],
  beaches: [
    "Kenya's coast is stunning! Diani Beach, Watamu, and Malindi offer pristine beaches, water sports, and cultural experiences. Are you interested in relaxation or adventure activities?",
    "The Kenyan coast has beautiful beaches and rich Swahili culture. You can enjoy dhow cruises, snorkeling, and fresh seafood. What beach activities interest you most?"
  ],
  culture: [
    "Kenya has incredible cultural diversity! You can visit Maasai villages, explore Lamu's Swahili heritage, or experience traditional markets. What cultural aspects interest you?",
    "Cultural tours in Kenya include traditional dances, craft workshops, and community visits. The Maasai, Kikuyu, and Luo communities offer authentic experiences."
  ],
  food: [
    "Kenyan cuisine is delicious! Try nyama choma (grilled meat), ugali, sukuma wiki, and coastal dishes like biryani. Would you like restaurant recommendations?",
    "Food experiences include traditional cooking classes, local markets, and authentic restaurants. Coastal cuisine has Indian and Arabic influences. What type of food interests you?"
  ],
  transport: [
    "Getting around Kenya is easy! We offer airport transfers, safari vehicles, car rentals, and local transport. Where are you planning to travel?",
    "Transport options include private cars, matatus (local buses), and domestic flights. For safaris, 4WD vehicles are recommended. Need help with bookings?"
  ],
  default: [
    "That's interesting! I can help you with safaris, beaches, cultural tours, accommodation, food, and transport in Kenya. What would you like to explore?",
    "I'm here to help with your Kenya travel plans! You can ask about wildlife, beaches, culture, food, or any other travel needs.",
    "Let me help you discover Kenya! I can provide information about safaris, coastal experiences, cultural tours, and practical travel tips."
  ]
};

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const MessageComponent = ({ msg }: { msg: Message }) => (
  <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
      msg.sender === 'user' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-800'
    }`}>
      <p>{msg.text}</p>
      <p className="text-xs opacity-70 mt-1">
        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  </div>
);

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadInitialMessages();
    }
  }, [isOpen, messages.length]);

  const loadInitialMessages = () => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      text: CHATBOT_RESPONSES.greetings[0],
      sender: 'bot',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const getRandomResponse = (category: keyof typeof CHATBOT_RESPONSES) => {
    const responses = CHATBOT_RESPONSES[category] || CHATBOT_RESPONSES.default;
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const categorizeMessage = (text: string): keyof typeof CHATBOT_RESPONSES => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('safari') || lowerText.includes('wildlife') || lowerText.includes('animal')) {
      return 'safari';
    } else if (lowerText.includes('beach') || lowerText.includes('coast') || lowerText.includes('ocean')) {
      return 'beaches';
    } else if (lowerText.includes('culture') || lowerText.includes('tradition') || lowerText.includes('heritage')) {
      return 'culture';
    } else if (lowerText.includes('food') || lowerText.includes('meal') || lowerText.includes('restaurant')) {
      return 'food';
    } else if (lowerText.includes('transport') || lowerText.includes('car') || lowerText.includes('travel')) {
      return 'transport';
    } else if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
      return 'greetings';
    }
    return 'default';
  };

  const simulateTyping = async () => {
    setIsLoading(true);
    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    setIsLoading(false);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/message`, {
        message: text,
        sessionId: `session_${Date.now()}`,
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getRandomResponse(categorizeMessage(text)),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error.response?.data?.error || 
                         "Oops! I can't reach my brain right now. Please try again later.";
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: errorMessage,
        sender: 'bot',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/clear/${sessionId}`);
      setMessages([{
        id: '1',
        text: "Hi there! I'm your Go2Bookings Assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date(),
      }]);
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:bg-emerald-700 ${
          isOpen ? 'hidden' : 'block'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col"
          >
            <div className="bg-emerald-600 text-white p-4 rounded-t-lg flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Go2Bookings Assistant</h3>
                <p className="text-sm opacity-90">Your Kenya travel guide</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={clearChat}
                  className="text-xs bg-emerald-700 hover:bg-emerald-800 px-2 py-1 rounded"
                >
                  Clear
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="hover:bg-emerald-700 p-1 rounded"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => <Message key={msg.id} msg={msg} />)}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2">
                    <Loader className="animate-spin" size={16} />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200">
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(inputText); }} className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask about Go2Bookings..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  disabled={isLoading}
                  ref={inputRef}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputText.trim()}
                  className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;