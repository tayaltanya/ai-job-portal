const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect, companyOnly } = require('../middleware/authMiddleware');

// @route   POST /api/jobs
// @desc    Create a job (company only)
router.post('/', protect, companyOnly, async (req, res) => {
  try {
    const { title, description, location, jobType, salary, skills, experience } = req.body;

    const job = await Job.create({
      title,
      description,
      location,
      jobType,
      salary,
      skills,
      experience,
      company: req.user._id
    });
    if (!req.user.isVerified) {
      return res.status(403).json({
        message: 'Your company is pending approval. Please wait for admin verification!'
      })
    }

    const newjob = await Job.create({
      ...req.body,
      company: req.user._id
    });


    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/jobs
// @desc    Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'open' })
      .populate('company', 'name company')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company', 'name company');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update job (company only)
router.put('/:id', protect, companyOnly, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if company owns this job
    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete job (company only)
router.delete('/:id', protect, companyOnly, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.company.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await job.deleteOne();
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;