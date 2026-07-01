import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMyApplications } from '../services/api'
import Navbar from '../components/Navbar'

function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const { data } = await getMyApplications()
      setApplications(data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f39c12'
      case 'reviewed': return '#3498db'
      case 'shortlisted': return '#2ecc71'
      case 'rejected': return '#e74c3c'
      case 'selected': return '#27ae60'
      default: return '#95a5a6'
    }
  }

  return (
    <div style={styles.container}>
      <Navbar />

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.avatar}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={styles.welcomeText}>
              Welcome back, {user?.name}! 👋
            </h1>
            <p style={styles.emailText}>{user?.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div style={styles.stats}>
          <div style={styles.stat}>
            <span style={styles.statNumber}>{applications.length}</span>
            <span style={styles.statLabel}>Applied</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statNumber}>
              {applications.filter(a => a.status === 'shortlisted').length}
            </span>
            <span style={styles.statLabel}>Shortlisted</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statNumber}>
              {applications.filter(a => a.status === 'selected').length}
            </span>
            <span style={styles.statLabel}>Selected</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {['overview', 'applications', 'ai-tools'].map(tab => (
          <button
            key={tab}
            style={activeTab === tab ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'overview' && '📊 Overview'}
            {tab === 'applications' && '📝 My Applications'}
            {tab === 'ai-tools' && '🤖 AI Tools'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={styles.content}>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={styles.grid}>
            <div style={styles.card} onClick={() => navigate('/jobs')}>
              <div style={styles.cardIcon}>🔍</div>
              <h3 style={styles.cardTitle}>Browse Jobs</h3>
              <p style={styles.cardDesc}>Find your dream job from 1000+ listings</p>
              <button style={styles.cardBtn}>Browse Now →</button>
            </div>

            <div style={styles.card} onClick={() => setActiveTab('ai-tools')}>
              <div style={styles.cardIcon}>🤖</div>
              <h3 style={styles.cardTitle}>AI Resume Analyzer</h3>
              <p style={styles.cardDesc}>Get AI feedback on your resume instantly</p>
              <button style={styles.cardBtn}>Analyze Now →</button>
            </div>
            <div style={styles.card} onClick={() => navigate('/skill-assessment')}>
              <div style={styles.cardIcon}>🎯</div>
              <h3 style={styles.cardTitle}>Skill Assessment</h3>
              <p style={styles.cardDesc}>Test your knowledge with AI quiz</p>
              <button style={styles.cardBtn}>Start Now →</button>
            </div>

            <div style={styles.card} onClick={() => setActiveTab('applications')}>
              <div style={styles.cardIcon}>📝</div>
              <h3 style={styles.cardTitle}>My Applications</h3>
              <p style={styles.cardDesc}>
                Track all {applications.length} applications
              </p>
              <button style={styles.cardBtn}>View All →</button>
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div>
            <h2 style={styles.sectionTitle}>My Applications</h2>
            {loading ? (
              <p style={styles.loading}>Loading... ⏳</p>
            ) : applications.length === 0 ? (
              <div style={styles.empty}>
                <p>No applications yet! 😔</p>
                <button
                  style={styles.applyBtn}
                  onClick={() => navigate('/jobs')}
                >
                  Browse Jobs →
                </button>
              </div>
            ) : (
              <div style={styles.appList}>
                {applications.map(app => (
                  <div key={app._id} style={styles.appCard}>
                    <div style={styles.appHeader}>
                      <div>
                        <h3 style={styles.appTitle}>
                          {app.job?.title || 'Job Title'}
                        </h3>
                        <p style={styles.appCompany}>
                          {app.job?.location || 'Location'}
                        </p>
                      </div>
                      <span style={{
                        ...styles.status,
                        background: getStatusColor(app.status)
                      }}>
                        {app.status?.toUpperCase()}
                      </span>
                    </div>
                    <p style={styles.appDate}>
                      Applied: {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI Tools Tab */}
        {activeTab === 'ai-tools' && (
          <div>
            <h2 style={styles.sectionTitle}>AI Powered Tools 🤖</h2>
            <div style={styles.grid}>
              <div style={styles.aiCard}>
                <div style={styles.cardIcon}>📄</div>
                <h3 style={styles.cardTitle}>Resume Analyzer</h3>
                <p style={styles.cardDesc}>
                  Paste your resume and job description to get AI score and feedback
                </p>
                <button
                  style={styles.aiBtn}
                  onClick={() => navigate('/ai-analyzer')}
                >
                  Try Now →
                </button>
              </div>

              <div style={styles.aiCard}>
                <div style={styles.cardIcon}>💡</div>
                <h3 style={styles.cardTitle}>Job Suggester</h3>
                <p style={styles.cardDesc}>
                  Get AI powered job role suggestions based on your skills
                </p>
                <button
                  style={styles.aiBtn}
                  onClick={() => navigate('/ai-suggester')}
                >
                  Try Now →
                </button>
              </div>
              <div style={styles.aiCard}>
                <div style={styles.cardIcon}>🎯</div>
                <h3 style={styles.cardTitle}>Skill Assessment</h3>
                <p style={styles.cardDesc}>
                  Test your skills with AI generated MCQ quiz on any topic
                </p>
                <button
                  style={styles.aiBtn}
                  onClick={() => navigate('/skill-assessment')}
                >
                  Start Quiz →
                </button>
              </div>
              <div style={styles.aiCard}>
                <div style={styles.cardIcon}>🗺️</div>
                <h3 style={styles.cardTitle}>Learning Path</h3>
                <p style={styles.cardDesc}>
                  Get AI personalized roadmap to land your dream job!
                </p>
                <button
                  style={styles.aiBtn}
                  onClick={() => navigate('/learning-path')}
                >
                  Generate Path →
                </button>
              </div>

              <div style={styles.aiCard}>
                <div style={styles.cardIcon}>✉️</div>
                <h3 style={styles.cardTitle}>Cover Letter Generator</h3>
                <p style={styles.cardDesc}>
                  Generate professional cover letters with AI in seconds
                </p>
                <button
                  style={styles.aiBtn}
                  onClick={() => navigate('/ai-cover-letter')}
                >
                  Try Now →
                </button>
              </div>
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
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px'
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  avatar: {
    width: '60px',
    height: '60px',
    background: 'rgba(255,255,255,0.3)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white'
  },
  welcomeText: {
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '4px'
  },
  emailText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '14px'
  },
  stats: {
    display: 'flex',
    gap: '24px'
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.15)',
    padding: '16px 24px',
    borderRadius: '12px'
  },
  statNumber: {
    color: 'white',
    fontSize: '28px',
    fontWeight: 'bold'
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '12px'
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    padding: '24px 40px 0',
    borderBottom: '2px solid #e1e1e1',
    background: 'white'
  },
  tab: {
    padding: '12px 24px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#888',
    borderBottom: '2px solid transparent',
    marginBottom: '-2px'
  },
  tabActive: {
    padding: '12px 24px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    color: '#667eea',
    borderBottom: '2px solid #667eea',
    marginBottom: '-2px'
  },
  content: {
    padding: '40px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px'
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '28px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    cursor: 'pointer',
    textAlign: 'center'
  },
  aiCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '28px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    textAlign: 'center'
  },
  cardIcon: {
    fontSize: '40px',
    marginBottom: '16px'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '8px'
  },
  cardDesc: {
    fontSize: '14px',
    color: '#888',
    marginBottom: '20px',
    lineHeight: '1.6'
  },
  cardBtn: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  },
  aiBtn: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '24px'
  },
  loading: {
    textAlign: 'center',
    color: '#888',
    padding: '40px'
  },
  empty: {
    textAlign: 'center',
    padding: '60px',
    color: '#888'
  },
  applyBtn: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    marginTop: '16px'
  },
  appList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  appCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
  },
  appHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  appTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#333'
  },
  appCompany: {
    fontSize: '14px',
    color: '#888'
  },
  status: {
    padding: '4px 12px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600'
  },
  appDate: {
    fontSize: '12px',
    color: '#aaa'
  }
}

export default Dashboard