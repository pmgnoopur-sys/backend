const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const multer = require('multer');
const path = require('path');
const { sendResumeEmail, sendContactEmail } = require('../utils/emailService');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
  }
});

// Get all contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new contact
router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const contactData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      company: req.body.company,
      message: req.body.message,
      type: req.body.type || 'contact',
      // Career-specific fields
      position: req.body.position,
      yearsOfExperience: req.body.yearsOfExperience,
      currentCompany: req.body.currentCompany,
      expectedSalary: req.body.expectedSalary,
      noticePeriod: req.body.noticePeriod,
      coverLetter: req.body.coverLetter,
      howDidYouHear: req.body.howDidYouHear,
      resume: req.file ? req.file.filename : null,
    };

    const contact = new Contact(contactData);
    const savedContact = await contact.save();
    res.status(201).json(savedContact);

    if (contactData.type === 'career') {
      try {
        await sendResumeEmail({
          ...contactData,
          resumePath: req.file ? req.file.path : undefined,
        });
      } catch (emailError) {
        console.error('Failed to send resume email:', emailError.message);
      }
    } else if (contactData.type === 'contact') {
      try {
        await sendContactEmail(contactData);
      } catch (emailError) {
        console.error('Failed to send contact email:', emailError);
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete contact
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update contact status
router.put('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
