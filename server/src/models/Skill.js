// server/src/models/Skill.js
const mongoose = require('mongoose')

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
      maxlength: [50, 'Skill name must not exceed 50 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: ['Frontend Development', 'Backend Development', 'Databases', 'Tools & Platforms', 'Other'],
    },
    level: {
      type: String,
      required: [true, 'Level is required'],
      enum: ['Learning', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    color: {
      type: String,
      trim: true,
      default: 'blue',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Skill', skillSchema)