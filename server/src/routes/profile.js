// server/src/routes/profile.js
const express = require('express')
const { body } = require('express-validator')
const { getProfile, updateProfile, getResume } = require('../controllers/profileController')
const validate = require('../middleware/validate')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

const profileValidation = [
  body('name').optional().trim().isLength({ max: 100 }).withMessage('Name too long.'),
  body('title').optional().trim().isLength({ max: 100 }).withMessage('Title too long.'),
  body('bio').optional().trim().isLength({ max: 2000 }).withMessage('Bio too long.'),
  body('goal').optional().trim().isLength({ max: 2000 }).withMessage('Goal too long.'),
  body('interests').optional().trim().isLength({ max: 2000 }).withMessage('Interests too long.'),
  body('location').optional().trim().isLength({ max: 100 }).withMessage('Location too long.'),
  body('email').optional().trim().isEmail().withMessage('Invalid email.').normalizeEmail(),
  body('github').optional().trim().isURL().withMessage('Invalid GitHub URL.'),
  body('linkedin').optional().trim().isURL().withMessage('Invalid LinkedIn URL.'),
  body('photo').optional().isString(),
  body('resume').optional().isString(),
  body('available').optional().isBoolean(),
]

// GET /api/profile - public
router.get('/profile', getProfile)

// GET /api/resume - public (serves PDF)
router.get('/resume', getResume)

// PUT /api/profile - admin only
router.put('/profile', authMiddleware, profileValidation, validate, updateProfile)

module.exports = router
