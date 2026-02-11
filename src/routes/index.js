/**
 * Router principal - Agrégation de toutes les routes
 */

const express = require('express');
const router = express.Router();

// Import des routes
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const taskRoutes = require('./taskRoutes');
const videoRoutes = require('./videoRoutes');
const formationRoutes = require('./formationRoutes');
const referralRoutes = require('./referralRoutes');
const withdrawalRoutes = require('./withdrawalRoutes');
const paymentRoutes = require('./paymentRoutes');
const paydunyaRoutes = require('./paydunyaRoutes');
const adminRoutes = require('./adminRoutes');
const configRoutes = require('./configRoutes');

// Montage des routes
router.use('/', authRoutes);
router.use('/user', userRoutes);
router.use('/tasks', taskRoutes);
router.use('/videos', videoRoutes);
router.use('/formations', formationRoutes);
router.use('/referrals', referralRoutes);
router.use('/withdraw', withdrawalRoutes);      // POST /api/withdraw
router.use('/withdrawals', withdrawalRoutes);    // GET /api/withdrawals/user/:id
router.use('/payment', paymentRoutes);
router.use('/paydunya', paydunyaRoutes);         // POST /api/paydunya/ipn
router.use('/admin', adminRoutes);
router.use('/', configRoutes);

// Route de santé
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Motosu Agencies API'
  });
});

module.exports = router;
