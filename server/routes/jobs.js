const express = require('express');
const Job = require('../models/Job');
const router = express.Router();

// @route   GET /api/jobs
// @desc    Obtenir toutes les offres d'emploi
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      jobType, 
      location, 
      salary, 
      search 
    } = req.query;
    
    const query = { status: 'active' };
    
    if (jobType) {
      query.jobType = jobType;
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    const jobs = await Job.find(query)
      .populate('employer', 'firstName lastName companyName')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments(query);

    res.json({
      success: true,
      jobs,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Erreur récupération emplois:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

// @route   POST /api/jobs
// @desc    Créer une nouvelle offre d'emploi
// @access  Private (Employeurs)
router.post('/', async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      employer: req.body.employerId // À remplacer par l'ID du token JWT
    };

    const job = new Job(jobData);
    await job.save();

    await job.populate('employer', 'firstName lastName companyName');

    res.status(201).json({
      success: true,
      message: 'Offre d\'emploi créée avec succès',
      job
    });

  } catch (error) {
    console.error('Erreur création emploi:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'offre',
      error: error.message
    });
  }
});

module.exports = router;