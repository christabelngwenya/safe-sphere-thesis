require("dotenv").config();

// Initialize Express app
const express = require("express");
const cors = require("cors");
const { check, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");
const path = require("path");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const fs = require("fs");
const User = require("./models/User");
const crypto = require('crypto');
const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'safe_sphere',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
  console.log('Connected to PostgreSQL database');
});

const app = express();
const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
const saltRounds = 10;

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

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '24h' });
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Add dummy user for testing
const createDummyUser = async () => {
  try {
    const passwordHash = await bcrypt.hash('test123', saltRounds);
    await db.query(
      'INSERT INTO users (email, password_hash, name, surname) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
      ['test@example.com', passwordHash, 'Test', 'User']
    );
  } catch (error) {
    console.error('Error creating dummy user:', error);
  }
};

// Create dummy user on server start
createDummyUser();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = ["http://localhost:3000", "http://localhost:5173"];
app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Rate limiting
const reportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many submissions from this IP, please try again later.",
});

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Ensure uploads directory exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Helper function for MD5 hashing (consistent with water management project)
const md5 = (text) => {
  return crypto.createHash('md5').update(text).digest('hex');
};

// Helper function to format Zimbabwean phone numbers
const formatZimPhoneNumber = (phone) => {
  // Remove any non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // If phone starts with 07, convert to international format
  if (digits.startsWith('07')) {
    return '+263' + digits.substring(1);
  }
  
  // If phone starts with 7, add country code
  if (digits.startsWith('7')) {
    return '+263' + digits;
  }
  
  // If phone already has country code, return as is
  if (digits.startsWith('263')) {
    return '+' + digits;
  }
  
  // If phone is already in international format, return as is
  if (phone.startsWith('+263')) {
    return phone;
  }
  
  return null; // Invalid format
};

// Helper function to validate Zimbabwean phone numbers
const validateZimPhoneNumber = (phone) => {
  const formatted = formatZimPhoneNumber(phone);
  if (!formatted) {
    return false;
  }
  // Zimbabwean phone numbers should be 13 digits including country code
  return formatted.length === 13;
};

// Helper function to format emergency contact number before sending SMS
const formatEmergencyContact = (contact) => {
  // First try to format as Zimbabwean number
  const formatted = formatZimPhoneNumber(contact);
  if (formatted) return formatted;
  
  // If not Zimbabwean, return as is (for international numbers)
  return contact;
};

// Send SMS using Twilio (requires Twilio account setup)
const sendSMS = async (to, message) => {
  try {
    // Format the phone number
    const formattedNumber = formatEmergencyContact(to);
    if (!formattedNumber) {
      throw new Error('Invalid phone number format');
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedNumber
    });
    
    console.log(`SMS sent successfully to ${formattedNumber}`);
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};

// Signup endpoint
app.post('/api/auth/signup', [
  check('email').isEmail().withMessage('Please provide a valid email'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const newUser = await db.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, hashedPassword]
    );

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.rows[0].id,
        email: newUser.rows[0].email,
        created_at: newUser.rows[0].created_at
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// SOS Alert endpoint
app.post('/api/sos', authenticateToken, async (req, res) => {
  try {
    const { location, userDetails } = req.body;
    const { emergencyContact } = userDetails;

    // Format the emergency message
    const message = `🚨 EMERGENCY ALERT 🚨
Student Name: ${userDetails.name}
Contact: ${userDetails.contact}
Program: ${userDetails.program}
Campus Status: ${userDetails.campusStatus}
Location: ${location.latitude}, ${location.longitude}

Please respond immediately!`;

    // Send SMS to emergency contact
    await sendSMS(emergencyContact, message);

    res.json({
      success: true,
      message: 'SOS alert sent successfully'
    });
  } catch (error) {
    console.error('Error in SOS endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send SOS alert'
    });
  }
});

// News API endpoints
const newsModel = require('./models/NewsArticle');

// Helper function to fetch news from News API
const fetchNewsFromAPI = async () => {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    const sources = ['zbcnews', 'newzimbabwe']; // Add more Zimbabwean news sources
    
    // Fetch university-related news
    const universityResponse = await fetch(
      `https://newsapi.org/v2/everything?q=university Zimbabwe OR Zimbabwe university&apiKey=${apiKey}`
    );
    
    // Fetch girl child-related news
    const girlChildResponse = await fetch(
      `https://newsapi.org/v2/everything?q="girl child" OR "female education" Zimbabwe&apiKey=${apiKey}`
    );
    
    const [universityData, girlChildData] = await Promise.all([
      universityResponse.json(),
      girlChildResponse.json()
    ]);

    const allArticles = [...universityData.articles, ...girlChildData.articles];
    
    // Save to database
    for (const article of allArticles) {
      await db.query(
        `INSERT INTO news_articles (title, description, url, url_to_image, published_at, source_name, content, category)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (url) DO NOTHING`,
        [
          article.title,
          article.description,
          article.url,
          article.urlToImage,
          new Date(article.publishedAt),
          article.source?.name || 'Unknown',
          article.content,
          article.category || 'general'
        ]
      );
    }

    console.log('News articles updated successfully');
  } catch (error) {
    console.error('Error fetching news:', error);
  }
};

// Schedule news update every 24 hours
const schedule = require('node-schedule');
const j = schedule.scheduleJob('0 0 * * *', () => {
  console.log('Updating news articles...');
  fetchNewsFromAPI();
});

// News routes
app.use('/api/news', require('./routes/newsRoutes'));

// Fetch news endpoint
app.get('/api/news', async (req, res) => {
  try {
    const { category = 'all', search = '' } = req.query;
    
    const query = `
      SELECT * FROM news_articles 
      WHERE (
        $1 = 'all' OR category = $1
      )
      AND (
        title ILIKE $2 OR 
        description ILIKE $2 OR 
        content ILIKE $2
      )
      ORDER BY published_at DESC
      LIMIT 50
    `;
    
    const params = [
      category,
      `%${search}%`
    ];
    
    const result = await newsModel.query(query, params);
    res.json({
      success: true,
      news: result.rows
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news'
    });
  }
});

// Get single news article
app.get('/api/news/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await newsModel.query('SELECT * FROM news_articles WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'News article not found'
      });
    }
    
    res.json({
      success: true,
      news: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching news article:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news article'
    });
  }
});

// Delete old news articles (older than 30 days)
app.delete('/api/news/old', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    await newsModel.query('DELETE FROM news_articles WHERE published_at < $1', [thirtyDaysAgo]);
    res.json({
      success: true,
      message: 'Old news articles deleted'
    });
  } catch (error) {
    console.error('Error deleting old news:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete old news articles'
    });
  }
});

// Add news update endpoint for manual updates
app.post('/api/news/update', async (req, res) => {
  try {
    await fetchNewsFromAPI();
    res.json({
      success: true,
      message: 'News articles updated'
    });
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update news articles'
    });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    // Return all user fields from the database
    // Ensure sensitive fields like password_hash are not sent
    const { password_hash, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user details endpoint
app.put('/api/users/:id', authenticateToken, [
  check('email').optional().isEmail().withMessage('Invalid email format'),
  check('expected_completion_year').optional().isLength({ min: 4, max: 4 }).isNumeric().withMessage('Invalid year format'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userIdFromToken = req.user.id;
  const userIdFromParams = parseInt(req.params.id, 10);

  if (userIdFromToken !== userIdFromParams) {
    return res.status(403).json({ message: 'Forbidden: You can only update your own profile.' });
  }

  const {
    name,
    surname,
    contact_info,
    college,
    emergency_contact,
    next_of_kin,
    next_of_kin_contact,
    expected_completion_year,
    program,
    campus_status,
  } = req.body;

  // Fields that can be updated
  const allowedFields = {
    name,
    surname,
    contact_info,
    college,
    emergency_contact,
    next_of_kin,
    next_of_kin_contact,
    expected_completion_year,
    program,
    campus_status,
  };

  const fieldsToUpdate = {};
  const queryParams = [];
  let querySetString = '';
  let paramIndex = 1;

  for (const key in allowedFields) {
    if (allowedFields[key] !== undefined) { // Check if the field was provided in the body
      fieldsToUpdate[key] = allowedFields[key];
      if (queryParams.length > 0) querySetString += ', ';
      querySetString += `${key} = $${paramIndex}`;
      queryParams.push(allowedFields[key]);
      paramIndex++;
    }
  }

  if (queryParams.length === 0) {
    return res.status(400).json({ message: 'No fields to update provided.' });
  }

  // Add updated_at timestamp
  querySetString += `, updated_at = CURRENT_TIMESTAMP`;
  queryParams.push(userIdFromParams); // For the WHERE clause

  const updateUserQuery = `UPDATE users SET ${querySetString} WHERE id = $${paramIndex} RETURNING *`;

  try {
    const result = await db.query(updateUserQuery, queryParams);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const { password_hash, ...updatedUser } = result.rows[0];
    res.json({ message: 'Profile updated successfully', user: updatedUser });

  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error while updating profile.' });
  }
});

// Update user password endpoint
app.put('/api/users/:id/password', authenticateToken, async (req, res) => {
  try {
    const userIdFromToken = req.user.id;
    const userIdFromParams = parseInt(req.params.id, 10);

    if (userIdFromToken !== userIdFromParams) {
      return res.status(403).json({ message: 'Forbidden: You can only update your own password.' });
    }

    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({ message: 'Current password and new password are required.' });
    }

    // Get user's current password hash
    const result = await db.query('SELECT password_hash FROM users WHERE id = $1', [userIdFromParams]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Verify current password
    const validPassword = await bcrypt.compare(current_password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(new_password, saltRounds);

    // Update password
    await db.query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newPasswordHash, userIdFromParams]
    );

    res.json({ message: 'Password updated successfully.' });

  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Server error while updating password.' });
  }
});

// Protected route example
app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

// ==================== ABUSE REPORT ROUTES ====================
app.post(
  "/api/reports",
  reportLimiter,
  [
    check("message").not().isEmpty().withMessage("Report description is required."),
    check("email")
      .if(check("anonymous").equals(false))
      .isEmail()
      .withMessage("Valid email is required when not anonymous."),
    check("incident_date")
      .optional({ nullable: true })
      .isISO8601()
      .withMessage("Incident date must be a valid ISO 8601 date.")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      email,
      message,
      anonymous,
      incident_location,
      incident_date,
      report_category,
    } = req.body;

    try {
      const result = await db.query(
        `INSERT INTO abuse_reports (
          reporter_name,
          reporter_email,
          message,
          is_anonymous,
          status,
          incident_location,
          incident_date,
          report_category
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        [
          anonymous ? null : name,
          anonymous ? null : email,
          message,
          anonymous,
          "pending",
          incident_location || null,
          incident_date ? new Date(incident_date) : null,
          report_category || null
        ]
      );

      res.status(201).json({
        success: true,
        reportId: result.rows[0].id,
        message: "Report submitted successfully."
      });

    } catch (error) {
      console.error("Error submitting report:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to submit report. Please try again later."
      });
    }
  }
);

// Get all reports
app.get("/api/reports", async (req, res) => {
  try {
    const { rows } = await db.query(
      "SELECT id, created_at, is_anonymous, status FROM abuse_reports ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching reports:", error.message);
    res.status(500).json({ error: "Server error while fetching reports." });
  }
});

// ==================== WHISTLEBLOWING ROUTES ====================
app.post(
  "/api/whistle",
  reportLimiter,
  [
    check("message").not().isEmpty().withMessage("Whistle description is required."),
    check("incident_date")
      .optional({ nullable: true })
      .isISO8601()
      .withMessage("Incident date must be a valid ISO 8601 date.")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message, category, incident_date, location } = req.body;

    try {
      const result = await db.query(
        `INSERT INTO whistles (
          message,
          category,
          incident_date,
          location,
          status
        ) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [
          message,
          category || null,
          incident_date ? new Date(incident_date) : null,
          location || null,
          "pending"
        ]
      );

      res.status(201).json({
        success: true,
        whistleId: result.rows[0].id,
        message: "Whistle submitted successfully."
      });

    } catch (error) {
      console.error("Error submitting whistle:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to submit whistle. Please try again later."
      });
    }
  }
);

// Get all whistles
app.get("/api/whistles", async (req, res) => {
  try {
    const { rows } = await db.query(
      "SELECT id, created_at, category, status FROM whistles ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching whistles:", error.message);
    res.status(500).json({ error: "Server error while fetching whistles." });
  }
});

// ==================== EDUCATIONAL RESOURCES ROUTES ====================
app.get("/api/resources", async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM educational_resources ORDER BY created_at DESC");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching resources:", error.message);
    res.status(500).json({ error: "Server error while fetching resources." });
  }
});

app.post(
  "/api/resources",
  upload.single("file"),
  [
    check("name").not().isEmpty().withMessage("Resource name is required."),
    check("link")
      .optional({ nullable: true })
      .isURL({ protocols: ["https"], require_protocol: true })
      .withMessage("Link must be a secure URL starting with 'https://'.")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, link } = req.body;
    const file_path = req.file ? `/uploads/${req.file.filename}` : null;

    try {
      const result = await db.query(
        `INSERT INTO educational_resources (name, link, file_path, created_at)
         VALUES ($1, $2, $3, NOW()) RETURNING *`,
        [name, link || null, file_path]
      );

      res.status(201).json(result.rows[0]);

    } catch (error) {
      console.error("Error uploading resource:", error.message);
      res.status(500).json({ error: "Failed to upload resource." });
    }
  }
);

// ==================== GIRLS CORNER / MESSAGES ROUTES ====================
app.get("/api/messages", async (req, res) => {
  const { query } = req.query;
  try {
    let queryText = "SELECT * FROM messages ORDER BY created_at ASC";
    let queryParams = [];

    if (query) {
      queryText = "SELECT * FROM messages WHERE text ILIKE $1 ORDER BY created_at ASC";
      queryParams = [`%${query}%`];
    }

    const { rows } = await db.query(queryText, queryParams);
    res.json(rows);

  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ error: "Server error while fetching messages." });
  }
});

app.post("/api/messages", upload.single("file"), async (req, res) => {
  const { text } = req.body;
  const file_url = req.file ? `/uploads/${req.file.filename}` : null;
  const type = req.file ? req.file.mimetype.split("/")[0] : "text";

  try {
    const result = await db.query(
      `INSERT INTO messages (text, file_url, type, created_at)
       VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [text || null, file_url, type]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).json({ error: "Failed to send message." });
  }
});

app.delete("/api/messages/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM messages WHERE id = $1", [id]);
    res.status(200).json({ success: true, message: "Message deleted successfully." });
  } catch (error) {
    console.error("Error deleting message:", error.message);
    res.status(500).json({ error: "Failed to delete message." });
  }
});

// ==================== ERROR HANDLING ====================
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled for origins: ${allowedOrigins.join(", ")}`);
});