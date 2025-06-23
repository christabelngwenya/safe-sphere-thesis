const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');

// Login route
router.post(
  '/login',
  [
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').notEmpty().withMessage('Password is required')
  ],
  authController.login
);

// Signup route
router.post(
  '/signup',
  [
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('name').notEmpty().withMessage('Name is required'),
    check('surname').notEmpty().withMessage('Surname is required')
  ],
  authController.signup
);

// Protected test route (example)
router.get('/protected', authController.authenticate, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;