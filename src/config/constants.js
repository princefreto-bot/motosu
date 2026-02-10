/**
 * Constantes de l'application
 * NOUVEAU SYSTÈME PAYPLUS
 */

module.exports = {
  SUBSCRIPTION_AMOUNT: 4000,
  
  REFERRAL_COMMISSIONS: {
    LEVEL_1: 2000,
    LEVEL_2: 800,
    LEVEL_3: 400
  },
  
  WITHDRAWAL: {
    MINIMUM: 8000, // Nouveau minimum fixe
    METHODS: ['mobile_money'] // Uniquement via PayPlus
  },
  
  TASKS: {
    MAX_PER_DAY: 10,
    CYCLE: {
      ACTIVE_DAYS: 2,
      PAUSE_DAYS: 3
    }
  },
  
  VIDEOS: {
    MIN_WATCH_PERCENT: 0.8,
    REWARD_PER_MINUTE: 5
  },
  
  USER_STATUS: {
    PENDING: 'pending',
    PENDING_PAYMENT: 'pending_payment',
    VALIDATED: 'validated',
    REJECTED: 'rejected'
  },
  
  JWT: {
    EXPIRES_IN: '30d'
  },
  
  // Configuration UI (Plus de numéros manuels)
  SLOGAN: "Partagez, Gagnez, Grandissez ensemble"
};
