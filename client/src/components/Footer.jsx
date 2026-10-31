// src/components/Footer.jsx
import { Mail, ArrowUp } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './icons'

export default function Footer() {
  const year = 2026

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer
      style={{
        background: '#080b14',
        borderTop: '1px solid #1e2d45',
        padding: '3rem 1.5rem 2rem',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '2rem',
            marginBottom: '2rem',
          }}
        >
          {/* Branding */}
          <div>
            <p
              style={{
                fontSize: '1.4rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.4rem',
              }}
            >
              AMAN JAISWAL
            </p>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Full Stack Developer · Building impactful digital experiences
            </p>
          </div>

          {/* Social Links */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {[
              {
                href: 'https://github.com/AmanJaiswal002',
                icon: <GithubIcon size={18} />,
                label: 'GitHub',
              },
              {
                href: 'https://www.linkedin.com/in/aman-jaiswal-119b77329/',
                icon: <LinkedinIcon size={18} />,
                label: 'LinkedIn',
              },
              {
                href: 'mailto:jaiswalaman1520@gmail.com',
                icon: <Mail size={18} />,
                label: 'Email',
              },
            ].map(({ href, icon, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-label={label}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '0.5rem',
                  border: '1px solid #1e2d45',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94a3b8',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6'
                  e.currentTarget.style.color = '#3b82f6'
                  e.currentTarget.style.background = 'rgba(59,130,246,0.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#1e2d45'
                  e.currentTarget.style.color = '#94a3b8'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #1e2d45',
          }}
        >
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            © {year} Aman Jaiswal. All rights reserved.
          </p>

          <button
            onClick={scrollTop}
            aria-label="Back to top"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'none',
              border: '1px solid #1e2d45',
              borderRadius: '0.4rem',
              padding: '0.4rem 0.75rem',
              color: '#64748b',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6'
              e.currentTarget.style.color = '#3b82f6'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#1e2d45'
              e.currentTarget.style.color = '#64748b'
            }}
          >
            <ArrowUp size={14} />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  )
}
