/**
 * Rate Limiter — PHASE 6
 * Protection anti-spam, anti-brute-force renforcée
 */

const rateLimit = require('express-rate-limit');

// Limite générale API (100 req / 15 min)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Trop de requêtes, réessayez dans 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress;
  }
});

// Limite stricte pour auth (5 tentatives / 15 min)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Trop de tentatives de connexion, réessayez dans 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => {
    return req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress;
  }
});

// Limite pour les paiements (3 req / 1 heure)
const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { error: 'Trop de demandes de paiement, réessayez plus tard' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress;
  }
});

// Limite pour les retraits (5 req / 1 heure)
const withdrawLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Trop de demandes de retrait, réessayez plus tard' },
  standardHeaders: true,
  legacyHeaders: false
});

// Limite pour les tâches (30 req / 15 min)
const taskLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Trop de requêtes tâches, ralentissez' },
  standardHeaders: true,
  legacyHeaders: false
});

// Limite admin (50 req / 15 min)
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: 'Trop de requêtes admin' },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { 
  apiLimiter, 
  authLimiter, 
  paymentLimiter, 
  withdrawLimiter, 
  taskLimiter, 
  adminLimiter 
};
