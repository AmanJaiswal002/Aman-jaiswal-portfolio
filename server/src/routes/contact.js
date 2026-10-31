// server/src/routes/contact.js
const express = require('express')
const { body } = require('express-validator')
const { submitContact } = require('../controllers/contactController')
const validate = require('../middleware/validate')

const router = express.Router()

const contactValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required.')
    .isLength({ max: 100 }).withMessage('Name must not exceed 100 characters.'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Enter a valid email address.')
    .normalizeEmail(),

  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required.')
    .isLength({ max: 200 }).withMessage('Subject must not exceed 200 characters.'),

  body('message')
    .trim()
    .notEmpty().withMessage('Message is required.')
    .isLength({ min: 10, max: 5000 }).withMessage('Message must be between 10 and 5000 characters.'),
]

router.post('/', contactValidation, validate, submitContact)

module.exports = router
