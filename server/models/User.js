const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
  },
  phone: {
    type: String,
    required: [true, 'Le numéro de téléphone est requis']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: 6,
    select: false
  },
  userType: {
    type: String,
    enum: ['candidate', 'employer','admin'],
    required: true
  },
  address: {
    type: String,
    required: true
  },
  
  // Champs spécifiques aux candidats
  experience: {
    type: String,
    required: function() { return this.userType === 'candidate'; }
  },
  education: {
    type: String
  },
  photo: {
    type: String
  },
  skills: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0
  },
  completedMissions: {
    type: Number,
    default: 0
  },
  
  // Champs spécifiques aux employeurs
  companyName: {
    type: String,
    required: function() { return this.userType === 'employer'; }
  },
  companyType: {
    type: String,
    enum: ['Restaurant', 'Hôtel', 'Café', 'Boulangerie-Pâtisserie', 'Salon de thé', 'Traiteur', 'Bar', 'Fast-food', 'Autre'],
    required: function() { return this.userType === 'employer'; }
  },
  position: {
    type: String
  },
  
  // Abonnement
  subscription: {
    type: {
      type: String,
      enum: ['free', 'silver', 'gold', 'platine', 'recruteur', 'recruteur_actif', 'recruteur_expert'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    isActive: {
      type: Boolean,
      default: false
    }
  },
  
  // Points de fidélité
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  
  // Favoris (pour les employeurs)
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date
}, {
  timestamps: true
});

// Crypter le mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Méthode pour comparer les mots de passe
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);