const { getAllMessages, createMessage } = require('../models/messageModel');

// Get all messages
const getMessages = async (req, res) => {
  try {
    const messages = await getAllMessages();
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Send a new message
const sendMessage = async (req, res) => {
  const { text, userEmail } = req.body;
  const imageUrl = req.files['image'] ? `/uploads/${req.files['image'][0].filename}` : null;
  const voiceNoteUrl = req.files['voiceNote'] ? `/uploads/${req.files['voiceNote'][0].filename}` : null;

  try {
    await createMessage(text, imageUrl, voiceNoteUrl, userEmail);
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getMessages,
  sendMessage,
};