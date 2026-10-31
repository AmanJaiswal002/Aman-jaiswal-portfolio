// src/sections/Hero.jsx
import { motion } from 'framer-motion'
import { ArrowRight, Mail, Sparkles } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '../components/icons'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
})

export default function Hero() {
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="home"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '7rem 1.5rem 4rem',
      }}
    >
      {/* Background orbs */}
      <div
        className="orb"
        style={{
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
          top: '-10%', left: '-15%',
        }}
      />
      <div
        className="orb"
        style={{
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
          bottom: '-5%', right: '-10%',
        }}
      />

      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr)',
            gap: '4rem',
            alignItems: 'center',
          }}
          className="hero-grid"
        >
          {/* Left content */}
          <div>
            {/* Availability badge */}
            <motion.div {...fadeUp(0)} style={{ marginBottom: '1.5rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(59,130,246,0.08)',
                  border: '1px solid rgba(59,130,246,0.2)',
                  borderRadius: '999px',
                  padding: '0.35rem 1rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#3b82f6',
                }}
              >
                <span
                  style={{
                    width: '7px', height: '7px',
                    borderRadius: '50%',
                    background: '#22c55e',
                    boxShadow: '0 0 6px #22c55e',
                    display: 'inline-block',
                  }}
                />
                Available for opportunities
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              {...fadeUp(0.1)}
              style={{ fontSize: 'clamp(2.2rem, 5.5vw, 3.8rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '0.5rem' }}
            >
              Hi, I'm{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Aman Jaiswal
              </span>
            </motion.h1>

            <motion.h2
              {...fadeUp(0.2)}
              style={{
                fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                fontWeight: 400,
                color: '#94a3b8',
                marginBottom: '1.5rem',
              }}
            >
              Full Stack Developer
            </motion.h2>

            <motion.p
              {...fadeUp(0.3)}
              style={{ fontSize: '1.05rem', color: '#94a3b8', lineHeight: 1.75, maxWidth: '560px', marginBottom: '2.5rem' }}
            >
              Building digital experiences that make an impact. I craft modern, responsive, and scalable web applications with a focus on clean code, intuitive user experiences, and reliable backend systems.
            </motion.p>

            {/* CTAs */}
            <motion.div
              {...fadeUp(0.4)}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}
            >
              <button
                className="btn-primary"
                onClick={() => scrollTo('projects')}
                id="hero-view-projects"
              >
                View Projects
                <ArrowRight size={16} />
              </button>
              <button
                className="btn-outline"
                onClick={() => scrollTo('contact')}
                id="hero-contact-me"
              >
                <Mail size={16} />
                Contact Me
              </button>
            </motion.div>

            {/* Social links */}
            <motion.div {...fadeUp(0.5)} style={{ display: 'flex', gap: '1.5rem' }}>
              {[
                { href: 'https://github.com/AmanJaiswal002', icon: <GithubIcon size={20} />, label: 'GitHub' },
                { href: 'https://www.linkedin.com/in/aman-jaiswal-119b77329/', icon: <LinkedinIcon size={20} />, label: 'LinkedIn' },
              ].map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: '#64748b',
                    textDecoration: 'none',
                    fontSize: '0.88rem',
                    fontWeight: 500,
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#3b82f6')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
                >
                  {icon}
                  {label}
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right: Animated visual */}
          <div className="hero-visual" style={{ display: 'none', justifyContent: 'center' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{
                width: '280px',
                height: '280px',
                borderRadius: '50%',
                background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                animation: 'orb-spin 8s linear infinite',
              }}
            >
              <div
                style={{
                  width: '240px',
                  height: '240px',
                  borderRadius: '50%',
                  background: '#080b14',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '0.25rem',
                }}
              >
                <Sparkles size={40} style={{ color: '#3b82f6' }} />
                <span style={{ color: '#f8fafc', fontWeight: 800, fontSize: '1rem' }}>MERN Stack</span>
                <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Developer</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes orb-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (min-width: 768px) {
          .hero-grid { grid-template-columns: minmax(0,1fr) auto !important; }
          .hero-visual { display: flex !important; }
        }
      `}</style>
    </section>
  )
}
