'use client'

import { useEffect, useState } from 'react'
import { getMessages, ContactMessage } from '../../lib/api'

interface Props { token: string }

export default function MessagesView({ token }: Props) {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMessages(token).then((msgs: ContactMessage[]) => {
      setMessages(msgs)
      setLoading(false)
    })
  }, [token])

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    const diff = Date.now() - d.getTime()
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return `${Math.floor(diff / 86400000)}d ago`
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Messages</div>
          <div className="page-subtitle">{messages.filter(m => !m.read).length} unread messages from your contact form.</div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--gray)' }}>Loading messages…</div>
      ) : messages.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80, color: 'var(--gray)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>✉️</div>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1rem', fontWeight: 700, marginBottom: 8 }}>No messages yet</h3>
          <p style={{ fontSize: '0.8rem' }}>Messages from your contact form will appear here.</p>
        </div>
      ) : (
        <div className="msg-list">
          {messages.map((msg, i) => (
            <div key={msg.id ?? i} className="msg-item">
              <div className={`msg-dot${msg.read ? ' read' : ''}`}/>
              <div>
                <div className="msg-name">{msg.name}</div>
                <div className="msg-preview">{msg.message}</div>
                <div className="msg-meta">
                  {msg.projectType && `${msg.projectType} · `}{msg.email}
                </div>
              </div>
              <div>
                <div className="msg-time">{msg.createdAt ? formatDate(msg.createdAt) : '—'}</div>
                <span className={`badge ${msg.read ? 'badge-gray' : 'badge-red'}`} style={{ marginTop: 6, display: 'block', textAlign: 'center' }}>
                  {msg.read ? 'Read' : 'New'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
