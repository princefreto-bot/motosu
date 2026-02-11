/**
 * PayDunya IPN Webhook
 * Required endpoint: POST https://motosu.onrender.com/api/paydunya/ipn
 */

const express = require('express');
const router = express.Router();

const Payment = require('../models/Payment');
const User = require('../models/User');
const { confirmInvoice } = require('../services/paydunyaService');
const { distributeCommissions } = require('../services/referralService');

// NOTE: PayDunya can send various payloads. We accept token from body or query.
router.post('/ipn', async (req, res) => {
  try {
    const token = req.body?.token || req.body?.invoice_token || req.query?.token;

    if (!token) {
      return res.status(400).json({ success: false, error: 'Missing token' });
    }

    // Confirm server-side (anti-fraud)
    const confirm = await confirmInvoice(token);
    if (!confirm.success) {
      console.log('PayDunya IPN not paid or confirm failed:', { token, confirm: confirm.status || confirm.error, raw: confirm.raw });
      // Always 200 to avoid PayDunya retries storms; but include response_code semantics
      return res.json({ success: true, message: 'IPN received (not paid)' });
    }

    // Find payment record
    const payment = await Payment.findOne({ transactionId: token });
    if (!payment) {
      console.log('PayDunya IPN: payment not found for token:', token);
      return res.json({ success: true, message: 'IPN received (payment not found)' });
    }

    // Idempotent: prevent double credit
    if (payment.status === 'validated') {
      return res.json({ success: true, message: 'Already validated' });
    }

    payment.status = 'validated';
    await payment.save();

    const user = await User.findById(payment.userId);
    if (user && user.status !== 'validated') {
      user.status = 'validated';
      user.subscriptionDate = new Date();
      await user.save();
      await distributeCommissions(user);
    }

    console.log('✅ PayDunya payment validated via IPN:', token);
    return res.json({ success: true, message: 'OK' });
  } catch (err) {
    console.error('PayDunya IPN error:', err.message);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
