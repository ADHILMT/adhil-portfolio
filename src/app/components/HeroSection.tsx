'use client'

import { SiteSettings, mediaUrl } from '../lib/api'

interface Props {
  settings: SiteSettings | null
}

export default function HeroSection({ settings }: Props) {
  const name = settings?.name ?? 'Adhil'
  const title = settings?.title ?? 'UI UX Designer'
  const bio = settings?.bio ?? "I'm Adhil — a creative designer from Kerala, India."
  const tagline = settings?.tagline ?? 'Available for freelance & collaborations'
  const stats = settings?.stats
  const photoUrl = settings?.photo ? mediaUrl(settings.photo.url) : '/assets/photo.jpg'

  return (
    <section id="hero" style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'flex-end', padding: '0 60px 80px',
      position: 'relative', overflow: 'hidden',
      borderBottom: '1px solid var(--border)', background: 'var(--black)'
    }}>
      {/* Background text */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: 'Syne, sans-serif', fontSize: 'clamp(110px,17vw,220px)',
        fontWeight: 800, textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.028)', whiteSpace: 'nowrap',
        pointerEvents: 'none', userSelect: 'none', zIndex: 1,
      }}>DESIGN</div>

      {/* Hero photo */}
      <div style={{
        position: 'absolute', right: 0, bottom: 0, top: 72,
        width: '45%', overflow: 'hidden', pointerEvents: 'none', zIndex: 2,
      }}>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to right,#0a0a0a 0%,rgba(10,10,10,0.5) 30%,transparent 55%), linear-gradient(to top,#0a0a0a 0%,transparent 15%)'
        }}/>
        <img src={photoUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}/>
      </div>

      {/* Badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, border: '1px solid var(--border)', padding: '8px 18px', marginBottom: 44, width: 'fit-content', position: 'relative', zIndex: 5 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4caf50' }}/>
        <span style={{ fontSize: '0.67rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gray)' }}>{tagline}</span>
      </div>

      {/* Title */}
      <h1 style={{
        fontFamily: 'Syne, sans-serif', fontSize: 'clamp(50px,8.2vw,115px)',
        fontWeight: 800, lineHeight: 0.92, letterSpacing: '-0.03em',
        textTransform: 'uppercase', marginBottom: 60,
        position: 'relative', zIndex: 5,
      }}>
        {name}<br/>
        <span style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)', color: 'transparent' }}>Creative.</span><br/>
        {title}
      </h1>

      {/* Bottom row */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
        <p style={{ maxWidth: 360, fontSize: '0.87rem', lineHeight: 1.85, color: 'var(--gray)' }}>{bio}</p>
        <div style={{ display: 'flex', gap: 16 }}>
          {[
            { num: stats?.yearsExperience ?? '2+', label: 'Years Experience', color: '#ff6b35' },
            { num: stats?.projectsDone ?? '20+', label: 'Projects Done', color: '#00d4ff' },
            { num: stats?.happyClients ?? '15+', label: 'Happy Clients', color: '#a855f7' },
          ].map((s, i) => (
            <div key={i} style={{
              padding: '26px 22px', minWidth: 120, borderRadius: 14,
              background: '#111', textAlign: 'center',
              boxShadow: `0 0 0 1px ${s.color}33`,
            }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#fff' }}>{s.num}</div>
              <div style={{ fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gray)', marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
