const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Helper function to call Groq API
const callGroq = async (prompt) => {
  const response = await fetch(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2048
      })
    }
  );

  const data = await response.json();

  // Check for API errors
  if (data.error) {
    throw new Error(`Groq API Error: ${data.error.message}`);
  }

  if (!data.choices || data.choices.length === 0) {
    throw new Error('No response from Groq AI');
  }

  return data.choices[0].message.content;
};

// Helper to parse JSON from AI response
const parseJSON = (text) => {
  const cleanText = text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();
  return JSON.parse(cleanText);
};

// @route   POST /api/ai/analyze-resume
router.post('/analyze-resume', protect, async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ message: 'Resume and job description required' });
    }

    const prompt = `
    You are an expert HR and resume analyst.
    
    Analyze this resume against the job description and provide:
    1. Match Score (0-100)
    2. Strong Points (3-5 points)
    3. Missing Skills
    4. Improvement Suggestions
    5. Overall Feedback
    
    Resume:
    ${resumeText}
    
    Job Description:
    ${jobDescription}
    
    Respond ONLY in this exact JSON format, no extra text:
    {
      "score": 85,
      "strongPoints": ["point1", "point2"],
      "missingSkills": ["skill1", "skill2"],
      "improvements": ["suggestion1", "suggestion2"],
      "overallFeedback": "feedback here"
    }
    `;

    const text = await callGroq(prompt);
    const result = parseJSON(text);
    res.json(result);

  } catch (error) {
    console.error('Analyze Resume Error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/ai/suggest-jobs
router.post('/suggest-jobs', protect, async (req, res) => {
  try {
    const { skills, experience } = req.body;

    if (!skills || skills.length === 0) {
      return res.status(400).json({ message: 'Skills are required' });
    }

    const skillsString = Array.isArray(skills) ? skills.join(', ') : skills;

    const prompt = `
    Based on these skills and experience, suggest 5 suitable job roles.
    
    Skills: ${skillsString}
    Experience: ${experience}
    
    Respond ONLY in this exact JSON format, no extra text:
    {
      "suggestions": [
        {
          "title": "Job Title",
          "reason": "Why this fits",
          "requiredSkills": ["skill1", "skill2"],
          "averageSalary": "salary range in INR"
        }
      ]
    }
    `;

    const text = await callGroq(prompt);
    const result = parseJSON(text);
    res.json(result);

  } catch (error) {
    console.error('Suggest Jobs Error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/ai/generate-cover-letter
router.post('/generate-cover-letter', protect, async (req, res) => {
  try {
    const { resumeText, jobTitle, companyName } = req.body;

    if (!resumeText || !jobTitle || !companyName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const prompt = `
    Write a professional cover letter for:
    Job Title: ${jobTitle}
    Company: ${companyName}
    
    Based on this resume:
    ${resumeText}
    
    Keep it concise, professional and under 300 words.
    Return only the cover letter text, no extra formatting.
    `;

    const coverLetter = await callGroq(prompt);
    res.json({ coverLetter });

  } catch (error) {
    console.error('Cover Letter Error:', error.message);
    res.status(500).json({ message: error.message });
  }
});
// @route   POST /api/ai/generate-quiz
// @desc    Generate MCQ quiz using AI
router.post('/generate-quiz', protect, async (req, res) => {
  try {
    const { topic, difficulty, numQuestions } = req.body;

    if (!topic) {
      return res.status(400).json({ message: 'Topic is required' });
    }

    const prompt = `
    Generate ${numQuestions || 10} multiple choice questions on "${topic}" 
    for a ${difficulty || 'intermediate'} level software developer interview.
    
    Respond ONLY in this exact JSON format, no extra text:
    {
      "quiz": [
        {
          "question": "Question text here?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0,
          "explanation": "Why this answer is correct"
        }
      ]
    }
    
    Rules:
    - correctAnswer is index (0,1,2,3) of correct option
    - Make questions practical and interview focused
    - Mix easy, medium and hard questions
    - Options should be realistic and tricky
    `;

    const text = await callGroq(prompt);
    const result = parseJSON(text);
    res.json(result);

  } catch (error) {
    console.error('Quiz Error:', error.message);
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;