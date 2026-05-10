import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAdmin } from '../services/api'

const LoginPage = () => {
  const navigate  = useNavigate()
  const [form, setForm]     = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

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
    <div style={s.wrapper}>
      <div style={s.card}>
        <div style={s.logo}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#e94560" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '40px', height: '40px' }}>
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <h2 style={s.title}>Admin Login</h2>
        <p style={s.sub}>ComplaintIQ Admin Panel</p>
        {error && <div style={s.error}>{error}</div>}
        <input
          style={s.input}
          placeholder="Username"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
        />
        <input
          style={s.input}
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
        />
        <button style={s.btn} onClick={handleLogin} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p style={s.hint}>Default: admin / admin1234</p>
      </div>
    </div>
  )
}

const s = {
  wrapper: { minHeight: '100vh', background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  card: { background: '#fff', borderRadius: '16px', padding: '48px 40px', width: '100%', maxWidth: '400px', textAlign: 'center' },
  logo: { display: 'flex', justifyContent: 'center', marginBottom: '16px' },
  title: { fontSize: '24px', fontWeight: '800', color: '#1a1a2e', marginBottom: '6px' },
  sub: { fontSize: '13px', color: '#9ca3af', marginBottom: '28px' },
  error: { background: '#fff0f3', color: '#e94560', padding: '10px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' },
  input: { display: 'block', width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px', marginBottom: '14px', fontFamily: 'inherit' },
  btn: { width: '100%', background: '#1a1a2e', color: '#fff', padding: '13px', borderRadius: '10px', fontSize: '15px', fontWeight: '700', marginTop: '4px' },
  hint: { fontSize: '12px', color: '#9ca3af', marginTop: '16px' }
}

export default LoginPage