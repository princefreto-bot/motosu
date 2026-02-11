/**
 * Routes de configuration publique — PAYDUNYA UNIQUEMENT
 */

const express = require('express');
const router = express.Router();

const Config = require('../models/Config');
const { SUBSCRIPTION_AMOUNT } = require('../config/constants');

// GET /api/config
router.get('/config', async (req, res) => {
  try {
    const subscriptionAmount = await Config.findOne({ key: 'subscriptionAmount' });

    return res.json({
      paymentNumbers: [],
      subscriptionAmount: subscriptionAmount?.value || SUBSCRIPTION_AMOUNT,
      withdrawMethods: [
        { id: 'mobile_money', name: 'Mobile Money (PayDunya)', min: 8000 }
      ]
    });
  } catch (error) {
    return res.json({
      paymentNumbers: [],
      subscriptionAmount: SUBSCRIPTION_AMOUNT,
      withdrawMethods: [
        { id: 'mobile_money', name: 'Mobile Money (PayDunya)', min: 8000 }
      ]
    });
  }
});

module.exports = router;
