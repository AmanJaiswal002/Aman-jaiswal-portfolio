// server/src/middleware/errorHandler.js

/**
 * Centralized error handler. Must be the last middleware in app.js.
 */
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500
  const isDev = process.env.NODE_ENV !== 'production'

  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} → ${status}:`, err.message)

  res.status(status).json({
    success: false,
    message: status === 500 && !isDev ? 'Internal server error.' : err.message,
    ...(isDev && { stack: err.stack }),
  })
}

module.exports = errorHandler
