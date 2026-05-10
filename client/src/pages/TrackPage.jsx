import { useState } from 'react'
import Navbar from '../components/Navbar'
import { getComplaintById } from '../services/api'

const priorityColor = (p) => p === 'Urgent' ? '#e94560' : '#10b981'
const statusColor   = (s) => s === 'Resolved' ? '#10b981' : s === 'In Progress' ? '#f59e0b' : '#9ca3af'

const TrackPage = () => {
  const [id, setId]         = useState('')
  const [result, setResult] = useState(null)
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleTrack = async () => {
    const trimmed = id.trim()
    if (!trimmed) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await getComplaintById(trimmed)
      setResult(res.data.data)
    } catch (err) {
      setError(
        err.response?.status === 404
          ? 'No complaint found with that ID. Please check and try again.'
          : 'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const rows = result ? [
    { label: 'Complaint ID',  value: result._id },
    { label: 'Category',      value: result.category },
    { label: 'Sentiment',     value: result.sentiment },
    { label: 'Priority',      value: result.priority,  color: priorityColor(result.priority) },
    { label: 'Status',        value: result.status,    color: statusColor(result.status) },
    { label: 'Submitted',     value: new Date(result.submittedAt).toLocaleString() },
    ...(result.resolvedAt ? [{ label: 'Resolved', value: new Date(result.resolvedAt).toLocaleString(), color: '#10b981' }] : [])
  ] : []

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6f9' }}>
      <Navbar />
      <div style={s.container}>
        <h2 style={s.title}>Track Your Complaint</h2>
        <p style={s.sub}>Enter the Complaint ID you received after submission to check its current status.</p>

        <div style={s.card}>
          <label style={s.label}>Complaint ID</label>
          <div style={s.inputRow}>
            <input
              style={s.input}
              placeholder="e.g. 6849f3c2a1b2c3d4e5f60001"
              value={id}
              onChange={e => setId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleTrack()}
            />
            <button style={s.btn} onClick={handleTrack} disabled={loading || !id.trim()}>
              {loading ? 'Searching...' : 'Track'}
            </button>
          </div>
          {error && <p style={s.error}>{error}</p>}
        </div>

        {result && (
          <div style={s.resultCard}>
            <div style={s.resultHeader}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span style={s.resultHeaderText}>Complaint Found</span>
            </div>

            <div style={s.complaintPreview}>{result.complaint_text}</div>

            {rows.map((row, i) => (
              <div key={i} style={s.row}>
                <span style={s.rowLabel}>{row.label}</span>
                <span style={{ ...s.rowValue, color: row.color || '#1a1a2e' }}>{row.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const s = {
  container:        { maxWidth: '600px', margin: '60px auto', padding: '0 24px' },
  title:            { fontSize: '28px', fontWeight: '800', color: '#1a1a2e', marginBottom: '8px' },
  sub:              { color: '#6b7280', fontSize: '14px', marginBottom: '32px' },
  card:             { background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '24px' },
  label:            { display: 'block', fontSize: '13px', fontWeight: '600', color: '#1a1a2e', marginBottom: '10px' },
  inputRow:         { display: 'flex', gap: '10px' },
  input:            { flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', fontFamily: 'inherit' },
  btn:              { background: '#1a1a2e', color: '#fff', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', whiteSpace: 'nowrap' },
  error:            { color: '#e94560', fontSize: '13px', marginTop: '12px' },
  resultCard:       { background: '#fff', borderRadius: '12px', padding: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  resultHeader:     { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' },
  resultHeaderText: { fontSize: '15px', fontWeight: '700', color: '#1a1a2e' },
  complaintPreview: { fontSize: '13px', color: '#6b7280', background: '#f4f6f9', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', lineHeight: '1.6' },
  row:              { display: 'flex', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid #f4f6f9' },
  rowLabel:         { fontSize: '13px', color: '#9ca3af', fontWeight: '500' },
  rowValue:         { fontSize: '13px', fontWeight: '700', maxWidth: '60%', textAlign: 'right', wordBreak: 'break-all' },
}

export default TrackPage
