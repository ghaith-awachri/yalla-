const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); 

// Définir les enums pour les champs spécifiques
const experienceEnum = [
  'less_than_1', 
  '1_to_3', 
  '3_to_5', 
  '5_to_10', 
  'more_than_10'
];

const companyTypeEnum = [
  'Restaurant',
  'Hôtel',
  'Café',
  'Boulangerie-Pâtisserie',
  'Salon de thé',
  'Traiteur',
  'Bar',
  'Fast-food',
  'Autre'
];

const skillEnum = [
  'Cuisine',
  'Pâtisserie',
  'Boulangerie',
  'Service',
  'Bar',
  'Management',
  'Vente',
  'Relation client',
  'Langues étrangères'
];

const subscriptionTypeEnum = [
  'free',
  'silver',
  'gold',
  'platine',
  'recruteur',
  'recruteur_actif',
  'recruteur_expert'
];

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true,
    maxlength: [50, 'Le prénom ne peut pas dépasser 50 caractères']
  },
  lastName: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
  },
  phone: {
    type: String,
    required: [true, 'Le numéro de téléphone est requis'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
    select: false
  },
  userType: {
    type: String,
    enum: ['candidate', 'employer', 'admin'],
    required: [true, 'Le type d\'utilisateur est requis']
  },
  address: {
    type: String,
    required: [true, 'L\'adresse est requise'],
    trim: true
  },
  
  // Champs spécifiques aux candidats
  experience: {
    type: String,
    enum: experienceEnum,
    required: function() { return this.userType === 'candidate'; }
  },
education: [{
  type: String,
  enum: ['BAC', 'BTS', 'BTP', 'CAP', 'Maitrise', 'Licence', 'Master', 'Sans diplôme']
}],
  photo: {
    type: String,
    default: 'default.jpg'
  },
  skills: [{
    type: String,
    enum: skillEnum
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
   cin: {
    type: String,
    required: function() { return this.userType === 'candidate'; }
  },
  age: {
    type: Number,
    required: true
  },
  currentPosition: String,
  currentCompany: String,
  desiredPositions: [String],
  preferredZones: [String],
  trainingInstitutions: [String],
  cv: String, // Chemin vers le fichier CV
  
  // Nouveaux champs pour les employeurs
  establishmentCategory: {
    type: String,
    required: function() { return this.userType === 'employer'; }
  },

  completedMissions: {
    type: Number,
    min: 0,
    default: 0
  },
  
  // Champs spécifiques aux employeurs
  companyName: {
    type: String,
    trim: true,
    required: function() { return this.userType === 'employer'; },
    maxlength: [100, 'Le nom de l\'entreprise ne peut pas dépasser 100 caractères']
  },
  companyType: {
    type: String,
    enum: companyTypeEnum,
    required: function() { return this.userType === 'employer'; }
  },
  position: {
    type: String,
    trim: true,
    maxlength: [50, 'Le poste ne peut pas dépasser 50 caractères']
  },
  
  
  // Abonnement
  subscription: {
    type: {
      type: String,
      enum: subscriptionTypeEnum,
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
    min: 0,
    default: 0
  },
  
  // Favoris (pour les employeurs)
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Vérification email
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  
  // Réinitialisation mot de passe
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // Dates importantes
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  lastLogin: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Middleware pour mettre à jour la date de modification
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Méthode pour comparer les mots de passe
userSchema.methods.correctPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour générer un token de réinitialisation
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

// Méthode pour générer un token de vérification email
userSchema.methods.createEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 heures
  
  return verificationToken;
};

// Query middleware pour exclure les utilisateurs inactifs
userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;