// server/src/routes/skill.js
const express = require('express')
const { body } = require('express-validator')
const { getSkills, createSkill, updateSkill, deleteSkill } = require('../controllers/skillController')
const validate = require('../middleware/validate')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

const skillValidation = [
  body('name').trim().notEmpty().withMessage('Skill name is required.').isLength({ max: 50 }).withMessage('Name too long.'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required.')
    .isIn(['Frontend Development', 'Backend Development', 'Databases', 'Tools & Platforms', 'Other'])
    .withMessage('Invalid category.'),
  body('level')
    .optional()
    .isIn(['Learning', 'Intermediate', 'Advanced'])
    .withMessage('Invalid level.'),
  body('color').optional().isString(),
  body('order').optional().isInt(),
]

// GET /api/skills - public
router.get('/', getSkills)

// POST /api/skills - admin only
router.post('/', authMiddleware, skillValidation, validate, createSkill)

// PUT /api/skills/:id - admin only
router.put('/:id', authMiddleware, skillValidation, validate, updateSkill)

// DELETE /api/skills/:id - admin only
router.delete('/:id', authMiddleware, deleteSkill)

module.exports = router