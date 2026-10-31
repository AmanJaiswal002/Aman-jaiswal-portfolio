// server/src/models/Profile.js
const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, maxlength: [100, 'Name too long'] },
    title: { type: String, trim: true, maxlength: [100, 'Title too long'] },
    bio: { type: String, trim: true, maxlength: [2000, 'Bio too long'] },
    goal: { type: String, trim: true, maxlength: [2000, 'Goal too long'] },
    interests: { type: String, trim: true, maxlength: [2000, 'Interests too long'] },
    location: { type: String, trim: true, maxlength: [100, 'Location too long'] },
    email: { type: String, trim: true, lowercase: true, match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email'] },
    github: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    photo: { type: String }, // base64 or URL
    resume: { type: String }, // base64 data URI for PDF
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Profile', profileSchema)