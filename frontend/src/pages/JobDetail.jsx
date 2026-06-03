import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getJobById, applyJob } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

function JobDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [applyForm, setApplyForm] = useState({
    resume: '',
    coverLetter: ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchJob()
  }, [id])

  const fetchJob = async () => {
    try {
      const { data } = await getJobById(id)
      setJob(data)
      if (user && data.applicants?.includes(user._id)) {
        setApplied(true)
      }
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleApply = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }
    if (!applyForm.resume) {
      setError('Please add your resume link!')
      return
    }
    setApplying(true)
    setError('')
    try {
      await applyJob(id, applyForm)
      setApplied(true)
      setShowApplyForm(false)
      alert('Application submitted successfully! 🎉')
    } catch (err) {
      setError(err.response?.data?.message || 'Application failed!')
    }
    setApplying(false)
  }

  if (loading) return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.loading}>Loading job details... ⏳</div>
    </div>
  )

  if (!job) return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.loading}>Job not found! 😔</div>
    </div>
  )

  return (
    <div style={styles.container}>
      <Navbar />

      <div style={styles.content}>
        {/* Back Button */}
        <button
          style={styles.backBtn}
          onClick={() => navigate('/jobs')}
        >
          ← Back to Jobs
        </button>

        <div style={styles.grid}>
          {/* Left Side - Job Details */}
          <div style={styles.mainContent}>

            {/* Job Header */}
            <div style={styles.jobHeader}>
              <div style={styles.companyLogo}>
                {job.company?.name?.charAt(0) || 'C'}
              </div>
              <div>
                <h1 style={styles.jobTitle}>{job.title}</h1>
                <p style={styles.companyName}>
                  {job.company?.company?.companyName || job.company?.name}
                </p>
              </div>
            </div>

            {/* Job Tags */}
            <div style={styles.tags}>
              <span style={styles.tag}>📍 {job.location}</span>
              <span style={styles.tag}>💼 {job.jobType}</span>
              <span style={styles.tag}>🎯 {job.experience}</span>
              <span style={styles.tag}>
                💰 {job.salary?.min && job.salary?.max
                  ? `₹${job.salary.min/1000}K - ₹${job.salary.max/1000}K`
                  : 'Not disclosed'}
              </span>
            </div>

            {/* Description */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Job Description</h2>
              <p style={styles.description}>{job.description}</p>
            </div>

            {/* Skills */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Required Skills</h2>
              <div style={styles.skillsContainer}>
                {job.skills?.map((skill, i) => (
                  <span key={i} style={styles.skill}>{skill}</span>
                ))}
              </div>
            </div>

            {/* Apply Form */}
            {showApplyForm && (
              <div style={styles.applyForm}>
                <h2 style={styles.sectionTitle}>Apply for this Job</h2>
                {error && <div style={styles.error}>{error}</div>}
                <form onSubmit={handleApply}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      📄 Resume Link (Google Drive / GitHub)
                    </label>
                    <input
                      style={styles.input}
                      type="text"
                      placeholder="https://drive.google.com/your-resume"
                      value={applyForm.resume}
                      onChange={e => setApplyForm({
                        ...applyForm, resume: e.target.value
                      })}
                      required
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      ✉️ Cover Letter (Optional)
                    </label>
                    <textarea
                      style={styles.textarea}
                      placeholder="Write a brief cover letter..."
                      value={applyForm.coverLetter}
                      onChange={e => setApplyForm({
                        ...applyForm, coverLetter: e.target.value
                      })}
                      rows={5}
                    />
                  </div>
                  <div style={styles.formButtons}>
                    <button
                      type="submit"
                      style={applying ? styles.btnDisabled : styles.btn}
                      disabled={applying}
                    >
                      {applying ? 'Submitting...' : '🚀 Submit Application'}
                    </button>
                    <button
                      type="button"
                      style={styles.btnOutline}
                      onClick={() => setShowApplyForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Right Side - Apply Card */}
          <div style={styles.sidebar}>
            <div style={styles.applyCard}>
              <h3 style={styles.applyTitle}>Ready to Apply?</h3>
              <p style={styles.applyDesc}>
                {job.applicants?.length || 0} people have already applied
              </p>

              {!user ? (
                <button
                  style={styles.btn}
                  onClick={() => navigate('/login')}
                >
                  Login to Apply →
                </button>
              ) : applied ? (
                <button style={styles.appliedBtn} disabled>
                  ✅ Already Applied
                </button>
              ) : user.role === 'student' ? (
                <button
                  style={styles.btn}
                  onClick={() => setShowApplyForm(!showApplyForm)}
                >
                  {showApplyForm ? 'Cancel' : '🚀 Apply Now'}
                </button>
              ) : (
                <p style={styles.companyNote}>
                  Companies cannot apply for jobs
                </p>
              )}

              {/* AI Tools */}
              {user && user.role === 'student' && !applied && (
                <div style={styles.aiTools}>
                  <p style={styles.aiTitle}>🤖 Prepare Better</p>
                  <button
                    style={styles.aiBtn}
                    onClick={() => navigate('/ai-analyzer')}
                  >
                    📄 Analyze Resume
                  </button>
                  <button
                    style={styles.aiBtn}
                    onClick={() => navigate('/ai-cover-letter')}
                  >
                    ✉️ Generate Cover Letter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', background: '#f8f9ff' },
  loading: { textAlign: 'center', padding: '60px', fontSize: '18px', color: '#888' },
  content: { maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' },
  backBtn: {
    background: 'none', border: 'none', color: '#667eea',
    fontSize: '15px', cursor: 'pointer', fontWeight: '600',
    marginBottom: '24px', padding: '0'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 320px',
    gap: '24px',
    alignItems: 'start'
  },
  mainContent: {
    background: 'white', borderRadius: '16px',
    padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
  },
  jobHeader: {
    display: 'flex', alignItems: 'center',
    gap: '16px', marginBottom: '20px'
  },
  companyLogo: {
    width: '60px', height: '60px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '14px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', color: 'white',
    fontSize: '24px', fontWeight: 'bold'
  },
  jobTitle: { fontSize: '24px', fontWeight: '700', color: '#333', marginBottom: '4px' },
  companyName: { fontSize: '16px', color: '#888' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' },
  tag: {
    padding: '8px 16px', background: '#f5f5f5',
    borderRadius: '8px', fontSize: '14px', color: '#555'
  },
  section: { marginBottom: '28px' },
  sectionTitle: {
    fontSize: '18px', fontWeight: '700',
    color: '#333', marginBottom: '12px'
  },
  description: { fontSize: '15px', color: '#555', lineHeight: '1.8' },
  skillsContainer: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  skill: {
    padding: '6px 14px', background: '#f0f0ff',
    color: '#667eea', borderRadius: '8px',
    fontSize: '13px', fontWeight: '500'
  },
  applyForm: {
    borderTop: '2px solid #f0f0f0',
    paddingTop: '24px', marginTop: '24px'
  },
  formGroup: { marginBottom: '20px' },
  label: {
    display: 'block', fontWeight: '600',
    color: '#444', marginBottom: '8px', fontSize: '14px'
  },
  input: {
    width: '100%', padding: '12px 16px',
    border: '2px solid #e1e1e1', borderRadius: '10px',
    fontSize: '15px', outline: 'none', boxSizing: 'border-box'
  },
  textarea: {
    width: '100%', padding: '12px 16px',
    border: '2px solid #e1e1e1', borderRadius: '10px',
    fontSize: '14px', outline: 'none', resize: 'vertical',
    boxSizing: 'border-box', fontFamily: 'inherit'
  },
  formButtons: { display: 'flex', gap: '12px' },
  btn: {
    flex: 1, padding: '14px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white', border: 'none', borderRadius: '10px',
    fontSize: '15px', fontWeight: '600', cursor: 'pointer'
  },
  btnOutline: {
    flex: 1, padding: '14px', background: 'white',
    color: '#667eea', border: '2px solid #667eea',
    borderRadius: '10px', fontSize: '15px',
    fontWeight: '600', cursor: 'pointer'
  },
  btnDisabled: {
    flex: 1, padding: '14px', background: '#ccc',
    color: 'white', border: 'none', borderRadius: '10px',
    fontSize: '15px', cursor: 'not-allowed'
  },
  error: {
    background: '#ffe0e0', color: '#d00',
    padding: '12px', borderRadius: '8px',
    marginBottom: '16px', textAlign: 'center'
  },
  sidebar: { position: 'sticky', top: '20px' },
  applyCard: {
    background: 'white', borderRadius: '16px',
    padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
  },
  applyTitle: { fontSize: '18px', fontWeight: '700', color: '#333', marginBottom: '8px' },
  applyDesc: { fontSize: '14px', color: '#888', marginBottom: '20px' },
  appliedBtn: {
    width: '100%', padding: '14px', background: '#2ecc71',
    color: 'white', border: 'none', borderRadius: '10px',
    fontSize: '15px', fontWeight: '600', cursor: 'not-allowed'
  },
  companyNote: { color: '#888', fontSize: '14px', textAlign: 'center' },
  aiTools: { marginTop: '20px', borderTop: '1px solid #f0f0f0', paddingTop: '20px' },
  aiTitle: { fontSize: '14px', fontWeight: '600', color: '#444', marginBottom: '12px' },
  aiBtn: {
    width: '100%', padding: '10px', background: '#f0f0ff',
    color: '#667eea', border: '1px solid #667eea',
    borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
    fontWeight: '600', marginBottom: '8px'
  }
}

export default JobDetail