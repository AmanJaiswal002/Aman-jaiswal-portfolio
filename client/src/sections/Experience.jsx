// src/sections/Experience.jsx
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Plus, Loader2, FileText, Upload, X, GraduationCap, Award } from 'lucide-react'
import SectionReveal from '../components/SectionReveal'
import { useAuth } from '../context/AuthContext'
import { fetchExperience, createExperience, updateExperience, deleteExperience } from '../services/api'
import { uploadResume } from '../services/api'

const ICONS = { education: GraduationCap, certification: Award }
const ACCENT = { education: '#3b82f6', certification: '#06b6d4' }
const TYPES = [
  { value: 'education', label: 'Education', icon: GraduationCap },
  { value: 'certification', label: 'Certification', icon: Award },
]

function UploadResumeButton() {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      setMessage({ type: 'error', text: 'Please select a PDF file.' })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File must be less than 5MB.' })
      return
    }

    setUploading(true)
    setMessage(null)
    try {
      await uploadResume(file)
      setMessage({ type: 'success', text: 'Resume uploaded successfully!' })
      // Reload page to show updated resume
      setTimeout(() => window.location.reload(), 1500)
    } catch (err) {
      console.error('Upload failed:', err)
      setMessage({ type: 'error', text: 'Upload failed. Please try again.' })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '0.5rem', color: '#fff', fontWeight: 600, fontSize: '0.9rem', transition: 'opacity 0.2s', opacity: uploading ? 0.7 : 1 }}>
        <Upload size={16} />
        {uploading ? 'Uploading...' : 'Upload Resume'}
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={uploading}
        />
      </label>
      {message && (
        <span style={{ fontSize: '0.85rem', color: message.type === 'success' ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          {message.type === 'success' ? <FileText size={14} /> : <X size={14} />}
          {message.text}
        </span>
      )}
    </div>
  )
}

function TimelineItem({ item, isLast, isEditing, _onEdit, _onDelete, onSave, onCancel, editForm, setEditForm }) {
  const Icon = ICONS[item.type] || GraduationCap
  const accent = ACCENT[item.type] || '#3b82f6'

  if (isEditing) {
    return (
      <div style={{ display: 'flex', gap: '1.25rem', position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: `rgba(59,130,246,0.12)`, border: `2px solid ${accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={18} style={{ color: accent }} />
          </div>
          {!isLast && <div style={{ width: '2px', flex: 1, background: '#1e2d45', minHeight: '40px', marginTop: '4px' }} />}
        </div>
        <div style={{ flex: 1, paddingBottom: isLast ? 0 : '2rem' }}>
          <form onSubmit={(e) => { e.preventDefault(); onSave(editForm) }} className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.3rem' }}>Type</label>
                <select value={editForm.type} onChange={(e) => setEditForm({ ...editForm, type: e.target.value })} style={{ width: '100%', background: '#080b14', border: `1px solid ${accent}`, borderRadius: '0.4rem', padding: '0.5rem', color: '#f8fafc', fontSize: '0.85rem', fontFamily: 'inherit' }}>
                  {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.3rem' }}>Duration</label>
                <input type="text" value={editForm.duration} onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })} placeholder="2023 — 2027" style={{ width: '100%', background: '#080b14', border: `1px solid ${accent}`, borderRadius: '0.4rem', padding: '0.5rem', color: '#f8fafc', fontSize: '0.85rem', fontFamily: 'inherit' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.3rem' }}>Title</label>
                <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} placeholder="Title" style={{ width: '100%', background: '#080b14', border: `1px solid ${accent}`, borderRadius: '0.4rem', padding: '0.5rem', color: '#f8fafc', fontSize: '0.85rem', fontFamily: 'inherit' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.3rem' }}>Institution</label>
                <input type="text" value={editForm.institution} onChange={(e) => setEditForm({ ...editForm, institution: e.target.value })} placeholder="Institution" style={{ width: '100%', background: '#080b14', border: `1px solid ${accent}`, borderRadius: '0.4rem', padding: '0.5rem', color: '#f8fafc', fontSize: '0.85rem', fontFamily: 'inherit' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.3rem' }}>Description</label>
              <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows={3} placeholder="Description" style={{ width: '100%', background: '#080b14', border: `1px solid ${accent}`, borderRadius: '0.4rem', padding: '0.5rem', color: '#f8fafc', fontSize: '0.85rem', fontFamily: 'inherit', resize: 'vertical' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={onCancel} className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Cancel</button>
              <button type="submit" className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: `linear-gradient(135deg, ${accent}, ${accent})` }}>Save</button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: '1.25rem', position: 'relative' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: `rgba(59,130,246,0.12)`, border: `2px solid ${accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={18} style={{ color: accent }} />
        </div>
        {!isLast && <div style={{ width: '2px', flex: 1, background: '#1e2d45', minHeight: '40px', marginTop: '4px' }} />}
      </div>
      <div style={{ flex: 1, paddingBottom: isLast ? 0 : '2rem' }}>
        <div className="card" style={{ padding: '1.25rem', position: 'relative' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>{item.title}</h3>
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', background: '#0d1120', border: '1px solid #1e2d45', borderRadius: '999px', padding: '0.2rem 0.65rem', whiteSpace: 'nowrap' }}>{item.duration}</span>
          </div>
          <p style={{ color: accent, fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.5rem' }}>{item.institution}</p>
          {item.description && <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.65 }}>{item.description}</p>}
          {item.tags?.length && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
              {item.tags.map((tag) => (
                <span key={tag} style={{ fontSize: '0.7rem', fontWeight: 600, padding: '0.15rem 0.5rem', borderRadius: '999px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' }}>{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TimelineGroup({ title, items, isEditing, onEdit, onDelete, onSave, onCancel, editForm, setEditForm, editingId }) {
  if (!items.length && !isEditing) return null
  return (
    <div>
      <h3 style={{ fontWeight: 700, color: '#94a3b8', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid #1e2d45', textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.8rem' }}>{title}</h3>
      <div>
        {items.map((item, i) => (
          <TimelineItem
            key={item.id}
            item={item}
            isLast={i === items.length - 1}
            isEditing={editingId === item.id}
            onEdit={onEdit}
            onDelete={onDelete}
            onSave={onSave}
            onCancel={onCancel}
            editForm={editForm}
            setEditForm={setEditForm}
          />
        ))}
        {isEditing && editingId === 'new' && (
          <TimelineItem
            item={{ type: editForm.type, title: '', institution: '', duration: '', description: '', tags: [] }}
            isLast={true}
            isEditing={true}
            onSave={onSave}
            onCancel={onCancel}
            editForm={editForm}
            setEditForm={setEditForm}
          />
        )}
      </div>
    </div>
  )
}

function AddExperienceForm({ onAdd, onCancel }) {
  const [form, setForm] = useState({ type: 'education', title: '', institution: '', duration: '', description: '', tags: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.institution.trim() || !form.duration.trim()) return
    onAdd({ ...form, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean) })
    setForm({ type: 'education', title: '', institution: '', duration: '', description: '', tags: '' })
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h3 style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>Add Education</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.3rem' }}>Duration</label>
          <input type="text" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="2023 — 2027" style={{ width: '100%', background: '#080b14', border: '1px solid #1e2d45', borderRadius: '0.4rem', padding: '0.5rem', color: '#f8fafc', fontSize: '0.85rem', fontFamily: 'inherit' }} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.3rem' }}>Title</label>
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" style={{ width: '100%', background: '#080b14', border: '1px solid #1e2d45', borderRadius: '0.4rem', padding: '0.5rem', color: '#f8fafc', fontSize: '0.85rem', fontFamily: 'inherit' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.3rem' }}>Institution</label>
          <input type="text" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} placeholder="Institution" style={{ width: '100%', background: '#080b14', border: '1px solid #1e2d45', borderRadius: '0.4rem', padding: '0.5rem', color: '#f8fafc', fontSize: '0.85rem', fontFamily: 'inherit' }} />
        </div>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.3rem' }}>Description</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Description" style={{ width: '100%', background: '#080b14', border: '1px solid #1e2d45', borderRadius: '0.4rem', padding: '0.5rem', color: '#f8fafc', fontSize: '0.85rem', fontFamily: 'inherit', resize: 'vertical' }} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.3rem' }}>Tags (comma separated)</label>
        <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="MERN, React, Node.js" style={{ width: '100%', background: '#080b14', border: '1px solid #1e2d45', borderRadius: '0.4rem', padding: '0.5rem', color: '#f8fafc', fontSize: '0.85rem', fontFamily: 'inherit' }} />
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        <button type="button" onClick={onCancel} className="btn-outline" style={{ padding: '0.5rem 1rem' }}>Cancel</button>
        <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem' }}><Plus size={14} /> Add</button>
      </div>
    </form>
  )
}

export default function Experience() {
  const { isAuthenticated } = useAuth()
  const [data, setData] = useState({ educationItems: [] })
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})

  useEffect(() => {
    async function loadExp() {
      try {
        const res = await fetchExperience()
        if (res.success) setData({ educationItems: res.data.educationItems || [] })
      } catch (err) {
        console.error('Failed to load education:', err)
      } finally {
        setLoading(false)
      }
    }
    loadExp()
  }, [])

  const updateData = (type, updater) => {
    setData((prev) => ({ ...prev, [type]: updater(prev[type]) }))
  }

  const handleAdd = async (itemData) => {
    try {
      const res = await createExperience(itemData)
      if (res.success) {
        const newItem = { ...res.data, id: res.data._id }
        const dataType = itemData.type === 'certification' ? 'certifications' : 'educationItems'
        updateData(dataType, (arr) => [...arr, newItem])
      }
    } catch (err) { console.error('Failed to add:', err) }
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setEditForm({ ...item })
  }

  const handleSave = async (formData) => {
    try {
      const res = await updateExperience(editingId, formData)
      if (res.success) {
        const updated = { ...res.data, id: res.data._id }
        const dataType = formData.type === 'certification' ? 'certifications' : 'educationItems'
        updateData(dataType, (arr) => arr.map((i) => i.id === editingId ? updated : i))
        setEditingId(null)
      }
    } catch (err) { console.error('Failed to update:', err) }
  }

  const handleDelete = async (id, type) => {
    if (!confirm(`Delete this ${type === 'certification' ? 'certification' : 'education'} entry?`)) return
    try {
      const res = await deleteExperience(id)
      if (res.success) {
        const dataType = type === 'certification' ? 'certifications' : 'educationItems'
        updateData(dataType, (arr) => arr.filter((i) => i.id !== id))
      }
    } catch (err) { console.error('Failed to delete:', err) }
  }

  const handleAddNew = (type = 'education') => {
    setEditingId('new')
    setEditForm({ type, title: '', institution: '', duration: '', description: '', tags: '' })
  }

  if (loading) {
    return (
      <section id="experience" className="section-padding">
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', padding: '4rem 2rem', color: '#64748b' }}>
          <Loader2 size={36} style={{ margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
          <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>Loading education…</p>
          <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
        </div>
      </section>
    )
  }

  return (
    <section id="experience" className="section-padding">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <SectionReveal>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '3rem' }}>
            <div>
              <span className="section-label">Background</span>
              <h2 className="section-title">
                Education &{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Certificate
                </span>
              </h2>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>My academic background.</p>
            </div>
            {isAuthenticated && (
              <motion.button className="btn-primary" onClick={() => setShowAddForm(true)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={{ flexShrink: 0, marginTop: '0.25rem' }}>
                <Plus size={16} /> Add Education
              </motion.button>
            )}
          </div>
        </SectionReveal>

        {showAddForm && isAuthenticated && (
          <SectionReveal>
            <AddExperienceForm onAdd={handleAdd} onCancel={() => setShowAddForm(false)} />
          </SectionReveal>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '3rem' }}>
          <SectionReveal delay={0.1}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <TimelineGroup
                title="Education"
                items={data.educationItems}
                isEditing={isAuthenticated}
                onEdit={handleEdit}
                onDelete={(id) => handleDelete(id, 'education')}
                onSave={handleSave}
                onCancel={() => setEditingId(null)}
                editForm={editForm}
                setEditForm={setEditForm}
                editingId={editingId}
              />
              {isAuthenticated && (
                <motion.button
                  className="btn-outline"
                  onClick={handleAddNew}
                  whileHover={{ scale: 1.02 }}
                  style={{ justifyContent: 'center', padding: '0.5rem 1rem', fontSize: '0.85rem', borderColor: ACCENT.education, color: ACCENT.education }}
                >
                  <Plus size={14} /> Add Education
                </motion.button>
              )}
            </div>
          </SectionReveal>

          <SectionReveal delay={0.2}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <TimelineGroup
                title="Certifications"
                items={data.certifications || []}
                isEditing={isAuthenticated}
                onEdit={handleEdit}
                onDelete={(id) => handleDelete(id, 'certification')}
                onSave={handleSave}
                onCancel={() => setEditingId(null)}
                editForm={editForm}
                setEditForm={setEditForm}
                editingId={editingId}
              />
              {isAuthenticated && (
                <motion.button
                  className="btn-outline"
                  onClick={() => handleAddNew('certification')}
                  whileHover={{ scale: 1.02 }}
                  style={{ justifyContent: 'center', padding: '0.5rem 1rem', fontSize: '0.85rem', borderColor: ACCENT.certification, color: ACCENT.certification }}
                >
                  <Plus size={14} /> Add Certification
                </motion.button>
              )}
            </div>
          </SectionReveal>
        </div>

        {isAuthenticated && (
          <SectionReveal delay={0.3}>
            <div style={{ marginTop: '3rem', padding: '2rem', borderRadius: '1rem', background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.08))', border: '1px solid rgba(59,130,246,0.15)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
              <div>
                <h3 style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>Manage Resume</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Upload your latest resume PDF (max 5MB).</p>
              </div>
              <UploadResumeButton />
            </div>
          </SectionReveal>
        )}

        {!isAuthenticated && (
          <SectionReveal delay={0.3}>
            <div style={{ marginTop: '3rem', padding: '2rem', borderRadius: '1rem', background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.08))', border: '1px solid rgba(59,130,246,0.15)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
              <div>
                <h3 style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '0.35rem' }}>Want the full picture?</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>View my resume for a complete overview of my skills and background.</p>
              </div>
              <a href="/api/resume" target="_blank" rel="noopener noreferrer" className="btn-primary" id="experience-view-resume">
                <FileText size={16} /> View Resume
              </a>
            </div>
          </SectionReveal>
        )}
      </div>
    </section>
  )
}