
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const errorHandler = require('./middleware/errorHandler');

const contactRoutes = require('./routes/contact');
const profileRoutes = require('./routes/profile');
const projectRoutes = require('./routes/project');
const authRoutes = require('./routes/auth');
const skillRoutes = require('./routes/skill');
const experienceRoutes = require('./routes/experience');

const app = express();

// ─── Security ─────────────────────────────────────────────
app.use(helmet());

const allowedOrigins = (
  process.env.CORS_ORIGINS || 'http://localhost:5173'
)
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS denied for origin: ${origin}`)
      );
    },
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ─── Rate Limiting ─────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many contact submissions. Please try again later.',
  },
});

app.use(globalLimiter);

// ─── Body Parsing ──────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// ─── Root Route ────────────────────────────────────────────
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Aman Jaiswal Portfolio Backend!',
    status: 'Server is running successfully',
  });
});

// ─── Health Check ──────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Aman Portfolio API is running',
  });
});

// ─── API Routes ────────────────────────────────────────────
app.use('/api/auth', authRoutes);

app.use('/api/contact', contactLimiter, contactRoutes);

app.use('/api', profileRoutes);

app.use('/api/projects', projectRoutes);

app.use('/api/skills', skillRoutes);

app.use('/api/experience', experienceRoutes);

// ─── API 404 Handler ───────────────────────────────────────
app.use('/api/*path', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found.',
  });
});

// ─── General 404 Handler ───────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.',
  });
});

// ─── Global Error Handler ─────────────────────────────────
app.use(errorHandler);

module.exports = app;
