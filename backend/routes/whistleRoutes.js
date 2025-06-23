const express = require("express");
const router = express.Router();
const whistleController = require("../controllers/whistleController");

// Submit a whistle
router.post("/whistle", whistleController.createWhistle);

// Get all whistles (for admin purposes)
router.get("/whistles", whistleController.getAllWhistles);

module.exports = router;