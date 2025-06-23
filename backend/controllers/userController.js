const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signup = async (req, res) => {
  const {
    email,
    password,
    name,
    surname,
    contactInfo,
    college,
    emergencyContact,
    nextOfKin,
    expectedCompletionYear,
    program,
    campusStatus
  } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user in database
    const user = await User.create({
      email,
      password_hash,
      name,
      surname,
      contact_info: contactInfo,
      college,
      emergency_contact: emergencyContact,
      next_of_kin: nextOfKin,
      expected_completion_year: expectedCompletionYear,
      program,
      campus_status: campusStatus
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        name: user.name,
        college: user.college
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        surname: user.surname,
        college: user.college,
        program: user.program,
        campus_status: user.campus_status
      }
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Error creating user account" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if the password matches
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    // Return the token and user details (excluding the password)
    res.status(200).json({ token, user: { ...user, password: undefined } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { signup, login };