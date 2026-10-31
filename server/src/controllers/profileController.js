// server/src/controllers/profileController.js
const Profile = require('../models/Profile')
const mongoose = require('mongoose')

const DEFAULT_PROFILE = {
  name: 'Aman Jaiswal',
  title: 'Full Stack Developer',
  tagline: 'Building digital experiences that make an impact.',
  bio: "I'm a B.Tech IT student and passionate Full Stack Developer skilled in the MERN stack, Data Structures & Algorithms, and building scalable, responsive web applications. As a hackathon participant and LeetCode enthusiast, I'm committed to writing clean code, solving problems, and continuously improving my development skills.",
  goal: "I aim to contribute to impactful projects, grow as a developer, and collaborate with teams that value clean code and great user experiences. My goal is to build scalable, real-world applications that solve meaningful problems.",
  interests: "Beyond coding, I enjoy exploring new technologies, contributing to open source, participating in hackathons, and continuously learning. I'm also passionate about solving DSA problems on LeetCode and improving my problem-solving skills.",
  location: 'Meerut, Uttar Pradesh, India',
  email: 'jaiswalaman1520@gmail.com',
  github: 'https://github.com/AmanJaiswal002',
  linkedin: 'https://www.linkedin.com/in/aman-jaiswal-119b77329/',
  available: true,
  photo: null,
  resume: null,
}

async function getProfile(req, res) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, data: DEFAULT_PROFILE })
    }

    let profile = await Profile.findOne().lean()
    if (!profile) {
      profile = await Profile.create(DEFAULT_PROFILE)
    }

    res.json({
      success: true,
      data: {
        name: profile.name,
        title: profile.title,
        tagline: profile.bio?.split('.')[0] || 'Building digital experiences that make an impact.',
        bio: profile.bio,
        goal: profile.goal,
        interests: profile.interests,
        location: profile.location,
        email: profile.email,
        github: profile.github,
        linkedin: profile.linkedin,
        available: profile.available,
        photo: profile.photo,
        resume: profile.resume,
      },
    })
  } catch (err) {
    res.json({ success: true, data: DEFAULT_PROFILE })
  }
}

async function getResume(req, res) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database not connected.' })
    }

    const profile = await Profile.findOne().select('resume').lean()
    if (!profile || !profile.resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' })
    }

    // Convert base64 to buffer
    const base64Data = profile.resume.replace(/^data:application\/pdf;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="Aman_Jaiswal_Resume.pdf"',
      'Content-Length': buffer.length,
    })
    res.send(buffer)
  } catch (err) {
    console.error('Error serving resume:', err)
    res.status(500).json({ success: false, message: 'Failed to load resume.' })
  }
}

async function updateProfile(req, res, next) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ success: false, message: 'Database not connected.' })
    }

    let profile = await Profile.findOne()
    if (!profile) {
      profile = await Profile.create({ ...DEFAULT_PROFILE, ...req.body })
    } else {
      Object.assign(profile, req.body)
      await profile.save()
    }

    res.json({ success: true, data: profile, message: 'Profile updated successfully.' })
  } catch (err) {
    next(err)
  }
}

module.exports = { getProfile, updateProfile, getResume }