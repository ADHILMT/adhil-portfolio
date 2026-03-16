'use client'

import { useEffect, useState } from 'react'
import { getProjects, getMessages, Project } from '../../lib/api'
import { useView } from './AdminLayout'

interface Props { token: string }

export default function Dashboard({ token }: Props) {
  const { setView } = useView()
  const [projects, setProjects] = useState<Project[]>([])
  const [msgCount, setMsgCount] = useState(0)

  useEffect(() => {
    getProjects().then(setProjects)
    getMessages(token).then((msgs: any[]) => setMsgCount(msgs.filter((m) => !m.read).length))
  }, [token])

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const heights = [40,65,55,80,100,72,48,88,62,76,50,84]

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">Welcome back, Adhil.</div>
        </div>
        <button className="btn" onClick={() => setView('settings')}>Site Settings</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{ '--accent': '#e63c2f' } as React.CSSProperties}>
          <div className="stat-label">Total Projects</div>
          <div className="stat-num">{String(projects.length).padStart(2,'0')}</div>
          <div className="stat-sub text-green">Active portfolio</div>
        </div>
        <div className="stat-card" style={{ '--accent': '#22c55e' } as React.CSSProperties}>
          <div className="stat-label">New Messages</div>
          <div className="stat-num">{String(msgCount).padStart(2,'0')}</div>
          <div className="stat-sub text-red">{msgCount} unread</div>
        </div>
        <div className="stat-card" style={{ '--accent': '#3b82f6' } as React.CSSProperties}>
          <div className="stat-label">Published</div>
          <div className="stat-num">{String(projects.filter(p => p.status === 'published').length).padStart(2,'0')}</div>
          <div className="stat-sub">Live projects</div>
        </div>
        <div className="stat-card" style={{ '--accent': '#f59e0b' } as React.CSSProperties}>
          <div className="stat-label">Drafts</div>
          <div className="stat-num">{String(projects.filter(p => p.status === 'draft').length).padStart(2,'0')}</div>
          <div className="stat-sub">In progress</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        <div className="chart-card">
          <div className="chart-title">Project Activity — 2024</div>
          <div className="chart-bars">
            {months.map((m, i) => (
              <div key={m} className="cbar-wrap">
                <div className={`cbar${i === 4 ? ' active' : ''}`} style={{ height: `${heights[i]}%` }}/>
                <div className="clabel">{m}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="chart-card" style={{ padding: 0 }}>
          <div style={{ padding: '22px 22px 16px', borderBottom: '1px solid var(--border)', fontFamily: 'Syne, sans-serif', fontSize: '0.85rem', fontWeight: 700 }}>Recent Activity</div>
          {[
            { text: 'Project published', detail: 'Lumina App', time: '2h ago', color: '#22c55e' },
            { text: 'New message from', detail: 'Rahul K.', time: '4h ago', color: 'var(--red)' },
            { text: 'Media uploaded', detail: '2 images', time: 'Yesterday', color: '#3b82f6' },
            { text: 'Settings updated', detail: 'Site info', time: '2 days ago', color: '#f59e0b' },
          ].map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 22px', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${a.color}22`, color: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.7rem' }}>✓</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.78rem', lineHeight: 1.6 }}>{a.text}: <strong style={{ color: 'var(--white)' }}>{a.detail}</strong></div>
                <div style={{ fontSize: '0.63rem', color: 'var(--gray2)', marginTop: 2 }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="table-wrap" style={{ marginTop: 20 }}>
        <div className="table-header">
          <div className="table-title">Recent Projects</div>
          <button className="btn btn-sm" onClick={() => setView('projects')}>View All →</button>
        </div>
        <table>
          <thead><tr><th>#</th><th>Title</th><th>Category</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {projects.slice(0,5).map((p,i) => (
              <tr key={p.id}>
                <td className="td-gray">{String(i+1).padStart(2,'0')}</td>
                <td><strong>{p.title}</strong></td>
                <td><span className="badge badge-blue">{p.category}</span></td>
                <td><span className={`badge ${p.status==='published'?'badge-green':'badge-amber'}`}>{p.status}</span></td>
                <td><button className="btn btn-sm" onClick={() => setView('projects')}>Edit</button></td>
              </tr>
            ))}
            {!projects.length && <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--gray)' }}>No projects yet — connect your Payload CMS.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
