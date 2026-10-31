// server/src/routes/experience.js
const express = require('express')
const { body } = require('express-validator')
const { getExperience, createExperience, updateExperience, deleteExperience } = require('../controllers/experienceController')
const validate = require('../middleware/validate')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

const experienceValidation = [
  body('type')
    .trim()
    .notEmpty()
    .withMessage('Type is required.')
    .isIn(['education', 'internship', 'work', 'certification', 'hackathon'])
    .withMessage('Invalid type.'),
  body('title').trim().notEmpty().withMessage('Title is required.').isLength({ max: 150 }).withMessage('Title too long.'),
  body('institution').trim().notEmpty().withMessage('Institution is required.').isLength({ max: 150 }).withMessage('Institution too long.'),
  body('duration').trim().notEmpty().withMessage('Duration is required.').isLength({ max: 50 }).withMessage('Duration too long.'),
  body('description').optional().trim().isLength({ max: 2000 }).withMessage('Description too long.'),
  body('tags').optional().isArray(),
  body('order').optional().isInt(),
]

// GET /api/experience - public
router.get('/', getExperience)

// POST /api/experience - admin only
router.post('/', authMiddleware, experienceValidation, validate, createExperience)

// PUT /api/experience/:id - admin only
router.put('/:id', authMiddleware, experienceValidation, validate, updateExperience)

// DELETE /api/experience/:id - admin only
router.delete('/:id', authMiddleware, deleteExperience)

module.exports = router