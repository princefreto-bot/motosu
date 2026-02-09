/**
 * Configuration MongoDB Atlas
 * NE PAS MODIFIER - Connexion stable
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    console.error('❌ MONGO_URI non définie dans les variables d\'environnement');
    process.exit(1);
  }

  console.log('🔄 Connexion à MongoDB Atlas...');

  try {
    await mongoose.connect(MONGO_URI, {
      dbName: 'motosu'
    });
    console.log('✅ Connecté à MongoDB Atlas');
    return mongoose.connection;
  } catch (err) {
    console.error('❌ Erreur connexion MongoDB:', err.message);
    throw err;
  }
};

module.exports = connectDB;
