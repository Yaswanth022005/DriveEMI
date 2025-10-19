const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Calculation = require('../models/Calculation');
const authMiddleware = require('../middleware/auth');

const historySchema = Joi.object({
  carPrice: Joi.number().positive().required(),
  downPayment: Joi.number().min(0).default(0),
  annualRate: Joi.number().min(0).required(),
  tenureMonths: Joi.number().integer().min(1).required(),
  emi: Joi.number().positive().required(),
  totalPayment: Joi.number().positive().required(),
  totalInterest: Joi.number().min(0).required(),
  amortization: Joi.array().optional()
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '20', 10)));
    const skip = (page - 1) * limit;
    const filter = { userId: req.user._id };
    const [items, total] = await Promise.all([
      Calculation.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Calculation.countDocuments(filter)
    ]);
    res.json({ items, page, limit, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { error, value } = historySchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const doc = new Calculation({ userId: req.user._id, ...value });
    await doc.save();
    res.json({ ok: true, id: doc._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
