// server/src/models/Project.js
const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [150, 'Title must not exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [15, 'Description must be at least 15 characters'],
      maxlength: [2000, 'Description must not exceed 2000 characters'],
    },
    tech: {
      type: [String],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'At least one technology is required',
      },
    },
    image: {
      type: String, // base64 data URI or URL
      default: null,
    },
    liveUrl: {
      type: String,
      trim: true,
      default: null,
    },
    githubUrl: {
      type: String,
      trim: true,
      default: null,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Project', projectSchema)
