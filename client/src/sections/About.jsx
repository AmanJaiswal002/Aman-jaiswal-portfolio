// src/sections/About.jsx
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import SectionReveal from '../components/SectionReveal'
import { User, Target, Heart, Camera, X, Save, Edit, Image } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { fetchProfile, updateProfile as apiUpdateProfile } from '../services/api'

const STORAGE_KEY = 'aman-portfolio-profile-photo'

export default function About() {
  const { isAuthenticated } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [photo, setPhoto] = useState(null)
  const [hovered, setHovered] = useState(false)
  const fileInputRef = useRef(null)

  // Load profile from backend
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetchProfile()
        if (res.success) {
          setProfile(res.data)
          if (res.data.photo) setPhoto(res.data.photo)
        }
      } catch (err) {
        console.error('Failed to load profile:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  // Also load from localStorage as fallback for photo
  useEffect(() => {
    if (typeof window !== 'undefined' && !photo) {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setPhoto(saved)
    }
  }, [photo])

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { alert('Please select an image file'); return }
    if (file.size > 2 * 1024 * 1024) { alert('Image must be less than 2MB'); return }
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target.result
      setPhoto(dataUrl)
      localStorage.setItem(STORAGE_KEY, dataUrl)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const removePhoto = () => {
    setPhoto(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const triggerFileInput = () => { fileInputRef.current?.click() }

  const startEditing = () => {
    if (!isAuthenticated) return
    setEditForm({
      name: profile?.name || '',
      title: profile?.title || '',
      bio: profile?.bio || '',
      goal: profile?.goal || '',
      interests: profile?.interests || '',
      location: profile?.location || '',
      email: profile?.email || '',
      github: profile?.github || '',
      linkedin: profile?.linkedin || '',
      available: profile?.available !== false,
      photo: photo,
    })
    setEditing(true)
  }

  const cancelEditing = () => {
    setEditing(false)
    setEditForm({})
  }

  const saveProfile = async () => {
    try {
      const dataToSave = { ...editForm, photo }
      const res = await apiUpdateProfile(dataToSave)
      if (res.success) {
        setProfile(res.data)
        setEditing(false)
      }
    } catch (err) {
      console.error('Failed to save profile:', err)
      alert('Failed to save profile. Please try again.')
    }
  }

  if (loading) {
    return (
      <section id="about" className="section-padding" style={{ background: '#0d1120' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', padding: '4rem 2rem', color: '#64748b' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
            <Image size={36} style={{ color: '#3b82f6' }} />
          </motion.div>
          <p style={{ fontSize: '0.9rem', fontWeight: 500, marginTop: '1rem' }}>Loading profile…</p>
        </div>
      </section>
    )
  }

  return (
    <section id="about" className="section-padding" style={{ background: '#0d1120' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <SectionReveal>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '3rem' }}>
            <div>
              <span className="section-label">About Me</span>
              <h2 className="section-title">
                Who I{' '}
                <span style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Am
                </span>
              </h2>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>
                A passionate Full Stack Developer with a love for building things that live on the internet.
              </p>
            </div>
            {isAuthenticated && (
              <motion.button
                className={editing ? 'btn-outline' : 'btn-primary'}
                onClick={editing ? cancelEditing : startEditing}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{ flexShrink: 0, marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                {editing ? <X size={16} /> : <Edit size={16} />}
                {editing ? 'Cancel' : 'Edit Profile'}
              </motion.button>
            )}
          </div>
        </SectionReveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          {/* Profile Card */}
          <SectionReveal delay={0.1}>
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              {/* Profile image with upload - Admin only */}
              <div
                style={{
                  width: '120px', height: '120px', borderRadius: '50%',
                  background: photo ? 'none' : 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))',
                  border: '3px solid #1e2d45', margin: '0 auto 1.25rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', position: 'relative', cursor: isAuthenticated ? 'pointer' : 'default',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={isAuthenticated ? triggerFileInput : undefined}
                title={isAuthenticated ? 'Click to upload profile photo' : undefined}
              >
                {photo ? <img src={photo} alt="Aman Jaiswal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={48} style={{ color: '#3b82f6', opacity: 0.6 }} />}
                {isAuthenticated && hovered && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,11,20,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#f8fafc', fontSize: '0.75rem', fontWeight: 500 }}>
                    <Camera size={16} /> Change Photo
                  </div>
                )}
                {isAuthenticated && photo && hovered && (
                  <button onClick={(e) => { e.stopPropagation(); removePhoto() }} aria-label="Remove photo" style={{ position: 'absolute', top: '-8px', right: '-8px', width: '28px', height: '28px', borderRadius: '50%', background: '#ef4444', border: '2px solid #080b14', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer', flexShrink: 0 }}>
                    <X size={14} />
                  </button>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />

              {editing ? (
                <>
                  <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem', borderRadius: '0.4rem', border: '1px solid #3b82f6', background: '#080b14', color: '#f8fafc', fontSize: '1.2rem', fontWeight: 700, textAlign: 'center', fontFamily: 'inherit' }} />
                  <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem', borderRadius: '0.4rem', border: '1px solid #8b5cf6', background: '#080b14', color: '#8b5cf6', fontSize: '0.9rem', fontWeight: 600, textAlign: 'center', fontFamily: 'inherit' }} />
                </>
              ) : (
                <>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>{profile?.name || 'Aman Jaiswal'}</h3>
                  <p style={{ color: '#3b82f6', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' }}>{profile?.title || 'Full Stack Developer'}</p>
                </>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left', fontSize: '0.88rem', color: '#94a3b8' }}>
                {editing ? (
                  <>
                    <input type="text" value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} placeholder="Location" style={{ width: '100%', padding: '0.4rem', borderRadius: '0.4rem', border: '1px solid #1e2d45', background: '#080b14', color: '#f8fafc', fontSize: '0.88rem', fontFamily: 'inherit' }} />
                    <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} placeholder="Email" style={{ width: '100%', padding: '0.4rem', borderRadius: '0.4rem', border: '1px solid #1e2d45', background: '#080b14', color: '#f8fafc', fontSize: '0.88rem', fontFamily: 'inherit' }} />
                    <input type="url" value={editForm.github} onChange={(e) => setEditForm({ ...editForm, github: e.target.value })} placeholder="GitHub URL" style={{ width: '100%', padding: '0.4rem', borderRadius: '0.4rem', border: '1px solid #1e2d45', background: '#080b14', color: '#f8fafc', fontSize: '0.88rem', fontFamily: 'inherit' }} />
                    <input type="url" value={editForm.linkedin} onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })} placeholder="LinkedIn URL" style={{ width: '100%', padding: '0.4rem', borderRadius: '0.4rem', border: '1px solid #1e2d45', background: '#080b14', color: '#f8fafc', fontSize: '0.88rem', fontFamily: 'inherit' }} />
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input type="checkbox" checked={editForm.available} onChange={(e) => setEditForm({ ...editForm, available: e.target.checked })} style={{ width: '16px', height: '16px', accentColor: '#3b82f6' }} />
                      <span>Open to opportunities</span>
                    </label>
                  </>
                ) : (
                  <>
                    <span>📍{profile?.location || 'Meerut, Uttar Pradesh, India'}</span>
                    <span>🎓 B.Tech (IT) — CCS University (SCRIET), Meerut</span>
                    <span>💼 {profile?.available !== false ? 'Open to opportunities' : 'Not available'}</span>
                    <span>📧 {profile?.email || 'jaiswalaman1520@gmail.com'}</span>
                    <span><a href={profile?.github || 'https://github.com/AmanJaiswal002'} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>🔗 github.com/AmanJaiswal002</a></span>
                    <span><a href={profile?.linkedin || 'https://www.linkedin.com/in/aman-jaiswal-119b77329/'} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>🔗 linkedin.com/in/aman-jaiswal-119b77329</a></span>
                  </>
                )}
              </div>

              {editing && (
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem' }}>
                  <button onClick={cancelEditing} className="btn-outline" style={{ padding: '0.6rem 1.2rem' }}>Cancel</button>
                  <button onClick={saveProfile} className="btn-primary" style={{ padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Save size={16} /> Save
                  </button>
                </div>
              )}
            </div>
          </SectionReveal>

          {/* Bio */}
          <SectionReveal delay={0.2}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                { key: 'bio', icon: <User size={20} style={{ color: '#3b82f6' }} />, title: 'My Story', placeholder: 'Tell your story...' },
                { key: 'goal', icon: <Target size={20} style={{ color: '#8b5cf6' }} />, title: 'My Goal', placeholder: 'What is your goal?' },
                { key: 'interests', icon: <Heart size={20} style={{ color: '#06b6d4' }} />, title: 'My Interests', placeholder: 'What are your interests?' },
              ].map(({ key, icon, title, placeholder }) => (
                <div key={title} className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '0.5rem', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
                    {editing ? (
                      <input type="text" value={editForm[key] || ''} onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })} placeholder={title} style={{ flex: 1, background: '#080b14', border: '1px solid #3b82f6', borderRadius: '0.4rem', padding: '0.4rem 0.6rem', color: '#f8fafc', fontSize: '1rem', fontWeight: 700, fontFamily: 'inherit' }} />
                    ) : (
                      <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#f8fafc' }}>{title}</h3>
                    )}
                  </div>
                  {editing ? (
                    <textarea value={editForm[key] || ''} onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })} rows={4} placeholder={placeholder} style={{ width: '100%', background: '#080b14', border: '1px solid #1e2d45', borderRadius: '0.4rem', padding: '0.6rem', color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.7, fontFamily: 'inherit', resize: 'vertical' }} />
                  ) : (
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.7 }}>{profile?.[key] || ''}</p>
                  )}
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  )
}