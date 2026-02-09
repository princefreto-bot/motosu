/**
 * Routes des formations
 */

const express = require('express');
const router = express.Router();
const Formation = require('../models/Formation');

// GET /api/formations - Toutes les formations actives
router.get('/', async (req, res) => {
  try {
    const formations = await Formation.find({ isActive: true })
      .sort({ createdAt: -1 });
    res.json(formations);
  } catch (error) {
    console.error('Erreur récupération formations:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/formations/:id - Une formation spécifique
router.get('/:id', async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id);
    
    if (!formation) {
      return res.status(404).json({ error: 'Formation non trouvée' });
    }
    
    res.json(formation);
  } catch (error) {
    console.error('Erreur récupération formation:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
