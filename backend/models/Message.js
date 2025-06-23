const db = require('../config/db');

class Message {
  static async getAll() {
    try {
      const { rows } = await db.query(`
        SELECT 
          m.*,
          u.email as userEmail,
          r.content as replyToContent
        FROM messages m
        LEFT JOIN users u ON m.user_id = u.id
        LEFT JOIN messages r ON m.reply_to_id = r.id
        ORDER BY m.created_at DESC
      `);
      return rows.map(message => ({
        id: message.id,
        content: message.content,
        userId: message.user_id,
        userEmail: message.useremail,
        createdAt: message.created_at,
        replyTo: message.replytocontent ? {
          id: message.reply_to_id,
          content: message.replytocontent
        } : null
      }));
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const { rows } = await db.query(
        'SELECT * FROM messages WHERE id = $1',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async create({ content, userId, replyToId }) {
    try {
      const { rows } = await db.query(
        `INSERT INTO messages (content, user_id, reply_to_id)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [content, userId, replyToId]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      await db.query('DELETE FROM messages WHERE id = $1', [id]);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Message; 