const express = require('express');
const User = require('../models/User');
const router = express.Router();

// @route   GET /api/users/profile/:id
// @desc    Obtenir le profil d'un utilisateur
// @access  Public
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Erreur récupération profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

// @route   GET /api/users/candidates
// @desc    Obtenir la liste des candidats
// @access  Public
router.get('/candidates', async (req, res) => {
  try {
    const { page = 1, limit = 10, skills, location } = req.query;
    
    const query = { userType: 'candidate' };
    
    if (skills) {
      query.skills = { $in: skills.split(',') };
    }
    
    if (location) {
      query.address = { $regex: location, $options: 'i' };
    }

    const candidates = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      candidates,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Erreur récupération candidats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

module.exports = router;