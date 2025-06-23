const pool = require("../config/db");

class Whistle {
  static async createWhistle(message) {
    const query = `
      INSERT INTO whistles (message)
      VALUES ($1)
      RETURNING *;
    `;
    const values = [message];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async getAllWhistles() {
    const query = `
      SELECT * FROM whistles;
    `;
    const { rows } = await pool.query(query);
    return rows;
  }
}

module.exports = Whistle;