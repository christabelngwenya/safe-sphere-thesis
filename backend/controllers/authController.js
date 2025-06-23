const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authController = {
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Compare passwords
      const isMatch = await User.comparePasswords(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Update last login
      await User.updateLastLogin(user.id);

      // Create JWT token
      const token = jwt.sign(
        { 
          userId: user.id,
          email: user.email,
          name: user.name,
          college: user.college
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Return token and user data (excluding password)
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        surname: user.surname,
        college: user.college,
        program: user.program,
        campus_status: user.campus_status
      };

      res.json({ token, user: userData });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  signup: async (req, res) => {
    const { email, password, name, surname } = req.body;

    try {
      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Create new user
      const newUser = await User.create({
        email,
        password,
        name,
        surname,
        college: req.body.college || '',
        program: req.body.program || '',
        campus_status: req.body.campus_status || 'off-campus'
      });

      // Create JWT token
      const token = jwt.sign(
        { 
          userId: newUser.id,
          email: newUser.email,
          name: newUser.name,
          college: newUser.college
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Return token and user data
      const userData = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        surname: newUser.surname,
        college: newUser.college,
        program: newUser.program,
        campus_status: newUser.campus_status
      };

      res.status(201).json({ token, user: userData });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  authenticate: async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  }
};

module.exports = authController;