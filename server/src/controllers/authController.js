// server/src/controllers/authController.js
const Admin = require('../models/Admin')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
const JWT_EXPIRES_IN = '7d'

function generateToken(admin) {
  return jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

async function login(req, res, next) {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required.',
      })
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database is not connected. Cannot authenticate.',
      })
    }

    const admin = await Admin.findOne({ username }).select('+password')

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      })
    }

    const isMatch = await admin.comparePassword(password)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      })
    }

    const token = generateToken(admin)

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
      },
    })
  } catch (err) {
    next(err)
  }
}

async function verifyToken(req, res, next) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database is not connected.',
      })
    }

    const admin = await Admin.findById(req.admin.id)

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin not found.',
      })
    }

    res.json({
      success: true,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
      },
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { login, verifyToken }