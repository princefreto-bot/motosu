/**
 * Fonctions utilitaires
 */

// Générer un code de parrainage unique
const generateReferralCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'MOT';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Générer un ID de transaction
const generateTransactionId = () => {
  return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Formater la date
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Obtenir la date du jour (YYYY-MM-DD)
const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

// Calculer la similarité entre deux textes (pour transcription)
const calculateSimilarity = (text1, text2) => {
  const s1 = text1.toLowerCase().trim();
  const s2 = text2.toLowerCase().trim();
  
  if (s1 === s2) return 100;
  
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  if (longer.length === 0) return 100;
  
  let matches = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (shorter[i] === longer[i]) matches++;
  }
  
  return Math.round((matches / longer.length) * 100);
};

// Vérifier si le cycle de tâches est en pause
const isTaskCyclePaused = (cycleConfig) => {
  if (!cycleConfig || !cycleConfig.startDate) {
    return { paused: false, message: '' };
  }

  const startDate = new Date(cycleConfig.startDate);
  const today = new Date();
  const daysDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  
  const activeDays = cycleConfig.activeDays || 2;
  const pauseDays = cycleConfig.pauseDays || 3;
  const cycleLength = activeDays + pauseDays;
  
  const dayInCycle = daysDiff % cycleLength;
  const isPaused = dayInCycle >= activeDays;
  
  let message = '';
  if (isPaused) {
    const daysUntilActive = cycleLength - dayInCycle;
    message = `Pause en cours. Reprise dans ${daysUntilActive} jour(s).`;
  } else {
    const daysUntilPause = activeDays - dayInCycle;
    message = `${daysUntilPause} jour(s) restant(s) avant la pause.`;
  }
  
  return { paused: isPaused, message };
};

// Extraire l'ID d'une URL YouTube
const extractYouTubeId = (url) => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

// Extraire l'ID d'une URL TikTok
const extractTikTokId = (url) => {
  const match = url.match(/video\/(\d+)/);
  return match ? match[1] : null;
};

module.exports = {
  generateReferralCode,
  generateTransactionId,
  formatDate,
  getTodayDate,
  calculateSimilarity,
  isTaskCyclePaused,
  extractYouTubeId,
  extractTikTokId
};
