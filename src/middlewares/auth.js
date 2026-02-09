/**
 * Middleware d'authentification JWT — PHASE 6
 * Sécurité renforcée
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'motosu-secret-key-2024-production-secure';

// Vérifier le token JWT
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token manquant' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Vérifier que le token n'est pas vide
    if (!token || token === 'null' || token === 'undefined') {
      return res.status(401).json({ error: 'Token invalide' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Vérifier l'expiration
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({ error: 'Token expiré' });
    }
    
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }
    
    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expiré, reconnectez-vous' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token invalide' });
    }
    return res.status(401).json({ error: 'Erreur d\'authentification' });
  }
};

// Vérifier si admin
const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Non authentifié' });
    }
    
    if (!req.user.isAdmin) {
      console.log(`⚠️ Tentative accès admin par: ${req.user.email}`);
      return res.status(403).json({ error: 'Accès refusé - Admin requis' });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Générer un token JWT sécurisé
const generateToken = (userId) => {
  return jwt.sign(
    { 
      userId,
      iat: Math.floor(Date.now() / 1000)
    }, 
    JWT_SECRET, 
    { 
      expiresIn: '30d',
      algorithm: 'HS256'
    }
  );
};

module.exports = { verifyToken, verifyAdmin, generateToken, JWT_SECRET };
