const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Resource = require('../models/Resource');
const auth = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Get all resources
router.get('/', auth, async (req, res) => {
  try {
    const resources = await Resource.getAll();
    res.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Error fetching resources' });
  }
});

// Create a new resource
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    const { title, description, link } = req.body;
    const userId = req.user.id;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const resource = await Resource.create({
      title,
      description,
      fileUrl,
      link,
      userId
    });

    res.status(201).json(resource);
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ error: 'Error creating resource' });
  }
});

// Delete a resource
router.delete('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    if (resource.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this resource' });
    }

    await Resource.delete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ error: 'Error deleting resource' });
  }
});

module.exports = router; 