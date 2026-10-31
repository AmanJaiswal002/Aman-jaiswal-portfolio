// src/components/ProjectCard.jsx
import { useState } from 'react'
import { ExternalLink, Code2, Trash2 } from 'lucide-react'
import { GithubIcon } from './icons'

const TECH_COLORS = {
  'React.js': '#61dafb',
  'Node.js': '#68a063',
  'Express.js': '#94a3b8',
  MongoDB: '#4caf50',
  'Tailwind CSS': '#38bdf8',
  JavaScript: '#f7df1e',
  'HTML5': '#e34c26',
  'CSS3': '#264de4',
  'REST API': '#8b5cf6',
  Mongoose: '#880000',
}

export default function ProjectCard({ project, onDelete }) {
  const [hovered, setHovered] = useState(false)
  const { title, description, tech = [], image, liveUrl, githubUrl } = project

  return (
    <article
      className="card"
      style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Delete button — visible on hover if onDelete is provided */}
      {onDelete && hovered && (
        <button
          onClick={() => onDelete(project.id)}
          aria-label={`Delete project ${title}`}
          title="Remove this project"
          style={{
            position: 'absolute', top: '0.6rem', right: '0.6rem', zIndex: 2,
            width: '30px', height: '30px', borderRadius: '0.4rem',
            background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#f87171', cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.22)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)' }}
        >
          <Trash2 size={13} />
        </button>
      )}
      {/* Thumbnail */}
      <div
        style={{
          aspectRatio: '16/9',
          background: image
            ? `url(${image}) center/cover no-repeat`
            : 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))',
          borderBottom: '1px solid #1e2d45',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {!image && (
          <Code2 size={48} style={{ color: '#2a3f5f', opacity: 0.6 }} />
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
          {title}
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.65, flex: 1 }}>
          {description}
        </p>

        {/* Tech Stack */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {tech.map((t) => (
            <span
              key={t}
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '0.25rem 0.6rem',
                borderRadius: '999px',
                background: 'rgba(59,130,246,0.08)',
                border: '1px solid rgba(59,130,246,0.15)',
                color: TECH_COLORS[t] || '#94a3b8',
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {liveUrl ? (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.82rem', flex: 1, justifyContent: 'center' }}
            >
              <ExternalLink size={13} />
              Live Demo
            </a>
          ) : (
            <span
              title="Live demo not available yet"
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.82rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid #1e2d45',
                color: '#64748b',
                cursor: 'not-allowed',
              }}
            >
              Demo Unavailable
            </span>
          )}

          {githubUrl ? (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
              aria-label="View source on GitHub"
            >
              <GithubIcon size={13} />
              Code
            </a>
          ) : (
            <span
              title="Repository not linked yet"
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.82rem',
                border: '1px solid #1e2d45',
                color: '#64748b',
                cursor: 'not-allowed',
              }}
            >
              <GithubIcon size={13} style={{ display: 'inline', marginRight: '4px' }} />
              Repo
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
