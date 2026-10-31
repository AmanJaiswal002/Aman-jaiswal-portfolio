// src/sections/Skills.jsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Loader2, Edit, Trash2 } from 'lucide-react'
import SectionReveal from '../components/SectionReveal'
import { useAuth } from '../context/AuthContext'
import { fetchSkills, createSkill, updateSkill, deleteSkill } from '../services/api'

const ACCENT = {
  blue: { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)', text: '#3b82f6' },
  purple: { bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)', text: '#8b5cf6' },
  cyan: { bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.2)', text: '#06b6d4' },
  green: { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)', text: '#22c55e' },
  orange: { bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.2)', text: '#f97316' },
}

const _CATEGORIES = ['Frontend Development', 'Backend Development', 'Databases', 'Tools & Platforms', 'Other']
const LEVELS = ['Learning', 'Intermediate', 'Advanced']
const COLORS = ['blue', 'purple', 'cyan', 'green', 'orange']

function LevelDot({ level }) {
  const filled = level === 'Advanced' ? 3 : level === 'Intermediate' ? 2 : 1
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            width: '6px', height: '6px',
            borderRadius: '50%',
            background: i <= filled ? '#3b82f6' : '#1e2d45',
          }}
        />
      ))}
    </div>
  )
}

function SkillItem({ skill, group, onEdit, onDelete, isEditing, onSave, onCancel, editForm, setEditForm }) {
  const accent = ACCENT[group.color] || ACCENT.blue
  const isAdmin = onEdit && onDelete

  if (isEditing && isAdmin) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: accent.bg, border: `1px solid ${accent.border}`, borderRadius: '0.5rem', padding: '0.75rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <input
            type="text"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            placeholder="Skill name"
            style={{ flex: 1, minWidth: '120px', background: '#080b14', border: `1px solid ${accent.border}`, borderRadius: '0.4rem', padding: '0.4rem 0.6rem', color: '#f8fafc', fontSize: '0.85rem', fontFamily: 'inherit' }}
            autoFocus
          />
          <select
            value={editForm.level}
            onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}
            style={{ background: '#080b14', border: `1px solid ${accent.border}`, borderRadius: '0.4rem', padding: '0.4rem 0.6rem', color: '#f8fafc', fontSize: '0.85rem', fontFamily: 'inherit' }}
          >
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button onClick={() => onSave(editForm)} className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Save</button>
          <button onClick={onCancel} className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: accent.bg,
        border: `1px solid ${accent.border}`,
        borderRadius: '0.5rem',
        padding: '0.5rem 0.75rem',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.88rem', fontWeight: 500, color: '#f8fafc' }}>{skill.name}</span>
        <LevelDot level={skill.level} />
      </div>
      {isAdmin && (
        <div style={{ display: 'flex', gap: '0.3rem' }}>
          <button onClick={() => onEdit(skill)} aria-label="Edit" style={{ background: 'none', border: 'none', color: accent.text, cursor: 'pointer', padding: '0.2rem', display: 'flex' }}><Edit size={14} /></button>
          <button onClick={() => onDelete(skill._id || skill.id)} aria-label="Delete" style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.2rem', display: 'flex' }}><Trash2 size={14} /></button>
        </div>
      )}
    </div>
  )
}

function AddSkillForm({ group, onAdd, onCancel }) {
  const [form, setForm] = useState({ name: '', level: 'Intermediate', color: group.color })
  const accent = ACCENT[group.color] || ACCENT.blue

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    onAdd({ ...form, category: group.category })
    setForm({ name: '', level: 'Intermediate', color: group.color })
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: accent.bg, border: `1px dashed ${accent.border}`, borderRadius: '0.5rem', padding: '0.75rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Skill name (e.g., TypeScript)"
          style={{ flex: 1, minWidth: '120px', background: '#080b14', border: `1px solid ${accent.border}`, borderRadius: '0.4rem', padding: '0.4rem 0.6rem', color: '#f8fafc', fontSize: '0.85rem', fontFamily: 'inherit' }}
          autoFocus
        />
        <select
          value={form.level}
          onChange={(e) => setForm({ ...form, level: e.target.value })}
          style={{ background: '#080b14', border: `1px solid ${accent.border}`, borderRadius: '0.4rem', padding: '0.4rem 0.6rem', color: '#f8fafc', fontSize: '0.85rem', fontFamily: 'inherit' }}
        >
          {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', gap: '0.4rem' }}>
        <button type="submit" className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}><Plus size={13} /> Add</button>
        <button type="button" onClick={onCancel} className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Cancel</button>
      </div>
    </form>
  )
}

export default function Skills() {
  const [skillGroups, setSkillGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(null)
  const [editingSkill, setEditingSkill] = useState(null)
  const [editForm, setEditForm] = useState({})
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    async function loadSkills() {
      try {
        const res = await fetchSkills()
        if (res.success) setSkillGroups(res.data)
      } catch (err) {
        console.error('Failed to load skills:', err)
      } finally {
        setLoading(false)
      }
    }
    loadSkills()
  }, [])

  const handleAddSkill = async (data) => {
    try {
      const res = await createSkill(data)
      if (res.success) {
        setSkillGroups((prev) => {
          const groupIndex = prev.findIndex((g) => g.category === data.category)
          const newSkill = { name: res.data.name, level: res.data.level, _id: res.data._id }
          if (groupIndex >= 0) {
            return prev.map((g, i) => i === groupIndex ? { ...g, skills: [...g.skills, newSkill] } : g)
          }
          return [...prev, { category: data.category, color: data.color, skills: [newSkill] }]
        })
      }
    } catch (err) {
      console.error('Failed to add skill:', err)
    }
  }

  const handleEditSkill = (skill) => {
    setEditingSkill(skill._id || skill.id)
    setEditForm({ name: skill.name, level: skill.level })
  }

  const handleSaveSkill = async (data) => {
    try {
      const res = await updateSkill(editingSkill, data)
      if (res.success) {
        setSkillGroups((prev) => prev.map((g) => ({
          ...g,
          skills: g.skills.map((s) => (s._id === editingSkill || s.id === editingSkill ? { ...s, ...data } : s)),
        })))
        setEditingSkill(null)
      }
    } catch (err) {
      console.error('Failed to update skill:', err)
    }
  }

  const handleDeleteSkill = async (id) => {
    if (!confirm('Delete this skill?')) return
    try {
      const res = await deleteSkill(id)
      if (res.success) {
        setSkillGroups((prev) => prev.map((g) => ({
          ...g,
          skills: g.skills.filter((s) => (s._id || s.id) !== id),
        })).filter((g) => g.skills.length > 0))
      }
    } catch (err) {
      console.error('Failed to delete skill:', err)
    }
  }

  if (loading) {
    return (
      <section id="skills" className="section-padding">
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', padding: '4rem 2rem', color: '#64748b' }}>
          <Loader2 size={36} style={{ margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
          <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>Loading skills…</p>
          <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
        </div>
      </section>
    )
  }

  return (
    <section id="skills" className="section-padding">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <SectionReveal>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '3rem' }}>
            <div>
              <span className="section-label">Technical Skills</span>
              <h2 className="section-title">
                My{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Tech Stack
                </span>
              </h2>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>
                Technologies I use to build robust, scalable, and modern web applications.
              </p>
            </div>
            {isAuthenticated && (
              <motion.button
                className="btn-primary"
                onClick={() => setShowAddForm('new-category')}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{ flexShrink: 0, marginTop: '0.25rem' }}
              >
                <Plus size={16} />
                Add Category
              </motion.button>
            )}
          </div>
        </SectionReveal>

        {showAddForm === 'new-category' && isAuthenticated && (
          <SectionReveal>
            <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>Add New Skill Category</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const fd = new FormData(e.target)
                  const category = fd.get('category')
                  const color = fd.get('color')
                  if (category && !skillGroups.some((g) => g.category === category)) {
                    setSkillGroups((prev) => [...prev, { category, color, skills: [] }])
                  }
                  setShowAddForm(null)
                }}
                style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}
              >
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem' }}>Category Name</label>
                  <input name="category" type="text" placeholder="e.g., Cloud & DevOps" required style={{ width: '100%', background: '#080b14', border: '1px solid #1e2d45', borderRadius: '0.5rem', padding: '0.6rem 0.8rem', color: '#f8fafc', fontSize: '0.9rem', fontFamily: 'inherit' }} />
                </div>
                <div style={{ minWidth: '160px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem' }}>Color Theme</label>
                  <select name="color" style={{ width: '100%', background: '#080b14', border: '1px solid #1e2d45', borderRadius: '0.5rem', padding: '0.6rem 0.8rem', color: '#f8fafc', fontSize: '0.9rem', fontFamily: 'inherit' }}>
                    {COLORS.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Create</button>
                  <button type="button" onClick={() => setShowAddForm(null)} className="btn-outline" style={{ padding: '0.5rem 1rem' }}>Cancel</button>
                </div>
              </form>
            </div>
          </SectionReveal>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {skillGroups.map((group, gi) => {
            const accent = ACCENT[group.color] || ACCENT.blue
            return (
              <SectionReveal key={group.category} delay={gi * 0.1}>
                <div className="card" style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: accent.text, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: accent.text, display: 'inline-block' }} />
                      {group.category}
                    </h3>
                    {isAuthenticated && (
                      <button onClick={() => setShowAddForm(group.category)} className="btn-primary" style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Plus size={12} /> Add
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
                    {group.skills.map((skill) => (
                      <SkillItem
                        key={skill._id || skill.id}
                        skill={skill}
                        group={group}
                        onEdit={isAuthenticated ? handleEditSkill : undefined}
                        onDelete={isAuthenticated ? handleDeleteSkill : undefined}
                        isEditing={editingSkill === (skill._id || skill.id)}
                        onSave={handleSaveSkill}
                        onCancel={() => setEditingSkill(null)}
                        editForm={editForm}
                        setEditForm={setEditForm}
                      />
                    ))}
                    {isAuthenticated && showAddForm === group.category && (
                      <AddSkillForm group={group} onAdd={handleAddSkill} onCancel={() => setShowAddForm(null)} />
                    )}
                  </div>
                  {isAuthenticated && group.skills.length === 0 && !showAddForm && (
                    <p style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', marginTop: '1rem' }}>No skills in this category yet. Click "Add" to add one.</p>
                  )}
                </div>
              </SectionReveal>
            )
          })}
          {isAuthenticated && skillGroups.length === 0 && (
            <SectionReveal>
              <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center', gridColumn: '1 / -1' }}>
                <Plus size={40} style={{ margin: '0 auto 1rem', opacity: 0.4, color: '#3b82f6' }} />
                <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.4rem', color: '#94a3b8' }}>No skill categories yet</p>
                <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '1.5rem' }}>Click "Add Category" to create your first skill category.</p>
                <motion.button className="btn-primary" onClick={() => setShowAddForm('new-category')} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Plus size={16} /> Add Category
                </motion.button>
              </div>
            </SectionReveal>
          )}
        </div>

        {/* Legend */}
        <SectionReveal delay={0.4}>
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { dots: 1, label: 'Learning' },
              { dots: 2, label: 'Intermediate' },
              { dots: 3, label: 'Advanced' },
            ].map(({ dots, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
                <div style={{ display: 'flex', gap: '3px' }}>
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: '6px', height: '6px',
                        borderRadius: '50%',
                        background: i <= dots ? '#3b82f6' : '#1e2d45',
                      }}
                    />
                  ))}
                </div>
                {label}
              </div>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}