const Whistle = require("../models/Whistle");

// Create a new whistle
const createWhistle = async (req, res) => {
  const { message } = req.body;
  try {
    const newWhistle = await Whistle.createWhistle(message);
    res.status(201).json({ message: "Whistle submitted successfully", whistle: newWhistle });
  } catch (error) {
    console.error("Error submitting whistle:", error);
    res.status(500).json({ message: "Error submitting whistle" });
  }
};

// Get all whistles (for admin purposes)
const getAllWhistles = async (req, res) => {
  try {
    const whistles = await Whistle.getAllWhistles();
    res.status(200).json(whistles);
  } catch (error) {
    console.error("Error fetching whistles:", error);
    res.status(500).json({ message: "Error fetching whistles" });
  }
};

module.exports = { createWhistle, getAllWhistles };