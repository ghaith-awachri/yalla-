const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Job = require('../models/Job');
const auth = require('../middleware/auth');

// Créer une nouvelle offre
router.post('/', auth, async (req, res) => {
  try {
    
    console.log("Données reçues:", req.body);
    
    // Validation des champs obligatoires
    const requiredFields = ['title', 'description', 'type', 'employer', 'owner'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Champs obligatoires manquants',
        missingFields 
      });
    }

    // Vérification basique du format des IDs
    if (typeof req.body.employer !== 'string' || req.body.employer.length !== 24 ||
        typeof req.body.owner !== 'string' || req.body.owner.length !== 24) {
      return res.status(400).json({
        success: false,
        message: 'Format ID invalide'
      });
    }

    // Conversion des types
    const jobData = {
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      location: {
        address: req.body.location.address,
        city: req.body.location.city,
        region: req.body.location.region
      },
      salary: {
        amount: Number(req.body.salary.amount),
        period: req.body.salary.period || 'heure'
      },

      dates: {
        start: new Date(req.body.dates.start),
        end: req.body.dates.end ? new Date(req.body.dates.end) : null
      },
      employer: req.body.employer,
      owner: req.body.owner, // Utilisation correcte de owner depuis req.body
      status: 'pending'
    };

    const job = new Job(jobData);
    const savedJob = await job.save();
    
    res.status(201).json({
      success: true,
      job: savedJob
    });

  } catch (err) {
    console.error("Erreur détaillée:", err);
    
    if (err.name === 'ValidationError') {
      const errors = {};
      Object.keys(err.errors).forEach(key => {
        errors[key] = err.errors[key].message;
      });
      
      return res.status(400).json({ 
        success: false,
        message: 'Erreur de validation',
        errors 
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'offre',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});
// Supprimer une offre
router.delete('/:id', auth, async (req, res) => {
  try {
    const jobId = req.params.id;

    // Validation de l'ID
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de l\'offre invalide'
      });
    }

    const deletedJob = await Job.findByIdAndDelete(jobId);

    if (!deletedJob) {
      return res.status(404).json({
        success: false,
        message: 'Offre non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Offre supprimée avec succès',
      job: deletedJob
    });

  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'offre',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
// Récupérer les offres
// Récupérer les offres
// routes/jobs.js
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      owner,
      employer,
      status,
      type,
      search,
      minSalary,
      maxSalary,
      location,
      dateFrom,
      dateTo
    } = req.query;
    
    // Créer un objet de requête avec les filtres optionnels
    const query = {};
    
    if (owner) query.owner = owner;
    if (employer) query.employer = employer;
    if (status) query.status = status;
    if (type) query.type = type;
    
    // Filtre de recherche texte (titre ou description)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filtre salaire
    if (minSalary || maxSalary) {
      query['salary.amount'] = {};
      if (minSalary) query['salary.amount'].$gte = Number(minSalary);
      if (maxSalary) query['salary.amount'].$lte = Number(maxSalary);
    }
    
    // Filtre localisation
    if (location) {
      query.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.region': { $regex: location, $options: 'i' } }
      ];
    }
    
    // Filtre date
// Par ceci :
if (dateFrom || dateTo) {
  query['publishDate'] = {};
  if (dateFrom) query['publishDate'].$gte = new Date(dateFrom);
  if (dateTo) query['publishDate'].$lte = new Date(dateTo);
}
    
    const jobs = await Job.find(query)
      .populate('employer', 'firstName lastName companyName photo')
      .sort({ publishDate: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      jobs,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erreur lors de la récupération des offres',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
// Mettre à jour le statut d'une offre
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const jobId = req.params.id;
    const { status } = req.body;

    // Validation de l'ID
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de l\'offre invalide'
      });
    }

    // Validation du statut
    const validStatuses = ['active', 'inactive', 'pending', 'accepted', 'Refused'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: 'Offre non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Statut de l\'offre mis à jour',
      job: updatedJob
    });

  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;