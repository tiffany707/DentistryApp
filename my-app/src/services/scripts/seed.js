const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const User = require('../models/Users.js');

const sampleUsers = [
  // --- PROFESSIONALS (14 Users: 7 Ladies, 7 Guys) ---
  
  // Ladies (1-7)
  {
    email: 'sarah.dentist@example.com',
    profilePicture: 'https://storage.googleapis.com/dentistapp-bucket/profilepictures/lady1.jpg',
    professionalProfile: {
      firstName: 'Sarah',
      lastName: 'Jenkins',
      title: 'Dentist',
      yearsExperience: 8,
      skills: ['ortho', 'surgery', 'restorative'],
      certifications: ['DDS', 'Inviscertified'],
      location: { type: 'Point', coordinates: [-114.0719, 51.0447] },
      availability: [
        { date: new Date('2026-06-01'), startTime: '09:00', endTime: '17:00' }
      ],
      vettingStatus: 'verified',
    }
  },
  {
    email: 'emily.assistant@example.com',
    profilePicture: 'https://storage.googleapis.com/dentistapp-bucket/profilepictures/lady2.jpg',
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
    email: 'jessica.dentist@example.com',
    profilePicture: 'https://storage.googleapis.com/dentistapp-bucket/profilepictures/lady3.jpg',
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
    profilePicture: 'https://storage.googleapis.com/dentistapp-bucket/profilepictures/lady4.jpg',
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
    profilePicture: 'https://storage.googleapis.com/dentistapp-bucket/profilepictures/lady5.jpg',
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
    email: 'hannah.dentist@example.com',
    profilePicture: 'https://storage.googleapis.com/dentistapp-bucket/profilepictures/lady6.jpg',
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
    email: 'olivia.coordinator@example.com',
    profilePicture: 'https://storage.googleapis.com/dentistapp-bucket/profilepictures/lady7.jpg',
    professionalProfile: {
      firstName: 'Olivia',
      lastName: 'Bennett',
      title: 'Office Coordinator',
      yearsExperience: 4,
      skills: ['insurance-billing', 'scheduling', 'patient-relations'],
      certifications: ['Dental Management Cert'],
      location: { type: 'Point', coordinates: [-114.0650, 51.0450] },
      vettingStatus: 'verified',
    }
  },

  // Guys (1-7)
  {
    email: 'michael.hygienist@example.com',
    profilePicture: 'https://storage.googleapis.com/dentistapp-bucket/profilepictures/guy1.jpg',
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
    email: 'david.coordinator@example.com',
    profilePicture: 'https://storage.googleapis.com/dentistapp-bucket/profilepictures/guy2.jpg',
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
    email: 'robert.other@example.com',
    profilePicture: 'https://storage.googleapis.com/dentistapp-bucket/profilepictures/guy3.jpg',
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
    email: 'tyler.hygienist@example.com',
    profilePicture: 'https://storage.googleapis.com/dentistapp-bucket/profilepictures/guy4.jpg',
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
  {
    email: 'james.dentist@example.com',
    profilePicture: 'https://storage.googleapis.com/dentistapp-bucket/profilepictures/guy5.jpg',
    professionalProfile: {
      firstName: 'James',
      lastName: 'Miller',
      title: 'Dentist',
      yearsExperience: 9,
      skills: ['oral-surgery', 'implants'],
      certifications: ['DDS', 'Oral Surgery Fellowship'],
      location: { type: 'Point', coordinates: [-114.0750, 51.0350] },
      vettingStatus: 'verified',
    }
  },
  {
    email: 'lucas.assistant@example.com',
    profilePicture: 'https://storage.googleapis.com/dentistapp-bucket/profilepictures/guy6.jpg',
    professionalProfile: {
      firstName: 'Lucas',
      lastName: 'Martinez',
      title: 'Dental Assistant',
      yearsExperience: 3,
      skills: ['chairside', 'digital-scanning'],
      certifications: ['RDA', 'BLS Certified'],
      location: { type: 'Point', coordinates: [-114.0800, 51.0550] },
      vettingStatus: 'verified',
    }
  },
  {
    email: 'ethan.dentist@example.com',
    profilePicture: 'https://storage.googleapis.com/dentistapp-bucket/profilepictures/guy7.jpg',
    professionalProfile: {
      firstName: 'Ethan',
      lastName: 'Wright',
      title: 'Dentist',
      yearsExperience: 5,
      skills: ['restorative', 'endodontics'],
      certifications: ['DMD'],
      location: { type: 'Point', coordinates: [-114.0600, 51.0600] },
      vettingStatus: 'verified',
    }
  },

  // --- CLINICS (5 Users) ---
  {
    email: 'info@downtownsmile.com',
    profilePicture: 'https://storage.googleapis.com/dentistapp-bucket/profilepictures/clinic1.jpg',
    clinicProfile: {
      clinicName: 'Downtown Smile Centre',
      address: '123 4 Ave SW, Calgary, AB',
      location: { type: 'Point', coordinates: [-114.0708, 51.0486] },
      contactName: 'Amanda Vance',
    }
  },
  {
    email: 'contact@beltlineidental.com',
    profilePicture: 'https://storage.googleapis.com/dentistapp-bucket/profilepictures/clinic2.jpg',
    clinicProfile: {
      clinicName: 'Beltline Family Dental',
      address: '789 10 Ave SW, Calgary, AB',
      location: { type: 'Point', coordinates: [-114.0820, 51.0420] },
      contactName: 'Mark Sterling',
    }
  },
  {
    email: 'frontdesk@kensingtondental.com',
    profilePicture: 'https://storage.googleapis.com/dentistapp-bucket/profilepictures/clinic3.jpg',
    clinicProfile: {
      clinicName: 'Kensington Dental Studio',
      address: '456 14 St NW, Calgary, AB',
      location: { type: 'Point', coordinates: [-114.0935, 51.0532] },
      contactName: 'Karen White',
    }
  },
  {
    email: 'admin@riverbenddental.com',
    profilePicture: 'https://storage.googleapis.com/dentistapp-bucket/profilepictures/clinic4.jpg',
    clinicProfile: {
      clinicName: 'Riverbend Dental Care',
      address: '321 Realchester Dr SE, Calgary, AB',
      location: { type: 'Point', coordinates: [-114.0250, 51.0020] },
      contactName: 'Brian O’Connor',
    }
  },
  {
    email: 'hello@stampedecc.com',
    profilePicture: 'https://storage.googleapis.com/dentistapp-bucket/profilepictures/clinic5.jpg',
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

    await User.deleteMany({});
    console.log('Cleared existing users collection.');

    await User.insertMany(sampleUsers);
    console.log('Successfully seeded 19 test users (14 professionals, 5 clinics)! 🌱');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();