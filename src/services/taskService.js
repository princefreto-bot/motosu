/**
 * Service de gestion des tâches
 */

const Task = require('../models/Task');
const User = require('../models/User');
const SystemConfig = require('../models/SystemConfig');
const { getTodayDate, isTaskCyclePaused, calculateSimilarity } = require('../utils/helpers');
const { TASKS } = require('../config/constants');

/**
 * Vérifier si le cycle de tâches est en pause
 */
const checkTaskCycleStatus = async () => {
  try {
    const cycleConfig = await SystemConfig.findOne({ key: 'taskCycle' });
    if (!cycleConfig) {
      return { paused: false, message: 'Tâches disponibles' };
    }
    return isTaskCyclePaused(cycleConfig.value);
  } catch (error) {
    console.error('Erreur vérification cycle:', error.message);
    return { paused: false, message: '' };
  }
};

/**
 * Obtenir les tâches disponibles pour un utilisateur
 * @param {String} userId - ID de l'utilisateur
 */
const getAvailableTasks = async (userId) => {
  try {
    // Vérifier le cycle de pause
    const cycleStatus = await checkTaskCycleStatus();
    if (cycleStatus.paused) {
      return { tasks: [], paused: true, message: cycleStatus.message };
    }

    // Récupérer l'utilisateur
    const user = await User.findById(userId);
    if (!user) {
      return { tasks: [], paused: false, message: 'Utilisateur non trouvé' };
    }

    // Réinitialiser les tâches quotidiennes si nouveau jour
    const today = getTodayDate();
    if (user.lastTaskDate !== today) {
      user.tasksCompletedToday = [];
      user.lastTaskDate = today;
      await user.save();
    }

    // Vérifier limite journalière
    if (user.tasksCompletedToday.length >= TASKS.MAX_PER_DAY) {
      return { 
        tasks: [], 
        paused: false, 
        message: 'Limite journalière atteinte (10 tâches)',
        limitReached: true
      };
    }

    // Récupérer les tâches actives
    const tasks = await Task.find({ isActive: true });
    
    return { 
      tasks, 
      paused: false, 
      message: cycleStatus.message,
      completedToday: user.tasksCompletedToday
    };
  } catch (error) {
    console.error('Erreur récupération tâches:', error.message);
    return { tasks: [], paused: false, message: 'Erreur serveur' };
  }
};

/**
 * Valider les réponses d'une tâche
 * @param {Object} task - La tâche
 * @param {Object} answers - Les réponses de l'utilisateur
 */
const validateTaskAnswers = (task, answers) => {
  switch (task.type) {
    case 'sondage':
      // Vérifier que toutes les questions ont une réponse
      const questionsCount = task.content.questions.length;
      const answersCount = Object.keys(answers).length;
      return answersCount >= questionsCount;

    case 'verification':
      // Au moins un item vérifié
      return Array.isArray(answers) && answers.length > 0;

    case 'classification':
      // Tous les items classifiés
      const itemsCount = task.content.items.length;
      const classifiedCount = Object.keys(answers).length;
      return classifiedCount >= itemsCount;

    case 'transcription':
      // Précision minimum 80%
      const similarity = calculateSimilarity(task.content.textToTranscribe, answers);
      return similarity >= (task.content.minAccuracy || 80);

    default:
      return true;
  }
};

/**
 * Compléter une tâche
 * @param {String} userId - ID de l'utilisateur
 * @param {String} taskId - ID de la tâche
 * @param {Object} answers - Réponses de l'utilisateur
 */
const completeTask = async (userId, taskId, answers) => {
  try {
    const user = await User.findById(userId);
    const task = await Task.findById(taskId);

    if (!user || !task) {
      return { success: false, message: 'Utilisateur ou tâche non trouvé' };
    }

    // Vérifier si déjà complétée
    if (user.completedTasks.includes(taskId)) {
      return { success: false, message: 'Tâche déjà complétée' };
    }

    // Vérifier limite journalière
    const today = getTodayDate();
    if (user.lastTaskDate !== today) {
      user.tasksCompletedToday = [];
      user.lastTaskDate = today;
    }

    if (user.tasksCompletedToday.length >= TASKS.MAX_PER_DAY) {
      return { success: false, message: 'Limite journalière atteinte' };
    }

    // Valider les réponses
    if (!validateTaskAnswers(task, answers)) {
      return { success: false, message: 'Réponses incomplètes ou incorrectes' };
    }

    // Créditer les gains
    user.earnings += task.reward;
    user.totalEarnings = (user.totalEarnings || 0) + task.reward;
    user.completedTasks.push(taskId);
    user.tasksCompletedToday.push(taskId);
    await user.save();

    return { 
      success: true, 
      message: `+${task.reward} FCFA gagnés!`,
      reward: task.reward,
      newEarnings: user.earnings
    };
  } catch (error) {
    console.error('Erreur complétion tâche:', error.message);
    return { success: false, message: 'Erreur serveur' };
  }
};

module.exports = {
  checkTaskCycleStatus,
  getAvailableTasks,
  validateTaskAnswers,
  completeTask
};
