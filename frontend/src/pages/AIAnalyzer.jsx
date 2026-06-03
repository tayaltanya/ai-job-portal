import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { analyzeResume } from '../services/api'
import Navbar from '../components/Navbar'

function AIAnalyzer() {
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleAnalyze = async () => {
    if (!resumeText || !jobDescription) {
      setError('Please fill both fields!')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const { data } = await analyzeResume({ resumeText, jobDescription })
      setResult(data)
    } catch (err) {
      setError('AI analysis failed! Try again.')
    }
    setLoading(false)
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#2ecc71'
    if (score >= 60) return '#f39c12'
    return '#e74c3c'
  }

  return (
    <div style={styles.container}>
      <Navbar />

      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>AI Resume Analyzer 🤖</h1>
        <p style={styles.heroSubtitle}>
          Get instant AI feedback on your resume!
        </p>
      </div>

      <div style={styles.content}>
        {/* Input Section */}
        <div style={styles.inputSection}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              📄 Paste Your Resume Text
            </label>
            <textarea
              style={styles.textarea}
              placeholder="Paste your complete resume text here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={10}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              💼 Paste Job Description
            </label>
            <textarea
              style={styles.textarea}
              placeholder="Paste the job description you want to apply for..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={10}
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button
            style={loading ? styles.btnDisabled : styles.btn}
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? '🤖 Analyzing... Please wait...' : '🚀 Analyze My Resume'}
          </button>
        </div>

        {/* Result Section */}
        {result && (
          <div style={styles.resultSection}>
            <h2 style={styles.resultTitle}>Analysis Result 📊</h2>

            {/* Score */}
            <div style={styles.scoreCard}>
              <div style={styles.scoreCircle}>
                <span style={{
                  ...styles.scoreNumber,
                  color: getScoreColor(result.score)
                }}>
                  {result.score}
                </span>
                <span style={styles.scoreLabel}>/ 100</span>
              </div>
              <div>
                <h3 style={styles.scoreTitle}>Match Score</h3>
                <p style={styles.scoreDesc}>
                  {result.score >= 80 ? '🎉 Excellent match!' :
                   result.score >= 60 ? '👍 Good match!' :
                   '⚠️ Needs improvement'}
                </p>
              </div>
            </div>

            {/* Strong Points */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>✅ Strong Points</h3>
              {result.strongPoints?.map((point, i) => (
                <div key={i} style={styles.pointCard}>
                  <span style={styles.pointIcon}>✅</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>

            {/* Missing Skills */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>❌ Missing Skills</h3>
              <div style={styles.skillsContainer}>
                {result.missingSkills?.map((skill, i) => (
                  <span key={i} style={styles.missingSkill}>{skill}</span>
                ))}
              </div>
            </div>

            {/* Improvements */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>💡 Improvements</h3>
              {result.improvements?.map((imp, i) => (
                <div key={i} style={styles.impCard}>
                  <span style={styles.pointIcon}>💡</span>
                  <span>{imp}</span>
                </div>
              ))}
            </div>

            {/* Overall Feedback */}
            <div style={styles.feedbackCard}>
              <h3 style={styles.sectionTitle}>📝 Overall Feedback</h3>
              <p style={styles.feedbackText}>{result.overallFeedback}</p>
            </div>

            {/* Action Buttons */}
            <div style={styles.actions}>
              <button
                style={styles.btn}
                onClick={() => navigate('/jobs')}
              >
                Browse Matching Jobs →
              </button>
              <button
                style={styles.btnOutline}
                onClick={() => {
                  setResult(null)
                  setResumeText('')
                  setJobDescription('')
                }}
              >
                Analyze Again
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
  resultTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '24px'
  },
  scoreCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    background: '#f8f9ff',
    padding: '24px',
    borderRadius: '12px',
    marginBottom: '32px'
  },
  scoreCircle: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px'
  },
  scoreNumber: {
    fontSize: '64px',
    fontWeight: 'bold'
  },
  scoreLabel: {
    fontSize: '24px',
    color: '#888'
  },
  scoreTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '8px'
  },
  scoreDesc: {
    fontSize: '16px',
    color: '#666'
  },
  section: {
    marginBottom: '24px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '12px'
  },
  pointCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px',
    background: '#f8fff8',
    borderRadius: '8px',
    marginBottom: '8px',
    fontSize: '14px',
    color: '#444'
  },
  pointIcon: {
    fontSize: '16px'
  },
  skillsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  missingSkill: {
    padding: '6px 14px',
    background: '#ffe0e0',
    color: '#d00',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500'
  },
  impCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px',
    background: '#fffdf0',
    borderRadius: '8px',
    marginBottom: '8px',
    fontSize: '14px',
    color: '#444'
  },
  feedbackCard: {
    background: '#f0f0ff',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '24px'
  },
  feedbackText: {
    fontSize: '15px',
    color: '#555',
    lineHeight: '1.8'
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  }
}

export default AIAnalyzer