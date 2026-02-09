/**
 * Routes d'authentification
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../middlewares/auth');
const { generateReferralCode } = require('../utils/helpers');
const { authLimiter } = require('../middlewares/rateLimiter');
const { registerRules, loginRules, handleValidation } = require('../middlewares/validator');

// POST /api/register
router.post('/register', authLimiter, registerRules, handleValidation, async (req, res) => {
  try {
    const { name, email, phone, password, referralCode } = req.body;

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    // Trouver le parrain si code fourni
    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
      if (referrer) {
        referredBy = referrer._id;
      }
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Générer un code de parrainage unique
    let newReferralCode;
    let codeExists = true;
    while (codeExists) {
      newReferralCode = generateReferralCode();
      codeExists = await User.findOne({ referralCode: newReferralCode });
    }

    // Créer l'utilisateur
    const user = new User({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      referralCode: newReferralCode,
      referredBy,
      status: 'pending'
    });

    await user.save();

    // Générer le token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        status: user.status,
        referralCode: user.referralCode,
        earnings: user.earnings
      },
      token
    });
  } catch (error) {
    console.error('Erreur inscription:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/login
router.post('/login', authLimiter, loginRules, handleValidation, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Générer le token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Connexion réussie',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        status: user.status,
        isAdmin: user.isAdmin,
        referralCode: user.referralCode,
        earnings: user.earnings,
        completedTasks: user.completedTasks,
        watchedVideos: user.watchedVideos,
        tasksCompletedToday: user.tasksCompletedToday
      },
      token
    });
  } catch (error) {
    console.error('Erreur connexion:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
