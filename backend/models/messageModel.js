const pool = require('../config/db');

// Get all messages
const getAllMessages = async () => {
  const result = await pool.query('SELECT * FROM messages ORDER BY created_at ASC');
  return result.rows;
};

// Create a new message
const createMessage = async (text, imageUrl, voiceNoteUrl, userEmail) => {
  await pool.query(
    'INSERT INTO messages (text, image_url, voice_note_url, user_email) VALUES ($1, $2, $3, $4)',
    [text, imageUrl, voiceNoteUrl, userEmail]
  );
};

module.exports = {
  getAllMessages,
  createMessage,
};