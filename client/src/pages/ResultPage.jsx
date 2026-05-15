import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

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

const ResultPage = () => {
  const { state } = useLocation()
  const navigate  = useNavigate()
  const data      = state?.data

  if (!data) {
    navigate('/')
    return null
  }

  const priorityColor = data.priority === 'Urgent' ? 'var(--accent)' : 'var(--green)'

  return (
    <div className="page">
      <Navbar />
      <div className="container-xs slide-up" style={{ textAlign: 'center' }}>
        {/* success icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'var(--green-soft)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '32px', height: '32px' }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        </div>

        <h2 className="section-title" style={{ textAlign: 'center' }}>Complaint Submitted</h2>
        <p className="section-sub" style={{ textAlign: 'center' }}>Your complaint has been received and analyzed by our AI system.</p>

        <div className="card" style={{ padding: '28px', textAlign: 'left', marginBottom: '24px' }}>
          {/* Complaint ID row with copy button */}
          <div className="data-row">
            <span className="data-label">Complaint ID</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="data-value" style={{ maxWidth: 'none' }}>{data._id}</span>
              <CopyButton text={data._id} />
            </span>
          </div>
          {[
            { label: 'Category', value: data.category },
            { label: 'Sentiment', value: data.sentiment },
            { label: 'Priority', value: data.priority, color: priorityColor },
            { label: 'Status', value: data.status, color: 'var(--amber)' },
            { label: 'Submitted', value: new Date(data.submittedAt).toLocaleString() }
          ].map((row, i) => (
            <div key={i} className="data-row">
              <span className="data-label">{row.label}</span>
              <span className="data-value" style={row.color ? { color: row.color } : {}}>{row.value}</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Save your Complaint ID to track its status later.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/submit')}>Submit Another</button>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/track')}>Track Complaint</button>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    </div>
  )
}

export default ResultPage