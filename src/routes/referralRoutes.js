/**
 * Routes de parrainage
 */

const express = require('express');
const router = express.Router();
const { getReferralStats } = require('../services/referralService');

// GET /api/referrals/:userId - Stats de parrainage d'un utilisateur
router.get('/:userId', async (req, res) => {
  try {
    const stats = await getReferralStats(req.params.userId);
    res.json(stats);
  } catch (error) {
    console.error('Erreur stats parrainage:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
