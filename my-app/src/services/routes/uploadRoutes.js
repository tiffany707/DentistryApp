const express = require('express');
const router = express.Router();
const { uploadToCloud } = require('../services/storageService');
const User = require('../models/Users')

router.post('/profilepicture', async (req, res) => {
    try {
        const result = await uploadToCloud(req.body.path, req.body.destination, req.body.userId);
        if(!result.publicUrl || !result.userId){
            throw new Error("There was something wrong when uploading the image to the cloud.")
        }

        const user = await User.findById(req.body.userId)
        if(!newProfileImage){
            throw new Error("Could not find user to upload image to");
        }

        user.profilePicture = result.publicUrl;

        await user.save(); 
        
        res.status(200).json({ success: true, file: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;