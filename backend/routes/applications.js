const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect, companyOnly } = require('../middleware/authMiddleware');

// @route   POST /api/applications/:jobId
// @desc    Apply for a job (student only)
router.post('/:jobId', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const alreadyApplied = await Application.findOne({
      job: req.params.jobId,
      applicant: req.user._id
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: 'Already applied for this job' });
    }

    const application = await Application.create({
      job: req.params.jobId,
      applicant: req.user._id,
      resume: req.body.resume,
      coverLetter: req.body.coverLetter
    });

    // Add applicant to job
    job.applicants.push(req.user._id);
    await job.save();

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/applications/my
// @desc    Get my applications (student)
router.get('/my', protect, async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user._id
    })
      .populate('job', 'title location company jobType')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/applications/job/:jobId
// @desc    Get all applications for a job (company only)
router.get('/job/:jobId', protect, companyOnly, async (req, res) => {
  try {
    const applications = await Application.find({
      job: req.params.jobId
    })
      .populate('applicant', 'name email profile')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/applications/:id
// @desc    Update application status (company only)
router.put('/:id', protect, companyOnly, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = req.body.status;
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;