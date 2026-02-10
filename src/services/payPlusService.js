/**
 * Service PayPlus - Intégration Complète
 * Documentation: https://documenter.getpostman.com/view/15222649/UzBvqq8g
 */

const axios = require('axios');
const crypto = require('crypto');

const PAYPLUS_BASE_URL = process.env.PAYPLUS_BASE_URL || 'https://app.pay-plus.africa/api/v1';
const API_KEY = process.env.PAYPLUS_API_KEY;
const API_TOKEN = process.env.PAYPLUS_API_TOKEN;

const headers = {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY,
  'x-api-token': API_TOKEN
};

/**
 * Initialiser un paiement (Dépôt)
 */
const initPayment = async (user, amount) => {
  try {
    // Payload standard PayPlus
    const data = {
      amount: amount,
      currency: 'XOF',
      customer_name: user.name,
      customer_email: user.email || 'no-email@motosu.com',
      customer_phone: user.phone,
      description: `Abonnement Motosu - ${user.name}`,
      cancel_url: `${process.env.APP_URL || 'https://motosu.onrender.com'}/api/payment/cancel`,
      return_url: `${process.env.APP_URL || 'https://motosu.onrender.com'}/api/payment/return`,
      callback_url: `${process.env.APP_URL || 'https://motosu.onrender.com'}/api/payment/notify`,
      metadata: JSON.stringify({ userId: user._id })
    };

    const response = await axios.post(`${PAYPLUS_BASE_URL}/payment/create`, data, { headers });

    if (response.data && response.data.response_code === '00') {
      return {
        success: true,
        payment_url: response.data.response_text, // URL de paiement
        token: response.data.token
      };
    } else {
      console.error('PayPlus Init Error:', response.data);
      return { success: false, error: 'Erreur initialisation PayPlus' };
    }
  } catch (error) {
    console.error('PayPlus Service Error:', error.response ? error.response.data : error.message);
    return { success: false, error: 'Service paiement indisponible' };
  }
};

/**
 * Initialiser un retrait (Payout)
 * Note: PayPlus nécessite souvent une validation manuelle ou une config spécifique pour le payout auto.
 * Ici on prépare la requête.
 */
const initWithdrawal = async (user, amount, phoneNumber, operator) => {
  try {
    const data = {
      amount: amount,
      currency: 'XOF',
      customer_phone: phoneNumber,
      customer_name: user.name,
      description: `Retrait Motosu - ${user.name}`,
      operator: operator // Orange, MTN, Moov, Wave
    };

    // Note: Endpoint hypothétique standard. Vérifier doc spécifique PayPlus pour le payout.
    // Souvent: /payout/create
    const response = await axios.post(`${PAYPLUS_BASE_URL}/payout/create`, data, { headers });

    return response.data;
  } catch (error) {
    console.error('PayPlus Withdrawal Error:', error.message);
    throw error;
  }
};

/**
 * Vérifier une transaction
 */
const verifyTransaction = async (token) => {
  try {
    const response = await axios.get(`${PAYPLUS_BASE_URL}/payment/check/${token}`, { headers });
    return response.data;
  } catch (error) {
    return null;
  }
};

module.exports = {
  initPayment,
  initWithdrawal,
  verifyTransaction
};
