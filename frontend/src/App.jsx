import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Jobs from './pages/Jobs'
import Dashboard from './pages/Dashboard'
import AIAnalyzer from './pages/AIAnalyzer'
import AISuggester from './pages/AISuggester'
import AICoverLetter from './pages/AICoverLetter'
import CompanyDashboard from './pages/CompanyDashboard'
import JobDetail from './pages/JobDetail'
import AdminPanel from './pages/AdminPanel'
import SkillAssessment from './pages/SkillAssessment'





function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ai-analyzer" element={<AIAnalyzer />} />
          <Route path="/ai-suggester" element={<AISuggester />} />
          <Route path="/ai-cover-letter" element={<AICoverLetter />} />
          <Route path="/company-dashboard" element={<CompanyDashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/skill-assessment" element={<SkillAssessment />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App