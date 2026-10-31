// src/sections/Projects.jsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Loader2 } from 'lucide-react'
import SectionReveal from '../components/SectionReveal'
import ProjectCard from '../components/ProjectCard'
import AddProjectModal from '../components/AddProjectModal'
import { fetchProjects, createProject, deleteProject as deleteProjectApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Projects() {
  const [allProjects, setAllProjects] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useAuth()

  // Fetch projects from backend on mount
  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetchProjects()
        if (res.success) {
          setAllProjects(res.data)
        }
      } catch (err) {
        console.error('Failed to load projects:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProjects()
  }, [])

  const handleAdd = async (projectData) => {
    // Save to backend (MongoDB)
    const res = await createProject(projectData)
    if (res.success) {
      setAllProjects((prev) => [res.data, ...prev])
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await deleteProjectApi(id)
      if (res.success) {
        setAllProjects((prev) => prev.filter((p) => p.id !== id))
      }
    } catch (err) {
      console.error('Failed to delete project:', err)
    }
  }

  const featured = allProjects.filter((p) => p.featured)
  const other = allProjects.filter((p) => !p.featured)

  return (
    <section id="projects" className="section-padding" style={{ background: '#0d1120' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header row */}
        <SectionReveal>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '3rem' }}>
            <div>
              <span className="section-label">Featured Work</span>
              <h2 className="section-title">
                My{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Projects
                </span>
              </h2>
              <p className="section-subtitle">
                A selection of projects I've built.
              </p>
            </div>

            {/* Add Project Button - Admin only */}
            {isAuthenticated && (
              <motion.button
                id="open-add-project-modal"
                className="btn-primary"
                onClick={() => setModalOpen(true)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{ flexShrink: 0, marginTop: '0.25rem' }}
              >
                <Plus size={16} />
                Add Project
              </motion.button>
            )}
          </div>
        </SectionReveal>

        {/* Loading state */}
        {loading && (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: '#64748b',
            }}
          >
            <Loader2 size={36} style={{ margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
            <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>Loading projects…</p>
            <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        {/* Empty state */}
        {!loading && allProjects.length === 0 && (
          <SectionReveal>
            <div
              style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                border: '2px dashed #1e2d45',
                borderRadius: '1rem',
                color: '#64748b',
              }}
            >
              <Plus size={40} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
              <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.4rem', color: '#94a3b8' }}>No projects yet</p>
              {isAuthenticated ? (
                <p style={{ fontSize: '0.88rem' }}>Click "Add Project" to add your first project.</p>
              ) : (
                <p style={{ fontSize: '0.88rem' }}>Projects will appear here once added by admin.</p>
              )}
            </div>
          </SectionReveal>
        )}

        {/* Featured grid */}
        {featured.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
              marginBottom: other.length > 0 ? '3rem' : 0,
            }}
          >
            <AnimatePresence mode="popLayout">
              {featured.map((project, i) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 24, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.93 }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                >
                  <ProjectCard
                    project={project}
                    onDelete={isAuthenticated ? handleDelete : undefined}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Other projects */}
        {other.length > 0 && (
          <>
            <SectionReveal>
              <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#64748b', marginBottom: '1.25rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Other Projects
              </h3>
            </SectionReveal>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.25rem',
              }}
            >
              <AnimatePresence mode="popLayout">
                {other.map((project, i) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 24, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.93 }}
                    transition={{ duration: 0.35, delay: i * 0.06 }}
                  >
                    <ProjectCard
                      project={project}
                      onDelete={isAuthenticated ? handleDelete : undefined}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>

      {/* Modal - Admin only */}
      {isAuthenticated && (
        <AddProjectModal
          key={modalOpen ? 'open' : 'closed'}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onAdd={handleAdd}
        />
      )}
    </section>
  )
}
