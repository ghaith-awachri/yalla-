const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    enum: ['silver', 'gold', 'platine', 'recruteur_actif', 'recruteur_expert'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: Number, // en mois
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['online', 'mobile', 'bank_transfer', 'check']
  },
  transactionId: String,
  features: {
    publications: {
      type: Number,
      default: -1 // -1 = illimité
    },
    notifications: {
      type: Number,
      default: -1
    },
    formations: {
      discount: Number,
      free: Number
    },
    consultation: {
      discount: Number
    },
    canRate: {
      type: Boolean,
      default: false
    },
    hasFavorites: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Subscription', subscriptionSchema);