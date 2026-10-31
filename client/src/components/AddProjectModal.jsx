// src/components/AddProjectModal.jsx
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, ExternalLink, AlertCircle } from 'lucide-react'
import { GithubIcon } from './icons'

const TECH_OPTIONS = [
  'React.js','Node.js','Express.js','MongoDB','Mongoose',
  'JavaScript','TypeScript','HTML5','CSS3','Tailwind CSS',
  'REST API','Next.js','Vite','Git','PostgreSQL','MySQL',
  'Redux','GraphQL','Docker','Firebase','Vercel','Render',
]

const EMPTY_FORM = {
  title: '',
  description: '',
  liveUrl: '',
  githubUrl: '',
  featured: false,
  image: null,
}

const inputCss = (err) => ({
  width: '100%',
  background: '#080b14',
  border: `1px solid ${err ? '#ef4444' : '#1e2d45'}`,
  borderRadius: '0.5rem',
  padding: '0.65rem 0.85rem',
  color: '#f8fafc',
  fontSize: '0.9rem',
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'border-color 0.2s',
})

function FieldError({ msg }) {
  if (!msg) return null
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.76rem', color: '#ef4444', marginTop: '0.3rem' }}>
      <AlertCircle size={11} /> {msg}
    </span>
  )
}

function Label({ children, required }) {
  return (
    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '0.4rem' }}>
      {children}
      {required && <span style={{ color: '#ef4444', marginLeft: '3px' }}>*</span>}
    </label>
  )
}

export default function AddProjectModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [selectedTech, setSelectedTech] = useState([])
  const [customTech, setCustomTech] = useState('')
  const [errors, setErrors] = useState({})
  const firstRef = useRef(null)

  // Trap Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (open) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Focus first input on mount
  useEffect(() => {
    if (open) {
      setTimeout(() => firstRef.current?.focus(), 80)
    }
  }, [open])

  const change = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [field]: val }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }))
  }

  const toggleTech = (t) => {
    setSelectedTech((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    )
  }

  const addCustomTech = () => {
    const t = customTech.trim()
    if (t && !selectedTech.includes(t)) {
      setSelectedTech((prev) => [...prev, t])
      setCustomTech('')
    }
  }

  const removeTech = (t) => setSelectedTech((prev) => prev.filter((x) => x !== t))

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Project title is required.'
    if (!form.description.trim()) e.description = 'Description is required.'
    if (form.description.trim().length < 15) e.description = 'Description must be at least 15 characters.'
    if (selectedTech.length === 0) e.tech = 'Select at least one technology.'
    if (form.liveUrl && !/^https?:\/\/.+/.test(form.liveUrl)) e.liveUrl = 'Enter a valid URL (start with https://).'
    if (form.githubUrl && !/^https?:\/\/.+/.test(form.githubUrl)) e.githubUrl = 'Enter a valid URL (start with https://).'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // Convert a File to base64 data URI
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  const [submitting, setSubmitting] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!validate() || submitting) return
    setSubmitting(true)

    try {
      let imageData = null
      if (form.image) {
        imageData = await fileToBase64(form.image)
      }

      await onAdd({
        title: form.title.trim(),
        description: form.description.trim(),
        tech: selectedTech,
        image: imageData,
        liveUrl: form.liveUrl.trim() || null,
        githubUrl: form.githubUrl.trim() || null,
        featured: form.featured,
      })
      onClose()
    } catch (err) {
      console.error('Failed to add project:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 100,
              background: 'rgba(4,6,14,0.85)',
              backdropFilter: 'blur(6px)',
            }}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 101,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              pointerEvents: 'none',
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                pointerEvents: 'auto',
                width: '100%',
                maxWidth: '580px',
                maxHeight: '90vh',
                overflowY: 'auto',
                background: '#111827',
                border: '1px solid #1e2d45',
                borderRadius: '1.25rem',
                boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(59,130,246,0.08)',
              }}
            >
              {/* Header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1.5rem 1.75rem',
                borderBottom: '1px solid #1e2d45',
                position: 'sticky', top: 0,
                background: '#111827',
                borderRadius: '1.25rem 1.25rem 0 0',
                zIndex: 1,
              }}>
                <div>
                  <h2 id="modal-title" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                    Add New Project
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                    Fill in the details — it'll appear in your project grid instantly.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  style={{
                    background: 'none', border: '1px solid #1e2d45', borderRadius: '0.5rem',
                    width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#64748b', cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1e2d45'; e.currentTarget.style.color = '#64748b' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form body */}
              <form onSubmit={submit} noValidate style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>

                {/* Title */}
                <div>
                  <Label required>Project Title</Label>
                  <input
                    ref={firstRef}
                    id="ap-title"
                    type="text"
                    placeholder="e.g. E-Commerce Platform"
                    value={form.title}
                    onChange={change('title')}
                    style={inputCss(errors.title)}
                    onFocus={(e) => { if (!errors.title) e.target.style.borderColor = '#3b82f6' }}
                    onBlur={(e) => { if (!errors.title) e.target.style.borderColor = '#1e2d45' }}
                  />
                  <FieldError msg={errors.title} />
                </div>

                {/* Description */}
                <div>
                  <Label required>Description</Label>
                  <textarea
                    id="ap-desc"
                    rows={3}
                    placeholder="What does this project do? What problem does it solve?"
                    value={form.description}
                    onChange={change('description')}
                    style={{ ...inputCss(errors.description), resize: 'vertical', minHeight: '80px' }}
                    onFocus={(e) => { if (!errors.description) e.target.style.borderColor = '#3b82f6' }}
                    onBlur={(e) => { if (!errors.description) e.target.style.borderColor = '#1e2d45' }}
                  />
                  <FieldError msg={errors.description} />
                </div>

                {/* Project Image */}
                <div>
                  <Label>Project Image</Label>
                  <input
                    id="ap-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setForm((f) => ({ ...f, image: e.target.files[0] }))}
                    style={inputCss(false)}
                  />
                  {form.image && (
                    <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.4rem' }}>
                      Selected: {form.image.name} ({(form.image.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                </div>

                {/* Tech stack selector */}
                <div>
                  <Label required>Tech Stack</Label>

                  {/* Selected tags */}
                  {selectedTech.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                      {selectedTech.map((t) => (
                        <span key={t} style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                          background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)',
                          borderRadius: '999px', padding: '0.2rem 0.65rem',
                          fontSize: '0.78rem', fontWeight: 600, color: '#60a5fa',
                        }}>
                          {t}
                          <button
                            type="button"
                            onClick={() => removeTech(t)}
                            aria-label={`Remove ${t}`}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#60a5fa', display: 'flex', alignItems: 'center' }}
                          >
                            <X size={11} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Common options */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                    {TECH_OPTIONS.map((t) => {
                      const active = selectedTech.includes(t)
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => toggleTech(t)}
                          style={{
                            fontSize: '0.76rem', fontWeight: 500,
                            padding: '0.25rem 0.65rem', borderRadius: '999px',
                            border: `1px solid ${active ? 'rgba(59,130,246,0.4)' : '#1e2d45'}`,
                            background: active ? 'rgba(59,130,246,0.12)' : 'transparent',
                            color: active ? '#60a5fa' : '#64748b',
                            cursor: 'pointer', transition: 'all 0.15s',
                          }}
                        >
                          {t}
                        </button>
                      )
                    })}
                  </div>

                  {/* Custom tech input */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="Add custom technology…"
                      value={customTech}
                      onChange={(e) => setCustomTech(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomTech() } }}
                      style={{ ...inputCss(false), flex: 1 }}
                      onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                      onBlur={(e) => (e.target.style.borderColor = '#1e2d45')}
                    />
                    <button
                      type="button"
                      onClick={addCustomTech}
                      style={{
                        padding: '0.65rem 0.9rem', borderRadius: '0.5rem',
                        background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                        color: '#3b82f6', cursor: 'pointer', transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(59,130,246,0.18)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(59,130,246,0.1)' }}
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>
                  <FieldError msg={errors.tech} />
                </div>

                {/* Links */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <Label>Live Demo URL</Label>
                    <div style={{ position: 'relative' }}>
                      <ExternalLink size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
                      <input
                        id="ap-live"
                        type="url"
                        placeholder="https://..."
                        value={form.liveUrl}
                        onChange={change('liveUrl')}
                        style={{ ...inputCss(errors.liveUrl), paddingLeft: '2.1rem' }}
                        onFocus={(e) => { if (!errors.liveUrl) e.target.style.borderColor = '#3b82f6' }}
                        onBlur={(e) => { if (!errors.liveUrl) e.target.style.borderColor = '#1e2d45' }}
                      />
                    </div>
                    <FieldError msg={errors.liveUrl} />
                  </div>

                  <div>
                    <Label>GitHub Repo URL</Label>
                    <div style={{ position: 'relative' }}>
                      <GithubIcon size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
                      <input
                        id="ap-github"
                        type="url"
                        placeholder="https://github.com/..."
                        value={form.githubUrl}
                        onChange={change('githubUrl')}
                        style={{ ...inputCss(errors.githubUrl), paddingLeft: '2.1rem' }}
                        onFocus={(e) => { if (!errors.githubUrl) e.target.style.borderColor = '#3b82f6' }}
                        onBlur={(e) => { if (!errors.githubUrl) e.target.style.borderColor = '#1e2d45' }}
                      />
                    </div>
                    <FieldError msg={errors.githubUrl} />
                  </div>
                </div>

                {/* Featured toggle */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', userSelect: 'none' }}>
                  <div
                    onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
                    style={{
                      width: '44px', height: '24px', borderRadius: '999px',
                      background: form.featured ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : '#1e2d45',
                      position: 'relative', transition: 'background 0.25s', flexShrink: 0,
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <div style={{
                      position: 'absolute', top: '2px',
                      left: form.featured ? '22px' : '2px',
                      width: '18px', height: '18px', borderRadius: '50%',
                      background: '#f8fafc',
                      transition: 'left 0.25s',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
                    }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc' }}>Featured Project</span>
                    <p style={{ fontSize: '0.76rem', color: '#64748b', margin: 0 }}>
                      Featured projects appear in the main grid at the top.
                    </p>
                  </div>
                </label>

                {/* Footer actions */}
                <div style={{
                  display: 'flex', gap: '0.75rem', justifyContent: 'flex-end',
                  paddingTop: '0.75rem', borderTop: '1px solid #1e2d45', marginTop: '0.25rem',
                }}>
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-outline"
                    style={{ padding: '0.6rem 1.25rem', fontSize: '0.88rem' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    id="add-project-submit"
                    className="btn-primary"
                    disabled={submitting}
                    style={{ padding: '0.6rem 1.5rem', fontSize: '0.88rem', opacity: submitting ? 0.6 : 1 }}
                  >
                    <Plus size={15} />
                    {submitting ? 'Saving…' : 'Add Project'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
