import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAdmin } from '../services/api'

const LoginPage = () => {
  const navigate  = useNavigate()
  const usernameRef = useRef(null)
  const [form, setForm]     = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  useEffect(() => { usernameRef.current?.focus() }, [])

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await loginAdmin(form)
      localStorage.setItem('admin_token', res.data.token)
      navigate('/dashboard')
    } catch {
      setError('Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1030 50%, #0f0f1a 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* decorative glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(233,69,96,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="glass slide-up" style={{
        padding: '48px 40px', width: '100%', maxWidth: '420px',
        textAlign: 'center', position: 'relative', zIndex: 1,
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: 'var(--accent-soft)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>Admin Login</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '28px' }}>ComplaintIQ Admin Panel</p>

        {error && <div className="error-msg">{error}</div>}

        <input
          ref={usernameRef}
          className="input"
          style={{ marginBottom: '14px' }}
          placeholder="Username"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
        />
        <input
          className="input"
          style={{ marginBottom: '14px' }}
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
        />
        <button
          className="btn btn-primary"
          style={{ width: '100%', padding: '13px', fontSize: '15px', marginTop: '4px' }}
          onClick={handleLogin}
          disabled={loading}>
          {loading ? <><span className="spinner" />Logging in...</> : 'Login'}
        </button>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '20px' }}>
          Default: admin / admin1234
        </p>
      </div>
    </div>
  )
}

export default LoginPage