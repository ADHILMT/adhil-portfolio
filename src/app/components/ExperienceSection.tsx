import { Experience } from '../lib/api'

interface Props { experience: Experience[] }

export default function ExperienceSection({ experience }: Props) {
  const list = experience.length ? experience : [
    { id: '1', company: 'Pixel & Co. Studio', role: 'Senior UI / UX Designer', startYear: '2023', endYear: 'Present', type: 'Full-time', order: 0 },
    { id: '2', company: 'Designhaus Agency', role: 'UI Designer & Brand Strategist', startYear: '2022', endYear: '2023', type: 'Full-time', order: 1 },
    { id: '3', company: 'Kreative Labs', role: 'Junior Visual Designer', startYear: '2021', endYear: '2022', type: 'Contract', order: 2 },
    { id: '4', company: 'Studio Noir', role: 'Design Intern', startYear: '2020', endYear: '2021', type: 'Internship', order: 3 },
  ]

  return (
    <section id="experience" style={{ borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'end', padding: '80px 60px 64px', borderBottom: '1px solid var(--border)', gap: 40 }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2.4rem,4.8vw,5.4rem)', fontWeight: 800, letterSpacing: '-0.04em', textTransform: 'uppercase', lineHeight: 0.92 }}>
          Work<br/>Experience
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--gray)', lineHeight: 2, maxWidth: 380 }}>
          A journey through the studios, agencies, and teams that have shaped my design thinking and craft.
        </p>
      </div>

      <div style={{ padding: '0 60px' }}>
        {list.map((exp) => (
          <div key={exp.id} style={{ display: 'grid', gridTemplateColumns: '150px 1fr auto', alignItems: 'center', gap: 60, padding: '48px 0', borderBottom: '1px solid var(--border)' }}>
            <div>
              <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.68rem', letterSpacing: '0.22em', color: 'var(--gray2)', textTransform: 'uppercase' }}>
                {exp.startYear} — {exp.endYear}
              </span>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 14 }}>
                <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, color: 'var(--red)', lineHeight: 1 }}>
                  {exp.endYear === 'Present'
                    ? new Date().getFullYear() - parseInt(exp.startYear)
                    : parseInt(exp.endYear) - parseInt(exp.startYear) || 1}
                </span>
                <span style={{ fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gray2)', lineHeight: 1.6 }}>
                  Year{parseInt(exp.endYear) - parseInt(exp.startYear) !== 1 ? 's' : ''}<br/>Worked
                </span>
              </div>
            </div>
            <div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.4rem,2.2vw,2rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>{exp.company}</h3>
              <span style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gray)', display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                <span style={{ display: 'block', width: 22, height: 1, background: 'var(--red)', flexShrink: 0 }}/>
                {exp.role}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 14 }}>
              <span style={{ fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase', border: '1px solid var(--border)', padding: '8px 16px', color: 'var(--gray2)' }}>{exp.type}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
