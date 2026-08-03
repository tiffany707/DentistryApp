const express = require('express');
const router = express.Router();
const User = require('../models/Users')
const { Storage } = require('@google-cloud/storage');
const storage = new Storage;
const bucket = storage.bucket('dentistapp-bucket')

router.post('/profilepicture', async (req, res) => {
    async function UploadToCloud(filePath, destination, userId){
        await bucket.upload(filePath, { destination });
    
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
        return {publicUrl, userId}
    }
    

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