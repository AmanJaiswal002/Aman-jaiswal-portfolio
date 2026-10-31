// server/src/routes/auth.js
const express = require('express')
const { body } = require('express-validator')
const { login, verifyToken } = require('../controllers/authController')
const validate = require('../middleware/validate')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

const loginValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required.'),
  body('password')
    .notEmpty().withMessage('Password is required.'),
]

router.post('/login', loginValidation, validate, login)

router.get('/verify', authMiddleware, verifyToken)

module.exports = router