const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  interestedCountries: [String],
  selectedServices: [String],
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  assignedCounselor: {
    type: String,
    ref: 'User'
  },
  assignedAgent: {
    type: String,
    ref: 'User'
  },
  commissionPercentage: {
    type: Number,
    default: 0
  },
  intake: String,
  preferredDestination: String,
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);