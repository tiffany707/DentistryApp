const mongoose = require('mongoose');
const { Schema } = mongoose;

// --- Sub-schemas ---

const RatingSchema = new Schema(
  {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const AvailabilitySchema = new Schema(
  {
    date: { type: Date, required: true },
    startTime: { type: String, required: true }, // e.g. "09:00"
    endTime: { type: String, required: true },   // e.g. "17:00"
  },
  { _id: false }
);

const GeoPointSchema = new Schema(
  {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true,
      validate: {
        validator: (val) => val.length === 2,
        message: 'coordinates must be [longitude, latitude]',
      },
    },
  },
  { _id: false }
);

const ProfessionalProfileSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    title: {
      type: String,
      enum: [
        'Dental Hygienist',
        'Dental Assistant',
        'Dentist',
        'Office Coordinator',
        'Other',
      ],
      required: true,
    },
    yearsExperience: { type: Number, default: 0, min: 0 },
    skills: { type: [String], default: [] }, // e.g. ["pediatric", "ortho", "sedation-certified"]
    certifications: { type: [String], default: [] },
    location: { type: GeoPointSchema, required: true },
    availability: { type: [AvailabilitySchema], default: [] },
    rating: { type: RatingSchema, default: () => ({}) },
    vettingStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    googleCalendarId: { type: String, default: null },
  },
  { _id: false }
);

const ClinicProfileSchema = new Schema(
  {
    clinicName: { type: String, required: true },
    address: { type: String, required: true },
    location: { type: GeoPointSchema, required: true },
    contactName: { type: String, required: true },
    rating: { type: RatingSchema, default: () => ({}) },
  },
  { _id: false }
);

// --- Main User schema ---

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    professionalProfile: {
      type: ProfessionalProfileSchema,
      required: function () {
        return this.role === 'professional';
      },
    },
    clinicProfile: {
      type: ClinicProfileSchema,
      required: function () {
        return this.role === 'clinic';
      },
    },
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
);

// Geospatial indexes for "nearby" queries
UserSchema.index({ 'professionalProfile.location': '2dsphere' });
UserSchema.index({ 'clinicProfile.location': '2dsphere' });

module.exports = mongoose.model('User', UserSchema);