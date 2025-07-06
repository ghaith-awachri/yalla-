const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre du poste est requis'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise']
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: [true, 'La localisation est requise']
  },
  region: {
    type: String,
    required: true
  },
  jobType: {
    type: String,
    enum: ['CDI', 'CDD', 'Extra'],
    required: true
  },
  duration: {
    type: String
  },
  salary: {
    amount: {
      type: Number,
      required: true
    },
    period: {
      type: String,
      enum: ['heure', 'jour', 'semaine', 'mois', 'année'],
      required: true
    }
  },
  requiredProfile: {
    type: String,
    required: true
  },
  skills: [{
    type: String
  }],
  gender: {
    type: String,
    enum: ['Homme', 'Femme', 'Indifférent'],
    default: 'Indifférent'
  },
  experience: {
    type: String,
    enum: ['Débutant', '1-2 ans', '3-5 ans', '5+ ans'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'closed', 'filled'],
    default: 'active'
  },
  applications: [{
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    message: String
  }],
  maxApplications: {
    type: Number,
    default: 50
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  benefits: [String],
  requirements: [String]
}, {
  timestamps: true
});

// Index pour la recherche
jobSchema.index({ title: 'text', description: 'text', location: 'text' });
jobSchema.index({ location: 1, jobType: 1, status: 1 });
jobSchema.index({ employer: 1, status: 1 });

module.exports = mongoose.model('Job', jobSchema);