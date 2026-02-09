/**
 * MOTOSU AGENCIES - Core Module
 * State, utilitaires, API, helpers
 */

// État global de l'application
let state = {
  currentUser: null,
  currentPage: 'login',
  config: { paymentNumbers: [], withdrawMethods: [], subscriptionAmount: 4000 },
  tasks: [],
  videos: [],
  formations: [],
  taskStatus: { isActive: true, paused: false, message: '' },
  currentTask: null,
  currentVideo: null,
  referrals: null,
  withdrawals: [],
  surveyAnswers: {},
  adminData: { pending: [], users: [], withdrawals: [], tasks: [], videos: [], formations: [], payments: [], stats: {}, config: {} }
};

// Sélecteurs DOM
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// Appels API centralisés
const api = async (url, method = 'GET', data = null) => {
  try {
    const token = localStorage.getItem('authToken');
    const opts = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };
    if (data) opts.body = JSON.stringify(data);
    console.log('API Call:', method, url);
    const res = await fetch(url, opts);
    const json = await res.json();
    console.log('API Response:', json);
    return json;
  } catch (e) {
    console.error('API Error:', e);
    toast('Erreur de connexion au serveur. Réessayez.', 'error');
    return { error: 'Erreur de connexion' };
  }
};

// Helper pour obtenir l'ID MongoDB
const getId = (obj) => obj?._id || obj?.id;

// Toast notifications
const toast = (msg, type = 'info') => {
  const div = document.createElement('div');
  div.className = `toast toast-${type}`;
  div.textContent = msg;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 4000);
};

// Barre de navigation
function renderNav() {
  return `
    <div class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 class="text-lg font-bold text-blue-600">🚀 Motosu</h1>
        <div class="flex items-center gap-3">
          <span class="text-sm font-bold text-orange-600">${state.currentUser?.earnings || 0} FCFA</span>
          <button onclick="logout()" class="text-red-500 text-sm">Quitter</button>
        </div>
      </div>
      <div class="flex border-t">
        <button onclick="navigate('dashboard')" class="flex-1 py-3 text-xs text-center ${state.currentPage === 'dashboard' ? 'tab-active' : 'text-gray-500'}">🏠 Accueil</button>
        <button onclick="navigate('tasks')" class="flex-1 py-3 text-xs text-center ${state.currentPage === 'tasks' ? 'tab-active' : 'text-gray-500'}">📋 Tâches</button>
        <button onclick="navigate('videos')" class="flex-1 py-3 text-xs text-center ${state.currentPage === 'videos' ? 'tab-active' : 'text-gray-500'}">🎬 Vidéos</button>
        <button onclick="navigate('formations')" class="flex-1 py-3 text-xs text-center ${state.currentPage === 'formations' ? 'tab-active' : 'text-gray-500'}">📚 Formations</button>
        <button onclick="navigate('referrals')" class="flex-1 py-3 text-xs text-center ${state.currentPage === 'referrals' ? 'tab-active' : 'text-gray-500'}">👥 Parrainage</button>
        <button onclick="navigate('withdraw')" class="flex-1 py-3 text-xs text-center ${state.currentPage === 'withdraw' ? 'tab-active' : 'text-gray-500'}">💰 Retrait</button>
      </div>
    </div>
  `;
}

// Helpers d'affichage
function getTaskTypeColor(type) {
  const colors = { sondage: 'bg-blue-100 text-blue-600', verification: 'bg-yellow-100 text-yellow-600', classification: 'bg-purple-100 text-purple-600', transcription: 'bg-green-100 text-green-600' };
  return colors[type] || 'bg-gray-100 text-gray-600';
}

function getTaskTypeLabel(type) {
  const labels = { sondage: '📊 Sondage', verification: '✅ Vérification', classification: '📁 Classification', transcription: '✍️ Transcription' };
  return labels[type] || type;
}

function getStatusColor(status) {
  const colors = { pending: 'bg-yellow-100 text-yellow-700', pending_payment: 'bg-orange-100 text-orange-700', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700', validated: 'bg-green-100 text-green-700' };
  return colors[status] || 'bg-gray-100 text-gray-600';
}

function getStatusLabel(status) {
  const labels = { pending: 'En attente', pending_payment: 'Paiement à vérifier', approved: 'Approuvé', rejected: 'Refusé', validated: 'Validé' };
  return labels[status] || status;
}

function copyNumber(number) {
  navigator.clipboard.writeText(number);
  toast('Numéro copié: ' + number, 'success');
}
