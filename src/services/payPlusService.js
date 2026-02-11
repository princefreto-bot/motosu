/**
 * DEPRECATED: PayPlus removed.
 * This file is intentionally kept as a stub to avoid accidental imports during transition.
 * Use PayDunya only.
 */

module.exports = {
  initPayment: async () => ({ success: false, error: 'PayPlus removed. Use PayDunya.' }),
  initWithdrawal: async () => ({ success: false, error: 'PayPlus removed. Use PayDunya.' }),
  verifyTransaction: async () => null
};
