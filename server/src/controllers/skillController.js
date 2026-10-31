// server/src/controllers/skillController.js
const Skill = require('../models/Skill')
const mongoose = require('mongoose')

const groupSkills = (skills) => {
  const groups = {}
  skills.forEach((skill) => {
    if (!groups[skill.category]) {
      groups[skill.category] = {
        category: skill.category,
        color: skill.color || 'blue',
        skills: [],
      }
    }
    groups[skill.category].skills.push({
      name: skill.name,
      level: skill.level,
    })
  })
  return Object.values(groups).sort((a, b) => a.category.localeCompare(b.category))
}

async function getSkills(req, res, next) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, data: [] })
    }

    const skills = await Skill.find().sort({ category: 1, order: 1, name: 1 }).lean()
    const grouped = groupSkills(skills)
    res.json({ success: true, data: grouped })
  } catch (err) {
    next(err)
  }
}

async function createSkill(req, res, next) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database not connected.' })
    }

    const doc = await Skill.create(req.body)
    res.status(201).json({ success: true, data: doc })
  } catch (err) {
    next(err)
  }
}

async function updateSkill(req, res, next) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database not connected.' })
    }

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid skill ID.' })
    }

    const doc = await Skill.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Skill not found.' })
    }
    res.json({ success: true, data: doc })
  } catch (err) {
    next(err)
  }
}

async function deleteSkill(req, res, next) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database not connected.' })
    }

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid skill ID.' })
    }

    const doc = await Skill.findByIdAndDelete(id)
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Skill not found.' })
    }
    res.json({ success: true, message: 'Skill deleted.' })
  } catch (err) {
    next(err)
  }
}

module.exports = { getSkills, createSkill, updateSkill, deleteSkill }