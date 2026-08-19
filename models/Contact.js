const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  company: {
    type: String,
  },
  message: {
    type: String,
  },
  type: {
    type: String,
    default: 'contact',
    enum: ['contact', 'demo', 'newsletter', 'career']
  },
  // Career-specific fields
  position: {
    type: String,
  },
  yearsOfExperience: {
    type: String,
  },
  currentCompany: {
    type: String,
  },
  expectedSalary: {
    type: String,
  },
  noticePeriod: {
    type: String,
  },
  coverLetter: {
    type: String,
  },
  howDidYouHear: {
    type: String,
  },
  resume: {
    type: String, // Store file path or URL
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Review', 'Shortlisted', 'Interview', 'Rejected', 'Hired']
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Contact', contactSchema);
