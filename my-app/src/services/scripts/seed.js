const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') }); // Adjust path if your .env is elsewhere

const User = require('../models/Users.js'); // Adjust path to your User model if needed

const sampleUsers = [
  // --- PROFESSIONALS (10 Users) ---
  {
    email: 'sarah.dentist@example.com',
    role: 'professional',
    professionalProfile: {
      firstName: 'Sarah',
      lastName: 'Jenkins',
      title: 'Dentist',
      yearsExperience: 8,
      skills: ['ortho', 'surgery', 'restorative'],
      certifications: ['DDS', 'Inviscertified'],
      location: { type: 'Point', coordinates: [-114.0719, 51.0447] }, // Calgary coordinates
      availability: [
        { date: new Date('2026-06-01'), startTime: '09:00', endTime: '17:00' }
      ],
      vettingStatus: 'verified',
    }
  },
  {
    email: 'michael.hygienist@example.com',
    role: 'professional',
    professionalProfile: {
      firstName: 'Michael',
      lastName: 'Chang',
      title: 'Dental Hygienist',
      yearsExperience: 4,
      skills: ['pediatric', 'periodontal-therapy'],
      certifications: ['RDH', 'Local Anesthesia Permit'],
      location: { type: 'Point', coordinates: [-114.0850, 51.0500] },
      vettingStatus: 'verified',
    }
  },
  {
    email: 'emily.assistant@example.com',
    role: 'professional',
    professionalProfile: {
      firstName: 'Emily',
      lastName: 'Rodriguez',
      title: 'Dental Assistant',
      yearsExperience: 2,
      skills: ['chairside', 'radiography', 'sterilization'],
      certifications: ['RDA'],
      location: { type: 'Point', coordinates: [-114.0600, 51.0300] },
      vettingStatus: 'pending',
    }
  },
  {
    email: 'david.coordinator@example.com',
    role: 'professional',
    professionalProfile: {
      firstName: 'David',
      lastName: 'Smith',
      title: 'Office Coordinator',
      yearsExperience: 6,
      skills: ['insurance-billing', 'scheduling', 'patient-relations'],
      certifications: ['Dental Management Cert'],
      location: { type: 'Point', coordinates: [-114.0900, 51.0600] },
      vettingStatus: 'verified',
    }
  },
  {
    email: 'jessica.dentist@example.com',
    role: 'professional',
    professionalProfile: {
      firstName: 'Jessica',
      lastName: 'Taylor',
      title: 'Dentist',
      yearsExperience: 12,
      skills: ['endodontics', 'implants', 'pediatric'],
      certifications: ['DMD', 'Board Certified Endo'],
      location: { type: 'Point', coordinates: [-114.0500, 51.0200] },
      vettingStatus: 'verified',
    }
  },
  {
    email: 'alex.hygienist@example.com',
    role: 'professional',
    professionalProfile: {
      firstName: 'Alex',
      lastName: 'Mercer',
      title: 'Dental Hygienist',
      yearsExperience: 5,
      skills: ['preventative', 'laser-assisted-periodontal'],
      certifications: ['RDH'],
      location: { type: 'Point', coordinates: [-114.1100, 51.0700] },
      vettingStatus: 'verified',
    }
  },
  {
    email: 'chloe.assistant@example.com',
    role: 'professional',
    professionalProfile: {
      firstName: 'Chloe',
      lastName: 'Dubois',
      title: 'Dental Assistant',
      yearsExperience: 1,
      skills: ['four-handed-dentistry', 'digital-scanning'],
      certifications: ['BLS Certified'],
      location: { type: 'Point', coordinates: [-114.0400, 51.0400] },
      vettingStatus: 'pending',
    }
  },
  {
    email: 'robert.other@example.com',
    role: 'professional',
    professionalProfile: {
      firstName: 'Robert',
      lastName: 'Fox',
      title: 'Other',
      yearsExperience: 10,
      skills: ['equipment-repair', 'lab-technician'],
      certifications: ['Certified Dental Lab Tech'],
      location: { type: 'Point', coordinates: [-114.1200, 51.0300] },
      vettingStatus: 'verified',
    }
  },
  {
    email: 'hannah.dentist@example.com',
    role: 'professional',
    professionalProfile: {
      firstName: 'Hannah',
      lastName: 'Wong',
      title: 'Dentist',
      yearsExperience: 3,
      skills: ['cosmetic', 'restorative'],
      certifications: ['DDS'],
      location: { type: 'Point', coordinates: [-114.0300, 51.0800] },
      vettingStatus: 'verified',
    }
  },
  {
    email: 'tyler.hygienist@example.com',
    role: 'professional',
    professionalProfile: {
      firstName: 'Tyler',
      lastName: 'Green',
      title: 'Dental Hygienist',
      yearsExperience: 7,
      skills: ['periodontal-therapy', 'local-anesthetic'],
      certifications: ['RDH'],
      location: { type: 'Point', coordinates: [-114.0200, 51.0500] },
      vettingStatus: 'rejected',
    }
  },

  // --- CLINICS (5 Users) ---
  {
    email: 'info@downtownsmile.com',
    role: 'clinic',
    clinicProfile: {
      clinicName: 'Downtown Smile Centre',
      address: '123 4 Ave SW, Calgary, AB',
      location: { type: 'Point', coordinates: [-114.0708, 51.0486] },
      contactName: 'Amanda Vance',
    }
  },
  {
    email: 'contact@beltlineidental.com',
    role: 'clinic',
    clinicProfile: {
      clinicName: 'Beltline Family Dental',
      address: '789 10 Ave SW, Calgary, AB',
      location: { type: 'Point', coordinates: [-114.0820, 51.0420] },
      contactName: 'Mark Sterling',
    }
  },
  {
    email: 'frontdesk@kensingtondental.com',
    role: 'clinic',
    clinicProfile: {
      clinicName: 'Kensington Dental Studio',
      address: '456 14 St NW, Calgary, AB',
      location: { type: 'Point', coordinates: [-114.0935, 51.0532] },
      contactName: 'Karen White',
    }
  },
  {
    email: 'admin@riverbenddental.com',
    role: 'clinic',
    clinicProfile: {
      clinicName: 'Riverbend Dental Care',
      address: '321 Realchester Dr SE, Calgary, AB',
      location: { type: 'Point', coordinates: [-114.0250, 51.0020] },
      contactName: 'Brian O’Connor',
    }
  },
  {
    email: 'hello@stampedecc.com',
    role: 'clinic',
    clinicProfile: {
      clinicName: 'Stampede City Dental',
      address: '99 Macleod Trail SE, Calgary, AB',
      location: { type: 'Point', coordinates: [-114.0550, 51.0380] },
      contactName: 'Sophie Turner',
    }
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    console.log('Connected to MongoDB for seeding...');

    // Clear out existing test users to prevent duplicate email crashes
    await User.deleteMany({});
    console.log('Cleared existing users collection.');

    // Insert new data
    await User.insertMany(sampleUsers);
    console.log('Successfully seeded 15 test users (10 professionals, 5 clinics)! 🌱');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();