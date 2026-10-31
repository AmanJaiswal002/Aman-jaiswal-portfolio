// server/src/app.js
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const errorHandler = require('./middleware/errorHandler')
const contactRoutes = require('./routes/contact')
const profileRoutes = require('./routes/profile')
const projectRoutes = require('./routes/project')
const authRoutes = require('./routes/auth')
const skillRoutes = require('./routes/skill')
const experienceRoutes = require('./routes/experience')

const app = express()

// ─── Security ────────────────────────────────────────────────────────────────
app.use(helmet())

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (e.g., curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
      cb(new Error(`CORS denied for origin: ${origin}`))
    },
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// ─── Rate limiting ────────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
})

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { success: false, message: 'Too many contact submissions. Please try again later.' },
})

app.use(globalLimiter)

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: false, limit: '10mb' }))

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'OK', timestamp: new Date().toISOString() })
})

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/contact', contactLimiter, contactRoutes)
app.use('/api', profileRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/skills', skillRoutes)
app.use('/api/experience', experienceRoutes)

// ─── 404 for unmatched API routes ──────────────────────────────────────────
app.use('/api/*path', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found.' })
})

// ─── Error handler ────────────────────────────────────────────────────────────
app.use(errorHandler)

module.exports = app
