import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllJobs } from '../services/api'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const { data } = await getAllJobs()
      setJobs(data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const filteredJobs = jobs.filter(job => {
    const matchSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || job.jobType === filter
    return matchSearch && matchFilter
  })

  return (
    <div style={styles.container}>
      <Navbar />

      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Find Your Dream Job 🚀
        </h1>
        <p style={styles.heroSubtitle}>
          AI powered job matching for freshers
        </p>

        {/* Search Bar */}
        <div style={styles.searchBar}>
          <input
            style={styles.searchInput}
            type="text"
            placeholder="Search jobs or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button style={styles.searchBtn}>Search</button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div style={styles.filters}>
        {['all', 'full-time', 'part-time', 'internship', 'remote'].map(f => (
          <button
            key={f}
            style={filter === f ? styles.filterActive : styles.filter}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Jobs Count */}
      <div style={styles.countContainer}>
        <p style={styles.count}>
          {filteredJobs.length} jobs found
        </p>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div style={styles.loading}>Loading jobs... ⏳</div>
      ) : filteredJobs.length === 0 ? (
        <div style={styles.noJobs}>
          <p>No jobs found 😔</p>
          <p>Try different search terms</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredJobs.map(job => (
            <div
              key={job._id}
              style={styles.card}
              onClick={() => navigate(`/jobs/${job._id}`)}
            >
              {/* Job Header */}
              <div style={styles.cardHeader}>
                <div style={styles.companyLogo}>
                  {job.company?.name?.charAt(0) || 'C'}
                </div>
                <div>
                  <h3 style={styles.jobTitle}>{job.title}</h3>
                  <p style={styles.companyName}>
                    {job.company?.company?.companyName || job.company?.name}
                  </p>
                </div>
              </div>

              {/* Job Details */}
              <div style={styles.cardDetails}>
                <span style={styles.tag}>📍 {job.location}</span>
                <span style={styles.tag}>💼 {job.jobType}</span>
                <span style={styles.tag}>🎯 {job.experience}</span>
              </div>

              {/* Skills */}
              <div style={styles.skills}>
                {job.skills?.slice(0, 3).map((skill, i) => (
                  <span key={i} style={styles.skill}>{skill}</span>
                ))}
              </div>

              {/* Salary & Apply */}
              <div style={styles.cardFooter}>
                <span style={styles.salary}>
                  {job.salary?.min && job.salary?.max
                    ? `₹${job.salary.min/1000}K - ₹${job.salary.max/1000}K`
                    : 'Salary not disclosed'}
                </span>
                <button style={styles.applyBtn}>
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
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
    padding: '60px 40px',
    textAlign: 'center',
    color: 'white'
  },
  heroTitle: {
    fontSize: '42px',
    fontWeight: 'bold',
    marginBottom: '12px'
  },
  heroSubtitle: {
    fontSize: '18px',
    opacity: 0.9,
    marginBottom: '32px'
  },
  searchBar: {
    display: 'flex',
    maxWidth: '600px',
    margin: '0 auto',
    gap: '12px'
  },
  searchInput: {
    flex: 1,
    padding: '16px 20px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '16px',
    outline: 'none'
  },
  searchBtn: {
    padding: '16px 32px',
    background: '#ff6b6b',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  filters: {
    display: 'flex',
    gap: '12px',
    padding: '24px 40px',
    flexWrap: 'wrap'
  },
  filter: {
    padding: '8px 20px',
    border: '2px solid #e1e1e1',
    borderRadius: '20px',
    background: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#555'
  },
  filterActive: {
    padding: '8px 20px',
    border: '2px solid #667eea',
    borderRadius: '20px',
    background: '#667eea',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: 'white'
  },
  countContainer: {
    padding: '0 40px 16px'
  },
  count: {
    color: '#888',
    fontSize: '14px'
  },
  loading: {
    textAlign: 'center',
    padding: '60px',
    fontSize: '18px',
    color: '#888'
  },
  noJobs: {
    textAlign: 'center',
    padding: '60px',
    color: '#888'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '24px',
    padding: '0 40px 40px'
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    border: '1px solid #f0f0f0'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px'
  },
  companyLogo: {
    width: '48px',
    height: '48px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold'
  },
  jobTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '4px'
  },
  companyName: {
    fontSize: '14px',
    color: '#888'
  },
  cardDetails: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '16px'
  },
  tag: {
    fontSize: '12px',
    color: '#666',
    background: '#f5f5f5',
    padding: '4px 10px',
    borderRadius: '6px'
  },
  skills: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '16px'
  },
  skill: {
    fontSize: '12px',
    color: '#667eea',
    background: '#f0f0ff',
    padding: '4px 10px',
    borderRadius: '6px',
    fontWeight: '500'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #f0f0f0',
    paddingTop: '16px'
  },
  salary: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#333'
  },
  applyBtn: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600'
  }
}

export default Jobs