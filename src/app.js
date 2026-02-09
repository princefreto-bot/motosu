/**
 * MOTOSU AGENCIES - Application Express
 * Version 2.0.0 - Architecture Modulaire
 * Configuration des middlewares et routes
 */

const express = require('express');
const path = require('path');
const compression = require('compression');

// Import des middlewares de sécurité
const { helmetConfig, corsConfig, hppConfig, antiScraping, securityHeaders, requestLogger } = require('./middlewares/security');
const { apiLimiter } = require('./middlewares/rateLimiter');

// Import des routes
const apiRoutes = require('./routes');

// Création de l'application Express
const app = express();

// ======================
// MIDDLEWARES GLOBAUX
// ======================

// Compression GZIP
app.use(compression());

// Sécurité
app.use(helmetConfig);
app.use(corsConfig);
app.use(hppConfig);

// Anti-scraping (sauf webhooks)
app.use(antiScraping);

// Headers de sécurité additionnels
app.use(securityHeaders);

// Logger en développement
app.use(requestLogger);

// Parser JSON (limite augmentée pour les images base64)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ======================
// FICHIERS STATIQUES
// ======================

// Servir les fichiers statiques depuis la racine
app.use(express.static(path.join(__dirname, '..'), {
  index: false,
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0
}));

// ======================
// ROUTES API
// ======================

// Rate limiter pour l'API
app.use('/api', apiLimiter);

// Toutes les routes API
app.use('/api', apiRoutes);

// ======================
// ROUTES FRONTEND
// ======================

// Servir index.html pour toutes les routes non-API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ======================
// GESTION DES ERREURS
// ======================

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error('❌ Erreur non gérée:', err.message);
  
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ error: 'Erreur serveur interne' });
  } else {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

module.exports = app;
