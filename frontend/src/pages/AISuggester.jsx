import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { suggestJobs } from '../services/api'
import Navbar from '../components/Navbar'

function AISuggester() {
  const [skills, setSkills] = useState('')
  const [experience, setExperience] = useState('fresher')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSuggest = async () => {
    if (!skills) {
      setError('Please enter your skills!')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const skillsArray = skills.split(',').map(s => s.trim())
      const { data } = await suggestJobs({ skills: skillsArray, experience })
      setResult(data)
    } catch (err) {
      setError('AI suggestion failed! Try again.')
    }
    setLoading(false)
  }

  return (
    <div style={styles.container}>
      <Navbar />

      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>AI Job Suggester 💡</h1>
        <p style={styles.heroSubtitle}>
          Get AI powered job role suggestions based on your skills!
        </p>
      </div>

      <div style={styles.content}>
        {/* Input Section */}
        <div style={styles.inputSection}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              🛠️ Your Skills (comma separated)
            </label>
            <input
              style={styles.input}
              type="text"
              placeholder="e.g. React, Node.js, MongoDB, JavaScript"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
            <p style={styles.hint}>
              💡 Tip: Add all your skills separated by commas
            </p>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              📅 Experience Level
            </label>
            <div style={styles.expContainer}>
              {['fresher', '1-2 years', '2-5 years', '5+ years'].map(exp => (
                <div
                  key={exp}
                  style={experience === exp ? styles.expActive : styles.exp}
                  onClick={() => setExperience(exp)}
                >
                  {exp === 'fresher' && '🎓 '}
                  {exp === '1-2 years' && '💼 '}
                  {exp === '2-5 years' && '🏆 '}
                  {exp === '5+ years' && '⭐ '}
                  {exp}
                </div>
              ))}
            </div>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button
            style={loading ? styles.btnDisabled : styles.btn}
            onClick={handleSuggest}
            disabled={loading}
          >
            {loading ? '🤖 Finding Jobs...' : '💡 Suggest Jobs For Me'}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div style={styles.resultSection}>
            <h2 style={styles.resultTitle}>
              🎯 Suggested Job Roles For You
            </h2>
            <div style={styles.grid}>
              {result.suggestions?.map((job, i) => (
                <div key={i} style={styles.jobCard}>
                  <div style={styles.jobNumber}>#{i + 1}</div>
                  <h3 style={styles.jobTitle}>{job.title}</h3>
                  <p style={styles.jobReason}>
                    💡 {job.reason}
                  </p>

                  <div style={styles.section}>
                    <p style={styles.sectionLabel}>Required Skills:</p>
                    <div style={styles.skillsContainer}>
                      {job.requiredSkills?.map((skill, j) => (
                        <span key={j} style={styles.skill}>{skill}</span>
                      ))}
                    </div>
                  </div>

                  <div style={styles.salaryContainer}>
                    <span style={styles.salaryIcon}>💰</span>
                    <span style={styles.salary}>{job.averageSalary}</span>
                  </div>

                  <button
                    style={styles.searchBtn}
                    onClick={() => navigate('/jobs')}
                  >
                    Find These Jobs →
                  </button>
                </div>
              ))}
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
  input: {
    width: '100%',
    padding: '14px 16px',
    border: '2px solid #e1e1e1',
    borderRadius: '12px',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  hint: {
    fontSize: '13px',
    color: '#888',
    marginTop: '6px'
  },
  expContainer: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  exp: {
    padding: '10px 20px',
    border: '2px solid #e1e1e1',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#666'
  },
  expActive: {
    padding: '10px 20px',
    border: '2px solid #667eea',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    color: '#667eea',
    background: '#f0f0ff'
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
  error: {
    background: '#ffe0e0',
    color: '#d00',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    textAlign: 'center'
  },
  resultSection: {
    marginTop: '8px'
  },
  resultTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '24px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '24px'
  },
  jobCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    position: 'relative'
  },
  jobNumber: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: 'bold'
  },
  jobTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '8px'
  },
  jobReason: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '16px',
    lineHeight: '1.6'
  },
  section: {
    marginBottom: '16px'
  },
  sectionLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#888',
    marginBottom: '8px'
  },
  skillsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px'
  },
  skill: {
    padding: '4px 10px',
    background: '#f0f0ff',
    color: '#667eea',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500'
  },
  salaryContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
    padding: '10px',
    background: '#f8fff8',
    borderRadius: '8px'
  },
  salaryIcon: {
    fontSize: '18px'
  },
  salary: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2ecc71'
  },
  searchBtn: {
    width: '100%',
    padding: '10px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  }
}

export default AISuggester