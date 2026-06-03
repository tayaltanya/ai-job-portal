import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getAllJobs, createJob, deleteJob, getJobApplications, updateApplicationStatus } from '../services/api'
import Navbar from '../components/Navbar'

function CompanyDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [showJobForm, setShowJobForm] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    location: '',
    jobType: 'full-time',
    skills: '',
    experience: 'fresher',
    salary: { min: '', max: '' }
  })

  useEffect(() => {
    if (!user || user.role !== 'company') {
      navigate('/login')
      return
    }
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const { data } = await getAllJobs()
      const myJobs = data.filter(job =>
        job.company?._id === user._id ||
        job.company === user._id
      )
      setJobs(myJobs)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const fetchApplications = async (jobId) => {
    try {
      const { data } = await getJobApplications(jobId)
      setApplications(data)
      setSelectedJob(jobId)
      setActiveTab('applications')
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreateJob = async (e) => {
    e.preventDefault()
    try {
      const jobData = {
        ...jobForm,
        skills: jobForm.skills.split(',').map(s => s.trim()),
        salary: {
          min: Number(jobForm.salary.min),
          max: Number(jobForm.salary.max)
        }
      }
      await createJob(jobData)
      setShowJobForm(false)
      setJobForm({
        title: '', description: '', location: '',
        jobType: 'full-time', skills: '',
        experience: 'fresher', salary: { min: '', max: '' }
      })
      fetchJobs()
      alert('Job posted successfully!')
    } catch (err) {
      alert('Failed to post job!')
    }
  }

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteJob(jobId)
        fetchJobs()
        alert('Job deleted!')
      } catch (err) {
        alert('Failed to delete job!')
      }
    }
  }

  const handleUpdateStatus = async (appId, status) => {
    try {
      await updateApplicationStatus(appId, { status })
      fetchApplications(selectedJob)
    } catch (err) {
      alert('Failed to update status!')
    }
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
              {user?.company?.companyName || user?.name} 🏢
            </h1>
            <p style={styles.emailText}>{user?.email}</p>
          </div>
        </div>
        <div style={styles.stats}>
          <div style={styles.stat}>
            <span style={styles.statNumber}>{jobs.length}</span>
            <span style={styles.statLabel}>Jobs Posted</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statNumber}>
              {jobs.reduce((acc, job) => acc + (job.applicants?.length || 0), 0)}
            </span>
            <span style={styles.statLabel}>Total Applicants</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {['overview', 'jobs', 'applications'].map(tab => (
          <button
            key={tab}
            style={activeTab === tab ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'overview' && '📊 Overview'}
            {tab === 'jobs' && '💼 My Jobs'}
            {tab === 'applications' && '👥 Applications'}
          </button>
        ))}
      </div>

      <div style={styles.content}>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={styles.grid}>
            <div style={styles.card} onClick={() => setActiveTab('jobs')}>
              <div style={styles.cardIcon}>💼</div>
              <h3 style={styles.cardTitle}>Manage Jobs</h3>
              <p style={styles.cardDesc}>Post new jobs and manage existing ones</p>
              <button style={styles.cardBtn}>View Jobs →</button>
            </div>
            <div style={styles.card} onClick={() => setActiveTab('applications')}>
              <div style={styles.cardIcon}>👥</div>
              <h3 style={styles.cardTitle}>Applications</h3>
              <p style={styles.cardDesc}>Review and manage job applications</p>
              <button style={styles.cardBtn}>View Applications →</button>
            </div>
            <div style={styles.card} onClick={() => setShowJobForm(true)}>
              <div style={styles.cardIcon}>➕</div>
              <h3 style={styles.cardTitle}>Post New Job</h3>
              <p style={styles.cardDesc}>Create a new job listing</p>
              <button style={styles.cardBtn}>Post Job →</button>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div>
            <div style={styles.jobsHeader}>
              <h2 style={styles.sectionTitle}>My Job Listings</h2>
              <button
                style={styles.postBtn}
                onClick={() => setShowJobForm(!showJobForm)}
              >
                {showJobForm ? '✕ Cancel' : '➕ Post New Job'}
              </button>
            </div>

            {/* Job Form */}
            {showJobForm && (
              <div style={styles.formCard}>
                <h3 style={styles.formTitle}>Post New Job</h3>
                <form onSubmit={handleCreateJob}>
                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Job Title</label>
                      <input
                        style={styles.input}
                        placeholder="e.g. React Developer"
                        value={jobForm.title}
                        onChange={e => setJobForm({...jobForm, title: e.target.value})}
                        required
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Location</label>
                      <input
                        style={styles.input}
                        placeholder="e.g. Mumbai, Remote"
                        value={jobForm.location}
                        onChange={e => setJobForm({...jobForm, location: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Description</label>
                    <textarea
                      style={styles.textarea}
                      placeholder="Job description..."
                      value={jobForm.description}
                      onChange={e => setJobForm({...jobForm, description: e.target.value})}
                      rows={4}
                      required
                    />
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Job Type</label>
                      <select
                        style={styles.input}
                        value={jobForm.jobType}
                        onChange={e => setJobForm({...jobForm, jobType: e.target.value})}
                      >
                        <option value="full-time">Full Time</option>
                        <option value="part-time">Part Time</option>
                        <option value="internship">Internship</option>
                        <option value="remote">Remote</option>
                      </select>
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Experience</label>
                      <select
                        style={styles.input}
                        value={jobForm.experience}
                        onChange={e => setJobForm({...jobForm, experience: e.target.value})}
                      >
                        <option value="fresher">Fresher</option>
                        <option value="1-2 years">1-2 Years</option>
                        <option value="2-5 years">2-5 Years</option>
                        <option value="5+ years">5+ Years</option>
                      </select>
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Skills (comma separated)</label>
                    <input
                      style={styles.input}
                      placeholder="e.g. React, Node.js, MongoDB"
                      value={jobForm.skills}
                      onChange={e => setJobForm({...jobForm, skills: e.target.value})}
                      required
                    />
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Min Salary (INR)</label>
                      <input
                        style={styles.input}
                        type="number"
                        placeholder="e.g. 300000"
                        value={jobForm.salary.min}
                        onChange={e => setJobForm({...jobForm, salary: {...jobForm.salary, min: e.target.value}})}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Max Salary (INR)</label>
                      <input
                        style={styles.input}
                        type="number"
                        placeholder="e.g. 600000"
                        value={jobForm.salary.max}
                        onChange={e => setJobForm({...jobForm, salary: {...jobForm.salary, max: e.target.value}})}
                      />
                    </div>
                  </div>

                  <button type="submit" style={styles.submitBtn}>
                    🚀 Post Job
                  </button>
                </form>
              </div>
            )}

            {/* Jobs List */}
            {loading ? (
              <p style={styles.loading}>Loading... ⏳</p>
            ) : jobs.length === 0 ? (
              <div style={styles.empty}>
                <p>No jobs posted yet!</p>
                <button
                  style={styles.postBtn}
                  onClick={() => setShowJobForm(true)}
                >
                  Post Your First Job →
                </button>
              </div>
            ) : (
              <div style={styles.jobsList}>
                {jobs.map(job => (
                  <div key={job._id} style={styles.jobCard}>
                    <div style={styles.jobHeader}>
                      <div>
                        <h3 style={styles.jobTitle}>{job.title}</h3>
                        <p style={styles.jobMeta}>
                          📍 {job.location} • 💼 {job.jobType} • 🎯 {job.experience}
                        </p>
                      </div>
                      <div style={styles.jobActions}>
                        <button
                          style={styles.viewBtn}
                          onClick={() => fetchApplications(job._id)}
                        >
                          👥 {job.applicants?.length || 0} Applicants
                        </button>
                        <button
                          style={styles.deleteBtn}
                          onClick={() => handleDeleteJob(job._id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                    <div style={styles.skillsContainer}>
                      {job.skills?.map((skill, i) => (
                        <span key={i} style={styles.skill}>{skill}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div>
            <h2 style={styles.sectionTitle}>
              {selectedJob ? 'Job Applications' : 'Select a job to view applications'}
            </h2>
            {applications.length === 0 ? (
              <div style={styles.empty}>
                <p>No applications yet!</p>
                <p>Click "Applicants" on any job to view applications</p>
              </div>
            ) : (
              <div style={styles.appList}>
                {applications.map(app => (
                  <div key={app._id} style={styles.appCard}>
                    <div style={styles.appHeader}>
                      <div>
                        <h3 style={styles.appName}>
                          {app.applicant?.name || 'Applicant'}
                        </h3>
                        <p style={styles.appEmail}>
                          {app.applicant?.email}
                        </p>
                      </div>
                      <span style={{
                        ...styles.status,
                        background: getStatusColor(app.status)
                      }}>
                        {app.status?.toUpperCase()}
                      </span>
                    </div>

                    {app.coverLetter && (
                      <p style={styles.coverLetter}>
                        "{app.coverLetter.substring(0, 100)}..."
                      </p>
                    )}

                    <div style={styles.statusButtons}>
                      {['reviewed', 'shortlisted', 'rejected', 'selected'].map(s => (
                        <button
                          key={s}
                          style={{
                            ...styles.statusBtn,
                            background: getStatusColor(s),
                            opacity: app.status === s ? 1 : 0.6
                          }}
                          onClick={() => handleUpdateStatus(app._id, s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: { minHeight: '100vh', background: '#f8f9ff' },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px'
  },
  headerContent: { display: 'flex', alignItems: 'center', gap: '20px' },
  avatar: {
    width: '60px', height: '60px',
    background: 'rgba(255,255,255,0.3)',
    borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '24px', fontWeight: 'bold', color: 'white'
  },
  welcomeText: { color: 'white', fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' },
  emailText: { color: 'rgba(255,255,255,0.8)', fontSize: '14px' },
  stats: { display: 'flex', gap: '24px' },
  stat: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    background: 'rgba(255,255,255,0.15)', padding: '16px 24px', borderRadius: '12px'
  },
  statNumber: { color: 'white', fontSize: '28px', fontWeight: 'bold' },
  statLabel: { color: 'rgba(255,255,255,0.8)', fontSize: '12px' },
  tabs: {
    display: 'flex', gap: '8px', padding: '24px 40px 0',
    borderBottom: '2px solid #e1e1e1', background: 'white'
  },
  tab: {
    padding: '12px 24px', border: 'none', background: 'transparent',
    cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: '#888',
    borderBottom: '2px solid transparent', marginBottom: '-2px'
  },
  tabActive: {
    padding: '12px 24px', border: 'none', background: 'transparent',
    cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#667eea',
    borderBottom: '2px solid #667eea', marginBottom: '-2px'
  },
  content: { padding: '40px' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px'
  },
  card: {
    background: 'white', borderRadius: '16px', padding: '28px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)', cursor: 'pointer', textAlign: 'center'
  },
  cardIcon: { fontSize: '40px', marginBottom: '16px' },
  cardTitle: { fontSize: '18px', fontWeight: '700', color: '#333', marginBottom: '8px' },
  cardDesc: { fontSize: '14px', color: '#888', marginBottom: '20px', lineHeight: '1.6' },
  cardBtn: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white', border: 'none', padding: '10px 24px',
    borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px'
  },
  jobsHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '24px'
  },
  sectionTitle: { fontSize: '22px', fontWeight: '700', color: '#333' },
  postBtn: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white', border: 'none', padding: '12px 24px',
    borderRadius: '8px', cursor: 'pointer', fontWeight: '600'
  },
  formCard: {
    background: 'white', borderRadius: '16px', padding: '32px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '24px'
  },
  formTitle: { fontSize: '20px', fontWeight: '700', color: '#333', marginBottom: '24px' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  formGroup: { marginBottom: '20px' },
  label: { display: 'block', fontWeight: '600', color: '#444', marginBottom: '6px', fontSize: '14px' },
  input: {
    width: '100%', padding: '12px 16px', border: '2px solid #e1e1e1',
    borderRadius: '10px', fontSize: '15px', outline: 'none', boxSizing: 'border-box'
  },
  textarea: {
    width: '100%', padding: '12px 16px', border: '2px solid #e1e1e1',
    borderRadius: '10px', fontSize: '14px', outline: 'none',
    resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit'
  },
  submitBtn: {
    width: '100%', padding: '14px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white', border: 'none', borderRadius: '10px',
    fontSize: '16px', fontWeight: '600', cursor: 'pointer'
  },
  loading: { textAlign: 'center', color: '#888', padding: '40px' },
  empty: { textAlign: 'center', padding: '60px', color: '#888' },
  jobsList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  jobCard: {
    background: 'white', borderRadius: '12px', padding: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
  },
  jobHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  jobTitle: { fontSize: '16px', fontWeight: '700', color: '#333', marginBottom: '4px' },
  jobMeta: { fontSize: '13px', color: '#888' },
  jobActions: { display: 'flex', gap: '8px' },
  viewBtn: {
    background: '#667eea', color: 'white', border: 'none',
    padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px'
  },
  deleteBtn: {
    background: '#ff4757', color: 'white', border: 'none',
    padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px'
  },
  skillsContainer: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  skill: {
    padding: '4px 10px', background: '#f0f0ff', color: '#667eea',
    borderRadius: '6px', fontSize: '12px', fontWeight: '500'
  },
  appList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  appCard: {
    background: 'white', borderRadius: '12px', padding: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
  },
  appHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  appName: { fontSize: '16px', fontWeight: '700', color: '#333' },
  appEmail: { fontSize: '13px', color: '#888' },
  status: { padding: '4px 12px', borderRadius: '20px', color: 'white', fontSize: '12px', fontWeight: '600' },
  coverLetter: { fontSize: '13px', color: '#666', fontStyle: 'italic', marginBottom: '12px' },
  statusButtons: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  statusBtn: {
    color: 'white', border: 'none', padding: '6px 12px',
    borderRadius: '6px', cursor: 'pointer', fontSize: '12px',
    fontWeight: '600', textTransform: 'capitalize'
  }
}

export default CompanyDashboard