/**
 * Routes de configuration publique
 */

const express = require('express');
const router = express.Router();
const Config = require('../models/Config');
const { SUBSCRIPTION_AMOUNT, DEFAULT_PAYMENT_NUMBERS } = require('../config/constants');

// GET /api/config - Configuration publique
router.get('/config', async (req, res) => {
  try {
    const paymentNumbers = await Config.findOne({ key: 'paymentNumbers' });
    const subscriptionAmount = await Config.findOne({ key: 'subscriptionAmount' });

    res.json({
      paymentNumbers: paymentNumbers?.value || DEFAULT_PAYMENT_NUMBERS,
      subscriptionAmount: subscriptionAmount?.value || SUBSCRIPTION_AMOUNT,
      withdrawMethods: [
        { id: 'moov', name: 'Moov Money', min: 15000 },
        { id: 'mix', name: 'Mix by Yas', min: 15000 }
      ]
    });
  } catch (error) {
    console.error('Erreur config:', error.message);
    res.json({
      paymentNumbers: DEFAULT_PAYMENT_NUMBERS,
      subscriptionAmount: SUBSCRIPTION_AMOUNT,
      withdrawMethods: [
        { id: 'moov', name: 'Moov Money', min: 15000 },
        { id: 'mix', name: 'Mix by Yas', min: 15000 }
      ]
    });
  }
});

module.exports = router;
