// server/src/models/Experience.js
const mongoose = require('mongoose')

const experienceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: ['education', 'internship', 'work', 'certification', 'hackathon'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [150, 'Title must not exceed 150 characters'],
    },
    institution: {
      type: String,
      required: [true, 'Institution is required'],
      trim: true,
      maxlength: [150, 'Institution must not exceed 150 characters'],
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
      trim: true,
      maxlength: [50, 'Duration must not exceed 50 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description must not exceed 2000 characters'],
    },
    tags: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Experience', experienceSchema)