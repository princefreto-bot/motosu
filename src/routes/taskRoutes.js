/**
 * Routes des tâches
 */

const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');
const { getAvailableTasks, completeTask, checkTaskCycleStatus } = require('../services/taskService');
const { getTodayDate } = require('../utils/helpers');

// GET /api/tasks - Toutes les tâches actives
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ isActive: true });
    res.json(tasks);
  } catch (error) {
    console.error('Erreur récupération tâches:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/tasks/status - Statut du cycle
router.get('/status', async (req, res) => {
  try {
    const status = await checkTaskCycleStatus();
    res.json(status);
  } catch (error) {
    console.error('Erreur statut cycle:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/tasks/daily/:userId - Tâches disponibles pour un utilisateur
router.get('/daily/:userId', async (req, res) => {
  try {
    const result = await getAvailableTasks(req.params.userId);
    res.json(result);
  } catch (error) {
    console.error('Erreur tâches quotidiennes:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/tasks/:taskId/complete - Compléter une tâche
router.post('/:taskId/complete', async (req, res) => {
  try {
    const { userId, answers } = req.body;
    const { taskId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'UserId requis' });
    }

    const result = await completeTask(userId, taskId, answers);
    
    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }

    res.json(result);
  } catch (error) {
    console.error('Erreur complétion tâche:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
