// server/src/middleware/validate.js
const { validationResult } = require('express-validator')

/**
 * Middleware that runs after express-validator chains.
 * Returns 422 with structured errors if validation fails.
 */
function validate(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed. Please check your input.',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    })
  }
  next()
}

module.exports = validate
