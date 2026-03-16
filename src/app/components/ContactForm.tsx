'use client'

import { useState } from 'react'
import { submitContactForm } from '../lib/api'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', projectType: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      alert('Please fill in name, email, and message.')
      return
    }
    setStatus('sending')
    const ok = await submitContactForm(form)
    setStatus(ok ? 'sent' : 'error')
    if (ok) setForm({ name: '', email: '', projectType: '', message: '' })
    setTimeout(() => setStatus('idle'), 3000)
  }

  return (
    <section id="contact" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '80vh', borderBottom: '1px solid var(--border)' }}>
      {/* Left */}
      <div style={{ padding: '80px 60px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gray2)', marginBottom: 40 }}>05 — Contact</p>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2.4rem,4.8vw,5.4rem)', fontWeight: 800, letterSpacing: '-0.04em', textTransform: 'uppercase', lineHeight: 0.9 }}>
            Let&apos;s Build<br/><em style={{ fontStyle: 'italic', fontWeight: 400, color: 'var(--gray)' }}>Something</em><br/>Great
          </h2>
        </div>
        <div>
          {[
            { label: 'Email', value: 'hello@adhil.design' },
            { label: 'Location', value: 'Kerala, India' },
            { label: 'Status', value: 'Open to freelance & collaborations' },
            { label: 'Response', value: 'Within 24 hours' },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gray2)' }}>{row.label}</span>
              <span style={{ fontSize: '0.82rem' }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Form */}
      <div style={{ padding: '80px 60px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        {[
          { label: 'Your Name', name: 'name', placeholder: 'Full name', type: 'text' },
          { label: 'Email Address', name: 'email', placeholder: 'your@email.com', type: 'email' },
          { label: 'Project Type', name: 'projectType', placeholder: 'Brand identity, UI/UX, Editorial...', type: 'text' },
        ].map(field => (
          <div key={field.name} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <label style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gray2)' }}>{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={form[field.name as keyof typeof form]}
              onChange={handleChange}
              style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', padding: '14px 0', color: 'var(--white)', fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', fontWeight: 300, outline: 'none' }}
            />
          </div>
        ))}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gray2)' }}>Tell Me About Your Project</label>
          <textarea
            name="message"
            rows={4}
            placeholder="A brief description..."
            value={form.message}
            onChange={handleChange}
            style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', padding: '14px 0', color: 'var(--white)', fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', fontWeight: 300, outline: 'none', resize: 'none' }}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={status === 'sending'}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 14,
            background: status === 'sent' ? '#22c55e' : status === 'error' ? 'var(--red)' : 'var(--white)',
            color: 'var(--black)', fontFamily: 'Syne, sans-serif', fontSize: '0.7rem',
            fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
            padding: '16px 32px', border: 'none', cursor: 'pointer', width: 'fit-content', marginTop: 12,
          }}
        >
          {status === 'sending' ? 'Sending...' : status === 'sent' ? '✓ Message Sent!' : status === 'error' ? '✗ Failed — Try Again' : 'Send Message →'}
        </button>
      </div>
    </section>
  )
}
