import { Link, useNavigate, useLocation } from 'react-router-dom'

const Navbar = ({ isAdmin = false }) => {
  const navigate  = useNavigate()
  const location  = useLocation()

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    navigate('/')
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>
        <svg style={styles.brandIcon} viewBox="0 0 24 24" fill="none" stroke="#e94560" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
        ComplaintIQ
      </Link>
      <div style={styles.links}>
        {!isAdmin ? (
          <>
            <Link
              to="/submit"
              style={{
                ...styles.link,
                ...(location.pathname === '/submit' ? styles.activeLink : {})
              }}>
              Complain
            </Link>
            <Link
              to="/track"
              style={{
                ...styles.link,
                ...(location.pathname === '/track' ? styles.activeLink : {})
              }}>
              Track
            </Link>
            <Link to="/login" style={styles.adminBtn}>
              Admin
            </Link>
          </>
        ) : (
          <>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 40px',
    height: '64px',
    background: '#1a1a2e',
    boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#ffffff',
    fontSize: '20px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
  },
  brandIcon: {
    width: '22px',
    height: '22px',
    flexShrink: 0,
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  link: {
    color: '#9ca3af',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'color 0.2s',
  },
  activeLink: {
    color: '#ffffff',
  },
  adminBtn: {
    background: '#e94560',
    color: '#ffffff',
    padding: '8px 18px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
  },
  adminBadge: {
    color: '#9ca3af',
    fontSize: '13px',
    fontWeight: '500',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #e94560',
    color: '#e94560',
    padding: '7px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
  }
}

export default Navbar