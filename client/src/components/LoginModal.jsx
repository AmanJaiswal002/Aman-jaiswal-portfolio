// src/components/LoginModal.jsx
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Eye, EyeOff, Loader2, Lock, User } from 'lucide-react'
import { adminLogin as apiLogin, setAuthToken } from '../services/api'

const inputStyle = (hasError) => ({
  width: '100%',
  background: '#080b14',
  border: `1px solid ${hasError ? '#ef4444' : '#1e2d45'}`,
  borderRadius: '0.5rem',
  padding: '0.7rem 0.9rem',
  color: '#f8fafc',
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'border-color 0.2s',
  fontFamily: 'inherit',
})

function Label({ children }) {
  return (
    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '0.4rem' }}>
      {children}
    </label>
  )
}

export default function LoginModal({ open, onClose }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const usernameRef = useRef(null)

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setUsername('')
      setPassword('')
      setError('')
      setTimeout(() => usernameRef.current?.focus(), 80)
    }
  }, [open])

  // Trap Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (open) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    setError('')
    setSubmitting(true)

    try {
      const res = await apiLogin({ username, password })
      if (res.success) {
        setAuthToken(res.token)
        onClose()
      } else {
        setError(res.message || 'Login failed. Please try again.')
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
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
          <motion.div
            key="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-modal-title"
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
                maxWidth: '400px',
                background: '#111827',
                border: '1px solid #1e2d45',
                borderRadius: '1.25rem',
                boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(59,130,246,0.08)',
              }}
            >
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
                  <h2 id="login-modal-title" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                    Admin Login
                  </h2>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                    Enter credentials to manage projects
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

              <form onSubmit={handleSubmit} noValidate style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {error && (
                  <div style={{
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1rem',
                    color: '#fca5a5',
                    fontSize: '0.85rem',
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'flex-start',
                  }}>
                    {error}
                  </div>
                )}

                <div>
                  <Label>Username</Label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
                    <input
                      ref={usernameRef}
                      id="login-username"
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      style={{ ...inputStyle(false), paddingLeft: '2.5rem' }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = '#1e2d45'}
                      autoComplete="username"
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div>
                  <Label>Password</Label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', pointerEvents: 'none' }} />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ ...inputStyle(false), paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                      onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                      onBlur={(e) => e.target.style.borderColor = '#1e2d45'}
                      autoComplete="current-password"
                      disabled={submitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                  style={{ justifyContent: 'center', padding: '0.7rem 1.5rem', fontSize: '0.9rem', opacity: submitting ? 0.7 : 1 }}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      Signing in…
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}