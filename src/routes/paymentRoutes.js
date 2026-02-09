/**
 * Routes de paiement
 */

const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const User = require('../models/User');
const { SUBSCRIPTION_AMOUNT } = require('../config/constants');
const { paymentLimiter } = require('../middlewares/rateLimiter');

// POST /api/payment/proof - Envoyer une preuve de paiement
router.post('/proof', paymentLimiter, async (req, res) => {
  try {
    const { userId, screenshot, transactionId, phoneUsed } = req.body;

    if (!userId || !screenshot) {
      return res.status(400).json({ error: 'Données incomplètes' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Mettre à jour l'utilisateur avec la preuve
    user.paymentProof = {
      screenshot,
      transactionId: transactionId || '',
      phoneUsed: phoneUsed || user.phone,
      submittedAt: new Date()
    };
    user.status = 'pending_payment';
    await user.save();

    // Créer un enregistrement de paiement
    const payment = new Payment({
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      amount: SUBSCRIPTION_AMOUNT,
      screenshot,
      transactionId: transactionId || '',
      phoneUsed: phoneUsed || user.phone,
      status: 'pending'
    });
    await payment.save();

    res.json({
      success: true,
      message: 'Preuve de paiement envoyée. Validation sous 24h.'
    });
  } catch (error) {
    console.error('Erreur envoi preuve:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/payment/return - Retour après paiement (pour compatibilité)
router.get('/return', (req, res) => {
  res.redirect('/');
});

// GET /api/payment/cancel - Annulation paiement (pour compatibilité)
router.get('/cancel', (req, res) => {
  res.redirect('/');
});

// POST /api/payment/notify - Webhook de notification (pour compatibilité)
router.post('/notify', (req, res) => {
  console.log('Notification de paiement reçue:', req.body);
  res.json({ success: true, message: 'Notification reçue' });
});

// GET /api/payment/notify - Pour test de l'endpoint
router.get('/notify', (req, res) => {
  res.json({ success: true, message: 'Notification endpoint active' });
});

module.exports = router;
