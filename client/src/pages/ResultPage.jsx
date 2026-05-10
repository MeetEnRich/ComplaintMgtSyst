import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

const ResultPage = () => {
  const { state } = useLocation()
  const navigate  = useNavigate()
  const data      = state?.data

  if (!data) {
    navigate('/')
    return null
  }

  const priorityColor = data.priority === 'Urgent' ? '#e94560' : '#10b981'

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6f9' }}>
      <Navbar />
      <div style={s.container}>
        <div style={s.iconWrap}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '48px', height: '48px' }}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h2 style={s.title}>Complaint Submitted</h2>
        <p style={s.sub}>Your complaint has been received and analyzed by our AI system.</p>
        <div style={s.card}>
          {[
            { label: 'Complaint ID', value: data._id },
            { label: 'Category', value: data.category },
            { label: 'Sentiment', value: data.sentiment },
            { label: 'Priority', value: data.priority, color: priorityColor },
            { label: 'Status', value: data.status, color: '#f59e0b' },
            { label: 'Submitted', value: new Date(data.submittedAt).toLocaleString() }
          ].map((row, i) => (
            <div key={i} style={s.row}>
              <span style={s.label}>{row.label}</span>
              <span style={{ ...s.value, color: row.color || '#1a1a2e' }}>{row.value}</span>
            </div>
          ))}
        </div>
        <div style={s.btnGroup}>
          <button style={s.primaryBtn} onClick={() => navigate('/submit')}>Submit Another</button>
          <button style={s.secondaryBtn} onClick={() => navigate('/track')}>Track Complaint</button>
          <button style={s.secondaryBtn} onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    </div>
  )
}

const s = {
  container: { maxWidth: '560px', margin: '60px auto', padding: '0 24px', textAlign: 'center' },
  iconWrap: { display: 'flex', justifyContent: 'center', marginBottom: '16px' },
  title: { fontSize: '28px', fontWeight: '800', color: '#1a1a2e', marginBottom: '8px' },
  sub: { color: '#6b7280', fontSize: '14px', marginBottom: '32px' },
  card: { background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', textAlign: 'left', marginBottom: '24px' },
  row: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f4f6f9' },
  label: { fontSize: '13px', color: '#9ca3af', fontWeight: '500' },
  value: { fontSize: '13px', fontWeight: '700', maxWidth: '60%', textAlign: 'right', wordBreak: 'break-all' },
  btnGroup: { display: 'flex', gap: '12px', justifyContent: 'center' },
  primaryBtn: { background: '#1a1a2e', color: '#fff', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: '700' },
  secondaryBtn: { background: '#fff', color: '#1a1a2e', padding: '12px 24px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', border: '1px solid #e5e7eb' }
}

export default ResultPage