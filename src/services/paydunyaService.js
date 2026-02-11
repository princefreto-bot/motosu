/**
 * PayDunya Service (PAYIN + verification)
 * Base URL prod: https://app.paydunya.com/api/v1
 * Security: keys ONLY from env, NEVER expose to client.
 */

const axios = require('axios');

const BASE_URL = process.env.PAYDUNYA_BASE_URL || 'https://app.paydunya.com/api/v1';
const API_KEY = process.env.PAYDUNYA_API_KEY;       // PAYDUNYA-TOKEN
const API_SECRET = process.env.PAYDUNYA_API_SECRET; // PAYDUNYA-PRIVATE-KEY
const MASTER_KEY = process.env.PAYDUNYA_MASTER_KEY; // PAYDUNYA-MASTER-KEY

function assertConfig() {
  if (!API_KEY || !API_SECRET || !MASTER_KEY) {
    const missing = [
      !API_KEY ? 'PAYDUNYA_API_KEY' : null,
      !API_SECRET ? 'PAYDUNYA_API_SECRET' : null,
      !MASTER_KEY ? 'PAYDUNYA_MASTER_KEY' : null
    ].filter(Boolean);
    throw new Error(`PayDunya config missing: ${missing.join(', ')}`);
  }
}

function paydunyaHeaders() {
  return {
    'Content-Type': 'application/json',
    'PAYDUNYA-TOKEN': API_KEY,
    'PAYDUNYA-PRIVATE-KEY': API_SECRET,
    'PAYDUNYA-MASTER-KEY': MASTER_KEY
  };
}

/**
 * Create invoice (PAYIN)
 * @returns { success, token, payment_url, raw }
 */
async function createInvoice({ amount, description, customer, returnUrl, cancelUrl, ipnUrl, customData }) {
  assertConfig();

  const payload = {
    invoice: {
      total_amount: amount,
      description
    },
    store: {
      name: 'Motosu Agencies',
      tagline: 'Partagez, Gagnez, Grandissez ensemble'
    },
    actions: {
      return_url: returnUrl,
      cancel_url: cancelUrl,
      callback_url: ipnUrl
    },
    custom_data: customData || {}
  };

  // Some PayDunya setups accept customer fields at root level; we attach if provided.
  if (customer) {
    payload.customer = {
      name: customer.name,
      phone: customer.phone,
      email: customer.email
    };
  }

  try {
    const res = await axios.post(`${BASE_URL}/checkout-invoice/create`, payload, { headers: paydunyaHeaders(), timeout: 20000 });
    const data = res.data || {};

    // Common PayDunya response: { response_code: '00', token: '...', response_text: 'payment_url' }
    if (data.response_code === '00' && (data.token || data.invoice_token) && (data.response_text || data.payment_url)) {
      return {
        success: true,
        token: data.token || data.invoice_token,
        payment_url: data.response_text || data.payment_url,
        raw: data
      };
    }

    // Accept alternative formats
    if (data.token && data.response_text) {
      return { success: true, token: data.token, payment_url: data.response_text, raw: data };
    }

    return { success: false, error: 'PayDunya invoice creation failed', raw: data };
  } catch (err) {
    const detail = err?.response?.data || err?.message;
    return { success: false, error: 'PayDunya service unavailable', raw: detail };
  }
}

/**
 * Confirm invoice status
 * @returns { success, status, raw }
 */
async function confirmInvoice(token) {
  assertConfig();
  if (!token) return { success: false, error: 'Missing token' };

  try {
    const res = await axios.post(`${BASE_URL}/checkout-invoice/confirm`, { token }, { headers: paydunyaHeaders(), timeout: 20000 });
    const data = res.data || {};

    // PayDunya typically returns response_code + status in invoice
    const status = data?.invoice?.status || data?.status || data?.invoice_status;

    const paidStatuses = ['completed', 'paid', 'confirmed', 'success', 'validated'];
    const isPaid = status && paidStatuses.includes(String(status).toLowerCase());

    if (data.response_code === '00' && isPaid) {
      return { success: true, status: status, raw: data };
    }

    return { success: false, status: status || 'unknown', raw: data };
  } catch (err) {
    const detail = err?.response?.data || err?.message;
    return { success: false, error: 'PayDunya confirm failed', raw: detail };
  }
}

module.exports = {
  createInvoice,
  confirmInvoice
};
