const mongoose = require('mongoose');

const calculationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  carPrice: Number,
  downPayment: Number,
  annualRate: Number,
  tenureMonths: Number,
  emi: Number,
  totalPayment: Number,
  totalInterest: Number,
  amortization: Array,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Calculation || mongoose.model('Calculation', calculationSchema);
