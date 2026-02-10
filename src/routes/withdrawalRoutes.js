/**
 * Routes de retrait - SYSTÈME PAYPLUS EXCLUSIF
 */

const express = require('express');
const router = express.Router();
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');
const { WITHDRAWAL } = require('../config/constants');
const { initWithdrawal } = require('../services/payPlusService');

// POST /api/withdraw - Demander un retrait
router.post('/', async (req, res) => {
  try {
    const { userId, amount, phoneNumber, operator } = req.body;

    if (!userId || !amount || !phoneNumber) {
      return res.status(400).json({ error: 'Données incomplètes' });
    }

    if (amount < WITHDRAWAL.MINIMUM) {
      return res.status(400).json({ error: `Minimum de retrait : ${WITHDRAWAL.MINIMUM} FCFA` });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    if (user.earnings < amount) {
      return res.status(400).json({ error: `Solde insuffisant. Disponible: ${user.earnings} FCFA` });
    }

    // Vérifier double retrait
    const pendingWithdrawal = await Withdrawal.findOne({ userId: user._id, status: 'pending' });
    if (pendingWithdrawal) {
      return res.status(400).json({ error: 'Vous avez déjà un retrait en attente' });
    }

    // Créer la demande
    const withdrawal = new Withdrawal({
      userId: user._id,
      userName: user.name,
      userPhone: user.phone,
      amount,
      method: 'mobile_money', // Uniquement via PayPlus
      accountNumber: phoneNumber,
      accountName: operator || 'Mobile Money',
      status: 'pending'
    });

    await withdrawal.save();

    // Déduire du solde IMMÉDIATEMENT (règle business)
    user.earnings -= amount;
    await user.save();

    // Tenter l'initiation PayPlus (Optionnel: peut être fait manuellement par l'admin si pas automatique)
    // Pour l'instant on garde en pending pour validation admin ou traitement auto
    
    res.json({
      success: true,
      message: 'Demande de retrait enregistrée.',
      withdrawal
    });

  } catch (error) {
    console.error('Erreur retrait:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/withdrawals/user/:userId - Historique
router.get('/user/:userId', async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(withdrawals);
  } catch (error) {
    console.error('Erreur historique:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
