/**
 * Routes des vidéos
 */

const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const User = require('../models/User');

// GET /api/videos - Toutes les vidéos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    console.error('Erreur récupération vidéos:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/videos/:videoId/watch - Marquer une vidéo comme vue
router.post('/:videoId/watch', async (req, res) => {
  try {
    const { userId, watchTime } = req.body;
    const { videoId } = req.params;

    const user = await User.findById(userId);
    const video = await Video.findById(videoId);

    if (!user || !video) {
      return res.status(404).json({ error: 'Utilisateur ou vidéo non trouvé' });
    }

    // Vérifier si déjà regardée
    if (user.watchedVideos.includes(videoId)) {
      return res.status(400).json({ error: 'Vidéo déjà regardée' });
    }

    // Vérifier le temps de visionnage (80% minimum)
    const requiredTime = video.duration * 60 * 0.8;
    if (watchTime < requiredTime) {
      return res.status(400).json({ 
        error: `Regardez au moins 80% de la vidéo (${Math.ceil(requiredTime / 60)} minutes)` 
      });
    }

    // Créditer les gains
    user.earnings += video.reward;
    user.totalEarnings = (user.totalEarnings || 0) + video.reward;
    user.watchedVideos.push(videoId);
    await user.save();

    res.json({
      success: true,
      message: `+${video.reward} FCFA gagnés!`,
      reward: video.reward,
      newEarnings: user.earnings
    });
  } catch (error) {
    console.error('Erreur visionnage vidéo:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
