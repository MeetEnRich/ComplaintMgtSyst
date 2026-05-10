import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div style={styles.wrapper}>
      <Navbar />

      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <span style={styles.badge}>AI-Powered Complaint Management</span>
          <h1 style={styles.title}>
            Your complaints, <br />
            <span style={styles.accent}>heard and prioritized.</span>
          </h1>
          <p style={styles.subtitle}>
            ComplaintIQ uses machine learning to automatically classify,
            analyze, and prioritize your complaints — ensuring the most
            urgent issues are resolved first.
          </p>
          <div style={styles.btnGroup}>
            <button
              style={styles.primaryBtn}
              onClick={() => navigate('/submit')}>
              Complain
            </button>
            <button
              style={styles.secondaryBtn}
              onClick={() => navigate('/login')}>
              Admin
            </button>
          </div>
        </div>
        <div style={styles.heroVisual}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.dot('green')} />
              <span style={styles.cardTitle}>Complaint Classified</span>
            </div>
            <div style={styles.cardRow}>
              <span style={styles.cardLabel}>Category</span>
              <span style={styles.cardValue}>Credit Card</span>
            </div>
            <div style={styles.cardRow}>
              <span style={styles.cardLabel}>Sentiment</span>
              <span style={styles.cardValue}>Negative</span>
            </div>
            <div style={styles.cardRow}>
              <span style={styles.cardLabel}>Priority</span>
              <span style={{
                ...styles.cardValue,
                color: '#e94560',
                fontWeight: '700'
              }}>Urgent</span>
            </div>
            <div style={styles.cardRow}>
              <span style={styles.cardLabel}>Status</span>
              <span style={{
                ...styles.cardValue,
                color: '#f59e0b'
              }}>In Progress</span>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.features}>
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
          <div key={i} style={styles.featureCard}>
            <span style={styles.featureIcon}>{f.icon}</span>
            <h3 style={styles.featureTitle}>{f.title}</h3>
            <p style={styles.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </div>

      <footer style={styles.footer}>
        <p>ComplaintIQ &copy; 2026 — Final Year Project, Divine Oche Ajogi</p>
      </footer>
    </div>
  )
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: '#f4f6f9',
  },
  hero: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '80px 80px',
    gap: '60px',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    minHeight: '520px',
  },
  heroContent: {
    flex: 1,
    maxWidth: '560px',
  },
  badge: {
    display: 'inline-block',
    background: 'rgba(233,69,96,0.15)',
    color: '#e94560',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    marginBottom: '24px',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: '52px',
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: '1.15',
    marginBottom: '20px',
    letterSpacing: '-1px',
  },
  accent: {
    color: '#e94560',
  },
  subtitle: {
    fontSize: '16px',
    color: '#9ca3af',
    lineHeight: '1.7',
    marginBottom: '36px',
  },
  btnGroup: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  primaryBtn: {
    background: '#e94560',
    color: '#ffffff',
    padding: '14px 28px',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '700',
    transition: 'opacity 0.2s',
  },
  secondaryBtn: {
    background: 'transparent',
    color: '#ffffff',
    padding: '14px 28px',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  heroVisual: {
    flex: '0 0 320px',
  },
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '28px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  dot: (color) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: color === 'green' ? '#10b981' : '#e94560',
    display: 'inline-block',
  }),
  cardTitle: {
    fontWeight: '700',
    fontSize: '15px',
    color: '#1a1a2e',
  },
  cardRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #f4f6f9',
  },
  cardLabel: {
    fontSize: '13px',
    color: '#9ca3af',
    fontWeight: '500',
  },
  cardValue: {
    fontSize: '13px',
    color: '#1a1a2e',
    fontWeight: '600',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
    padding: '60px 80px',
  },
  featureCard: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '28px 24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  featureIcon: {
    width: '36px',
    height: '36px',
    marginBottom: '16px',
    display: 'block',
    color: '#e94560',
  },
  featureTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: '10px',
  },
  featureDesc: {
    fontSize: '13px',
    color: '#6b7280',
    lineHeight: '1.65',
  },
  footer: {
    textAlign: 'center',
    padding: '24px',
    color: '#9ca3af',
    fontSize: '13px',
    borderTop: '1px solid #e5e7eb',
  }
}

export default LandingPage