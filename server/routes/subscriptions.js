const express = require('express');
const Subscription = require('../models/Subscription');
const router = express.Router();

// Plans disponibles
const PLANS = {
  silver: { price: 60, duration: 3, features: { publications: -1, notifications: -1 } },
  gold: { price: 100, duration: 6, features: { publications: -1, notifications: -1, formations: { discount: 50 } } },
  platine: { price: 160, duration: 12, features: { publications: -1, notifications: -1, formations: { free: 1 }, canRate: true } },
  recruteur_actif: { price: 500, duration: 12, features: { publications: -1, notifications: -1, formations: { discount: 50 }, consultation: { discount: 30 } } },
  recruteur_expert: { price: 900, duration: 12, features: { publications: -1, notifications: -1, formations: { free: 1 }, consultation: { discount: 50 }, canRate: true, hasFavorites: true } }
};

// @route   POST /api/subscriptions
// @desc    Créer un abonnement
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { userId, plan, paymentMethod } = req.body;

    if (!PLANS[plan]) {
      return res.status(400).json({
        success: false,
        message: 'Plan d\'abonnement invalide'
      });
    }

    const planDetails = PLANS[plan];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + planDetails.duration);

    const subscription = new Subscription({
      user: userId,
      plan,
      price: planDetails.price,
      duration: planDetails.duration,
      startDate,
      endDate,
      paymentMethod,
      features: planDetails.features
    });

    await subscription.save();

    res.status(201).json({
      success: true,
      message: 'Abonnement créé avec succès',
      subscription
    });

  } catch (error) {
    console.error('Erreur création abonnement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'abonnement',
      error: error.message
    });
  }
});

module.exports = router;