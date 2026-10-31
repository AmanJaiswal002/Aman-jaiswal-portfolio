// src/components/TimelineItem.jsx
import { GraduationCap, Briefcase, Award, Code } from 'lucide-react'

const ICONS = {
  education: GraduationCap,
  internship: Briefcase,
  work: Briefcase,
  certification: Award,
  hackathon: Code,
}

const ACCENT = {
  education: '#3b82f6',
  internship: '#8b5cf6',
  work: '#8b5cf6',
  certification: '#06b6d4',
  hackathon: '#f59e0b',
}

export default function TimelineItem({ item, isLast }) {
  const Icon = ICONS[item.type] || Briefcase
  const accent = ACCENT[item.type] || '#3b82f6'

  return (
    <div style={{ display: 'flex', gap: '1.25rem', position: 'relative' }}>
      {/* Line + Icon */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: `rgba(${accent === '#3b82f6' ? '59,130,246' : accent === '#8b5cf6' ? '139,92,246' : '6,182,212'},0.12)`,
            border: `2px solid ${accent}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={18} style={{ color: accent }} />
        </div>
        {!isLast && (
          <div style={{ width: '2px', flex: 1, background: '#1e2d45', minHeight: '40px', marginTop: '4px' }} />
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, paddingBottom: isLast ? 0 : '2rem' }}>
        <div
          className="card"
          style={{ padding: '1.25rem' }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '0.5rem',
              marginBottom: '0.5rem',
            }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
              {item.title}
            </h3>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 500,
                color: '#64748b',
                background: '#0d1120',
                border: '1px solid #1e2d45',
                borderRadius: '999px',
                padding: '0.2rem 0.65rem',
                whiteSpace: 'nowrap',
              }}
            >
              {item.duration}
            </span>
          </div>
          <p style={{ color: accent, fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.5rem' }}>
            {item.institution}
          </p>
          {item.description && (
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.65 }}>
              {item.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
