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

const ShiftSchema = new Schema(
  {
    clinicId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    skillsRequired: { type: [String], default: [] },
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

module.exports = mongoose.model('Shift', ShiftSchema);