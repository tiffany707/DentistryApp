require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const Shift = require('../models/Shift');

const MONGO_URI = process.env.MONGODB_CONNECTION_STRING;

const sampleShifts = [
  // --- CALGARY SHIFTS (MDT: UTC-6) ---
  {
    clinicId: new mongoose.Types.ObjectId(),
    clinicName: 'Downtown Calgary Dental Care',
    title: 'Registered Dental Assistant (RDA)',
    date: new Date('2026-08-15T00:00:00-06:00'),
    startTime: new Date('2026-08-15T08:00:00-06:00'),
    endTime: new Date('2026-08-15T16:30:00-06:00'),
    skillsRequired: ['Chairside Assisting', 'X-Ray Certified', 'Dentrix'],
    location: {
      type: 'Point',
      coordinates: [-114.0719, 51.0447],
    },
    address: '100 8 Ave SW, Calgary, AB T2P 1B3',
    jobDescription: 'Looking for an experienced RDA to assist our dentist with general procedures and patient management for the day.',
    status: 'open',
    matchedProfessionalId: null,
    aiMatchResults: [
      {
        professionalId: new mongoose.Types.ObjectId(),
        score: 95,
        rationale: 'Strong background in chairside assisting with matching local availability.',
      },
    ],
  },
  {
    clinicId: new mongoose.Types.ObjectId(),
    clinicName: 'NW Smiles Dental Clinic',
    title: 'Emergency Hygienist',
    date: new Date('2026-08-18T00:00:00-06:00'),
    startTime: new Date('2026-08-18T09:00:00-06:00'),
    endTime: new Date('2026-08-18T17:00:00-06:00'),
    skillsRequired: ['Scaling & Root Planing', 'Local Anesthetic', 'Eaglesoft'],
    location: {
      type: 'Point',
      coordinates: [-114.1333, 51.0800],
    },
    address: '3625 Shaganappi Trail NW, Calgary, AB T3A 0E2',
    jobDescription: 'Covering a busy hygiene schedule. Must be comfortable working independently and efficient with patient charting.',
    status: 'open',
    matchedProfessionalId: null,
    aiMatchResults: [],
  },
  {
    clinicId: new mongoose.Types.ObjectId(),
    clinicName: 'SE Calgary Family Dental',
    title: 'Front Desk Receptionist',
    date: new Date('2026-08-20T00:00:00-06:00'),
    startTime: new Date('2026-08-20T08:30:00-06:00'),
    endTime: new Date('2026-08-20T16:30:00-06:00'),
    skillsRequired: ['Patient Booking', 'Insurance Billing', 'AbanDent'],
    location: {
      type: 'Point',
      coordinates: [-114.0300, 50.9800],
    },
    address: '8833 Macleod Trail SW, Calgary, AB T2H 0M2',
    jobDescription: 'Friendly front desk receptionist needed to manage phone lines, direct patient flow, and handle insurance claims.',
    status: 'open',
    matchedProfessionalId: null,
    aiMatchResults: [],
  },

  // --- VANCOUVER SHIFT (PDT: UTC-7) ---
  {
    clinicId: new mongoose.Types.ObjectId(),
    clinicName: 'Pacific Centre Dental',
    title: 'Registered Dental Hygienist',
    date: new Date('2026-08-22T00:00:00-07:00'),
    startTime: new Date('2026-08-22T08:00:00-07:00'),
    endTime: new Date('2026-08-22T15:30:00-07:00'),
    skillsRequired: ['Scaling & Root Planing', 'Client Education', 'Claris'],
    location: {
      type: 'Point',
      coordinates: [-123.1207, 49.2827],
    },
    address: '701 W Georgia St, Vancouver, BC V7Y 1G5',
    jobDescription: 'Covering a Saturday hygiene shift in downtown Vancouver. Looking for an energetic hygienist with a gentle touch.',
    status: 'open',
    matchedProfessionalId: null,
    aiMatchResults: [],
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB cluster.');

    await Shift.deleteMany({});
    console.log('Cleared existing shifts.');

    const createdShifts = await Shift.insertMany(sampleShifts);
    console.log(`Successfully seeded ${createdShifts.length} shifts with explicit timezone offsets!`);

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();