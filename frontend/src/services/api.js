import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
})

// Add token to every request automatically
API.interceptors.request.use((req) => {
  const user = localStorage.getItem('user')
  if (user) {
    req.headers.Authorization = `Bearer ${JSON.parse(user).token}`
  }
  return req
})

// Auth APIs
export const registerUser = (data) => API.post('/auth/register', data)
export const loginUser = (data) => API.post('/auth/login', data)
export const getMe = () => API.get('/auth/me')

// Jobs APIs
export const getAllJobs = () => API.get('/jobs')
export const getJobById = (id) => API.get(`/jobs/${id}`)
export const createJob = (data) => API.post('/jobs', data)
export const updateJob = (id, data) => API.put(`/jobs/${id}`, data)
export const deleteJob = (id) => API.delete(`/jobs/${id}`)

// Applications APIs
export const applyJob = (jobId, data) => API.post(`/applications/${jobId}`, data)
export const getMyApplications = () => API.get('/applications/my')
export const getJobApplications = (jobId) => API.get(`/applications/job/${jobId}`)
export const updateApplicationStatus = (id, data) => API.put(`/applications/${id}`, data)

// AI APIs
export const analyzeResume = (data) => API.post('/ai/analyze-resume', data)
export const suggestJobs = (data) => API.post('/ai/suggest-jobs', data)
export const generateCoverLetter = (data) => API.post('/ai/generate-cover-letter', data)