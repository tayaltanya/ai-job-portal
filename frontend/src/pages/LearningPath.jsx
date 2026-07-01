import { useState } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function LearningPath() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState('setup')
  const [formData, setFormData] = useState({
    targetRole: '',
    currentSkills: '',
    timeframe: '3 months'
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activePhase, setActivePhase] = useState(0)

  const roles = [
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'React Developer',
    'Node.js Developer',
    'Data Scientist',
    'DevOps Engineer',
    'Android Developer',
    'UI/UX Designer',
    'Machine Learning Engineer'
  ]

  const timeframes = [
    '1 month',
    '2 months',
    '3 months',
    '6 months',
    '1 year'
  ]

  const handleGenerate = async () => {
    if (!formData.targetRole) {
      setError('Please select a target role!')
      return
    }
    if (!user) {
      navigate('/login')
      return
    }
    setLoading(true)
    setError('')
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/ai/learning-path`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setResult(data.roadmap)
      setStep('result')
      setActivePhase(0)
    } catch (err) {
      setError('Failed to generate learning path! Try again.')
    }
    setLoading(false)
  }

  return (
    <div style={styles.container}>
      <Navbar />

      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Learning Path Generator 🗺️</h1>
        <p style={styles.heroSubtitle}>
          Get your personalized AI roadmap to land your dream job!
        </p>
      </div>

      <div style={styles.content}>

        {/* Setup Step */}
        {step === 'setup' && (
          <div style={styles.setupCard}>
            <h2 style={styles.sectionTitle}>
              🎯 What's Your Target Role?
            </h2>

            {/* Role Grid */}
            <div style={styles.roleGrid}>
              {roles.map(r => (
                <div
                  key={r}
                  style={formData.targetRole === r
                    ? styles.roleActive : styles.role}
                  onClick={() => setFormData({
                    ...formData, targetRole: r
                  })}
                >
                  {r === 'Full Stack Developer' && '🌐 '}
                  {r === 'Frontend Developer' && '🎨 '}
                  {r === 'Backend Developer' && '⚙️ '}
                  {r === 'React Developer' && '⚛️ '}
                  {r === 'Node.js Developer' && '🟢 '}
                  {r === 'Data Scientist' && '📊 '}
                  {r === 'DevOps Engineer' && '🔧 '}
                  {r === 'Android Developer' && '📱 '}
                  {r === 'UI/UX Designer' && '🎭 '}
                  {r === 'Machine Learning Engineer' && '🤖 '}
                  {r}
                </div>
              ))}
            </div>

            {/* Custom Role */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Or type custom role:
              </label>
              <input
                style={styles.input}
                type="text"
                placeholder="e.g. Cloud Architect, Blockchain Developer..."
                value={roles.includes(formData.targetRole)
                  ? '' : formData.targetRole}
                onChange={e => setFormData({
                  ...formData, targetRole: e.target.value
                })}
              />
            </div>

            {/* Current Skills */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                💡 Your Current Skills (optional):
              </label>
              <input
                style={styles.input}
                type="text"
                placeholder="e.g. HTML, CSS, Basic JavaScript..."
                value={formData.currentSkills}
                onChange={e => setFormData({
                  ...formData, currentSkills: e.target.value
                })}
              />
              <p style={styles.hint}>
                Leave empty if you're a complete beginner!
              </p>
            </div>

            {/* Timeframe */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                ⏱️ Available Timeframe:
              </label>
              <div style={styles.timeGrid}>
                {timeframes.map(t => (
                  <div
                    key={t}
                    style={formData.timeframe === t
                      ? styles.timeActive : styles.time}
                    onClick={() => setFormData({
                      ...formData, timeframe: t
                    })}
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <button
              style={loading ? styles.btnDisabled : styles.btn}
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading
                ? '🤖 Generating Your Roadmap...'
                : '🗺️ Generate My Learning Path'}
            </button>
          </div>
        )}

        {/* Result Step */}
        {step === 'result' && result && (
          <div>
            {/* Header */}
            <div style={styles.resultHeader}>
              <div style={styles.resultInfo}>
                <h2 style={styles.resultTitle}>{result.title}</h2>
                <p style={styles.resultOverview}>{result.overview}</p>
                <div style={styles.resultMeta}>
                  <span style={styles.metaTag}>
                    ⏱️ {result.totalWeeks} Weeks
                  </span>
                  <span style={styles.metaTag}>
                    💰 {result.expectedSalary}
                  </span>
                  <span style={styles.metaTag}>
                    📋 {result.phases?.length} Phases
                  </span>
                </div>
              </div>

              {/* Job Titles */}
              <div style={styles.jobTitles}>
                <p style={styles.jobTitlesLabel}>🎯 Target Job Titles:</p>
                {result.jobTitles?.map((title, i) => (
                  <span key={i} style={styles.jobTitle}>{title}</span>
                ))}
              </div>
            </div>

            {/* Phase Tabs */}
            <div style={styles.phaseTabs}>
              {result.phases?.map((phase, i) => (
                <button
                  key={i}
                  style={activePhase === i
                    ? styles.phaseTabActive : styles.phaseTab}
                  onClick={() => setActivePhase(i)}
                >
                  Phase {phase.phase}
                </button>
              ))}
            </div>

            {/* Active Phase Content */}
            {result.phases && result.phases[activePhase] && (
              <div style={styles.phaseCard}>
                <div style={styles.phaseHeader}>
                  <div>
                    <h3 style={styles.phaseTitle}>
                      Phase {result.phases[activePhase].phase}:
                      {' '}{result.phases[activePhase].title}
                    </h3>
                    <span style={styles.phaseDuration}>
                      ⏱️ {result.phases[activePhase].duration}
                    </span>
                  </div>
                  <div style={styles.phaseGoal}>
                    <p style={styles.phaseGoalTitle}>🎯 Goal:</p>
                    <p style={styles.phaseGoalText}>
                      {result.phases[activePhase].goal}
                    </p>
                  </div>
                </div>

                {/* Skills */}
                <div style={styles.section}>
                  <h4 style={styles.sectionLabel}>
                    🛠️ Skills to Learn:
                  </h4>
                  <div style={styles.skillsContainer}>
                    {result.phases[activePhase].skills?.map((skill, i) => (
                      <span key={i} style={styles.skill}>{skill}</span>
                    ))}
                  </div>
                </div>

                {/* Resources */}
                <div style={styles.section}>
                  <h4 style={styles.sectionLabel}>
                    📚 Learning Resources:
                  </h4>
                  <div style={styles.resources}>
                    {result.phases[activePhase].resources?.map((res, i) => (
                      <div key={i} style={styles.resourceCard}>
                        <div style={styles.resourceInfo}>
                          <span style={styles.resourceName}>{res.name}</span>
                          <span style={styles.resourceType}>{res.type}</span>
                        </div>
                        <div style={styles.resourceMeta}>
                          <span style={{
                            ...styles.freeBadge,
                            background: res.free ? '#2ecc71' : '#e74c3c'
                          }}>
                            {res.free ? '✅ Free' : '💰 Paid'}
                          </span>
                          <span style={styles.resourceUrl}>
                            {res.url}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div style={styles.section}>
                  <h4 style={styles.sectionLabel}>
                    🚀 Projects to Build:
                  </h4>
                  {result.phases[activePhase].projects?.map((project, i) => (
                    <div key={i} style={styles.projectCard}>
                      <span style={styles.projectNum}>{i + 1}</span>
                      <span style={styles.projectName}>{project}</span>
                    </div>
                  ))}
                </div>

                {/* Navigation */}
                <div style={styles.phaseNav}>
                  <button
                    style={activePhase === 0
                      ? styles.navBtnDisabled : styles.navBtn}
                    onClick={() => setActivePhase(activePhase - 1)}
                    disabled={activePhase === 0}
                  >
                    ← Previous Phase
                  </button>
                  <button
                    style={activePhase === result.phases.length - 1
                      ? styles.navBtnDisabled : styles.navBtn}
                    onClick={() => setActivePhase(activePhase + 1)}
                    disabled={activePhase === result.phases.length - 1}
                  >
                    Next Phase →
                  </button>
                </div>
              </div>
            )}

            {/* Interview Prep */}
            <div style={styles.interviewCard}>
              <h3 style={styles.interviewTitle}>
                🎯 Interview Preparation Tips
              </h3>
              {result.interviewPrep?.map((tip, i) => (
                <div key={i} style={styles.tipCard}>
                  <span style={styles.tipNum}>{i + 1}</span>
                  <span style={styles.tipText}>{tip}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={styles.actions}>
              <button
                style={styles.btn}
                onClick={() => navigate('/skill-assessment')}
              >
                🎯 Test Your Skills Now
              </button>
              <button
                style={styles.btnOutline}
                onClick={() => {
                  setStep('setup')
                  setResult(null)
                  setFormData({
                    targetRole: '',
                    currentSkills: '',
                    timeframe: '3 months'
                  })
                }}
              >
                🔄 Generate New Path
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', background: '#f8f9ff' },
  hero: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px', textAlign: 'center', color: 'white'
  },
  heroTitle: { fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' },
  heroSubtitle: { fontSize: '16px', opacity: 0.9 },
  content: { maxWidth: '900px', margin: '0 auto', padding: '40px 20px' },
  setupCard: {
    background: 'white', borderRadius: '16px',
    padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
  },
  sectionTitle: {
    fontSize: '22px', fontWeight: '700',
    color: '#333', marginBottom: '24px'
  },
  roleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '12px', marginBottom: '24px'
  },
  role: {
    padding: '12px 16px', border: '2px solid #e1e1e1',
    borderRadius: '10px', cursor: 'pointer',
    fontSize: '13px', fontWeight: '500',
    color: '#555', textAlign: 'center'
  },
  roleActive: {
    padding: '12px 16px', border: '2px solid #667eea',
    borderRadius: '10px', cursor: 'pointer',
    fontSize: '13px', fontWeight: '600',
    color: '#667eea', textAlign: 'center', background: '#f0f0ff'
  },
  inputGroup: { marginBottom: '24px' },
  label: {
    display: 'block', fontWeight: '600',
    color: '#444', marginBottom: '10px', fontSize: '15px'
  },
  input: {
    width: '100%', padding: '12px 16px',
    border: '2px solid #e1e1e1', borderRadius: '10px',
    fontSize: '15px', outline: 'none', boxSizing: 'border-box'
  },
  hint: { fontSize: '13px', color: '#888', marginTop: '6px' },
  timeGrid: {
    display: 'flex', gap: '12px', flexWrap: 'wrap'
  },
  time: {
    padding: '10px 20px', border: '2px solid #e1e1e1',
    borderRadius: '10px', cursor: 'pointer',
    fontSize: '14px', fontWeight: '500', color: '#666'
  },
  timeActive: {
    padding: '10px 20px', border: '2px solid #667eea',
    borderRadius: '10px', cursor: 'pointer',
    fontSize: '14px', fontWeight: '600',
    color: '#667eea', background: '#f0f0ff'
  },
  btn: {
    width: '100%', padding: '16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white', border: 'none', borderRadius: '12px',
    fontSize: '16px', fontWeight: '600', cursor: 'pointer'
  },
  btnDisabled: {
    width: '100%', padding: '16px', background: '#ccc',
    color: 'white', border: 'none', borderRadius: '12px',
    fontSize: '16px', cursor: 'not-allowed'
  },
  btnOutline: {
    width: '100%', padding: '16px', background: 'white',
    color: '#667eea', border: '2px solid #667eea',
    borderRadius: '12px', fontSize: '16px',
    fontWeight: '600', cursor: 'pointer', marginTop: '12px'
  },
  error: {
    background: '#ffe0e0', color: '#d00',
    padding: '12px', borderRadius: '8px',
    marginBottom: '16px', textAlign: 'center'
  },
  resultHeader: {
    background: 'white', borderRadius: '16px',
    padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    marginBottom: '24px'
  },
  resultInfo: { marginBottom: '20px' },
  resultTitle: {
    fontSize: '26px', fontWeight: '700',
    color: '#333', marginBottom: '8px'
  },
  resultOverview: {
    fontSize: '15px', color: '#666',
    lineHeight: '1.6', marginBottom: '16px'
  },
  resultMeta: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  metaTag: {
    padding: '6px 14px', background: '#f0f0ff',
    color: '#667eea', borderRadius: '20px',
    fontSize: '13px', fontWeight: '600'
  },
  jobTitles: { borderTop: '1px solid #f0f0f0', paddingTop: '16px' },
  jobTitlesLabel: {
    fontSize: '14px', fontWeight: '600',
    color: '#444', marginBottom: '10px'
  },
  jobTitle: {
    display: 'inline-block', padding: '6px 14px',
    background: '#f8f9ff', border: '1px solid #e1e1e1',
    borderRadius: '8px', fontSize: '13px',
    color: '#555', marginRight: '8px', marginBottom: '8px'
  },
  phaseTabs: {
    display: 'flex', gap: '8px',
    marginBottom: '16px', flexWrap: 'wrap'
  },
  phaseTab: {
    padding: '10px 20px', border: '2px solid #e1e1e1',
    borderRadius: '10px', cursor: 'pointer',
    fontSize: '14px', fontWeight: '500',
    color: '#666', background: 'white'
  },
  phaseTabActive: {
    padding: '10px 20px', border: '2px solid #667eea',
    borderRadius: '10px', cursor: 'pointer',
    fontSize: '14px', fontWeight: '600',
    color: '#667eea', background: '#f0f0ff'
  },
  phaseCard: {
    background: 'white', borderRadius: '16px',
    padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    marginBottom: '24px'
  },
  phaseHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '24px',
    flexWrap: 'wrap', gap: '16px'
  },
  phaseTitle: {
    fontSize: '20px', fontWeight: '700',
    color: '#333', marginBottom: '6px'
  },
  phaseDuration: {
    fontSize: '14px', color: '#888', fontWeight: '500'
  },
  phaseGoal: {
    background: '#f0f0ff', padding: '16px',
    borderRadius: '10px', maxWidth: '300px'
  },
  phaseGoalTitle: {
    fontSize: '13px', fontWeight: '700',
    color: '#667eea', marginBottom: '6px'
  },
  phaseGoalText: { fontSize: '13px', color: '#555', lineHeight: '1.5' },
  section: { marginBottom: '24px' },
  sectionLabel: {
    fontSize: '16px', fontWeight: '700',
    color: '#333', marginBottom: '12px'
  },
  skillsContainer: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  skill: {
    padding: '6px 14px', background: '#f0f0ff',
    color: '#667eea', borderRadius: '8px',
    fontSize: '13px', fontWeight: '500'
  },
  resources: { display: 'flex', flexDirection: 'column', gap: '10px' },
  resourceCard: {
    background: '#f8f9ff', borderRadius: '10px',
    padding: '14px 16px', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center',
    flexWrap: 'wrap', gap: '8px'
  },
  resourceInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
  resourceName: { fontSize: '14px', fontWeight: '600', color: '#333' },
  resourceType: {
    fontSize: '12px', color: '#888',
    background: '#e1e1e1', padding: '2px 8px',
    borderRadius: '4px'
  },
  resourceMeta: { display: 'flex', alignItems: 'center', gap: '8px' },
  freeBadge: {
    padding: '3px 10px', borderRadius: '20px',
    color: 'white', fontSize: '11px', fontWeight: '600'
  },
  resourceUrl: { fontSize: '12px', color: '#888' },
  projectCard: {
    display: 'flex', alignItems: 'center',
    gap: '12px', padding: '12px 16px',
    background: '#f8f9ff', borderRadius: '10px',
    marginBottom: '8px'
  },
  projectNum: {
    width: '28px', height: '28px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white', borderRadius: '50%',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '13px',
    fontWeight: 'bold', flexShrink: 0
  },
  projectName: { fontSize: '14px', color: '#444', fontWeight: '500' },
  phaseNav: {
    display: 'flex', justifyContent: 'space-between',
    marginTop: '24px', paddingTop: '20px',
    borderTop: '1px solid #f0f0f0'
  },
  navBtn: {
    padding: '10px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white', border: 'none', borderRadius: '8px',
    cursor: 'pointer', fontWeight: '600', fontSize: '14px'
  },
  navBtnDisabled: {
    padding: '10px 24px', background: '#e1e1e1',
    color: '#aaa', border: 'none', borderRadius: '8px',
    cursor: 'not-allowed', fontWeight: '600', fontSize: '14px'
  },
  interviewCard: {
    background: 'white', borderRadius: '16px',
    padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    marginBottom: '24px'
  },
  interviewTitle: {
    fontSize: '20px', fontWeight: '700',
    color: '#333', marginBottom: '16px'
  },
  tipCard: {
    display: 'flex', alignItems: 'flex-start',
    gap: '12px', padding: '12px',
    background: '#f8f9ff', borderRadius: '10px',
    marginBottom: '10px'
  },
  tipNum: {
    width: '28px', height: '28px',
    background: '#667eea', color: 'white',
    borderRadius: '50%', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: '13px', fontWeight: 'bold', flexShrink: 0
  },
  tipText: { fontSize: '14px', color: '#444', lineHeight: '1.6' },
  actions: {
    display: 'flex', flexDirection: 'column',
    gap: '12px', marginTop: '8px'
  }
}

export default LearningPath