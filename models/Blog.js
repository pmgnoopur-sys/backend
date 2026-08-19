const mongoose = require('mongoose');

const blogImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  altText: {
    type: String,
    required: true,
  },
});

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  keywords: {
    type: [String],
    default: [],
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  images: {
    type: [blogImageSchema],
    default: [],
  },
  metaDescription: {
    type: String,
  },
  focusKeyword: {
    type: String,
  },
  tags: {
    type: [String],
    default: [],
  },
  ogImage: {
    type: String,
  },
  canonicalUrl: {
    type: String,
  },
  // New fields
  category: {
    type: String,
    default: 'general',
  },
  excerpt: {
    type: String,
  },
  readingTime: {
    type: Number,
    default: 0,
  },
  scheduledDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'scheduled'],
    default: 'draft',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
blogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Blog', blogSchema);
