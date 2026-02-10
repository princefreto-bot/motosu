/**
 * Routes de paiement - SYSTÈME PAYPLUS EXCLUSIF
 */

const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const User = require('../models/User');
const { initPayment, verifyTransaction } = require('../services/payPlusService');
const { distributeCommissions } = require('../services/referralService');
const { SUBSCRIPTION_AMOUNT } = require('../config/constants');

// POST /api/payment/init - Initier un paiement PayPlus
router.post('/init', async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    // Initialiser PayPlus
    const result = await initPayment(user, SUBSCRIPTION_AMOUNT);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    // Créer un paiement en attente
    const payment = new Payment({
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      amount: SUBSCRIPTION_AMOUNT,
      transactionId: result.token || 'PENDING',
      status: 'pending'
    });
    await payment.save();

    res.json({
      success: true,
      payment_url: result.payment_url
    });

  } catch (error) {
    console.error('Erreur init paiement:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/payment/notify - Callback PayPlus
router.post('/notify', async (req, res) => {
  try {
    const { token, command_status } = req.body; // Adapter selon payload réel PayPlus

    console.log('PayPlus Callback:', req.body);

    // Vérifier la transaction
    // Note: Si PayPlus envoie le statut directement, on peut l'utiliser, 
    // sinon on vérifie via API
    
    // Rechercher le paiement
    // (Adapter la recherche selon ce que PayPlus renvoie comme ID unique)
    // Ici on suppose que le token est renvoyé ou qu'on le retrouve via metadata
    
    // Exemple simplifié: on attend que le verify soit appelé ou on fait la logique ici.
    // Pour la sécurité, on va toujours vérifier via l'API si possible.
    
    res.json({ response_code: "00", response_text: "OK" });
  } catch (error) {
    console.error('Callback Error:', error.message);
    res.status(500).json({ error: 'Error' });
  }
});

// GET /api/payment/return - Retour succès
router.get('/return', async (req, res) => {
  // Ici on peut vérifier le statut si le token est dans l'URL
  // PayPlus renvoie souvent ?token=...
  const { token } = req.query;

  if (token) {
    try {
      const statusData = await verifyTransaction(token);
      
      // Logique de validation si succès
      if (statusData && statusData.response_code === '00') {
         // Trouver le paiement associé au token
         const payment = await Payment.findOne({ transactionId: token });
         
         if (payment && payment.status === 'pending') {
            payment.status = 'validated';
            await payment.save();
            
            const user = await User.findById(payment.userId);
            if (user && user.status !== 'validated') {
              user.status = 'validated';
              user.subscriptionDate = new Date();
              await user.save();
              await distributeCommissions(user);
            }
         }
      }
    } catch (e) {
      console.error('Verif error on return:', e);
    }
  }

  res.redirect('/');
});

// GET /api/payment/cancel - Annulation
router.get('/cancel', (req, res) => {
  res.redirect('/');
});

module.exports = router;
