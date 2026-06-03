import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      {/* Logo */}
      <Link to="/" style={styles.logo}>
        🚀 AI Job Portal
      </Link>

      {/* Links */}
      <div style={styles.links}>
        <Link to="/jobs" style={styles.link}>Jobs</Link>

        {user ? (
          <>
            {user.role === 'student' && (
              <Link to="/dashboard" style={styles.link}>
                Dashboard
              </Link>
            )}
            {user.role === 'company' && (
              <Link to="/company-dashboard" style={styles.link}>
                Dashboard
              </Link>
            )}
            {user.role === 'admin' && (
              <Link to="/admin" style={styles.link}>
                Admin
              </Link>
            )}
            <div style={styles.userInfo}>
              <span style={styles.userName}>Hi, {user.name}! 👋</span>
              <button style={styles.logoutBtn} onClick={handleLogout}>
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>
              Register Free
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 40px',
    background: 'white',
    boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  logo: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#667eea',
    textDecoration: 'none'
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px'
  },
  link: {
    color: '#555',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '15px'
  },
  registerBtn: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  userName: {
    color: '#555',
    fontWeight: '500'
  },
  logoutBtn: {
    background: '#ff4757',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  }
}

export default Navbar