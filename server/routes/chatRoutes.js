const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Process new chat message
router.post('/message', chatController.processMessage);

// Get chat history
router.get('/history/:sessionId', chatController.getChatHistory);

// Clear chat history
router.delete('/clear/:sessionId', chatController.clearChatHistory);

module.exports = router;