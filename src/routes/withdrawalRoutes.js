/**
 * Routes de retrait
 */

const express = require('express');
const router = express.Router();
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');
const { WITHDRAWAL } = require('../config/constants');
const { withdrawRules, handleValidation } = require('../middlewares/validator');

// POST /api/withdraw - Demander un retrait
router.post('/', async (req, res) => {
  try {
    const { userId, amount, method, accountNumber, accountName } = req.body;

    // Validation
    if (!userId || !amount || !method || !accountNumber) {
      return res.status(400).json({ error: 'Données incomplètes' });
    }

    // Vérifier méthode
    if (!WITHDRAWAL.METHODS.includes(method)) {
      return res.status(400).json({ error: 'Méthode de retrait invalide' });
    }

    // Vérifier montant minimum
    if (amount < WITHDRAWAL.MINIMUM) {
      return res.status(400).json({ 
        error: `Montant minimum: ${WITHDRAWAL.MINIMUM} FCFA` 
      });
    }

    // Trouver l'utilisateur
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Vérifier le solde
    if (user.earnings < amount) {
      return res.status(400).json({ 
        error: `Solde insuffisant. Disponible: ${user.earnings} FCFA` 
      });
    }

    // Créer la demande de retrait
    const withdrawal = new Withdrawal({
      userId: user._id,
      userName: user.name,
      userPhone: user.phone,
      amount,
      method,
      accountNumber,
      accountName: accountName || user.name,
      status: 'pending'
    });

    await withdrawal.save();

    // Déduire du solde
    user.earnings -= amount;
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Demande de retrait enregistrée. Traitement sous 24-48h.',
      withdrawal: {
        _id: withdrawal._id,
        amount: withdrawal.amount,
        method: withdrawal.method,
        status: withdrawal.status
      }
    });
  } catch (error) {
    console.error('Erreur demande retrait:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/withdrawals/user/:userId - Historique des retraits d'un utilisateur
router.get('/user/:userId', async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(withdrawals);
  } catch (error) {
    console.error('Erreur historique retraits:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
