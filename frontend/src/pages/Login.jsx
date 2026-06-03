import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../services/api'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Load Google GSI script
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse
      })
      window.google.accounts.id.renderButton(
        document.getElementById('google-btn'),
        {
          theme: 'outline',
          size: 'large',
          width: 350,
          text: 'continue_with'
        }
      )
    }

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleGoogleResponse = async (response) => {
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/auth/google',
        { credential: response.credential }
      )
      login(data)
      if (data.role === 'admin') navigate('/admin')
      else if (data.role === 'company') navigate('/company-dashboard')
      else navigate('/jobs')
    } catch (err) {
      setError('Google login failed!')
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await loginUser(formData)
      login(data)
      if (data.role === 'admin') navigate('/admin')
      else if (data.role === 'company') navigate('/company-dashboard')
      else navigate('/jobs')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed!')
    }
    setLoading(false)
  }

  return (
    <div style={styles.container}>
      {/* Left Side */}
      <div style={styles.leftSide}>
        <div style={styles.leftContent}>
          <h1 style={styles.brandName}>AI Job Portal</h1>
          <p style={styles.brandTagline}>
            Find your dream job with the power of AI 🚀
          </p>
          <div style={styles.features}>
            <div style={styles.feature}>✅ AI Resume Analysis</div>
            <div style={styles.feature}>✅ Smart Job Matching</div>
            <div style={styles.feature}>✅ Auto Cover Letter</div>
            <div style={styles.feature}>✅ 1000+ Companies</div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div style={styles.rightSide}>
        <div style={styles.card}>
          <h2 style={styles.title}>Welcome Back! 👋</h2>
          <p style={styles.subtitle}>Login to your account</p>

          {error && <div style={styles.error}>{error}</div>}

          {/* Google Button */}
          <div id="google-btn" style={styles.googleBtn}></div>

          <div style={styles.divider}>
            <span style={styles.dividerLine}></span>
            <span style={styles.dividerText}>or login with email</span>
            <span style={styles.dividerLine}></span>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                style={styles.input}
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                style={styles.input}
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              style={loading ? styles.buttonDisabled : styles.button}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login →'}
            </button>
          </form>

          <p style={styles.link}>
            Don't have an account?{' '}
            <Link to="/register" style={styles.linkText}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
  },
  leftSide: {
    flex: 1,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
  },
  leftContent: {
    color: 'white',
    maxWidth: '400px'
  },
  brandName: {
    fontSize: '42px',
    fontWeight: 'bold',
    marginBottom: '16px'
  },
  brandTagline: {
    fontSize: '18px',
    opacity: 0.9,
    marginBottom: '40px',
    lineHeight: '1.6'
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  feature: {
    fontSize: '16px',
    background: 'rgba(255,255,255,0.15)',
    padding: '12px 20px',
    borderRadius: '8px',
    backdropFilter: 'blur(10px)'
  },
  rightSide: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8f9ff',
    padding: '40px'
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '8px',
    color: '#333'
  },
  subtitle: {
    textAlign: 'center',
    color: '#888',
    marginBottom: '24px'
  },
  googleBtn: {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px'
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: '#e1e1e1'
  },
  dividerText: {
    color: '#999',
    fontSize: '13px',
    whiteSpace: 'nowrap'
  },
  inputGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: '600',
    color: '#444',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e1e1e1',
    borderRadius: '10px',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border 0.3s'
  },
  button: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px'
  },
  buttonDisabled: {
    width: '100%',
    padding: '14px',
    background: '#ccc',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    cursor: 'not-allowed',
    marginTop: '10px'
  },
  error: {
    background: '#ffe0e0',
    color: '#d00',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center',
    fontSize: '14px'
  },
  link: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#888',
    fontSize: '14px'
  },
  linkText: {
    color: '#667eea',
    fontWeight: '600',
    textDecoration: 'none'
  }
}

export default Login