'use client'

import { Project, mediaUrl } from '../lib/api'

interface Props { projects: Project[] }

export default function ProjectsSection({ projects }: Props) {
  if (!projects.length) return null

  return (
    <section id="projects" style={{ borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '80px 60px 60px', borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2.4rem,4.8vw,5.4rem)', fontWeight: 800, letterSpacing: '-0.04em', textTransform: 'uppercase', lineHeight: 0.9 }}>
          Projects That<br/>Define the Craft
        </h2>
        <a href="#contact" style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gray)', textDecoration: 'none' }}>
          All projects →
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2 }}>
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const imgUrl = project.coverImage ? mediaUrl(project.coverImage.url) : '/assets/mockup.jpg'
  const num = String(index + 1).padStart(2, '0')

  return (
    <div
      style={{
        position: 'relative', borderRight: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)', overflow: 'hidden',
        cursor: 'pointer', background: 'var(--black)', display: 'flex', flexDirection: 'column',
      }}
      className="project-card-hover"
    >
      {/* Image layer */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
        <img
          src={imgUrl}
          alt={project.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.88) 0%,rgba(0,0,0,0.55) 50%,rgba(0,0,0,0.35) 100%)' }}/>
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, padding: '48px 44px 44px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '4.5rem', fontWeight: 800, letterSpacing: '-0.05em', color: 'rgba(255,255,255,0.06)', lineHeight: 1, marginBottom: 24 }}>{num}</div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          {[project.category, project.year].map((tag, i) => (
            <span key={i} style={{ fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gray2)', border: '1px solid var(--border)', padding: '4px 12px' }}>{tag}</span>
          ))}
        </div>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.3rem,2vw,1.75rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 16 }}>{project.title}</h3>
        <p style={{ fontSize: '0.78rem', lineHeight: 1.85, color: 'var(--gray)', marginBottom: 36 }}>{project.description}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 24, borderTop: '1px solid var(--border)' }}>
          <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.65rem', letterSpacing: '0.18em', color: 'var(--gray2)' }}>{project.year}</span>
          <span style={{ width: 38, height: 38, border: '1px solid var(--border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', color: 'var(--gray2)' }}>↗</span>
        </div>
      </div>
    </div>
  )
}
