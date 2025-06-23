const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'safe_sphere',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

const db = {
  query: async (text, params) => {
    try {
      const res = await pool.query(text, params);
      return res;
    } catch (err) {
      console.error('Database error:', err);
      throw err;
    }
  }
};

// Create news articles table if it doesn't exist
const createNewsTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS news_articles (
        id SERIAL PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        content TEXT,
        url VARCHAR(500) NOT NULL,
        image_url VARCHAR(500),
        source_name VARCHAR(100),
        published_at TIMESTAMP,
        category VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create index for faster searches
    await db.query(`
      CREATE INDEX IF NOT EXISTS idx_news_category ON news_articles(category)
    `);
  } catch (error) {
    console.error('Error creating news table:', error);
  }
};

createNewsTable();

module.exports = {
  query: db.query,
};
