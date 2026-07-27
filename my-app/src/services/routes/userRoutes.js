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

//find shifts that are nearby the clinic
router.get('/professionalsNearby', async (req, res) =>{
  try {
      const { lng, lat, maxDistance } = req.query;

      // 1. Validate that longitude and latitude are provided
      if (!lng || !lat) {
          return res.status(400).json({ error: 'Longitude (lng) and latitude (lat) are required queries.' });
      }

      // 2. Query using MongoDB $near
      // maxDistance defaults to 10,000 meters (10km) if not specified
      const radiusInMeters = maxDistance ? Number(maxDistance) : 10000;

      const nearbyUsers = await User.find({
        'professionalProfile.location' : {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [parseFloat(lng), parseFloat(lat)] // [longitude, latitude]
                },
                $maxDistance: radiusInMeters
            }
          }
      }).select('_id profilePicture professionalProfile.firstName professionalProfile.lastName professionalProfile.title professionalProfile.skills');

      nearbyUsers.name = `${nearbyUser.firstName}  ${nearbyUser.lastName}`;  

      res.status(200).json({
          count: nearbyUsers.length,
          users: nearbyUsers
      });

  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

module.exports = router;