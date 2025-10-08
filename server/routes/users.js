const express = require('express');
const User = require('../models/User');
const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (for admin)
// @access  Private/Admin
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10,
      search,
      userType, 
      isActive,
      education,
      age,
      desiredPosition,
      preferredZone,
      dateFrom,
      dateTo,
      sortBy = 'createdAt',  // Nouveau paramètre
      sortOrder = 'desc'     // Nouveau paramètre (asc/desc)
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }

    if (userType) query.userType = userType;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (education) query.education = education;
    if (age) query.age = Number(age);
    if (desiredPosition) query.desiredPositions = desiredPosition;
    if (preferredZone) query.preferredZones = preferredZone;

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    // Configuration du tri
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const users = await User.find(query)
      .select('-password')
      .sort(sortOptions)  // Ajout du tri
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    // Compter par type d'utilisateur
    const userTypeCounts = await User.aggregate([
      { $match: query },
      { $group: { _id: "$userType", count: { $sum: 1 } } }
    ]);

    const counts = userTypeCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    res.json({
      success: true,
      users,
      total,
      userTypeCounts: counts,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalUsers: total
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});
// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private/Admin
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});


// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private/Admin
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Middleware pour parser les données multipart/form-data
const parseFormData = upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'cv', maxCount: 1 }
]);

// Route pour mettre à jour l'utilisateur
router.put('/:id', parseFormData, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      userType,
      isActive,
      address,
      age,
      cin,
      experience,
      education,
      currentPosition,
      currentCompany,
      desiredPositions,
      preferredZones,
      trainingInstitutions
    } = req.body;

    // Convertir les chaînes en tableaux si nécessaire
    const educationArray = Array.isArray(education) ? education : (education ? education.split(',') : []);
    const desiredPositionsArray = Array.isArray(desiredPositions) ? desiredPositions : (desiredPositions ? desiredPositions.split(',') : []);
    const preferredZonesArray = Array.isArray(preferredZones) ? preferredZones : (preferredZones ? preferredZones.split(',') : []);
    const trainingInstitutionsArray = Array.isArray(trainingInstitutions) ? trainingInstitutions : (trainingInstitutions ? trainingInstitutions.split(',') : []);

    const updateData = {
      firstName,
      lastName,
      email,
      phone,
      userType,
      isActive: isActive === 'true',
      address,
      age,
      cin,
      experience,
      education: educationArray,
      currentPosition,
      currentCompany,
      desiredPositions: desiredPositionsArray,
      preferredZones: preferredZonesArray,
      trainingInstitutions: trainingInstitutionsArray
    };

    // Gestion des fichiers
    if (req.files?.photo) {
      updateData.photo = req.files.photo[0].path;
    }
    if (req.files?.cv) {
      updateData.cv = req.files.cv[0].path;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;