// server/src/controllers/projectController.js
const Project = require('../models/Project')
const mongoose = require('mongoose')

/**
 * GET /api/projects
 * Fetch all projects, newest first
 */
async function getProjects(req, res, next) {
  try {
    // If MongoDB is not connected, return empty array gracefully
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, data: [] })
    }

    const projects = await Project.find().sort({ createdAt: -1 }).lean()

    // Map Mongo _id to id for frontend consistency
    const data = projects.map((p) => ({
      id: p._id.toString(),
      title: p.title,
      description: p.description,
      tech: p.tech,
      image: p.image,
      liveUrl: p.liveUrl,
      githubUrl: p.githubUrl,
      featured: p.featured,
      createdAt: p.createdAt,
    }))

    return res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/projects
 * Create a new project
 */
async function createProject(req, res, next) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database is not connected. Cannot save project.',
      })
    }

    const { title, description, tech, image, liveUrl, githubUrl, featured } = req.body

    const doc = await Project.create({
      title,
      description,
      tech,
      image: image || null,
      liveUrl: liveUrl || null,
      githubUrl: githubUrl || null,
      featured: featured || false,
    })

    return res.status(201).json({
      success: true,
      message: 'Project added successfully!',
      data: {
        id: doc._id.toString(),
        title: doc.title,
        description: doc.description,
        tech: doc.tech,
        image: doc.image,
        liveUrl: doc.liveUrl,
        githubUrl: doc.githubUrl,
        featured: doc.featured,
        createdAt: doc.createdAt,
      },
    })
  } catch (err) {
    next(err)
  }
}

/**
 * DELETE /api/projects/:id
 * Delete a project by ID
 */
async function deleteProject(req, res, next) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database is not connected.',
      })
    }

    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid project ID.' })
    }

    const deleted = await Project.findByIdAndDelete(id)

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Project not found.' })
    }

    return res.json({ success: true, message: 'Project deleted successfully.' })
  } catch (err) {
    next(err)
  }
}

module.exports = { getProjects, createProject, deleteProject }
