/**
 * Validation des entrées utilisateur — PHASE 6
 * Protection contre injections et données malveillantes
 */

const { body, validationResult } = require('express-validator');

// Gestion des erreurs de validation
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: errors.array()[0].msg 
    });
  }
  next();
};

// Nettoyage anti-injection
const sanitizeInput = (value) => {
  if (typeof value !== 'string') return value;
  return value
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

// Règles de validation pour l'inscription
const registerRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2, max: 100 }).withMessage('Nom entre 2 et 100 caractères')
    .customSanitizer(sanitizeInput),
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail()
    .isLength({ max: 255 }).withMessage('Email trop long'),
  body('phone')
    .trim()
    .notEmpty().withMessage('Le téléphone est requis')
    .isLength({ min: 8, max: 20 }).withMessage('Numéro de téléphone invalide')
    .customSanitizer(sanitizeInput),
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis')
    .isLength({ min: 6, max: 128 }).withMessage('Mot de passe entre 6 et 128 caractères')
];

// Règles de validation pour la connexion
const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis')
    .isLength({ max: 128 }).withMessage('Mot de passe trop long')
];

// Règles de validation pour le retrait (PayDunya uniquement)
const withdrawRules = [
  body('amount')
    .isInt({ min: 8000 }).withMessage('Minimum withdrawal is 8000'),
  body('method')
    .isIn(['mobile_money']).withMessage('Méthode invalide'),
  body('accountNumber')
    .trim()
    .notEmpty().withMessage('Numéro de compte requis')
    .isLength({ min: 8, max: 20 }).withMessage('Numéro invalide')
    .customSanitizer(sanitizeInput)
];

// Règles pour ajout vidéo
const videoRules = [
  body('platform')
    .isIn(['youtube', 'tiktok']).withMessage('Plateforme invalide'),
  body('title')
    .trim()
    .notEmpty().withMessage('Titre requis')
    .isLength({ max: 200 }).withMessage('Titre trop long')
    .customSanitizer(sanitizeInput),
  body('url')
    .trim()
    .notEmpty().withMessage('URL requise')
    .isLength({ max: 500 }).withMessage('URL trop longue'),
  body('duration')
    .isInt({ min: 1, max: 120 }).withMessage('Durée invalide (1-120 min)'),
  body('reward')
    .isInt({ min: 1, max: 1000 }).withMessage('Récompense invalide')
];

// Règles pour ajout formation
const formationRules = [
  body('title')
    .trim()
    .notEmpty().withMessage('Titre requis')
    .isLength({ max: 200 }).withMessage('Titre trop long')
    .customSanitizer(sanitizeInput),
  body('description')
    .trim()
    .notEmpty().withMessage('Description requise')
    .isLength({ max: 1000 }).withMessage('Description trop longue')
    .customSanitizer(sanitizeInput),
  body('link')
    .trim()
    .notEmpty().withMessage('Lien requis')
    .isLength({ max: 500 }).withMessage('Lien trop long')
];

module.exports = {
  handleValidation,
  sanitizeInput,
  registerRules,
  loginRules,
  withdrawRules,
  videoRules,
  formationRules
};
