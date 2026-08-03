const express = require('express');
const router = express.Router();
const Shift = require('../models/Shift');
const User = require('../models/Users.js');
const { GoogleGenAI, Type } = require("@google/genai");

const ai = new GoogleGenAI({});


router.get('/recommendations', async (req, res) => {
    try {
        const { shiftId } = req.query;


        const shift = await Shift.findById(shiftId);
        if (!shift) {
            return res.status(404).json({ error: 'Shift not found' });
        }
        
        const requirementsQuery = shift.skillsRequired.join(', ');
        console.log(requirementsQuery)

        const [lng, lat] = shift.location.coordinates
        const maxDistance=15000;

        //getNearbyProfessionals
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
        }).select('_id profilePicture professionalProfile.firstName professionalProfile.lastName professionalProfile.title professionalProfile.skills')
    .lean();

const formattedUsers = nearbyUsers.map(user => ({
    id: user._id,
    profilePicture: user.profilePicture,
    name: `${user.professionalProfile?.firstName ?? ''} ${user.professionalProfile?.lastName ?? ''}`.trim(),
    title: user.professionalProfile?.title ?? '',
    skills: Array.isArray(user.professionalProfile?.skills)
        ? user.professionalProfile.skills.join(', ')
        : '',
}));
    
        console.log(formattedUsers)
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: `
            Here is a list of nearby professionals ${JSON.stringify(formattedUsers, null, 2)}
            
            Task: Filter and select the best candidates who match this requirement: "${requirementsQuery}". 
            Return a list of matching professionals ranked from the professional that would most fit the requirements to the least.`,

            config: {
                responseMimeType: 'application/json',
                responseSchema:{
                    type: Type.ARRAY,
                    description: "A filtered list of matched professional candidates.",
                    items:{
                        type: Type.OBJECT,
                        properties: {
                            id: {type: Type.STRING,},
                            title: {type: Type.STRING,},
                            profilePicture: {type: Type.STRING,},
                            name: {type: Type.STRING,},
                            skills: {type: Type.ARRAY,
                                items: {type: Type.STRING}
                            },
                        },
                        required: ["id", "title", "profilePicture", "name", "skills"], 
                    }
                }

            }
        });

        const matchedCandidates = JSON.parse(response.text);
        res.status(200).json({matchedCandidates});
    }
    catch(err){
        res.status(500).json({
            error: err.message
        })
    }
});




module.exports = router;