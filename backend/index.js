const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// rate limiter
const windowMin = Number(process.env.RATE_LIMIT_WINDOW_MIN || 1);
const maxReq = Number(process.env.RATE_LIMIT_MAX || 60);
const apiLimiter = rateLimit({ windowMs: windowMin * 60 * 1000, max: maxReq });
app.use('/api/', apiLimiter);

const PORT = process.env.PORT || 5012;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/driveemi';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err.message));

// routes
const authRoutes = require('./routes/auth');
const calculateRoutes = require('./routes/calculate');
const historyRoutes = require('./routes/history');

app.use('/api/auth', authRoutes);
app.use('/api/calculate', calculateRoutes);
app.use('/api/history', historyRoutes);

// simple ping
app.get('/api/ping', (req, res) => res.json({ ok: true, time: Date.now() }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// health check export for simple scripts
module.exports.health = async function() {
  try {
    return mongoose.connection.readyState === 1;
  } catch (e) {
    return false;
  }
}
