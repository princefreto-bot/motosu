/**
 * Routes utilisateur
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/user/:userId
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      status: user.status,
      isAdmin: user.isAdmin,
      referralCode: user.referralCode,
      earnings: user.earnings,
      completedTasks: user.completedTasks || [],
      watchedVideos: user.watchedVideos || [],
      tasksCompletedToday: user.tasksCompletedToday || []
    });
  } catch (error) {
    console.error('Erreur récupération utilisateur:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/user/:userId/dashboard
router.get('/:userId/dashboard', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Compter les filleuls niveau 1
    const referralsCount = await User.countDocuments({ referredBy: user._id });

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        earnings: user.earnings,
        status: user.status,
        referralCode: user.referralCode
      },
      stats: {
        tasksCompleted: user.completedTasks?.length || 0,
        videosWatched: user.watchedVideos?.length || 0,
        referrals: referralsCount,
        todayTasks: user.tasksCompletedToday?.length || 0
      }
    });
  } catch (error) {
    console.error('Erreur dashboard:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
