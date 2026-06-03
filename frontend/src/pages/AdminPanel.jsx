import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import Navbar from '../components/Navbar'

function AdminPanel() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0
  })
  const [users, setUsers] = useState([])
  const [jobs, setJobs] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
      return
    }
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('user'))?.token
      const headers = { Authorization: `Bearer ${token}` }

      const [usersRes, jobsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/auth/users', { headers }),
        axios.get('http://localhost:5000/api/jobs', { headers })
      ])

      setUsers(usersRes.data)
      setJobs(jobsRes.data)
      setStats({
        totalUsers: usersRes.data.length,
        totalJobs: jobsRes.data.length,
        totalApplications: jobsRes.data.reduce(
          (acc, job) => acc + (job.applicants?.length || 0), 0
        )
      })
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Delete this user?')) {
      try {
        const token = JSON.parse(localStorage.getItem('user'))?.token
        await axios.delete(
          `http://localhost:5000/api/auth/users/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        fetchData()
      } catch (err) {
        alert('Failed to delete user!')
      }
    }
  }

  return (
    <div style={styles.container}>
      <Navbar />

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Panel 👨‍💼</h1>
        <p style={styles.subtitle}>Manage your AI Job Portal</p>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>👥</div>
          <div style={styles.statNumber}>{stats.totalUsers}</div>
          <div style={styles.statLabel}>Total Users</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>💼</div>
          <div style={styles.statNumber}>{stats.totalJobs}</div>
          <div style={styles.statLabel}>Total Jobs</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📝</div>
          <div style={styles.statNumber}>{stats.totalApplications}</div>
          <div style={styles.statLabel}>Total Applications</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {['overview', 'users', 'jobs'].map(tab => (
          <button
            key={tab}
            style={activeTab === tab ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'overview' && '📊 Overview'}
            {tab === 'users' && '👥 Users'}
            {tab === 'jobs' && '💼 Jobs'}
          </button>
        ))}
      </div>

      <div style={styles.content}>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div style={styles.grid}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>👥 Recent Users</h3>
              {users.slice(0, 5).map(u => (
                <div key={u._id} style={styles.listItem}>
                  <div style={styles.listAvatar}>
                    {u.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={styles.listName}>{u.name}</p>
                    <p style={styles.listEmail}>{u.email}</p>
                  </div>
                  <span style={{
                    ...styles.roleBadge,
                    background: u.role === 'admin' ? '#e74c3c' :
                      u.role === 'company' ? '#3498db' : '#2ecc71'
                  }}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>💼 Recent Jobs</h3>
              {jobs.slice(0, 5).map(j => (
                <div key={j._id} style={styles.listItem}>
                  <div style={styles.listAvatar}>
                    {j.title?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={styles.listName}>{j.title}</p>
                    <p style={styles.listEmail}>{j.location}</p>
                  </div>
                  <span style={styles.roleBadge}>
                    {j.jobType}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 style={styles.sectionTitle}>All Users ({users.length})</h2>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Role</th>
                    <th style={styles.th}>Joined</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} style={styles.tableRow}>
                      <td style={styles.td}>{u.name}</td>
                      <td style={styles.td}>{u.email}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.roleBadge,
                          background: u.role === 'admin' ? '#e74c3c' :
                            u.role === 'company' ? '#3498db' : '#2ecc71'
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td style={styles.td}>
                        {u.role !== 'admin' && (
                          <button
                            style={styles.deleteBtn}
                            onClick={() => handleDeleteUser(u._id)}
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div>
            <h2 style={styles.sectionTitle}>All Jobs ({jobs.length})</h2>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.th}>Title</th>
                    <th style={styles.th}>Company</th>
                    <th style={styles.th}>Location</th>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Applicants</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(j => (
                    <tr key={j._id} style={styles.tableRow}>
                      <td style={styles.td}>{j.title}</td>
                      <td style={styles.td}>
                        {j.company?.company?.companyName || j.company?.name}
                      </td>
                      <td style={styles.td}>{j.location}</td>
                      <td style={styles.td}>
                        <span style={styles.roleBadge}>{j.jobType}</span>
                      </td>
                      <td style={styles.td}>
                        {j.applicants?.length || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
    padding: '40px', textAlign: 'center', color: 'white'
  },
  title: { fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' },
  subtitle: { fontSize: '16px', opacity: 0.9 },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px', padding: '40px 40px 0'
  },
  statCard: {
    background: 'white', borderRadius: '16px', padding: '24px',
    textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
  },
  statIcon: { fontSize: '36px', marginBottom: '8px' },
  statNumber: { fontSize: '36px', fontWeight: 'bold', color: '#667eea' },
  statLabel: { fontSize: '14px', color: '#888', marginTop: '4px' },
  tabs: {
    display: 'flex', gap: '8px', padding: '24px 40px 0',
    borderBottom: '2px solid #e1e1e1', background: 'white',
    marginTop: '24px'
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
    gridTemplateColumns: '1fr 1fr',
    gap: '24px'
  },
  card: {
    background: 'white', borderRadius: '16px', padding: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
  },
  cardTitle: { fontSize: '18px', fontWeight: '700', color: '#333', marginBottom: '16px' },
  listItem: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '10px 0', borderBottom: '1px solid #f0f0f0'
  },
  listAvatar: {
    width: '36px', height: '36px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '50%', display: 'flex', alignItems: 'center',
    justifyContent: 'center', color: 'white',
    fontSize: '14px', fontWeight: 'bold', flexShrink: 0
  },
  listName: { fontSize: '14px', fontWeight: '600', color: '#333' },
  listEmail: { fontSize: '12px', color: '#888' },
  roleBadge: {
    padding: '3px 10px', borderRadius: '20px',
    color: 'white', fontSize: '11px', fontWeight: '600',
    background: '#667eea', marginLeft: 'auto', flexShrink: 0
  },
  sectionTitle: { fontSize: '20px', fontWeight: '700', color: '#333', marginBottom: '20px' },
  tableContainer: {
    background: 'white', borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)', overflow: 'hidden'
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeader: { background: '#f8f9ff' },
  th: {
    padding: '14px 16px', textAlign: 'left',
    fontSize: '13px', fontWeight: '600', color: '#666'
  },
  tableRow: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#444' },
  deleteBtn: {
    background: '#ff4757', color: 'white', border: 'none',
    padding: '6px 12px', borderRadius: '6px',
    cursor: 'pointer', fontSize: '12px', fontWeight: '600'
  }
}

export default AdminPanel