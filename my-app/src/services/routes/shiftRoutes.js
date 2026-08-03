const express = require('express');
const router = express.Router();
const Shift = require('../models/Shift.js');
const User = require('../models/Users.js');
const getCoordinatesFromAddress = require('../geocodeservices.js');
const { createShiftEvent } = require("../services/calendarEvents")
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


router.post('/creation', async (req, res) => {
    try{
        const { email, title, date, startTime, endTime, skillsRequired, jobDescription} = req.body;

        const status = 'open';
        //find location of clinic
        const clinicUser = await User.findOne({email}).select('clinicProfile.location clinicProfile.clinicName clinicProfile.address _id');

        if (!clinicUser || !clinicUser.clinicProfile) {
            throw new Error('Clinic not found');
        }

        //create the shift
        const newShift = new Shift({
            clinicId: clinicUser._id,
            clinicName: clinicUser.clinicProfile.clinicName,
            title,
            email, 
            date, 
            startTime, 
            endTime, 
            skillsRequired, 
            status,
            jobDescription,
            location: clinicUser.clinicProfile.location,
            clinicName: clinicUser.clinicProfile.clinicName,
            address: clinicUser.clinicProfile.address
        })

        await newShift.save();



        res.status(201).json({
            message: "Shift creation successful",
            shift:{ shiftId: newShift._id, date, startTime, endTime, skillsRequired, status }
        })
    }
    catch(err){
        res.status(500).json({
            error: err.message
        })
    }

})




//find shifts that are nearby the user
router.get('/shiftsNearby', async (req, res) =>{
    try {
        const { lng, lat, maxDistance } = req.query;

        // 1. Validate that longitude and latitude are provided
        if (!lng || !lat) {
            return res.status(400).json({ error: 'Longitude (lng) and latitude (lat) are required queries.' });
        }

        // 2. Query using MongoDB $near
        // maxDistance defaults to 10,000 meters (10km) if not specified
        const radiusInMeters = maxDistance ? Number(maxDistance) : 10000;

       const nearbyShifts = await Shift.find({
            status: 'open',
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: radiusInMeters
                }
            }
        });

        res.status(200).json({
            count: nearbyShifts.length,
            shifts: nearbyShifts
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



//PLACES
router.get('/autocomplete', async (req, res) => {
    try {
        const { input } = req.query;
        if (!input) {
            return res.json({ predictions: [] });
        }

        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&types=(regions)&key=${process.env.GOOGLE_MAPS_API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Google API error', details: data });
        }

        res.json({ predictions: data.predictions || [] });
    } catch (err) {
        console.error('Autocomplete error:', err);
        res.status(500).json({ error: 'Internal server error', predictions: [] });
    }
});

router.get('/details', async (req, res) => {
    try {
        const { placeId } = req.query;

        if (!placeId) {
            return res.status(400).json({ error: "placeId required" });
        }

        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,name&key=${process.env.GOOGLE_MAPS_API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok || data.status !== "OK") {
            return res.status(500).json({ 
                error: "Failed to fetch place details from Google", 
                status: data.status 
            });
        }

        const location = data.result?.geometry?.location;
        res.status(200).json({ location, name: data.result?.name });

    } catch (err) {
        console.error('Place details error:', err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST /api/shifts/:id/apply
router.post('/:id/apply', async (req, res) => {
     let calendarEvent = null;
    try {
        const shiftId = req.params.id;
      

        // 2. Find the shift by its ID
        const shift = await Shift.findById(shiftId);

        if (!shift) {
            return res.status(404).json({ error: 'Shift not found.' });
        }

        // 3. Check if the shift is still open
        if (shift.status !== 'open') {
            return res.status(400).json({ error: `This shift is no longer open (Current status: ${shift.status}).` });
        }

    

        shift.status = 'matched'; // or 'pending_approval' depending on your workflow
        await shift.save();
        console.log("Shift status:", shift.status)

        try {
            const resShiftDate = await createShiftEvent(shift);
            calendarEvent = { id: resShiftDate.id, htmlLink: resShiftDate.htmlLink, status: resShiftDate.status };
            console.log('Calendar event created:', resShiftDate.htmlLink);
        } catch (calendarErr) {
            console.error('Calendar creation failed:', calendarErr); // full object, not .message
        }

        res.status(200).json({
            message: 'Successfully applied to the shift!',
            shift,
            calendarEvent
        });

        } catch (err) {
        console.error('Route error:', err.message);
        if (!res.headersSent) {
            res.status(500).json({ error: err.message });
        }
    }
});



module.exports = router;