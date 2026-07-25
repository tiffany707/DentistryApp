const express = require('express');
const router = express.Router();
const Shift = require('../models/Shift.js');
const User = require('../models/Users.js');
const getCoordinatesFromAddress = require('../geocodeservices.js');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });


router.post('/creation', async (req, res) => {
    try{
        const { email, date, startTime, endTime, skillsRequired, status} = req.body;

        //find location of clinic
        const clinicUser = await User.findById(clinicId).select('clinicProfile.location', 'clinicProfile.clinicName');

        if (!clinicUser || !clinicUser.clinicProfile) {
            throw new Error('Clinic not found');
        }

        //create the shift
        const newShift = new Shift({
            email, 
            date, 
            startTime, 
            endTime, 
            skillsRequired, 
            status,
            location: clinicUser.clinicProfile.location,
            clinicName: clinicUser.clinicProfile.clinicName
        })

        await newShift.save();



        res.status(201).json({
            message: "Shift creation successful",
            shift:{ clinicId, date, startTime, endTime, skillsRequired, status }
        })
    }
    catch(err){
        res.status(500).json({
            error: err.message
        })
    }

})


//find shifts that are nearby the user
router.get('/nearby', async (req, res) =>{
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
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)] // [longitude, latitude]
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
    try {
        const shiftId = req.params.id;
        const { professionalId } = req.body;

        // 1. Validate that the professionalId is provided
        if (!professionalId) {
            return res.status(400).json({ error: 'Professional ID is required to apply.' });
        }

        // 2. Find the shift by its ID
        const shift = await Shift.findById(shiftId);

        if (!shift) {
            return res.status(404).json({ error: 'Shift not found.' });
        }

        // 3. Check if the shift is still open
        if (shift.status !== 'open') {
            return res.status(400).json({ error: `This shift is no longer open (Current status: ${shift.status}).` });
        }

        // 4. Check if this professional has already applied or been matched
        // (Assuming you check against your aiMatchResults or matchedProfessionalId)
        const alreadyApplied = shift.aiMatchResults.some(
            (match) => match.professionalId.toString() === professionalId
        );

        if (alreadyApplied) {
            return res.status(400).json({ error: 'You have already applied or been matched to this shift.' });
        }

        // 5. Update the shift status or add them to the matching/applicants list
        // For simplicity, let's assign them directly or set status to 'pending' / 'matched'
        shift.matchedProfessionalId = professionalId;
        shift.status = 'matched'; // or 'pending_approval' depending on your workflow

        await shift.save();

        res.status(200).json({
            message: 'Successfully applied to the shift!',
            shift
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;