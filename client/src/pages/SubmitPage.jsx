import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { submitComplaint } from '../services/api'

const MAX_LENGTH = 5000

const SubmitPage = () => {
  const navigate = useNavigate()
  const textareaRef = useRef(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { textareaRef.current?.focus() }, [])

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

  const counterColor = text.length > MAX_LENGTH
    ? 'var(--accent)'
    : text.length > MAX_LENGTH * 0.9
      ? 'var(--amber)'
      : 'var(--text-muted)'

  return (
    <div className="page">
      <Navbar />
      <div className="container-sm slide-up">
        <h2 className="section-title">Submit a Complaint</h2>
        <p className="section-sub">Describe your issue in detail. Our AI will classify and prioritize it automatically.</p>

        <div className="card" style={{ padding: '32px' }}>
          <label style={{
            display: 'block', fontSize: '13px', fontWeight: 600,
            color: 'var(--text-primary)', marginBottom: '10px',
          }}>Complaint Description</label>
          <textarea
            ref={textareaRef}
            className="input"
            rows={5}
            placeholder="Describe your complaint here..."
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <div style={{ textAlign: 'right', fontSize: '12px', color: counterColor, marginTop: '6px', marginBottom: '16px' }}>
            {text.length} / {MAX_LENGTH}
          </div>
          {error && <div className="error-msg">{error}</div>}
          <button
            className="btn btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '15px' }}
            onClick={handleSubmit}
            disabled={loading}>
            {loading ? <><span className="spinner" />Analyzing your complaint...</> : 'Submit Complaint'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SubmitPage