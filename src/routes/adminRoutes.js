/**
 * Routes Admin
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Withdrawal = require('../models/Withdrawal');
const Video = require('../models/Video');
const Task = require('../models/Task');
const Formation = require('../models/Formation');
const Config = require('../models/Config');
const SystemConfig = require('../models/SystemConfig');
const Payment = require('../models/Payment');
const { distributeCommissions } = require('../services/referralService');
const { verifyAdmin, verifyToken } = require('../middlewares/auth');
const { adminLimiter } = require('../middlewares/rateLimiter');

// GET /api/admin/global-stats - Stats Globales Publiques (Total Payé + Total Gains)
// Placée AVANT les middlewares admin pour être accessible publiquement
router.get('/global-stats', async (req, res) => {
  try {
    const approvedWithdrawals = await Withdrawal.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const totalEarningsResult = await User.aggregate([
       { $group: { _id: null, total: { $sum: '$totalEarnings' } } }
    ]);

    res.json({
      totalPaid: approvedWithdrawals[0]?.total || 0,
      totalEarnings: totalEarningsResult[0]?.total || 0
    });
  } catch (error) {
    res.json({ totalPaid: 0, totalEarnings: 0 });
  }
});

// ==========================================
// Protection globale admin pour la suite
// ==========================================
router.use(verifyToken);
router.use(verifyAdmin);
router.use(adminLimiter);

// GET /api/admin/stats - Stats générales Dashboard Admin
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const validatedUsers = await User.countDocuments({ status: 'validated' });
    const pendingUsers = await User.countDocuments({ status: { $in: ['pending', 'pending_payment'] } });
    const pendingWithdrawals = await Withdrawal.countDocuments({ status: 'pending' });
    const videosCount = await Video.countDocuments();
    
    const totalWithdrawalsAgg = await Withdrawal.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    res.json({
      totalUsers,
      validatedUsers,
      pendingUsers,
      pendingWithdrawals,
      videosCount,
      totalWithdrawals: totalWithdrawalsAgg[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/admin/pending - Utilisateurs en attente
router.get('/pending', async (req, res) => {
  try {
    const users = await User.find({ status: { $in: ['pending', 'pending_payment'] } })
      .sort({ createdAt: -1 })
      .select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/admin/users - Tous les utilisateurs
router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .select('-password')
      .limit(100); // Limite pour perf
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/admin/validate/:userId
router.post('/validate/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    
    user.status = 'validated';
    user.subscriptionDate = new Date();
    await user.save();
    
    await distributeCommissions(user);
    
    res.json({ success: true, message: 'Utilisateur validé' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/admin/reject/:userId
router.post('/reject/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    
    user.status = 'rejected';
    await user.save();
    
    res.json({ success: true, message: 'Utilisateur refusé' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/admin/withdrawals
router.get('/withdrawals', async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find()
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/admin/withdraw/approve/:id
router.post('/withdraw/approve/:id', async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) return res.status(404).json({ error: 'Retrait non trouvé' });
    
    if (withdrawal.status !== 'pending') return res.status(400).json({ error: 'Déjà traité' });
    
    withdrawal.status = 'approved';
    withdrawal.approvedAt = new Date();
    await withdrawal.save();
    
    res.json({ success: true, message: 'Retrait approuvé' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/admin/withdraw/reject/:id
router.post('/withdraw/reject/:id', async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) return res.status(404).json({ error: 'Retrait non trouvé' });
    
    if (withdrawal.status !== 'pending') return res.status(400).json({ error: 'Déjà traité' });
    
    // Rembourser l'utilisateur
    const user = await User.findById(withdrawal.userId);
    if (user) {
      user.earnings += withdrawal.amount;
      await user.save();
    }
    
    withdrawal.status = 'rejected';
    await withdrawal.save();
    
    res.json({ success: true, message: 'Retrait refusé et remboursé' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/admin/videos
router.get('/videos', async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/admin/videos
router.post('/videos', async (req, res) => {
  try {
    const video = new Video(req.body);
    await video.save();
    res.json({ success: true, video });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/admin/videos/:id
router.delete('/videos/:id', async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/admin/tasks
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/admin/tasks/:id
router.put('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/admin/tasks/:id
router.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/admin/tasks/cycle
router.post('/tasks/cycle', async (req, res) => {
  try {
    const { activeDays, pauseDays } = req.body;
    await SystemConfig.findOneAndUpdate(
      { key: 'taskCycle' },
      { value: { startDate: new Date().toISOString(), activeDays, pauseDays } },
      { upsert: true }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/admin/formations
router.get('/formations', async (req, res) => {
  try {
    const formations = await Formation.find().sort({ createdAt: -1 });
    res.json(formations);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/admin/formations
router.post('/formations', async (req, res) => {
  try {
    const formation = new Formation(req.body);
    await formation.save();
    res.json({ success: true, formation });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/admin/formations/:id
router.delete('/formations/:id', async (req, res) => {
  try {
    await Formation.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/admin/config
router.get('/config', async (req, res) => {
  try {
    const paymentNumbers = await Config.findOne({ key: 'paymentNumbers' });
    res.json({
      paymentNumbers: paymentNumbers?.value || []
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/admin/config/payment-numbers
router.post('/config/payment-numbers', async (req, res) => {
  try {
    const { paymentNumbers } = req.body;
    await Config.findOneAndUpdate(
      { key: 'paymentNumbers' },
      { value: paymentNumbers },
      { upsert: true }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
