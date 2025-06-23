const express = require('express');
const axios = require('axios');
const router = express.Router();

// News API configuration
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_URL = 'https://newsapi.org/v2/everything';

// Get news articles
router.get('/news', async (req, res) => {
  try {
    // Default query parameters
    const params = {
      q: 'mental health OR domestic violence OR abuse OR safety',
      language: 'en',
      sortBy: 'publishedAt',
      pageSize: 10,
      apiKey: NEWS_API_KEY
    };

    // Add optional query parameters from request
    if (req.query.category) {
      params.q = req.query.category;
    }
    if (req.query.pageSize) {
      params.pageSize = parseInt(req.query.pageSize);
    }
    if (req.query.page) {
      params.page = parseInt(req.query.page);
    }

    // Make request to News API
    const response = await axios.get(NEWS_API_URL, { params });
    
    // Transform the response to include only necessary fields
    const articles = response.data.articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.urlToImage,
      publishedAt: article.publishedAt,
      source: {
        name: article.source.name
      }
    }));

    res.json({
      status: 'success',
      totalResults: response.data.totalResults,
      articles
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch news articles'
    });
  }
});

module.exports = router;
