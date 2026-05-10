import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { submitComplaint } from '../services/api'

const MAX_LENGTH = 5000

const SubmitPage = () => {
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (text.trim().length < 10) {
      setError('Please enter at least 10 characters.')
      return
    }
    if (text.length > MAX_LENGTH) {
      setError(`Complaint must not exceed ${MAX_LENGTH} characters.`)
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await submitComplaint({ complaint_text: text })
      navigate('/result', { state: { data: res.data.data } })
    } catch (err) {
      if (err.response?.status === 503) {
        setError('Our AI service is temporarily unavailable. Please try again in a moment.')
      } else if (err.code === 'ERR_NETWORK') {
        setError('Cannot reach the server. Please check your connection and try again.')
      } else {
        setError('Submission failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6f9' }}>
      <Navbar />
      <div style={s.container}>
        <h2 style={s.title}>Submit a Complaint</h2>
        <p style={s.sub}>Describe your issue in detail. Our AI will classify and prioritize it automatically.</p>
        <div style={s.card}>
          <label style={s.label}>Complaint Description</label>
          <textarea
            style={s.textarea}
            rows={8}
            placeholder="Describe your complaint here..."
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <div style={{ ...s.counter, color: text.length > MAX_LENGTH ? '#e94560' : text.length > MAX_LENGTH * 0.9 ? '#f59e0b' : '#9ca3af' }}>
            {text.length} / {MAX_LENGTH}
          </div>
          {error && <p style={s.error}>{error}</p>}
          <button style={s.btn} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Analyzing...' : 'Submit Complaint'}
          </button>
        </div>
      </div>
    </div>
  )
}

const s = {
  container: { maxWidth: '680px', margin: '60px auto', padding: '0 24px' },
  title: { fontSize: '28px', fontWeight: '800', color: '#1a1a2e', marginBottom: '8px' },
  sub: { color: '#6b7280', fontSize: '14px', marginBottom: '32px' },
  card: { background: '#fff', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#1a1a2e', marginBottom: '10px' },
  textarea: { width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', lineHeight: '1.6', resize: 'vertical', fontFamily: 'inherit' },
  counter: { textAlign: 'right', fontSize: '12px', color: '#9ca3af', marginTop: '6px', marginBottom: '16px' },
  error: { color: '#e94560', fontSize: '13px', marginBottom: '12px' },
  btn: { width: '100%', background: '#1a1a2e', color: '#fff', padding: '14px', borderRadius: '10px', fontSize: '15px', fontWeight: '700' }
}

export default SubmitPage