// src/components/Navbar.jsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, FileText, LogIn, LogOut, User } from 'lucide-react'
import { useActiveSection } from '../hooks/useActiveSection'
import { useAuth } from '../context/AuthContext'
import LoginModal from './LoginModal'

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

const SECTION_IDS = NAV_LINKS.map((l) => l.href.replace('#', ''))

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const active = useActiveSection(SECTION_IDS)
  const { admin, logout, isAuthenticated } = useAuth()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleNav = (href) => {
    setOpen(false)
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout()
    } else {
      setLoginModalOpen(true)
    }
  }

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.3s ease',
        background: scrolled
          ? 'rgba(8,11,20,0.92)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid #1e2d45' : '1px solid transparent',
      }}
    >
      <nav
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => { e.preventDefault(); handleNav('#home') }}
          style={{
            fontSize: '1.3rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textDecoration: 'none',
            letterSpacing: '-0.02em',
          }}
        >
          AMAN.DEV
        </a>

        {/* Desktop Links */}
        <ul
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            listStyle: 'none',
          }}
          className="hidden md:flex"
        >
          {NAV_LINKS.map(({ label, href }) => {
            const id = href.replace('#', '')
            const isActive = active === id
            return (
              <li key={href}>
                <a
                  href={href}
                  onClick={(e) => { e.preventDefault(); handleNav(href) }}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '0.4rem',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: isActive ? '#3b82f6' : '#94a3b8',
                    textDecoration: 'none',
                    transition: 'color 0.2s',
                    position: 'relative',
                  }}
                >
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="navIndicator"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '0.4rem',
                        background: 'rgba(59,130,246,0.1)',
                        border: '1px solid rgba(59,130,246,0.2)',
                        zIndex: -1,
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </a>
              </li>
            )
          })}
        </ul>

        {/* Resume + Auth + Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <a
            href="/api/resume"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary hidden md:inline-flex"
            style={{ padding: '0.5rem 1.1rem', fontSize: '0.85rem' }}
          >
            <FileText size={14} />
            Resume
          </a>

          <button
            onClick={handleAuthClick}
            className="btn-outline hidden md:inline-flex"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', gap: '0.4rem' }}
          >
            {isAuthenticated ? (
              <>
                <User size={14} />
                {admin?.username}
                <LogOut size={14} />
              </>
            ) : (
              <>
                <LogIn size={14} />
                Login
              </>
            )}
          </button>

          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation menu"
            style={{
              background: 'none',
              border: '1px solid #1e2d45',
              borderRadius: '0.4rem',
              padding: '0.4rem',
              color: '#94a3b8',
              cursor: 'pointer',
            }}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: 'rgba(8,11,20,0.97)',
              borderTop: '1px solid #1e2d45',
              padding: '1rem 1.5rem 1.5rem',
            }}
          >
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {NAV_LINKS.map(({ label, href }) => {
                const id = href.replace('#', '')
                const isActive = active === id
                return (
                  <li key={href}>
                    <a
                      href={href}
                      onClick={(e) => { e.preventDefault(); handleNav(href) }}
                      style={{
                        display: 'block',
                        padding: '0.65rem 0.75rem',
                        borderRadius: '0.4rem',
                        color: isActive ? '#3b82f6' : '#94a3b8',
                        fontWeight: 500,
                        textDecoration: 'none',
                        background: isActive ? 'rgba(59,130,246,0.08)' : 'transparent',
                        transition: 'all 0.2s',
                      }}
                    >
                      {label}
                    </a>
                  </li>
                )
              })}
              <li>
                <a
                  href="/api/resume"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ marginTop: '0.5rem', justifyContent: 'center' }}
                >
                  <FileText size={14} />
                  View Resume
                </a>
              </li>
              <li>
                <button
                  onClick={handleAuthClick}
                  className="btn-outline"
                  style={{ marginTop: '0.5rem', justifyContent: 'center', width: '100%' }}
                >
                  {isAuthenticated ? (
                    <>
                      <LogOut size={14} />
                      Logout
                    </>
                  ) : (
                    <>
                      <LogIn size={14} />
                      Login
                    </>
                  )}
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <LoginModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </header>
  )
}
