import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div className="page">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="hero-section" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '80px 80px', gap: '60px', minHeight: '520px',
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1030 40%, #0f0f1a 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* decorative glow */}
        <div style={{
          position: 'absolute', top: '-120px', right: '-80px',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(233,69,96,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="slide-up hero-content" style={{ flex: 1, maxWidth: '560px', position: 'relative', zIndex: 1 }}>
          <span className="badge badge-accent" style={{
            marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px',
          }}>
            AI-Powered Complaint Management
          </span>
          <h1 className="hero-title" style={{
            fontSize: '52px', fontWeight: '900', color: 'var(--text-primary)',
            lineHeight: 1.12, marginBottom: '20px', letterSpacing: '-1.5px',
          }}>
            Your complaints, <br />
            <span style={{ color: 'var(--accent)' }}>heard and prioritized.</span>
          </h1>
          <p style={{
            fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '36px',
          }}>
            ComplaintIQ uses machine learning to automatically classify,
            analyze, and prioritize your complaints — ensuring the most
            urgent issues are resolved first.
          </p>
          <div className="btn-group" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => navigate('/submit')}
              style={{ padding: '14px 32px', fontSize: '15px' }}>
              Complain
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/login')}
              style={{ padding: '14px 32px', fontSize: '15px' }}>
              Admin
            </button>
          </div>
        </div>

        {/* preview card */}
        <div className="slide-up" style={{ flex: '0 0 320px', animationDelay: '0.15s', position: 'relative', zIndex: 1, width: '100%', maxWidth: '320px' }}>
          <div className="glass" style={{ padding: '28px', boxShadow: 'var(--shadow-lg), 0 0 60px rgba(233,69,96,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <span style={{
                width: '10px', height: '10px', borderRadius: '50%', background: 'var(--green)', display: 'inline-block',
                boxShadow: '0 0 8px rgba(16,185,129,0.4)',
              }} />
              <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>Complaint Classified</span>
            </div>
            {[
              { label: 'Category',  value: 'Credit Card',  color: null },
              { label: 'Sentiment', value: 'Negative',     color: null },
              { label: 'Priority',  value: 'Urgent',       color: 'var(--accent)' },
              { label: 'Status',    value: 'In Progress',  color: 'var(--amber)' },
            ].map((row, i) => (
              <div key={i} className="data-row">
                <span className="data-label">{row.label}</span>
                <span className="data-value" style={row.color ? { color: row.color } : {}}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section className="stagger features-grid" style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px', padding: '60px 80px',
      }}>
        {[
          {
            icon: (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a7 7 0 0 1 7 7c0 4-3 6-4 8H9c-1-2-4-4-4-8a7 7 0 0 1 7-7z" />
                <line x1="9" y1="21" x2="15" y2="21" />
                <line x1="10" y1="17" x2="14" y2="17" />
              </svg>
            ),
            title: 'ML Classification',
            desc: 'Complaints are automatically routed to the right category using a trained SVM model.'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            ),
            title: 'Sentiment Analysis',
            desc: 'Each complaint is scored for emotional urgency to ensure critical issues surface first.'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            ),
            title: 'Priority Assignment',
            desc: 'Urgent complaints are flagged immediately, reducing resolution time significantly.'
          },
          {
            icon: (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="2" width="6" height="4" rx="1" />
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <line x1="9" y1="12" x2="15" y2="12" />
                <line x1="9" y1="16" x2="13" y2="16" />
              </svg>
            ),
            title: 'Resolution Tracking',
            desc: 'Admins track every complaint from submission through to full resolution.'
          }
        ].map((f, i) => (
          <div key={i} className="card slide-up" style={{ padding: '28px 24px' }}>
            <span style={{
              width: '40px', height: '40px', marginBottom: '16px', display: 'block',
              color: 'var(--accent)',
            }}>{f.icon}</span>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>{f.title}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer style={{
        textAlign: 'center', padding: '24px',
        color: 'var(--text-muted)', fontSize: '13px',
        borderTop: '1px solid var(--border)',
      }}>
        ComplaintIQ &copy; 2026 — Final Year Project, Divine Oche Ajogi
      </footer>
    </div>
  )
}

export default LandingPage