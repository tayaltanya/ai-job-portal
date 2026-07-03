const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'company', 'admin'],
    default: 'student'
  },
  profile: {
    phone: String,
    location: String,
    bio: String,
    skills: [String],
    resume: String,
    profilePicture: String
  },
  resume: {
    type: String,
    default: "",
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  companyDocuments: {
    gst: String,
    registration: String,
    description: String
  },
  company: {
    companyName: String,
    website: String,
    description: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);