const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Endpoint to handle abuse reports
router.post("/", (req, res) => {
  const { name, email, message, anonymous } = req.body;

  const sql = "INSERT INTO reports (name, email, message, anonymous) VALUES (?, ?, ?, ?)";
  db.query(sql, [name || null, email || null, message, anonymous], (err, result) => {
    if (err) {
      console.error("Error saving the report:", err);
      res.status(500).send("Error saving the report.");
    } else {
      res.status(201).send("Report submitted successfully.");
    }
  });
});

module.exports = router;
