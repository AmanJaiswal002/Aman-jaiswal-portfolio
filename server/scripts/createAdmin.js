// server/scripts/createAdmin.js
require('dotenv').config()
const mongoose = require('mongoose')

const Admin = require('../src/models/Admin')

async function createAdmin() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.error('❌ MONGODB_URI not set in .env')
    process.exit(1)
  }

  const username = process.argv[2] || 'admin'
  const email = process.argv[3] || 'admin@portfolio.com'
  const password = process.argv[4] || 'admin123'

  try {
    await mongoose.connect(uri)
    console.log('✅ Connected to MongoDB')

    const existing = await Admin.findOne({ username })
    if (existing) {
      console.log(`⚠️  Admin user "${username}" already exists`)
      process.exit(0)
    }

    const admin = await Admin.create({
      username,
      email,
      password,
    })

    console.log('✅ Admin user created successfully!')
    console.log(`   Username: ${admin.username}`)
    console.log(`   Email: ${admin.email}`)
    console.log(`   Password: ${password} (change after first login)`)
  } catch (err) {
    console.error('❌ Error creating admin:', err.message)
    process.exit(1)
  } finally {
    await mongoose.connection.close()
    process.exit(0)
  }
}

createAdmin()