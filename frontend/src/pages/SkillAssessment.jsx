import { useState } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function SkillAssessment() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState('setup')
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('intermediate')
  const [numQuestions, setNumQuestions] = useState(10)
  const [quiz, setQuiz] = useState([])
  const [currentQ, setCurrentQ] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const topics = [
    'React.js', 'Node.js', 'JavaScript',
    'MongoDB', 'Data Structures', 'Algorithms',
    'Java', 'SQL', 'System Design',
    'CSS', 'TypeScript', 'Python'
  ]

  const handleGenerateQuiz = async () => {
    if (!topic) {
      setError('Please select a topic!')
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
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/ai/generate-quiz`,
        { topic, difficulty, numQuestions },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setQuiz(data.quiz)
      setStep('quiz')
      setCurrentQ(0)
      setSelectedAnswers({})
    } catch (err) {
      setError('Failed to generate quiz! Try again.')
    }
    setLoading(false)
  }

  const handleSelectAnswer = (answerIndex) => {
    if (selectedAnswers[currentQ] !== undefined) return
    setSelectedAnswers({ ...selectedAnswers, [currentQ]: answerIndex })
  }

  const handleNext = () => {
    if (currentQ < quiz.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      calculateResult()
    }
  }

  const handlePrev = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1)
  }

  const calculateResult = () => {
    let correct = 0
    quiz.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctAnswer) correct++
    })
    const score = Math.round((correct / quiz.length) * 100)
    setResult({
      correct,
      total: quiz.length,
      score,
      grade: score >= 80 ? 'Excellent' :
             score >= 60 ? 'Good' :
             score >= 40 ? 'Average' : 'Needs Work'
    })
    setStep('result')
  }

  const getOptionStyle = (qIndex, optIndex) => {
    const selected = selectedAnswers[qIndex]
    if (selected === undefined) {
      return optIndex === selectedAnswers[currentQ]
        ? styles.optionSelected
        : styles.option
    }
    if (optIndex === quiz[qIndex].correctAnswer) return styles.optionCorrect
    if (optIndex === selected && selected !== quiz[qIndex].correctAnswer) {
      return styles.optionWrong
    }
    return styles.option
  }

  return (
    <div style={styles.container}>
      <Navbar />

      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Skill Assessment 🎯</h1>
        <p style={styles.heroSubtitle}>
          Test your knowledge with AI generated questions!
        </p>
      </div>

      <div style={styles.content}>

        {/* Setup Step */}
        {step === 'setup' && (
          <div style={styles.setupCard}>
            <h2 style={styles.sectionTitle}>Choose Your Topic 📚</h2>

            {/* Topic Grid */}
            <div style={styles.topicGrid}>
              {topics.map(t => (
                <div
                  key={t}
                  style={topic === t ? styles.topicActive : styles.topic}
                  onClick={() => setTopic(t)}
                >
                  {t}
                </div>
              ))}
            </div>

            {/* Custom Topic */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Or type custom topic:
              </label>
              <input
                style={styles.input}
                type="text"
                placeholder="e.g. Express.js, REST APIs..."
                value={topics.includes(topic) ? '' : topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            {/* Difficulty */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Difficulty Level:</label>
              <div style={styles.diffContainer}>
                {['beginner', 'intermediate', 'advanced'].map(d => (
                  <div
                    key={d}
                    style={difficulty === d ? styles.diffActive : styles.diff}
                    onClick={() => setDifficulty(d)}
                  >
                    {d === 'beginner' && '🟢 '}
                    {d === 'intermediate' && '🟡 '}
                    {d === 'advanced' && '🔴 '}
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </div>
                ))}
              </div>
            </div>

            {/* Number of Questions */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Number of Questions: {numQuestions}
              </label>
              <input
                style={styles.range}
                type="range"
                min="5"
                max="20"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
              />
              <div style={styles.rangeLabels}>
                <span>5</span>
                <span>10</span>
                <span>15</span>
                <span>20</span>
              </div>
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <button
              style={loading ? styles.btnDisabled : styles.btn}
              onClick={handleGenerateQuiz}
              disabled={loading}
            >
              {loading ? '🤖 Generating Quiz...' : '🚀 Start Quiz'}
            </button>
          </div>
        )}

        {/* Quiz Step */}
        {step === 'quiz' && quiz.length > 0 && (
          <div style={styles.quizCard}>
            {/* Progress */}
            <div style={styles.progress}>
              <div style={styles.progressInfo}>
                <span style={styles.progressText}>
                  Question {currentQ + 1} of {quiz.length}
                </span>
                <span style={styles.progressText}>
                  {Object.keys(selectedAnswers).length} answered
                </span>
              </div>
              <div style={styles.progressBar}>
                <div style={{
                  ...styles.progressFill,
                  width: `${((currentQ + 1) / quiz.length) * 100}%`
                }} />
              </div>
            </div>

            {/* Question */}
            <div style={styles.questionCard}>
              <div style={styles.questionNumber}>
                Q{currentQ + 1}
              </div>
              <h3 style={styles.questionText}>
                {quiz[currentQ]?.question}
              </h3>
            </div>

            {/* Options */}
            <div style={styles.options}>
              {quiz[currentQ]?.options.map((opt, i) => (
                <div
                  key={i}
                  style={getOptionStyle(currentQ, i)}
                  onClick={() => handleSelectAnswer(i)}
                >
                  <span style={styles.optionLetter}>
                    {['A', 'B', 'C', 'D'][i]}
                  </span>
                  <span>{opt}</span>
                </div>
              ))}
            </div>

            {/* Explanation */}
            {selectedAnswers[currentQ] !== undefined && (
              <div style={styles.explanation}>
                <p style={styles.explanationTitle}>💡 Explanation:</p>
                <p style={styles.explanationText}>
                  {quiz[currentQ]?.explanation}
                </p>
              </div>
            )}

            {/* Navigation */}
            <div style={styles.navigation}>
              <button
                style={currentQ === 0 ? styles.navBtnDisabled : styles.navBtn}
                onClick={handlePrev}
                disabled={currentQ === 0}
              >
                ← Previous
              </button>

              {/* Question dots */}
              <div style={styles.dots}>
                {quiz.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      ...styles.dot,
                      background: i === currentQ ? '#667eea' :
                        selectedAnswers[i] !== undefined ?
                          selectedAnswers[i] === quiz[i].correctAnswer ?
                            '#2ecc71' : '#e74c3c'
                        : '#e1e1e1'
                    }}
                    onClick={() => setCurrentQ(i)}
                  />
                ))}
              </div>

              <button
                style={selectedAnswers[currentQ] === undefined
                  ? styles.navBtnDisabled : styles.navBtn}
                onClick={handleNext}
                disabled={selectedAnswers[currentQ] === undefined}
              >
                {currentQ === quiz.length - 1 ? 'Finish 🎯' : 'Next →'}
              </button>
            </div>
          </div>
        )}

        {/* Result Step */}
        {step === 'result' && result && (
          <div style={styles.resultCard}>
            <div style={styles.resultHeader}>
              <div style={styles.resultEmoji}>
                {result.score >= 80 ? '🏆' :
                 result.score >= 60 ? '👍' :
                 result.score >= 40 ? '📚' : '💪'}
              </div>
              <h2 style={styles.resultTitle}>{result.grade}!</h2>
              <div style={styles.scoreCircle}>
                <span style={{
                  ...styles.scoreNumber,
                  color: result.score >= 80 ? '#2ecc71' :
                         result.score >= 60 ? '#f39c12' : '#e74c3c'
                }}>
                  {result.score}%
                </span>
              </div>
              <p style={styles.resultDesc}>
                You got {result.correct} out of {result.total} correct!
              </p>
            </div>

            {/* Question Review */}
            <h3 style={styles.reviewTitle}>📝 Question Review</h3>
            {quiz.map((q, i) => (
              <div key={i} style={styles.reviewCard}>
                <div style={styles.reviewHeader}>
                  <span style={styles.reviewQ}>Q{i + 1}. {q.question}</span>
                  <span style={{
                    ...styles.reviewBadge,
                    background: selectedAnswers[i] === q.correctAnswer
                      ? '#2ecc71' : '#e74c3c'
                  }}>
                    {selectedAnswers[i] === q.correctAnswer ? '✅' : '❌'}
                  </span>
                </div>
                <p style={styles.reviewAnswer}>
                  ✅ Correct: {q.options[q.correctAnswer]}
                </p>
                {selectedAnswers[i] !== q.correctAnswer && (
                  <p style={styles.reviewWrong}>
                    ❌ Your answer: {q.options[selectedAnswers[i]] || 'Not answered'}
                  </p>
                )}
                <p style={styles.reviewExp}>💡 {q.explanation}</p>
              </div>
            ))}

            {/* Action Buttons */}
            <div style={styles.actions}>
              <button
                style={styles.btn}
                onClick={() => {
                  setStep('setup')
                  setQuiz([])
                  setSelectedAnswers({})
                  setResult(null)
                  setTopic('')
                }}
              >
                🔄 Try Another Topic
              </button>
              <button
                style={styles.btnOutline}
                onClick={() => {
                  setStep('quiz')
                  setCurrentQ(0)
                  setSelectedAnswers({})
                  setResult(null)
                }}
              >
                🔁 Retry Same Quiz
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
  content: { maxWidth: '800px', margin: '0 auto', padding: '40px 20px' },
  setupCard: {
    background: 'white', borderRadius: '16px',
    padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
  },
  sectionTitle: {
    fontSize: '22px', fontWeight: '700',
    color: '#333', marginBottom: '24px'
  },
  topicGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '12px', marginBottom: '24px'
  },
  topic: {
    padding: '10px 16px', border: '2px solid #e1e1e1',
    borderRadius: '10px', cursor: 'pointer',
    fontSize: '13px', fontWeight: '500',
    color: '#555', textAlign: 'center'
  },
  topicActive: {
    padding: '10px 16px', border: '2px solid #667eea',
    borderRadius: '10px', cursor: 'pointer',
    fontSize: '13px', fontWeight: '600',
    color: '#667eea', textAlign: 'center',
    background: '#f0f0ff'
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
  diffContainer: { display: 'flex', gap: '12px' },
  diff: {
    flex: 1, padding: '12px', border: '2px solid #e1e1e1',
    borderRadius: '10px', cursor: 'pointer',
    fontSize: '14px', fontWeight: '500',
    color: '#666', textAlign: 'center'
  },
  diffActive: {
    flex: 1, padding: '12px', border: '2px solid #667eea',
    borderRadius: '10px', cursor: 'pointer',
    fontSize: '14px', fontWeight: '600',
    color: '#667eea', textAlign: 'center', background: '#f0f0ff'
  },
  range: { width: '100%', marginBottom: '8px' },
  rangeLabels: {
    display: 'flex', justifyContent: 'space-between',
    fontSize: '12px', color: '#888'
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
  quizCard: {
    background: 'white', borderRadius: '16px',
    padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
  },
  progress: { marginBottom: '24px' },
  progressInfo: {
    display: 'flex', justifyContent: 'space-between',
    marginBottom: '8px'
  },
  progressText: { fontSize: '14px', color: '#888', fontWeight: '500' },
  progressBar: {
    height: '8px', background: '#f0f0f0',
    borderRadius: '4px', overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '4px', transition: 'width 0.3s'
  },
  questionCard: {
    background: '#f8f9ff', borderRadius: '12px',
    padding: '24px', marginBottom: '24px',
    display: 'flex', gap: '16px', alignItems: 'flex-start'
  },
  questionNumber: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white', width: '36px', height: '36px',
    borderRadius: '50%', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: '14px', fontWeight: 'bold', flexShrink: 0
  },
  questionText: { fontSize: '17px', color: '#333', lineHeight: '1.6' },
  options: { display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' },
  option: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '14px 16px', border: '2px solid #e1e1e1',
    borderRadius: '10px', cursor: 'pointer',
    fontSize: '15px', color: '#444', transition: 'all 0.2s'
  },
  optionSelected: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '14px 16px', border: '2px solid #667eea',
    borderRadius: '10px', cursor: 'pointer',
    fontSize: '15px', color: '#667eea',
    background: '#f0f0ff'
  },
  optionCorrect: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '14px 16px', border: '2px solid #2ecc71',
    borderRadius: '10px', cursor: 'pointer',
    fontSize: '15px', color: '#2ecc71',
    background: '#f0fff0'
  },
  optionWrong: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '14px 16px', border: '2px solid #e74c3c',
    borderRadius: '10px', cursor: 'pointer',
    fontSize: '15px', color: '#e74c3c',
    background: '#fff0f0'
  },
  optionLetter: {
    width: '28px', height: '28px',
    background: '#f0f0f0', borderRadius: '50%',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '13px',
    fontWeight: 'bold', flexShrink: 0
  },
  explanation: {
    background: '#fffdf0', border: '1px solid #f39c12',
    borderRadius: '10px', padding: '16px', marginBottom: '20px'
  },
  explanationTitle: { fontWeight: '700', color: '#f39c12', marginBottom: '6px' },
  explanationText: { fontSize: '14px', color: '#555', lineHeight: '1.6' },
  navigation: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginTop: '8px'
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
  dots: { display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' },
  dot: {
    width: '12px', height: '12px',
    borderRadius: '50%', cursor: 'pointer',
    transition: 'background 0.2s'
  },
  resultCard: {
    background: 'white', borderRadius: '16px',
    padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
  },
  resultHeader: { textAlign: 'center', marginBottom: '32px' },
  resultEmoji: { fontSize: '60px', marginBottom: '12px' },
  resultTitle: { fontSize: '28px', fontWeight: '700', color: '#333', marginBottom: '16px' },
  scoreCircle: { marginBottom: '12px' },
  scoreNumber: { fontSize: '64px', fontWeight: 'bold' },
  resultDesc: { fontSize: '16px', color: '#666' },
  reviewTitle: { fontSize: '20px', fontWeight: '700', color: '#333', marginBottom: '16px' },
  reviewCard: {
    background: '#f8f9ff', borderRadius: '12px',
    padding: '16px', marginBottom: '12px'
  },
  reviewHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: '8px', gap: '12px'
  },
  reviewQ: { fontSize: '14px', fontWeight: '600', color: '#333', lineHeight: '1.5' },
  reviewBadge: {
    padding: '4px 10px', borderRadius: '20px',
    color: 'white', fontSize: '12px', flexShrink: 0
  },
  reviewAnswer: { fontSize: '13px', color: '#2ecc71', marginBottom: '4px' },
  reviewWrong: { fontSize: '13px', color: '#e74c3c', marginBottom: '4px' },
  reviewExp: { fontSize: '13px', color: '#888', fontStyle: 'italic' },
  actions: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }
}

export default SkillAssessment