import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/chat';

const Message = ({ msg }) => (
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
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(`session_${Date.now()}`);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize chat
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadInitialMessages();
    }
  }, [isOpen]);

  const loadInitialMessages = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/history/${sessionId}`);
      if (response.data.history.length > 0) {
        const formattedMessages = response.data.history
          .filter(m => m.role !== 'system')
          .map(m => ({
            id: Date.now().toString(),
            text: m.content,
            sender: m.role === 'user' ? 'user' : 'bot',
            timestamp: new Date()
          }));
        setMessages(formattedMessages);
      } else {
        setMessages([{
          id: '1',
          text: "Hi there! I'm your Go2Bookings Assistant. How can I help you today?",
          sender: 'bot',
          timestamp: new Date(),
        }]);
      }
    } catch (error) {
      console.error('Error loading history:', error);
      setMessages([{
        id: '1',
        text: "Hi there! I'm your Go2Bookings Assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date(),
      }]);
    }
  };

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = {
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
        sessionId
      });

      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: response.data.response,
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