// server/src/controllers/experienceController.js
const Experience = require('../models/Experience')
const mongoose = require('mongoose')

async function getExperience(req, res, next) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, data: { educationItems: [], experienceItems: [], certifications: [] } })
    }

    const items = await Experience.find().sort({ type: 1, order: 1, createdAt: -1 }).lean()

    const educationItems = items.filter((i) => i.type === 'education').map((i) => ({
      id: i._id.toString(),
      type: i.type,
      title: i.title,
      institution: i.institution,
      duration: i.duration,
      description: i.description,
      tags: i.tags,
    }))

    const experienceItems = items.filter((i) => ['internship', 'work'].includes(i.type)).map((i) => ({
      id: i._id.toString(),
      type: i.type,
      title: i.title,
      institution: i.institution,
      duration: i.duration,
      description: i.description,
      tags: i.tags,
    }))

    const certifications = items.filter((i) => i.type === 'certification').map((i) => ({
      id: i._id.toString(),
      type: i.type,
      title: i.title,
      institution: i.institution,
      duration: i.duration,
      description: i.description,
      tags: i.tags,
    }))

    res.json({ success: true, data: { educationItems, experienceItems, certifications } })
  } catch (err) {
    next(err)
  }
}

async function createExperience(req, res, next) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database not connected.' })
    }

    const doc = await Experience.create(req.body)
    res.status(201).json({ success: true, data: doc })
  } catch (err) {
    next(err)
  }
}

async function updateExperience(req, res, next) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database not connected.' })
    }

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid experience ID.' })
    }

    const doc = await Experience.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Experience not found.' })
    }
    res.json({ success: true, data: doc })
  } catch (err) {
    next(err)
  }
}

async function deleteExperience(req, res, next) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database not connected.' })
    }

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid experience ID.' })
    }

    const doc = await Experience.findByIdAndDelete(id)
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Experience not found.' })
    }
    res.json({ success: true, message: 'Experience deleted.' })
  } catch (err) {
    next(err)
  }
}

module.exports = { getExperience, createExperience, updateExperience, deleteExperience }