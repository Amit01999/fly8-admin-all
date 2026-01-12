const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
  universityId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  city: String,
  ranking: Number,
  logo: String,
  website: String,
  programs: [{
    name: String,
    degree: String,
    duration: String,
    tuitionFee: Number
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('University', universitySchema);