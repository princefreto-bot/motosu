/**
 * Routes de retrait — PAYDUNYA UNIQUEMENT (demande)
 * Minimum FIXE = 8000
 * Statuts: pending/approved/rejected
 */

const express = require('express');
const router = express.Router();

const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');
const { WITHDRAWAL } = require('../config/constants');

// POST /api/withdraw — Demander un retrait (PayDunya ONLY)
router.post('/', async (req, res) => {
  try {
    const { userId, amount, phoneNumber, operator } = req.body;

    if (!userId || !amount || !phoneNumber) {
      return res.status(400).json({ error: 'Données incomplètes' });
    }

    if (Number(amount) < 8000) {
      return res.status(400).json({ error: 'Minimum withdrawal is 8000' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    if (user.earnings < Number(amount)) {
      return res.status(400).json({ error: `Solde insuffisant. Disponible: ${user.earnings} FCFA` });
    }

    const pendingWithdrawal = await Withdrawal.findOne({ userId: user._id, status: 'pending' });
    if (pendingWithdrawal) {
      return res.status(400).json({ error: 'Vous avez déjà un retrait en attente' });
    }

    const withdrawal = new Withdrawal({
      userId: user._id,
      userName: user.name,
      userPhone: user.phone,
      amount: Number(amount),
      method: 'mobile_money',
      accountNumber: String(phoneNumber),
      accountName: operator || 'Mobile Money',
      status: 'pending'
    });

    await withdrawal.save();

    // Debit immediately (business rule)
    user.earnings -= Number(amount);
    await user.save();

    return res.json({
      success: true,
      message: 'Demande de retrait enregistrée.',
      withdrawal
    });

  } catch (error) {
    console.error('Erreur retrait:', error.message);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/withdrawals/user/:userId — Historique
router.get('/user/:userId', async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    return res.json(withdrawals);
  } catch (error) {
    console.error('Erreur historique:', error.message);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
