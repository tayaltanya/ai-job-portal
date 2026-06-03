const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();


app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://ai-job-portal-eight.vercel.app'
  ],
  credentials: true
}))
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/ai', require('./routes/ai'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'AI Job Portal API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});