// src/pages/NotFound.jsx
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1.5rem',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontSize: 'clamp(5rem, 15vw, 9rem)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1,
        }}
      >
        404
      </h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>
        Page Not Found
      </h2>
      <p style={{ color: '#94a3b8', maxWidth: '400px' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a href="/" className="btn-primary">
        <Home size={16} />
        Back to Home
      </a>
    </div>
  )
}
