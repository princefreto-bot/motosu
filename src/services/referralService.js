/**
 * Service de gestion des parrainages
 */

const User = require('../models/User');
const { REFERRAL_COMMISSIONS } = require('../config/constants');

/**
 * Distribuer les commissions de parrainage sur 3 niveaux
 * @param {Object} newUser - L'utilisateur qui vient d'être validé
 */
const distributeCommissions = async (newUser) => {
  try {
    if (!newUser.referredBy) return;

    // Niveau 1
    const level1 = await User.findById(newUser.referredBy);
    if (level1 && level1.status === 'validated') {
      level1.earnings += REFERRAL_COMMISSIONS.LEVEL_1;
      level1.totalEarnings = (level1.totalEarnings || 0) + REFERRAL_COMMISSIONS.LEVEL_1;
      await level1.save();

      // Niveau 2
      if (level1.referredBy) {
        const level2 = await User.findById(level1.referredBy);
        if (level2 && level2.status === 'validated') {
          level2.earnings += REFERRAL_COMMISSIONS.LEVEL_2;
          level2.totalEarnings = (level2.totalEarnings || 0) + REFERRAL_COMMISSIONS.LEVEL_2;
          await level2.save();

          // Niveau 3
          if (level2.referredBy) {
            const level3 = await User.findById(level2.referredBy);
            if (level3 && level3.status === 'validated') {
              level3.earnings += REFERRAL_COMMISSIONS.LEVEL_3;
              level3.totalEarnings = (level3.totalEarnings || 0) + REFERRAL_COMMISSIONS.LEVEL_3;
              await level3.save();
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Erreur distribution commissions:', error.message);
  }
};

const getReferralStats = async (userId) => {
  try {
    const level1Users = await User.find({ referredBy: userId }).select('name status createdAt');
    const level1Ids = level1Users.map(u => u._id);
    const level2Users = await User.find({ referredBy: { $in: level1Ids } }).select('name status createdAt');
    const level2Ids = level2Users.map(u => u._id);
    const level3Users = await User.find({ referredBy: { $in: level2Ids } }).select('name status createdAt');

    const level1Validated = level1Users.filter(u => u.status === 'validated').length;
    const level2Validated = level2Users.filter(u => u.status === 'validated').length;
    const level3Validated = level3Users.filter(u => u.status === 'validated').length;

    return {
      level1: { users: level1Users, total: level1Validated * REFERRAL_COMMISSIONS.LEVEL_1 },
      level2: { users: level2Users, total: level2Validated * REFERRAL_COMMISSIONS.LEVEL_2 },
      level3: { users: level3Users, total: level3Validated * REFERRAL_COMMISSIONS.LEVEL_3 }
    };
  } catch (error) {
    console.error('Erreur stats parrainage:', error.message);
    return { level1: { users: [], total: 0 }, level2: { users: [], total: 0 }, level3: { users: [], total: 0 } };
  }
};

module.exports = { distributeCommissions, getReferralStats };
