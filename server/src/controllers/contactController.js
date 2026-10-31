// server/src/controllers/contactController.js
const ContactMessage = require('../models/ContactMessage')
const mongoose = require('mongoose')

/**
 * POST /api/contact
 */
async function submitContact(req, res, next) {
  try {
    const { name, email, subject, message } = req.body

    // If MongoDB is not connected, respond gracefully
    if (mongoose.connection.readyState !== 1) {
      console.warn('Contact form submission received but MongoDB is not connected.')
      return res.status(200).json({
        success: true,
        message:
          'Your message has been received. However, the database is not currently connected — please also email me directly.',
      })
    }

    const doc = await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      ip: req.ip,
    })

    return res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! I will get back to you soon.',
      id: doc._id,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { submitContact }
