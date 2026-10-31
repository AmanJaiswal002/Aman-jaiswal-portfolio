// server/src/server.js
require('dotenv').config()
const app = require('./app')
const connectDB = require('./config/db')

const PORT = process.env.PORT || 5000

async function start() {
  await connectDB()

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
    console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`)
  })
}

start()
