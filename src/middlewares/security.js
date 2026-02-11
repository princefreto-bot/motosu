/**
 * Middlewares de sécurité — PHASE 6
 * Protection avancée anti-scraping, anti-bot, anti-copie
 */

const helmet = require('helmet');
const hpp = require('hpp');
const cors = require('cors');

// Configuration Helmet (sécurité headers renforcée)
const helmetConfig = helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'same-origin' },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'sameorigin' },
  hsts: { maxAge: 31536000, includeSubDomains: true },
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true
});

// Configuration CORS stricte
const corsConfig = cors({
  origin: (origin, callback) => {
    // Autoriser les requêtes sans origin (mobile apps, curl en dev)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://motosu.onrender.com',
      'http://localhost:3000',
      'http://localhost:5000'
    ];
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(null, true); // Permissif pour le moment
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  maxAge: 86400
});

// Protection contre pollution paramètres HTTP
const hppConfig = hpp();

// Middleware anti-scraping avancé
const antiScraping = (req, res, next) => {
  const userAgent = req.get('User-Agent') || '';
  
  // Agents bloqués
  const blockedAgents = [
    'curl', 'wget', 'python-requests', 'scrapy', 'httpclient',
    'postman', 'insomnia', 'httpie', 'java/', 'libwww',
    'bot', 'crawler', 'spider', 'scraper', 'phantomjs',
    'selenium', 'puppeteer', 'playwright', 'headless'
  ];
  
  const isBlocked = blockedAgents.some(agent => 
    userAgent.toLowerCase().includes(agent)
  );
  
  // Exclure les webhooks et les health checks
  const isExcluded = req.path.includes('/api/paydunya/ipn') ||
                     req.path.includes('/api/health') ||
                     req.path.includes('/api/payment/return') ||
                     req.path.includes('/api/payment/cancel');
  
  if (isBlocked && !isExcluded) {
    console.log(`🚫 Blocked agent: ${userAgent.substring(0, 50)} on ${req.path}`);
    return res.status(403).json({ error: 'Accès refusé' });
  }
  
  // Bloquer si pas de User-Agent (sauf webhooks)
  if (!userAgent && !isExcluded && req.path.startsWith('/api/')) {
    return res.status(403).json({ error: 'Accès refusé' });
  }
  
  next();
};

// Headers de sécurité additionnels
const securityHeaders = (req, res, next) => {
  // Empêcher le caching des données sensibles
  if (req.path.startsWith('/api/')) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }
  
  // Protection contre le clickjacking
  res.set('X-Frame-Options', 'SAMEORIGIN');
  
  // Empêcher le MIME sniffing
  res.set('X-Content-Type-Options', 'nosniff');
  
  // Protection XSS
  res.set('X-XSS-Protection', '1; mode=block');
  
  // Permissions Policy
  res.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  next();
};

// Logger des requêtes (dev only)
const requestLogger = (req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  }
  next();
};

module.exports = { 
  helmetConfig, 
  corsConfig, 
  hppConfig, 
  antiScraping,
  securityHeaders,
  requestLogger 
};
