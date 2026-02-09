/**
 * Constantes de l'application
 * Montants, limites, configurations
 */

module.exports = {
  SUBSCRIPTION_AMOUNT: 4000,
  
  REFERRAL_COMMISSIONS: {
    LEVEL_1: 2000,
    LEVEL_2: 800,
    LEVEL_3: 400
  },
  
  WITHDRAWAL: {
    MINIMUM: 15000,
    METHODS: ['moov', 'mix']
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
  
  DEFAULT_PAYMENT_NUMBERS: [
    { operator: 'Moov Money', number: '+225 01 01 01 01 01', name: 'MOTOSU AGENCIES' },
    { operator: 'Orange Money', number: '+225 07 07 07 07 07', name: 'MOTOSU AGENCIES' },
    { operator: 'MTN Money', number: '+225 05 05 05 05 05', name: 'MOTOSU AGENCIES' },
    { operator: 'Wave', number: '+225 01 02 03 04 05', name: 'MOTOSU AGENCIES' }
  ],
  
  SLOGAN: "Partagez, Gagnez, Grandissez ensemble"
};
