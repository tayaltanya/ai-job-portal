const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'selected'],
    default: 'pending'
  },
  resume: {
    type: String,
    required: true
  },
  coverLetter: {
    type: String
  },
  aiScore: {
    type: Number,
    default: 0
  },
  aiFeedback: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema);