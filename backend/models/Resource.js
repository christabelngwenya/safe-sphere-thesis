const db = require('../config/db');

class Resource {
  static async getAll() {
    try {
      const { rows } = await db.query(`
        SELECT 
          r.*,
          u.email as userEmail
        FROM resources r
        LEFT JOIN users u ON r.user_id = u.id
        ORDER BY r.created_at DESC
      `);
      return rows.map(resource => ({
        id: resource.id,
        title: resource.title,
        description: resource.description,
        fileUrl: resource.file_url,
        link: resource.link,
        userId: resource.user_id,
        userEmail: resource.useremail,
        createdAt: resource.created_at
      }));
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const { rows } = await db.query(
        'SELECT * FROM resources WHERE id = $1',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async create({ title, description, fileUrl, link, userId }) {
    try {
      const { rows } = await db.query(
        `INSERT INTO resources (title, description, file_url, link, user_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [title, description, fileUrl, link, userId]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      await db.query('DELETE FROM resources WHERE id = $1', [id]);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Resource;