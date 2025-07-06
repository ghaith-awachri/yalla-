const express = require('express');
const Application = require('../models/Application');
const router = express.Router();

// @route   POST /api/applications
// @desc    Postuler à une offre
// @access  Private (Candidats)
router.post('/', async (req, res) => {
  try {
    const { jobId, candidateId, coverLetter } = req.body;

    // Vérifier si le candidat a déjà postulé
    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: candidateId
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'Vous avez déjà postulé à cette offre'
      });
    }

    const application = new Application({
      job: jobId,
      candidate: candidateId,
      employer: req.body.employerId, // À récupérer depuis l'offre
      coverLetter
    });

    await application.save();

    await application.populate([
      { path: 'job', select: 'title companyName' },
      { path: 'candidate', select: 'firstName lastName email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Candidature envoyée avec succès',
      application
    });

  } catch (error) {
    console.error('Erreur candidature:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi de la candidature',
      error: error.message
    });
  }
});

module.exports = router;