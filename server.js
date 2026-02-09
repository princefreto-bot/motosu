/**
 * MOTOSU AGENCIES - Server Bootstrap
 * Version 2.0.0 - Architecture Modulaire
 * Ce fichier est un simple lanceur - Aucune logique métier
 */

require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');
const { initializeData } = require('./src/config/initializer');

const PORT = process.env.PORT || 3000;

// Connexion MongoDB puis démarrage serveur
connectDB()
  .then(async () => {
    await initializeData();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Motosu Agencies v2.0 running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch(err => {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  });
