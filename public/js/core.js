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

// Rendu du logo
function renderLogo(size = 'sm') {
  const isLg = size === 'lg';
  return `
    <div class="logo-container ${isLg ? 'logo-lg' : ''}">
      <div class="logo-icon">${isLg ? 'M' : 'M'}</div>
      <div><span class="logo-text">MOTOSU</span><span class="logo-sub">agencies</span></div>
    </div>`;
}

// Système de félicitations
const MILESTONES = [1000, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000];

function checkMilestone(earnings) {
  const shown = JSON.parse(localStorage.getItem('milestonesShown') || '[]');
  for (const milestone of MILESTONES) {
    if (earnings >= milestone && !shown.includes(milestone)) {
      shown.push(milestone);
      localStorage.setItem('milestonesShown', JSON.stringify(shown));
      showCongrats(milestone);
      return;
    }
  }
}

function showCongrats(amount) {
  const name = state.currentUser?.name?.split(' ')[0] || 'Champion';
  const messages = [
    'Votre engagement porte ses fruits ! Continuez sur cette lancée ! 💪',
    'Vous êtes sur la bonne voie ! Chaque action compte ! 🌟',
    'Incroyable progression ! Le succès est au bout du chemin ! 🏆',
    'Bravo pour votre persévérance ! Partagez et grandissez ! 🚀',
    'Vous faites partie des meilleurs ! Continuez à inspirer ! ⭐'
  ];
  const msg = messages[Math.floor(Math.random() * messages.length)];
  const colors = ['#3b82f6','#f97316','#10b981','#8b5cf6','#ec4899','#eab308'];
  
  let confettiHTML = '';
  for (let i = 0; i < 30; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const delay = Math.random() * 3;
    const size = 6 + Math.random() * 8;
    confettiHTML += `<div class="confetti" style="left:${left}%;background:${color};width:${size}px;height:${size}px;animation-delay:${delay}s;"></div>`;
  }

  const overlay = document.createElement('div');
  overlay.className = 'congrats-overlay';
  overlay.innerHTML = `
    ${confettiHTML}
    <div class="congrats-modal">
      <div class="congrats-content">
        <div class="congrats-emoji">🎉</div>
        <div class="congrats-title">Félicitations !</div>
        <div class="congrats-name">${name}</div>
        <div class="congrats-amount">${amount.toLocaleString('fr-FR')} FCFA</div>
        <p class="congrats-msg">${msg}</p>
        <button class="congrats-btn" onclick="this.closest('.congrats-overlay').remove()">Continuer 🚀</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  setTimeout(() => { if(overlay.parentNode) overlay.remove(); }, 15000);
}

// Barre de navigation
function renderNav() {
  return `
    <div class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        ${renderLogo()}
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
