-- Create news_articles table
CREATE TABLE IF NOT EXISTS news_articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  url VARCHAR(1000) UNIQUE NOT NULL,
  image_url VARCHAR(1000),
  published_at TIMESTAMP NOT NULL,
  source_name VARCHAR(255) NOT NULL,
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster querying
CREATE INDEX IF NOT EXISTS idx_news_articles_category ON news_articles(category);
CREATE INDEX IF NOT EXISTS idx_news_articles_published_at ON news_articles(published_at);
CREATE INDEX IF NOT EXISTS idx_news_articles_title ON news_articles(title);
