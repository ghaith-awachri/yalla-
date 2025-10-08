// models/Job.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true, enum: ['CDI', 'CDD', 'Extra'] },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    region: { type: String, required: true }
  },
  salary: {
    amount: { type: Number, required: true },
    period: { type: String, required: true, enum: ['heure', 'jour', 'mois'] }
  },

  dates: {
    start: { type: Date, required: true },
    end: { type: Date }
  },
  employer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
    owner: {  // Nouveau champ
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: { 
    type: String, 
    default: 'pending', 
    enum: ['active', 'inactive', 'pending', 'accepted','Refused'] 
  },
  views: { type: Number, default: 0 },
  applications: { type: Number, default: 0 },
  publishDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);