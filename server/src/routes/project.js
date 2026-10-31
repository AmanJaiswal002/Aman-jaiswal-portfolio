// server/src/routes/project.js
const express = require('express')
const { body } = require('express-validator')
const { getProjects, createProject, deleteProject } = require('../controllers/projectController')
const validate = require('../middleware/validate')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

const projectValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Project title is required.')
    .isLength({ max: 150 }).withMessage('Title must not exceed 150 characters.'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required.')
    .isLength({ min: 15, max: 2000 }).withMessage('Description must be between 15 and 2000 characters.'),

  body('tech')
    .isArray({ min: 1 }).withMessage('At least one technology is required.'),

  body('image')
    .optional({ nullable: true })
    .isString(),

  body('liveUrl')
    .optional({ nullable: true, checkFalsy: true })
    .isURL().withMessage('Live URL must be a valid URL.'),

  body('githubUrl')
    .optional({ nullable: true, checkFalsy: true })
    .isURL().withMessage('GitHub URL must be a valid URL.'),

  body('featured')
    .optional()
    .isBoolean().withMessage('Featured must be a boolean.'),
]

// GET  /api/projects       → fetch all projects (public)
router.get('/', getProjects)

// POST /api/projects       → create a project (admin only)
router.post('/', authMiddleware, projectValidation, validate, createProject)

// DELETE /api/projects/:id → delete a project (admin only)
router.delete('/:id', authMiddleware, deleteProject)

module.exports = router
