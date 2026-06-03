import { useState } from 'react'
import Navbar from '../components/Navbar'
import { generateCoverLetter } from '../services/api'

function AICoverLetter() {
  const [formData, setFormData] = useState({
    resumeText: '',
    jobTitle: '',
    companyName: ''
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleGenerate = async () => {
    if (!formData.resumeText || !formData.jobTitle || !formData.companyName) {
      setError('Please fill all fields!')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const { data } = await generateCoverLetter(formData)
      setResult(data.coverLetter)
    } catch (err) {
      setError('Cover letter generation failed! Try again.')
    }
    setLoading(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={styles.container}>
      <Navbar />

      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>AI Cover Letter Generator ✉️</h1>
        <p style={styles.heroSubtitle}>
          Generate professional cover letters in seconds!
        </p>
      </div>

      <div style={styles.content}>
        {/* Input Section */}
        <div style={styles.inputSection}>
          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>💼 Job Title</label>
              <input
                style={styles.input}
                type="text"
                name="jobTitle"
                placeholder="e.g. React Developer"
                value={formData.jobTitle}
                onChange={handleChange}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>🏢 Company Name</label>
              <input
                style={styles.input}
                type="text"
                name="companyName"
                placeholder="e.g. Google, TCS, Infosys"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>📄 Your Resume Text</label>
            <textarea
              style={styles.textarea}
              name="resumeText"
              placeholder="Paste your resume text here..."
              value={formData.resumeText}
              onChange={handleChange}
              rows={10}
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button
            style={loading ? styles.btnDisabled : styles.btn}
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? '✉️ Generating...' : '✉️ Generate Cover Letter'}
          </button>
        </div>

        {/* Result Section */}
        {result && (
          <div style={styles.resultSection}>
            <div style={styles.resultHeader}>
              <h2 style={styles.resultTitle}>
                Your Cover Letter 🎉
              </h2>
              <button
                style={copied ? styles.copiedBtn : styles.copyBtn}
                onClick={handleCopy}
              >
                {copied ? '✅ Copied!' : '📋 Copy'}
              </button>
            </div>

            <div style={styles.coverLetter}>
              {result.split('\n').map((line, i) => (
                <p key={i} style={styles.line}>
                  {line}
                </p>
              ))}
            </div>

            <div style={styles.actions}>
              <button
                style={styles.btn}
                onClick={handleGenerate}
              >
                🔄 Regenerate
              </button>
              <button
                style={styles.btnOutline}
                onClick={() => {
                  setResult(null)
                  setFormData({
                    resumeText: '',
                    jobTitle: '',
                    companyName: ''
                  })
                }}
              >
                ✏️ Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f8f9ff'
  },
  hero: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px',
    textAlign: 'center',
    color: 'white'
  },
  heroTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  heroSubtitle: {
    fontSize: '16px',
    opacity: 0.9
  },
  content: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px 20px'
  },
  inputSection: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    marginBottom: '32px'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '4px'
  },
  inputGroup: {
    marginBottom: '24px'
  },
  label: {
    display: 'block',
    fontWeight: '600',
    color: '#444',
    marginBottom: '8px',
    fontSize: '15px'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e1e1e1',
    borderRadius: '10px',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '16px',
    border: '2px solid #e1e1e1',
    borderRadius: '12px',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    lineHeight: '1.6'
  },
  btn: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  btnDisabled: {
    width: '100%',
    padding: '16px',
    background: '#ccc',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    cursor: 'not-allowed'
  },
  btnOutline: {
    width: '100%',
    padding: '16px',
    background: 'white',
    color: '#667eea',
    border: '2px solid #667eea',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '12px'
  },
  error: {
    background: '#ffe0e0',
    color: '#d00',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    textAlign: 'center'
  },
  resultSection: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  resultTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#333'
  },
  copyBtn: {
    background: '#667eea',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  },
  copiedBtn: {
    background: '#2ecc71',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  },
  coverLetter: {
    background: '#f8f9ff',
    padding: '24px',
    borderRadius: '12px',
    marginBottom: '24px',
    border: '1px solid #e1e1e1'
  },
  line: {
    fontSize: '15px',
    color: '#444',
    lineHeight: '1.8',
    marginBottom: '8px'
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  }
}

export default AICoverLetter