const express = require('express');
const router = express.Router();
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const Calculation = require('../models/Calculation');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

function generateAmortization(principal, monthlyRate, months, monthlyEmi) {
  const schedule = [];
  let balance = principal;
  for (let i = 1; i <= months; i++) {
    const interest = Number((balance * monthlyRate).toFixed(6));
    const principalPaid = Number((monthlyEmi - interest).toFixed(6));
    balance = Number((balance - principalPaid).toFixed(6));
    schedule.push({ month: i, interest: Number(interest.toFixed(2)), principalPaid: Number(principalPaid.toFixed(2)), balance: Number(Math.max(balance, 0).toFixed(2)) });
  }
  return schedule;
}

const calcSchema = Joi.object({
  carPrice: Joi.number().positive().required(),
  downPayment: Joi.number().min(0).default(0),
  annualRate: Joi.number().min(0).required(),
  tenureMonths: Joi.number().integer().min(1).required(),
  save: Joi.boolean().optional()
});

router.post('/', async (req, res) => {
  try {
    const { error, value } = calcSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const { carPrice, downPayment, annualRate, tenureMonths, save } = value;
    const P = carPrice - downPayment;
    const R = annualRate / 12 / 100;
    const N = tenureMonths;

    let emi = 0;
    if (R === 0) {
      emi = P / N;
    } else {
      const factor = Math.pow(1 + R, N);
      emi = (P * R * factor) / (factor - 1);
    }

    const totalPayment = emi * N;
    const totalInterest = totalPayment - P;
    const amortization = generateAmortization(P, R, N, emi);

    const result = {
      principal: P,
      monthlyRate: R,
      tenureMonths: N,
      emi: Number(emi.toFixed(2)),
      totalPayment: Number(totalPayment.toFixed(2)),
      totalInterest: Number(totalInterest.toFixed(2)),
      amortization
    };

    if (save) {
      const authHeader = req.headers.authorization || '';
      if (!authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Authorization required to save' });
      const token = authHeader.split(' ')[1];
      let payload;
      try { payload = jwt.verify(token, JWT_SECRET); } catch (e) { return res.status(401).json({ error: 'Invalid token' }); }
      const doc = new Calculation({ userId: payload.id, carPrice, downPayment, annualRate, tenureMonths: N, emi: result.emi, totalPayment: result.totalPayment, totalInterest: result.totalInterest, amortization });
      await doc.save();
      result.id = doc._id;
    }

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
