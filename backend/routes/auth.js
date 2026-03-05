const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router(); // ✅ ADDED THIS LINE TO FIX THE ERROR

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// REGISTER ROUTE
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body; // ✅ Added role here

    // Check existing user
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: role || "user" // ✅ Now saves the role you select
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && await user.matchPassword(password)) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role)
      });
    } else {
      res.status(401).json({
        message: "Invalid email or password"
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;