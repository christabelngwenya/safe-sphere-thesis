const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const twilio = require('twilio');

// Initialize Twilio client
const twilioClient = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Handle emergency alert
router.post('/emergency', auth, async (req, res) => {
  try {
    const { latitude, longitude, timestamp } = req.body;
    const userId = req.user.id;

    // Get user's emergency contact
    const user = await User.findById(userId);
    if (!user || !user.emergency_contact) {
      return res.status(400).json({ error: 'Emergency contact not set' });
    }

    // Format location URL
    const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

    // Send SMS to emergency contact
    await twilioClient.messages.create({
      body: `EMERGENCY ALERT from ${user.name} ${user.surname}!\nLocation: ${locationUrl}\nTime: ${new Date(timestamp).toLocaleString()}\nPlease respond immediately.`,
      to: user.emergency_contact,
      from: process.env.TWILIO_PHONE_NUMBER
    });

    // Log emergency alert
    await db.query(
      'INSERT INTO emergency_alerts (user_id, latitude, longitude, timestamp) VALUES ($1, $2, $3, $4)',
      [userId, latitude, longitude, timestamp]
    );

    res.json({ success: true, message: 'Emergency alert sent successfully' });
  } catch (error) {
    console.error('Emergency alert error:', error);
    res.status(500).json({ error: 'Failed to send emergency alert' });
  }
});

module.exports = router; 