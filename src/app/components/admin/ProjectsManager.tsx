'use client'

import { useEffect, useState } from 'react'
import { getProjects, createProject, updateProject, deleteProject, Project } from '../../lib/api'
import { useView } from './AdminLayout'

interface Props { token: string }

type Mode = 'list' | 'new' | 'edit'

const EMPTY: Partial<Project> = {
  title: '', slug: '', category: 'Branding', year: new Date().getFullYear().toString(),
  description: '', client: '', projectUrl: '', featured: false, order: 0, status: 'published',
}

export default function ProjectsManager({ token }: Props) {
  const { setView } = useView()
  const [projects, setProjects] = useState<Project[]>([])
  const [mode, setMode] = useState<Mode>('list')
  const [form, setForm] = useState<Partial<Project>>(EMPTY)
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => { getProjects().then(setProjects) }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2800)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setForm((prev: Partial<Project>) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    if (form.id) {
      const updated = await updateProject(token, form.id, form)
      if (updated) {
        setProjects(prev => prev.map(p => p.id === updated.id ? updated : p))
        showToast('Project updated!')
        setMode('list')
      } else {
        showToast('Failed to save. Please try again.')
      }
    } else {
      const created = await createProject(token, form)
      if (created) {
        setProjects(prev => [...prev, created])
        showToast('Project created!')
        setMode('list')
      } else {
        showToast('Failed to create. Please try again.')
      }
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project? This cannot be undone.')) return
    const ok = await deleteProject(token, id)
    if (ok) {
      setProjects(prev => prev.filter(p => p.id !== id))
      showToast('Project deleted.')
      setMode('list')
    }
  }

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  // ── LIST VIEW
  if (mode === 'list') return (
    <div>
      {toast && <div className="toast">{toast}</div>}
      <div className="page-header">
        <div>
          <div className="page-title">Projects</div>
          <div className="page-subtitle">{projects.length} projects in your portfolio.</div>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(EMPTY); setMode('new') }}>
          + Add Project
        </button>
      </div>
      <div className="table-wrap">
        <div className="table-header">
          <div className="table-title">All Projects</div>
          <div className="search-box">
            <input type="text" placeholder="Search projects…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <table>
          <thead>
            <tr><th>#</th><th>Title</th><th>Category</th><th>Year</th><th>Featured</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id}>
                <td className="td-gray">{String(i + 1).padStart(2, '0')}</td>
                <td>
                  <strong>{p.title}</strong>
                  <div className="td-gray" style={{ fontSize: '0.68rem' }}>{p.slug}</div>
                </td>
                <td><span className="badge badge-blue">{p.category}</span></td>
                <td className="td-gray">{p.year}</td>
                <td>{p.featured ? <span className="badge badge-green">Yes</span> : <span className="badge badge-gray">No</span>}</td>
                <td><span className={`badge ${p.status === 'published' ? 'badge-green' : 'badge-amber'}`}>{p.status}</span></td>
                <td>
                  <div className="td-actions">
                    <button className="btn btn-sm" onClick={() => { setForm(p); setMode('edit') }}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Del</button>
                  </div>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--gray)' }}>No projects found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )

  // ── NEW / EDIT FORM
  return (
    <div>
      {toast && <div className="toast">{toast}</div>}
      <div className="page-header">
        <div>
          <div className="page-title">{mode === 'new' ? 'New Project' : 'Edit Project'}</div>
          <div className="page-subtitle">{mode === 'edit' ? `Editing: ${form.title}` : 'Add a new portfolio project.'}</div>
        </div>
        <div className="page-actions">
          {mode === 'edit' && <button className="btn btn-danger" onClick={() => form.id && handleDelete(form.id)}>Delete</button>}
          <button className="btn" onClick={() => setMode('list')}>← Back</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Project'}
          </button>
        </div>
      </div>

      <div className="two-col-layout">
        <div>
          <div className="form-card">
            <div className="form-card-title">Project Details</div>
            <div className="form-grid">
              <div className="form-group full">
                <label className="form-label">Project Title *</label>
                <input name="title" type="text" className="form-input" placeholder="e.g. Maison Dorée" value={form.title ?? ''} onChange={handleChange}/>
              </div>
              <div className="form-group full">
                <label className="form-label">Slug *</label>
                <input name="slug" type="text" className="form-input" placeholder="e.g. maison-doree" value={form.slug ?? ''} onChange={handleChange}/>
                <div className="form-hint">Lowercase, hyphens only. Used in URL.</div>
              </div>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select name="category" className="form-select" value={form.category ?? 'Branding'} onChange={handleChange}>
                  {['Branding','UI/UX','Editorial','Motion Design','Web Design'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Year *</label>
                <input name="year" type="text" className="form-input" placeholder="2024" value={form.year ?? ''} onChange={handleChange}/>
              </div>
              <div className="form-group full">
                <label className="form-label">Short Description *</label>
                <textarea name="description" className="form-textarea" placeholder="Shown on the project card. Max 120 characters." value={form.description ?? ''} onChange={handleChange}/>
              </div>
              <div className="form-group">
                <label className="form-label">Client Name</label>
                <input name="client" type="text" className="form-input" placeholder="Client or brand name" value={form.client ?? ''} onChange={handleChange}/>
              </div>
              <div className="form-group">
                <label className="form-label">Live URL</label>
                <input name="projectUrl" type="text" className="form-input" placeholder="https://…" value={form.projectUrl ?? ''} onChange={handleChange}/>
              </div>
              <div className="form-group">
                <label className="form-label">Display Order</label>
                <input name="order" type="number" className="form-input" value={form.order ?? 0} onChange={handleChange}/>
                <div className="form-hint">0 = shown first</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="side-card">
            <div className="side-card-title">Status</div>
            <select name="status" className="form-select" style={{ marginBottom: 16 }} value={form.status ?? 'published'} onChange={handleChange}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" name="featured" checked={form.featured ?? false} onChange={handleChange}/>
              <span style={{ fontSize: '0.78rem', color: 'var(--gray)' }}>Featured project</span>
            </label>
          </div>
          <div className="side-card">
            <div className="side-card-title">Cover Image</div>
            <p style={{ fontSize: '0.72rem', color: 'var(--gray)', lineHeight: 1.8, marginBottom: 12 }}>
              Upload images via the Payload CMS admin at<br/>
              <a href="http://localhost:3000/admin" target="_blank" rel="noreferrer" style={{ color: 'var(--red)' }}>localhost:3000/admin</a>
              <br/>then enter the media ID in the API.
            </p>
          </div>
          <div className="side-card">
            <div className="side-card-title">Tips</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--gray)', lineHeight: 1.9 }}>
              • Keep description under 120 chars<br/>
              • Use a square or 4:3 cover image<br/>
              • Featured = shown in large card<br/>
              • Order 0 = shown first
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
