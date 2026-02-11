/**
 * Routes de paiement — PAYDUNYA UNIQUEMENT
 * - POST /api/payment/init
 * - GET /api/payment/return
 * - GET /api/payment/cancel
 */

const express = require('express');
const router = express.Router();

const Payment = require('../models/Payment');
const User = require('../models/User');
const { createInvoice, confirmInvoice } = require('../services/paydunyaService');
const { distributeCommissions } = require('../services/referralService');
const { SUBSCRIPTION_AMOUNT } = require('../config/constants');

const APP_URL = process.env.APP_URL || 'https://motosu.onrender.com';

// POST /api/payment/init — Create PayDunya invoice
router.post('/init', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'UserId requis' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    const result = await createInvoice({
      amount: SUBSCRIPTION_AMOUNT,
      description: `Activation Motosu - ${user.name}`,
      customer: { name: user.name, phone: user.phone, email: user.email },
      returnUrl: `${APP_URL}/api/payment/return`,
      cancelUrl: `${APP_URL}/api/payment/cancel`,
      ipnUrl: `${APP_URL}/api/paydunya/ipn`,
      customData: { userId: String(user._id) }
    });

    if (!result.success) {
      console.error('PayDunya init error:', result.raw || result.error);
      return res.status(400).json({ error: 'Erreur initialisation PayDunya' });
    }

    // Save payment pending
    const payment = new Payment({
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      amount: SUBSCRIPTION_AMOUNT,
      transactionId: result.token,
      status: 'pending'
    });
    await payment.save();

    return res.json({ success: true, payment_url: result.payment_url, token: result.token });
  } catch (err) {
    console.error('Erreur init PayDunya:', err.message);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/payment/return — User came back after payment
router.get('/return', async (req, res) => {
  const token = req.query?.token;
  if (token) {
    try {
      const confirm = await confirmInvoice(token);
      if (confirm.success) {
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
      console.error('PayDunya return confirm error:', e.message);
    }
  }
  return res.redirect('/');
});

// GET /api/payment/cancel — Cancel page
router.get('/cancel', (req, res) => {
  return res.redirect('/');
});

module.exports = router;
