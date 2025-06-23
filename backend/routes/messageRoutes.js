const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getMessages, sendMessage } = require('../controllers/messageController');
const Message = require('../models/Message');
const auth = require('../middleware/auth');

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Routes
router.get('/messages', getMessages);
router.post('/messages', upload.fields([{ name: 'image' }, { name: 'voiceNote' }]), sendMessage);

// Get all messages
router.get('/', auth, async (req, res) => {
  try {
    const messages = await Message.getAll();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

// Create a new message
router.post('/', auth, async (req, res) => {
  try {
    const { content, replyToId } = req.body;
    const userId = req.user.id;

    const message = await Message.create({
      content,
      userId,
      replyToId
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Error creating message' });
  }
});

// Delete a message
router.delete('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this message' });
    }

    await Message.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Error deleting message' });
  }
});

module.exports = router;