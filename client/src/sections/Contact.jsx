// src/sections/Contact.jsx
import { useState, useRef } from 'react'
import SectionReveal from '../components/SectionReveal'
import { submitContact } from '../services/api'
import { Send, CheckCircle, AlertCircle, Mail, Loader } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '../components/icons'

const INITIAL = { name: '', email: '', subject: '', message: '' }
const INITIAL_ERRORS = { name: '', email: '', subject: '', message: '' }

function validate(fields) {
  const errors = { ...INITIAL_ERRORS }
  let valid = true

  if (!fields.name.trim()) { errors.name = 'Name is required.'; valid = false }
  if (!fields.email.trim()) { errors.email = 'Email is required.'; valid = false }
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) { errors.email = 'Enter a valid email address.'; valid = false }
  if (!fields.subject.trim()) { errors.subject = 'Subject is required.'; valid = false }
  if (!fields.message.trim() || fields.message.trim().length < 10) { errors.message = 'Message must be at least 10 characters.'; valid = false }

  return { errors, valid }
}

function Field({ id, label, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <label htmlFor={id} style={{ fontSize: '0.85rem', fontWeight: 500, color: '#94a3b8' }}>
        {label} <span style={{ color: '#ef4444' }}>*</span>
      </label>
      {children}
      {error && (
        <span style={{ fontSize: '0.78rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <AlertCircle size={12} /> {error}
        </span>
      )}
    </div>
  )
}

const inputStyle = (hasError) => ({
  background: '#0d1120',
  border: `1px solid ${hasError ? '#ef4444' : '#1e2d45'}`,
  borderRadius: '0.5rem',
  padding: '0.7rem 0.9rem',
  color: '#f8fafc',
  fontSize: '0.9rem',
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.2s',
  fontFamily: 'inherit',
})

export default function Contact() {
  const [fields, setFields] = useState(INITIAL)
  const [errors, setErrors] = useState(INITIAL_ERRORS)
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [apiError, setApiError] = useState('')
  const submittingRef = useRef(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submittingRef.current) return
    const { errors: validationErrors, valid } = validate(fields)
    if (!valid) { setErrors(validationErrors); return }

    submittingRef.current = true
    setStatus('loading')
    setApiError('')

    try {
      await submitContact(fields)
      setStatus('success')
      setFields(INITIAL)
    } catch (err) {
      setStatus('error')
      setApiError(
        err?.response?.data?.message ||
        'Something went wrong. Please try again or contact me directly by email.'
      )
    } finally {
      submittingRef.current = false
    }
  }

  return (
    <section id="contact" className="section-padding" style={{ background: '#0d1120' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <SectionReveal>
          <span className="section-label">Get In Touch</span>
          <h2 className="section-title">
            Let's{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Connect
            </span>
          </h2>
          <p className="section-subtitle" style={{ marginBottom: '3rem' }}>
            Have a project in mind, a question, or just want to say hi? I'd love to hear from you.
          </p>
        </SectionReveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2.5rem',
          }}
        >
          {/* Contact Info */}
          <SectionReveal delay={0.1}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
                  Reach out directly
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.65 }}>
                  I'm responsive and always happy to connect. I typically reply within 24–48 hours.
                </p>
              </div>

              {[
                { icon: <Mail size={18} />, label: 'Email', value: 'jaiswalaman1520@gmail.com', href: 'mailto:jaiswalaman1520@gmail.com' },
                { icon: <span style={{fontSize: '18px'}}>📞</span>, label: 'Phone', value: '+91 9335294846', href: 'tel:+919335294848' },
                { icon: <span style={{fontSize: '18px'}}>📍</span>, label: 'Location', value: 'Meerut, Uttar Pradesh, India', href: '#' },
                { icon: <GithubIcon size={18} />, label: 'GitHub', value: 'github.com/AmanJaiswal002', href: 'https://github.com/AmanJaiswal002' },
                { icon: <LinkedinIcon size={18} />, label: 'LinkedIn', value: 'linkedin.com/in/aman-jaiswal-119b77329', href: 'https://www.linkedin.com/in/aman-jaiswal-119b77329/' },
              ].map(({ icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="card"
                  style={{
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.9rem',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <div
                    style={{
                      width: '40px', height: '40px',
                      borderRadius: '0.5rem',
                      background: 'rgba(59,130,246,0.12)',
                      border: '1px solid rgba(59,130,246,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#3b82f6', flexShrink: 0,
                    }}
                  >
                    {icon}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>{label}</p>
                    <p style={{ fontSize: '0.88rem', color: '#f8fafc', fontWeight: 500 }}>{value}</p>
                  </div>
                </a>
              ))}
            </div>
          </SectionReveal>

          {/* Form */}
          <SectionReveal delay={0.2}>
            <div className="card" style={{ padding: '2rem' }}>
              {status === 'success' ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <CheckCircle size={48} style={{ color: '#22c55e', margin: '0 auto 1rem' }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
                    Message Sent!
                  </h3>
                  <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
                    Thank you for reaching out. I'll get back to you soon.
                  </p>
                  <button
                    className="btn-outline"
                    onClick={() => setStatus('idle')}
                    style={{ fontSize: '0.85rem' }}
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <Field id="contact-name" label="Full Name" error={errors.name}>
                        <input
                          id="contact-name"
                          name="name"
                          type="text"
                          value={fields.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          style={inputStyle(!!errors.name)}
                          onFocus={(e) => { if (!errors.name) e.target.style.borderColor = '#3b82f6' }}
                          onBlur={(e) => { if (!errors.name) e.target.style.borderColor = '#1e2d45' }}
                          autoComplete="name"
                        />
                      </Field>

                      <Field id="contact-email" label="Email Address" error={errors.email}>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          value={fields.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          style={inputStyle(!!errors.email)}
                          onFocus={(e) => { if (!errors.email) e.target.style.borderColor = '#3b82f6' }}
                          onBlur={(e) => { if (!errors.email) e.target.style.borderColor = '#1e2d45' }}
                          autoComplete="email"
                        />
                      </Field>
                    </div>

                    <Field id="contact-subject" label="Subject" error={errors.subject}>
                      <input
                        id="contact-subject"
                        name="subject"
                        type="text"
                        value={fields.subject}
                        onChange={handleChange}
                        placeholder="What is this"
                        style={inputStyle(!!errors.subject)}
                        onFocus={(e) => { if (!errors.subject) e.target.style.borderColor = '#3b82f6' }}
                        onBlur={(e) => { if (!errors.subject) e.target.style.borderColor = '#1e2d45' }}
                      />
                    </Field>

                    <Field id="contact-message" label="Message" error={errors.message}>
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={5}
                        value={fields.message}
                        onChange={handleChange}
                        placeholder="Your message here..."
                        style={{ ...inputStyle(!!errors.message), resize: 'vertical', minHeight: '120px' }}
                        onFocus={(e) => { if (!errors.message) e.target.style.borderColor = '#3b82f6' }}
                        onBlur={(e) => { if (!errors.message) e.target.style.borderColor = '#1e2d45' }}
                      />
                    </Field>

                    {status === 'error' && apiError && (
                      <div
                        style={{
                          background: 'rgba(239,68,68,0.08)',
                          border: '1px solid rgba(239,68,68,0.2)',
                          borderRadius: '0.5rem',
                          padding: '0.75rem 1rem',
                          color: '#fca5a5',
                          fontSize: '0.85rem',
                          display: 'flex',
                          gap: '0.5rem',
                          alignItems: 'flex-start',
                        }}
                      >
                        <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
                        {apiError}
                      </div>
                    )}

                    <button
                      type="submit"
                      id="contact-submit"
                      className="btn-primary"
                      disabled={status === 'loading'}
                      style={{ justifyContent: 'center', opacity: status === 'loading' ? 0.7 : 1, cursor: status === 'loading' ? 'not-allowed' : 'pointer' }}
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </SectionReveal>
        </div>
      </div>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </section>
  )
}
