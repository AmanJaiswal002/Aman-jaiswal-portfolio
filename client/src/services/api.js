// src/services/api.js
import axios from 'axios'

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '')

const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
})

export function getResumeUrl() {
  return `${API_BASE}/resume`
}

async function requestWithRetry(config, retries = 2) {
  try {
    return await api(config)
  } catch (err) {
    const isNetworkError = err.code === 'ECONNABORTED' || err.code === 'ERR_NETWORK' || !err.response
    const isServerError = err.response?.status >= 500
    const shouldRetry = (isNetworkError || isServerError) && retries > 0

    if (shouldRetry) {
      await new Promise(r => setTimeout(r, 2000))
      return requestWithRetry(config, retries - 1)
    }
    throw err
  }
}

const originalGet = api.get.bind(api)
const originalPost = api.post.bind(api)
const originalPut = api.put.bind(api)
const originalDelete = api.delete.bind(api)

api.get = (url, config) => requestWithRetry({ method: 'GET', url, ...config })
api.post = (url, data, config) => requestWithRetry({ method: 'POST', url, data, ...config })
api.put = (url, data, config) => requestWithRetry({ method: 'PUT', url, data, ...config })
api.delete = (url, config) => requestWithRetry({ method: 'DELETE', url, ...config })

// Token management
let authToken = null

export function setAuthToken(token) {
  authToken = token
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem('auth_token', token)
  } else {
    delete api.defaults.headers.common['Authorization']
    localStorage.removeItem('auth_token')
  }
}

// Initialize token from localStorage on load
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('auth_token')
  if (stored) {
    authToken = stored
    api.defaults.headers.common['Authorization'] = `Bearer ${stored}`
  }
}

export function getAuthToken() {
  return authToken
}

export function clearAuthToken() {
  setAuthToken(null)
}

/**
 * Submit contact form message
 * @param {{ name: string, email: string, subject: string, message: string }} data
 */
export async function submitContact(data) {
  const response = await api.post('/contact', data)
  return response.data
}

/**
 * Fetch all projects from backend
 */
export async function fetchProjects() {
  const response = await api.get('/projects')
  return response.data
}

/**
 * Create a new project
 * @param {{ title, description, tech, image, liveUrl, githubUrl, featured }} data
 */
export async function createProject(data) {
  const response = await api.post('/projects', data)
  return response.data
}

/**
 * Delete a project by ID
 * @param {string} id
 */
export async function deleteProject(id) {
  const response = await api.delete(`/projects/${id}`)
  return response.data
}

/**
 * Admin login
 * @param {{ username: string, password: string }} credentials
 */
export async function adminLogin(credentials) {
  const response = await api.post('/auth/login', credentials)
  return response.data
}

/**
 * Verify current auth token
 */
export async function verifyAuth() {
  const response = await api.get('/auth/verify')
  return response.data
}

/**
 * Fetch all skills (grouped by category)
 */
export async function fetchSkills() {
  const response = await api.get('/skills')
  return response.data
}

/**
 * Create a new skill
 */
export async function createSkill(data) {
  const response = await api.post('/skills', data)
  return response.data
}

/**
 * Update a skill
 */
export async function updateSkill(id, data) {
  const response = await api.put(`/skills/${id}`, data)
  return response.data
}

/**
 * Delete a skill
 */
export async function deleteSkill(id) {
  const response = await api.delete(`/skills/${id}`)
  return response.data
}

/**
 * Fetch all experience/education
 */
export async function fetchExperience() {
  const response = await api.get('/experience')
  return response.data
}

/**
 * Create a new experience item
 */
export async function createExperience(data) {
  const response = await api.post('/experience', data)
  return response.data
}

/**
 * Update an experience item
 */
export async function updateExperience(id, data) {
  const response = await api.put(`/experience/${id}`, data)
  return response.data
}

/**
 * Delete an experience item
 */
export async function deleteExperience(id) {
  const response = await api.delete(`/experience/${id}`)
  return response.data
}

/**
 * Fetch profile data
 */
export async function fetchProfile() {
  const response = await api.get('/profile')
  return response.data
}

/**
 * Update profile data (admin only)
 */
export async function updateProfile(data) {
  const response = await api.put('/profile', data)
  return response.data
}

/**
 * Fetch resume PDF (public) - returns blob for viewing
 */
export async function fetchResume() {
  const response = await api.get('/resume', { responseType: 'blob' })
  return response.data
}

/**
 * Upload resume (admin only)
 * @param {File} file - PDF file
 */
export async function uploadResume(file) {
  const response = await api.put('/profile', { resume: await fileToBase64(file) })
  if (!response.data.success) {
    throw new Error(response.data.message || 'Upload failed')
  }
  return response.data
}

/**
 * Convert File to base64 data URI
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default api
