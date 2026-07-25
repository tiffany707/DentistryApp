const mongoose = require('mongoose');
const { Schema } = mongoose;

const AIMatchResultSchema = new Schema(
  {
    professionalId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, min: 0, max: 100, required: true },
    rationale: { type: String, required: true }, // one-line AI explanation
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

const ShiftSchema = new Schema(
  {
    clinicId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    clinicName: {type: String, required: true},
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    skillsRequired: { type: [String], default: [] },
    location: { type: GeoPointSchema, required: true },
    status: {
      type: String,
      enum: ['open', 'matched', 'confirmed', 'completed', 'cancelled'],
      default: 'open',
    },
    matchedProfessionalId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    aiMatchResults: { type: [AIMatchResultSchema], default: [] },
  },
  { timestamps: true }
);

ShiftSchema.index({ status: 1, date: 1 });
ShiftSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Shift', ShiftSchema);