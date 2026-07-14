import { Link, useNavigate, useLocation } from 'react-router-dom'

const Navbar = ({ isAdmin = false }) => {
  const navigate  = useNavigate()
  const location  = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
      <nav className="glass" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 40px', height: '64px',
      position: 'sticky', top: 0, zIndex: 100,
      borderBottom: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)',
      borderRadius: 0,
    }}>
      <Link to="/" style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        color: 'var(--text-primary)', fontSize: '20px', fontWeight: '800',
        letterSpacing: '-0.5px',
      }}>
        <svg style={{ width: '22px', height: '22px', flexShrink: 0 }}
          viewBox="0 0 24 24" fill="none" stroke="var(--accent)"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        ComplaintIQ
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {!isAdmin ? (
          <>
            <Link to="/submit"
              className={`btn btn-ghost btn-sm`}
              style={isActive('/submit') ? { color: 'var(--text-primary)', background: 'var(--bg-card)' } : {}}>
              Complain
            </Link>
            <Link to="/track"
              className={`btn btn-ghost btn-sm`}
              style={isActive('/track') ? { color: 'var(--text-primary)', background: 'var(--bg-card)' } : {}}>
              Track
            </Link>
            <Link to="/login" className="btn btn-primary btn-sm"
              style={{ marginLeft: '8px' }}>
              Admin
            </Link>
          </>
        ) : (
          <button onClick={handleLogout} className="btn btn-sm"
            style={{
              background: 'transparent', color: 'var(--accent)',
              border: '1px solid var(--accent)',
            }}>
            Logout
          </button>
        )}
      </div>
    </nav>
  )
}

export default Navbar