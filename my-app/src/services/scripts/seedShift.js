const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') }); // Adjust path if your .env is elsewhere

const mongoose = require('mongoose');
const User = require('../models/Users.js'); // Adjust path if needed
const Shift = require('../models/Shift.js'); // Adjust path if needed

async function seedDatabase() {
    try {
        // 1. Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017/test');
        console.log('Connected to MongoDB for seeding...');

        // 2. Clear out old shifts
        await Shift.deleteMany({});
        console.log('Cleared existing shifts.');

        // 3. Find or create a test clinic user to act as the owner
        let clinic = await User.findOne({ role: 'clinic' });
        
        if (!clinic) {
            clinic = new User({
                email: 'testclinic@dental.com',
                role: 'clinic',
                clinicProfile: {
                    clinicName: 'Downtown Dental Care',
                    address: '123 4 Ave SW, Calgary, AB',
                    contactName: 'Dr. Smith',
                    location: {
                        type: 'Point',
                        coordinates: [-114.0719, 51.0447] // Calgary coordinates [lng, lat]
                    }
                }
            });
            await clinic.save();
            console.log('Created a test clinic user.');
        } else {
            console.log(`Using existing clinic: ${clinic.clinicProfile.clinicName}`);
        }

        // 4. Create a sample shift linked to that clinic's location
        const sampleShift = new Shift({
            clinicId: clinic._id,
            email: 'testclinic@dental.com',
            date: new Date('2026-08-01'),
            startTime: '08:00 AM',
            endTime: '04:00 PM',
            skillsRequired: ['Hygiene', 'X-Rays'],
            status: 'open',
            location: {
                type: 'Point',
                coordinates: clinic.clinicProfile.location.coordinates // Matches clinic coordinates
            }
        });

        await sampleShift.save();
        console.log('Successfully seeded 1 test shift with geospatial data!');

        // 5. Disconnect
        await mongoose.disconnect();
        process.exit(0);

    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
}

seedDatabase();