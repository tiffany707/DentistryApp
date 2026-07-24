const express = require('express');
const router = express.Router();
const User = require('../models/Users.js');

// 1. SIGNUP ENDPOINT (Create a new user)
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already taken' });
    }

    // Create a new user using the Mongoose model
    const newUser = new User({ 
      email, 
      password 
    });

    // Save to MongoDB Atlas (this triggers the collection creation if it doesn't exist yet)
    await newUser.save();

    res.status(201).json({ 
      message: 'User created successfully!', 
      user: { id: newUser._id, email: newUser.email } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error while creating user' });
  }
});

module.exports = router;