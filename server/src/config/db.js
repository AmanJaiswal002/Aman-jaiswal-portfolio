// server/src/config/db.js
const mongoose = require('mongoose')

let isShutdownHandlerRegistered = false

async function connectDB() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.warn('⚠️  MONGODB_URI not set. Database features will be unavailable.')
    return
  }

  // Connection event listeners
  mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connected successfully')
  })

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err.message)
  })

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected')
  })

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      retryWrites: true,
    })
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB Atlas:', err.message)
    console.error('   → Check your MONGODB_URI, network connection, and IP whitelist in Atlas.')
    // Don't exit — let the server run without DB in dev
  }

  // Graceful shutdown (register only once)
  if (!isShutdownHandlerRegistered) {
    isShutdownHandlerRegistered = true
    process.on('SIGINT', async () => {
      await mongoose.connection.close()
      console.log('MongoDB connection closed (app shutdown)')
      process.exit(0)
    })
  }
}

module.exports = connectDB
