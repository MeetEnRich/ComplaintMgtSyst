import { useState, useRef, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { getComplaintById } from '../services/api'

const priorityColor = (p) => p === 'Urgent' ? 'var(--accent)' : 'var(--green)'
const statusColor   = (s) => s === 'Resolved' ? 'var(--green)' : s === 'In Progress' ? 'var(--amber)' : 'var(--text-muted)'

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false)
  const handleCopy = async (e) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button className={`copy-btn${copied ? ' copied' : ''}`} onClick={handleCopy}>
      {copied ? (
        <>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '12px', height: '12px' }}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '12px', height: '12px' }}>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Copy
        </>
      )}
    </button>
  )
}

const TrackPage = () => {
  const inputRef = useRef(null)
  const [id, setId]         = useState('')
  const [result, setResult] = useState(null)
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { inputRef.current?.focus() }, [])

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
    { label: 'Category',      value: result.category },
    { label: 'Sentiment',     value: result.sentiment },
    { label: 'Priority',      value: result.priority,  color: priorityColor(result.priority) },
    { label: 'Status',        value: result.status,    color: statusColor(result.status) },
    { label: 'Submitted',     value: new Date(result.submittedAt).toLocaleString() },
    ...(result.resolvedAt ? [{ label: 'Resolved', value: new Date(result.resolvedAt).toLocaleString(), color: 'var(--green)' }] : [])
  ] : []

  return (
    <div className="page">
      <Navbar />
      <div className="container-sm slide-up">
        <h2 className="section-title">Track Your Complaint</h2>
        <p className="section-sub">Enter the Complaint ID you received after submission to check its current status.</p>

        <div className="card" style={{ padding: '28px', marginBottom: '24px' }}>
          <label style={{
            display: 'block', fontSize: '13px', fontWeight: 600,
            color: 'var(--text-primary)', marginBottom: '10px',
          }}>Complaint ID</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              ref={inputRef}
              className="input"
              placeholder="e.g. 6849f3c2a1b2c3d4e5f60001"
              value={id}
              onChange={e => setId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleTrack()}
            />
            <button
              className="btn btn-primary"
              onClick={handleTrack}
              disabled={loading || !id.trim()}>
              {loading ? <><span className="spinner" />Searching...</> : 'Track'}
            </button>
          </div>
          {error && <div className="error-msg" style={{ marginTop: '12px' }}>{error}</div>}
        </div>

        {result && (
          <div className="card slide-up" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Complaint Found</span>
            </div>

            <div style={{
              fontSize: '13px', color: 'var(--text-secondary)',
              background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)',
              padding: '12px 16px', marginBottom: '20px', lineHeight: 1.6,
            }}>
              {result.complaint_text}
            </div>

            {/* ID row with copy */}
            <div className="data-row">
              <span className="data-label">Complaint ID</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="data-value" style={{ maxWidth: 'none' }}>{result._id}</span>
                <CopyButton text={result._id} />
              </span>
            </div>

            {rows.map((row, i) => (
              <div key={i} className="data-row">
                <span className="data-label">{row.label}</span>
                <span className="data-value" style={row.color ? { color: row.color } : {}}>{row.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TrackPage
