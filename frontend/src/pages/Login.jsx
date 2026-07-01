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
        { theme: 'filled_black', size: 'large', width: 350, text: 'continue_with' }
      )
    }
    return () => { document.body.removeChild(script) }
  }, [])

  const handleGoogleResponse = async (response) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`,
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
      {/* Animated blobs */}
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>
      <div style={styles.blob3}></div>
      <div style={styles.blob4}></div>
      <div style={styles.blob5}></div>

      {/* Left Side */}
      <div style={styles.leftSide}>
        <div style={styles.leftContent}>
          <div style={styles.logo}>🚀</div>
          <h1 style={styles.brandName}>AI Job Portal</h1>
          <p style={styles.brandTagline}>
            Find your dream job with the power of AI
          </p>
          <div style={styles.features}>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>✨</span>
              AI Resume Analysis
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>🎯</span>
              Smart Job Matching
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>✉️</span>
              Auto Cover Letter
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>📊</span>
              Skill Assessment Quiz
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>🗺️</span>
              Learning Path Generator
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div style={styles.rightSide}>
        <div style={styles.formCard}>
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
              style={loading ? styles.btnDisabled : styles.btn}
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
    background: '#0f0c29',
    position: 'relative',
    overflow: 'hidden'
  },
  blob1: {
    position: 'absolute',
    width: '500px', height: '500px',
    background: 'radial-gradient(circle, #667eea 0%, transparent 70%)',
    borderRadius: '50%',
    top: '-150px', left: '-150px',
    opacity: 0.5,
    animation: 'blob 8s infinite'
  },
  blob2: {
    position: 'absolute',
    width: '400px', height: '400px',
    background: 'radial-gradient(circle, #764ba2 0%, transparent 70%)',
    borderRadius: '50%',
    bottom: '-100px', right: '-100px',
    opacity: 0.5
  },
  blob3: {
    position: 'absolute',
    width: '350px', height: '350px',
    background: 'radial-gradient(circle, #f093fb 0%, transparent 70%)',
    borderRadius: '50%',
    top: '30%', right: '25%',
    opacity: 0.3
  },
  blob4: {
    position: 'absolute',
    width: '300px', height: '300px',
    background: 'radial-gradient(circle, #4facfe 0%, transparent 70%)',
    borderRadius: '50%',
    bottom: '20%', left: '20%',
    opacity: 0.25
  },
  blob5: {
    position: 'absolute',
    width: '200px', height: '200px',
    background: 'radial-gradient(circle, #43e97b 0%, transparent 70%)',
    borderRadius: '50%',
    top: '10%', right: '10%',
    opacity: 0.2
  },
  leftSide: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    position: 'relative',
    zIndex: 1
  },
  leftContent: {
    maxWidth: '420px',
    width: '100%'
  },
  logo: {
    fontSize: '56px',
    marginBottom: '20px',
    display: 'block'
  },
  brandName: {
    fontSize: '42px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '16px',
    background: 'linear-gradient(135deg, #667eea, #f093fb)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  brandTagline: {
    fontSize: '18px',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: '40px',
    lineHeight: '1.6'
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  feature: {
    fontSize: '15px',
    color: 'rgba(255,255,255,0.85)',
    background: 'rgba(255,255,255,0.05)',
    padding: '12px 18px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backdropFilter: 'blur(10px)'
  },
  featureIcon: { fontSize: '18px' },
  rightSide: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    position: 'relative',
    zIndex: 1
  },
  formCard: {
    background: 'rgba(255,255,255,0.07)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '24px',
    padding: '44px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.4)'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: '8px'
  },
  subtitle: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: '28px',
    fontSize: '15px'
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
    background: 'rgba(255,255,255,0.15)'
  },
  dividerText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '13px',
    whiteSpace: 'nowrap'
  },
  inputGroup: { marginBottom: '20px' },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    padding: '13px 16px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '12px',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    color: 'white',
    transition: 'border 0.3s'
  },
  btn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px',
    boxShadow: '0 8px 20px rgba(102,126,234,0.4)'
  },
  btnDisabled: {
    width: '100%',
    padding: '14px',
    background: 'rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.4)',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    cursor: 'not-allowed',
    marginTop: '10px'
  },
  error: {
    background: 'rgba(255,71,87,0.2)',
    color: '#ff6b7a',
    padding: '12px',
    borderRadius: '10px',
    marginBottom: '20px',
    textAlign: 'center',
    fontSize: '14px',
    border: '1px solid rgba(255,71,87,0.3)'
  },
  link: {
    textAlign: 'center',
    marginTop: '24px',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '14px'
  },
  linkText: {
    color: '#a78bfa',
    fontWeight: '600',
    textDecoration: 'none'
  }
}

export default Login