const Resource = require("../models/Resource");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Upload a resource
const uploadResource = async (req, res) => {
  const { name, link } = req.body;
  const filePath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const newResource = await Resource.createResource({ name, link, filePath });
    res.status(201).json(newResource);
  } catch (error) {
    console.error("Error uploading resource:", error);
    res.status(500).json({ error: "Error uploading resource" });
  }
};

// Get all resources
const getAllResources = async (req, res) => {
  try {
    const resources = await Resource.getAllResources();
    res.status(200).json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({ error: "Error fetching resources" });
  }
};

module.exports = { uploadResource, getAllResources, upload };