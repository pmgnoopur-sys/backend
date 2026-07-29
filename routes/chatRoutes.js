const express = require('express');
const router = express.Router();

// Pre-defined responses for common questions
const responses = {
  services: "PMG offers comprehensive B2B lead generation services including contact discovery, email marketing, telemarketing, and data services. We help businesses find qualified leads and convert them into customers.",
  pricing: "For pricing information, please contact our team directly. We offer customized packages based on your business needs and lead generation requirements.",
  contact: "You can reach our team through our contact page or email us at contact@pmg.com. We typically respond within 24 hours.",
  about: "PMG is a B2B lead generation company specializing in helping businesses find qualified leads through data-driven marketing strategies.",
  default: "Thanks for your message! For detailed information about our services, pricing, or to discuss how we can help your business, please contact our team directly through our contact page."
};

// Chat endpoint
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Simple keyword matching to determine response
    const lowerMessage = message.toLowerCase();
    let response = responses.default;

    if (lowerMessage.includes('service') || lowerMessage.includes('offer') || lowerMessage.includes('what do you do')) {
      response = responses.services;
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
      response = responses.pricing;
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('reach') || lowerMessage.includes('phone')) {
      response = responses.contact;
    } else if (lowerMessage.includes('about') || lowerMessage.includes('who are you') || lowerMessage.includes('company')) {
      response = responses.about;
    }

    res.json({
      response: response,
      role: 'assistant'
    });
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ 
      error: 'Failed to process message',
      details: error.message 
    });
  }
});

module.exports = router;
