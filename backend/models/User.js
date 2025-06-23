const bcrypt = require('bcrypt');
const db = require('../config/db');

class User {
  static async findByEmail(email) {
    try {
      const { rows } = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async create(userData) {
    try {
      const { rows } = await db.query(
        `INSERT INTO users (
          email, password_hash, name, surname, contact_info,
          college, emergency_contact, next_of_kin,
          expected_completion_year, program, campus_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *`,
        [
          userData.email,
          userData.password_hash,
          userData.name,
          userData.surname,
          userData.contact_info,
          userData.college,
          userData.emergency_contact,
          userData.next_of_kin,
          userData.expected_completion_year,
          userData.program,
          userData.campus_status
        ]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async comparePasswords(candidatePassword, hashedPassword) {
    return bcrypt.compare(candidatePassword, hashedPassword);
  }

  static async updateLastLogin(userId) {
    try {
      await db.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [userId]
      );
    } catch (error) {
      throw error;
    }
  }

  static async updateProfile(userId, updateData) {
    try {
      const fields = Object.keys(updateData)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(', ');

      const values = Object.values(updateData);
      const query = `
        UPDATE users 
        SET ${fields}
        WHERE id = $1
        RETURNING *
      `;

      const { rows } = await db.query(query, [userId, ...values]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;