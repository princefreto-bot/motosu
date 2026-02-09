/**
 * Routes administrateur
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Video = require('../models/Video');
const Task = require('../models/Task');
const Formation = require('../models/Formation');
const Withdrawal = require('../models/Withdrawal');
const Payment = require('../models/Payment');
const Config = require('../models/Config');
const SystemConfig = require('../models/SystemConfig');
const { distributeCommissions } = require('../services/referralService');
const { extractYouTubeId, extractTikTokId } = require('../utils/helpers');

// GET /api/admin/stats - Statistiques générales
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isAdmin: false });
    const validatedUsers = await User.countDocuments({ status: 'validated', isAdmin: false });
    const pendingUsers = await User.countDocuments({ 
      status: { $in: ['pending', 'pending_payment'] }, 
      isAdmin: false 
    });
    const pendingWithdrawals = await Withdrawal.countDocuments({ status: 'pending' });
    const videosCount = await Video.countDocuments();
    const tasksCount = await Task.countDocuments();
    const formationsCount = await Formation.countDocuments();
    
    const approvedWithdrawals = await Withdrawal.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      totalUsers,
      validatedUsers,
      pendingUsers,
      pendingWithdrawals,
      videosCount,
      tasksCount,
      formationsCount,
      totalWithdrawals: approvedWithdrawals[0]?.total || 0
    });
  } catch (error) {
    console.error('Erreur stats admin:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/admin/pending - Utilisateurs en attente
router.get('/pending', async (req, res) => {
  try {
    const pending = await User.find({ 
      status: { $in: ['pending', 'pending_payment'] },
      isAdmin: false 
    }).sort({ createdAt: -1 });
    res.json(pending);
  } catch (error) {
    console.error('Erreur pending:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/admin/users - Tous les utilisateurs
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Erreur users:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/admin/validate/:userId - Valider un utilisateur
router.post('/validate/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    user.status = 'validated';
    user.subscriptionDate = new Date();
    await user.save();

    // Distribuer les commissions de parrainage
    await distributeCommissions(user);

    // Mettre à jour le paiement associé
    await Payment.findOneAndUpdate(
      { userId: user._id, status: 'pending' },
      { status: 'validated' }
    );

    res.json({ success: true, message: 'Utilisateur validé avec succès' });
  } catch (error) {
    console.error('Erreur validation:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/admin/reject/:userId - Refuser un utilisateur
router.post('/reject/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    user.status = 'rejected';
    user.paymentProof = null;
    await user.save();

    // Mettre à jour le paiement associé
    await Payment.findOneAndUpdate(
      { userId: user._id, status: 'pending' },
      { status: 'rejected' }
    );

    res.json({ success: true, message: 'Utilisateur refusé' });
  } catch (error) {
    console.error('Erreur refus:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/admin/withdrawals - Tous les retraits
router.get('/withdrawals', async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find()
      .sort({ createdAt: -1 });
    res.json(withdrawals);
  } catch (error) {
    console.error('Erreur withdrawals:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/admin/withdraw/approve/:id - Approuver un retrait
router.post('/withdraw/approve/:id', async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) {
      return res.status(404).json({ error: 'Retrait non trouvé' });
    }

    withdrawal.status = 'approved';
    withdrawal.approvedAt = new Date();
    await withdrawal.save();

    res.json({ success: true, message: 'Retrait approuvé' });
  } catch (error) {
    console.error('Erreur approbation retrait:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/admin/withdraw/reject/:id - Refuser un retrait (rembourser)
router.post('/withdraw/reject/:id', async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) {
      return res.status(404).json({ error: 'Retrait non trouvé' });
    }

    // Rembourser l'utilisateur
    const user = await User.findById(withdrawal.userId);
    if (user) {
      user.earnings += withdrawal.amount;
      await user.save();
    }

    withdrawal.status = 'rejected';
    await withdrawal.save();

    res.json({ success: true, message: 'Retrait refusé et montant remboursé' });
  } catch (error) {
    console.error('Erreur refus retrait:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/admin/videos - Toutes les vidéos
router.get('/videos', async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    console.error('Erreur videos admin:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/admin/videos - Ajouter une vidéo
router.post('/videos', async (req, res) => {
  try {
    const { platform, title, url, duration, reward } = req.body;

    // Extraire l'ID de la vidéo
    let videoId = '';
    if (platform === 'youtube') {
      videoId = extractYouTubeId(url) || '';
    } else if (platform === 'tiktok') {
      videoId = extractTikTokId(url) || '';
    }

    const video = new Video({
      platform,
      title,
      url,
      videoId,
      duration,
      reward
    });

    await video.save();
    res.status(201).json({ success: true, message: 'Vidéo ajoutée', video });
  } catch (error) {
    console.error('Erreur ajout vidéo:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/admin/videos/:id - Supprimer une vidéo
router.delete('/videos/:id', async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Vidéo supprimée' });
  } catch (error) {
    console.error('Erreur suppression vidéo:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/admin/tasks - Toutes les tâches
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Erreur tasks admin:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/admin/tasks/:id - Modifier une tâche
router.put('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, message: 'Tâche modifiée', task });
  } catch (error) {
    console.error('Erreur modification tâche:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/admin/tasks/:id - Supprimer une tâche
router.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Tâche supprimée' });
  } catch (error) {
    console.error('Erreur suppression tâche:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/admin/tasks/cycle - Configurer le cycle de pause
router.post('/tasks/cycle', async (req, res) => {
  try {
    const { activeDays, pauseDays } = req.body;

    await SystemConfig.findOneAndUpdate(
      { key: 'taskCycle' },
      { 
        key: 'taskCycle',
        value: {
          startDate: new Date().toISOString(),
          activeDays: activeDays || 2,
          pauseDays: pauseDays || 3
        }
      },
      { upsert: true }
    );

    res.json({ success: true, message: 'Cycle de tâches mis à jour' });
  } catch (error) {
    console.error('Erreur cycle tâches:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/admin/formations - Toutes les formations
router.get('/formations', async (req, res) => {
  try {
    const formations = await Formation.find().sort({ createdAt: -1 });
    res.json(formations);
  } catch (error) {
    console.error('Erreur formations admin:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/admin/formations - Ajouter une formation
router.post('/formations', async (req, res) => {
  try {
    const { title, description, link, image, category } = req.body;

    const formation = new Formation({
      title,
      description,
      link,
      image: image || '',
      category: category || 'Général',
      isActive: true
    });

    await formation.save();
    res.status(201).json({ success: true, message: 'Formation ajoutée', formation });
  } catch (error) {
    console.error('Erreur ajout formation:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/admin/formations/:id - Supprimer une formation
router.delete('/formations/:id', async (req, res) => {
  try {
    await Formation.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Formation supprimée' });
  } catch (error) {
    console.error('Erreur suppression formation:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/admin/payments - Tous les paiements
router.get('/payments', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    console.error('Erreur payments admin:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/admin/config - Configuration
router.get('/config', async (req, res) => {
  try {
    const paymentNumbers = await Config.findOne({ key: 'paymentNumbers' });
    const subscriptionAmount = await Config.findOne({ key: 'subscriptionAmount' });

    res.json({
      paymentNumbers: paymentNumbers?.value || [],
      subscriptionAmount: subscriptionAmount?.value || 4000
    });
  } catch (error) {
    console.error('Erreur config admin:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/admin/config/payment-numbers - Modifier les numéros de paiement
router.post('/config/payment-numbers', async (req, res) => {
  try {
    const { paymentNumbers } = req.body;

    await Config.findOneAndUpdate(
      { key: 'paymentNumbers' },
      { key: 'paymentNumbers', value: paymentNumbers },
      { upsert: true }
    );

    res.json({ success: true, message: 'Numéros de paiement mis à jour' });
  } catch (error) {
    console.error('Erreur update payment numbers:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
