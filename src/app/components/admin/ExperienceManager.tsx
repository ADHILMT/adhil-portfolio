'use client'

import { useEffect, useState } from 'react'
import { getExperience, Experience } from '../../lib/api'

interface Props { token: string }

const EMPTY: Partial<Experience> = {
  company: '', role: '', startYear: '', endYear: 'Present',
  type: 'Full-time', order: 0
}

export default function ExperienceManager({ token }: Props) {
  const [list, setList] = useState<Experience[]>([])
  const [mode, setMode] = useState<'list' | 'form'>('list')
  const [form, setForm] = useState<Partial<Experience>>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  const CMS = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000'

  useEffect(() => { getExperience().then(setList) }, [])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2800) }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev: Partial<Experience>) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = async () => {
    if (!form.company || !form.role) { showToast('Company and role are required.'); return }
    setSaving(true)
    try {
      const isEdit = Boolean(form.id)
      const url = isEdit ? `${CMS}/api/experience/${form.id}` : `${CMS}/api/experience`
      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const data = await res.json()
        const saved = data.doc ?? data
        if (isEdit) setList(prev => prev.map(e => e.id === saved.id ? saved : e))
        else setList(prev => [...prev, saved])
        showToast(isEdit ? 'Experience updated!' : 'Experience added!')
        setMode('list')
      } else {
        showToast('Save failed. Check your backend.')
      }
    } catch { showToast('Network error.') }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this entry?')) return
    const res = await fetch(`${CMS}/api/experience/${id}`, {
      method: 'DELETE', headers: { Authorization: `JWT ${token}` }
    })
    if (res.ok) { setList(prev => prev.filter(e => e.id !== id)); showToast('Deleted.') }
  }

  if (mode === 'form') return (
    <div>
      {toast && <div className="toast">{toast}</div>}
      <div className="page-header">
        <div>
          <div className="page-title">{form.id ? 'Edit' : 'Add'} Experience</div>
          <div className="page-subtitle">{form.id ? `Editing: ${form.company}` : 'Add a work history entry.'}</div>
        </div>
        <div className="page-actions">
          {form.id && <button className="btn btn-danger" onClick={() => { handleDelete(form.id!); setMode('list') }}>Delete</button>}
          <button className="btn" onClick={() => setMode('list')}>← Back</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
      <div className="form-card">
        <div className="form-card-title">Work Experience Details</div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Company Name *</label>
            <input name="company" type="text" className="form-input" placeholder="e.g. Pixel & Co. Studio" value={form.company ?? ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Your Role *</label>
            <input name="role" type="text" className="form-input" placeholder="e.g. Senior UI Designer" value={form.role ?? ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Start Year</label>
            <input name="startYear" type="text" className="form-input" placeholder="2022" value={form.startYear ?? ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">End Year</label>
            <input name="endYear" type="text" className="form-input" placeholder="2023 or Present" value={form.endYear ?? ''} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Employment Type</label>
            <select name="type" className="form-select" value={form.type ?? 'Full-time'} onChange={handleChange}>
              {['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Display Order</label>
            <input name="order" type="number" className="form-input" value={form.order ?? 0} onChange={handleChange} />
            <div className="form-hint">0 = shown first (most recent)</div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      {toast && <div className="toast">{toast}</div>}
      <div className="page-header">
        <div>
          <div className="page-title">Experience</div>
          <div className="page-subtitle">{list.length} work history entries.</div>
        </div>
        <button className="btn btn-primary" onClick={() => { setForm(EMPTY); setMode('form') }}>+ Add Entry</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Company</th><th>Role</th><th>Period</th><th>Type</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {list.map(exp => (
              <tr key={exp.id}>
                <td><strong>{exp.company}</strong></td>
                <td className="td-gray">{exp.role}</td>
                <td className="td-gray">{exp.startYear} — {exp.endYear}</td>
                <td><span className="badge badge-blue">{exp.type}</span></td>
                <td>
                  <div className="td-actions">
                    <button className="btn btn-sm" onClick={() => { setForm(exp); setMode('form') }}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(exp.id)}>Del</button>
                  </div>
                </td>
              </tr>
            ))}
            {!list.length && (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--gray)' }}>No experience entries yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
