/**
 * MOTOSU AGENCIES - App Module
 * Navigation, événements, initialisation, sécurité
 */

// ==================== NAVIGATION ====================
async function navigate(page) {
  state.currentPage = page;
  const userId = getId(state.currentUser);

  if (state.currentUser && state.currentUser.status === 'validated') {
    if (['dashboard', 'referrals', 'withdraw'].includes(page)) {
      state.referrals = await api(`/api/referrals/${userId}`);
    }
    if (page === 'tasks') {
      const taskStatusData = await api(`/api/tasks/daily/${userId}`);
      state.taskStatus = { paused: taskStatusData.paused || false, message: taskStatusData.message || '' };
      state.tasks = Array.isArray(taskStatusData.tasks) ? taskStatusData.tasks : [];
      if (!state.taskStatus.paused && state.tasks.length === 0) {
        const allTasks = await api('/api/tasks');
        state.tasks = Array.isArray(allTasks) ? allTasks : [];
      }
    }
    if (page === 'videos') {
      const videosData = await api('/api/videos');
      state.videos = Array.isArray(videosData) ? videosData : [];
    }
    if (page === 'formations') {
      const formationsData = await api('/api/formations');
      state.formations = Array.isArray(formationsData) ? formationsData : [];
    }
    if (page === 'withdraw') {
      state.withdrawals = await api(`/api/withdrawals/user/${userId}`);
    }
  }
  render();
}

function render() {
  const app = $('#app');
  if (pages[state.currentPage]) {
    app.innerHTML = pages[state.currentPage]();
    attachEventListeners();
  }
}

// ==================== EVENT LISTENERS ====================
function attachEventListeners() {
  const loginForm = $('#loginForm');
  if (loginForm) {
    loginForm.onsubmit = async (e) => {
      e.preventDefault();
      const res = await api('/api/login', 'POST', { email: $('#loginEmail').value, password: $('#loginPassword').value });
      if (res.error) { toast(res.error, 'error'); }
      else {
        state.currentUser = res.user;
        localStorage.setItem('userId', getId(res.user));
        if (res.token) localStorage.setItem('authToken', res.token);
        if (res.user.isAdmin) navigate('admin');
        else if (res.user.status === 'validated') navigate('dashboard');
        else navigate('pending');
        toast('Connexion réussie!', 'success');
      }
    };
  }

  const registerForm = $('#registerForm');
  if (registerForm) {
    registerForm.onsubmit = async (e) => {
      e.preventDefault();
      const res = await api('/api/register', 'POST', {
        name: $('#regName').value, email: $('#regEmail').value,
        phone: $('#regPhone').value, password: $('#regPassword').value,
        referralCode: $('#regReferral').value
      });
      if (res.error) { toast(res.error, 'error'); }
      else {
        state.currentUser = res.user;
        localStorage.setItem('userId', getId(res.user));
        if (res.token) localStorage.setItem('authToken', res.token);
        localStorage.removeItem('referralCode');
        navigate('pending');
        toast('Inscription réussie!', 'success');
      }
    };
  }

  const withdrawForm = $('#withdrawForm');
  if (withdrawForm) {
    withdrawForm.onsubmit = async (e) => {
      e.preventDefault();
      const res = await api('/api/withdraw', 'POST', {
        userId: getId(state.currentUser), amount: parseInt($('#withdrawAmount').value),
        method: $('#withdrawMethod').value, accountNumber: $('#withdrawAccount').value,
        accountName: $('#withdrawName').value
      });
      if (res.error) { toast(res.error, 'error'); }
      else {
        toast(res.message, 'success');
        state.currentUser = await api(`/api/user/${getId(state.currentUser)}`);
        navigate('withdraw');
      }
    };
  }

  if (state.currentPage === 'admin') setAdminTab('stats');
}

// ==================== UTILITAIRES ====================
function copyReferral() {
  const link = `${window.location.origin}?ref=${state.currentUser.referralCode}`;
  navigator.clipboard.writeText(link);
  toast('Lien copié! Partagez-le!', 'success');
}

function logout() {
  state.currentUser = null;
  localStorage.removeItem('userId');
  localStorage.removeItem('authToken');
  navigate('login');
  toast('Déconnexion réussie', 'info');
}

function closeModal(event) {
  if (event && event.target !== event.currentTarget) return;
  if (window.videoTimer) clearInterval(window.videoTimer);
  $('#modal').innerHTML = '';
  state.currentTask = null;
  state.currentVideo = null;
  state.surveyAnswers = {};
}

// ==================== PREUVE DE PAIEMENT ====================
function openPaymentProof() {
  $('#modal').innerHTML = `
    <div class="modal" onclick="closeModal(event)">
      <div class="modal-content" onclick="event.stopPropagation()">
        <h2 class="text-lg font-bold mb-4">📤 Envoyer la preuve de paiement</h2>
        <form id="paymentProofForm">
          <label class="block text-sm font-medium text-gray-700 mb-2">Capture d'écran *</label>
          <input type="file" id="proofScreenshot" accept="image/*" class="input" required>
          <div id="imagePreview" class="mb-3 hidden"><p class="text-xs text-gray-500 mb-1">Aperçu :</p><img id="previewImg" class="max-w-full max-h-40 rounded-lg border"></div>
          <label class="block text-sm font-medium text-gray-700 mb-2">ID Transaction (optionnel)</label>
          <input type="text" id="proofTransactionId" class="input" placeholder="Ex: TXN123456789">
          <label class="block text-sm font-medium text-gray-700 mb-2">Numéro utilisé</label>
          <input type="text" id="proofPhone" class="input" value="${state.currentUser?.phone || ''}" placeholder="+225 XX XX XX XX XX">
          <div class="flex gap-3 mt-4">
            <button type="button" onclick="closeModal()" class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold">Annuler</button>
            <button type="submit" id="submitProofBtn" class="flex-1 btn-orange py-3">Envoyer</button>
          </div>
        </form>
      </div>
    </div>
  `;

  $('#proofScreenshot').onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => { $('#previewImg').src = ev.target.result; $('#imagePreview').classList.remove('hidden'); };
      reader.readAsDataURL(file);
    }
  };

  $('#paymentProofForm').onsubmit = async (e) => {
    e.preventDefault();
    const file = $('#proofScreenshot').files[0];
    if (!file) { toast("Ajoutez une capture d'écran", 'error'); return; }
    const btn = $('#submitProofBtn');
    btn.disabled = true; btn.textContent = 'Envoi en cours...';
    const reader = new FileReader();
    reader.onload = async () => {
      const res = await api('/api/payment/proof', 'POST', {
        userId: getId(state.currentUser), screenshot: reader.result,
        transactionId: $('#proofTransactionId').value, phoneUsed: $('#proofPhone').value
      });
      if (res.error) { toast(res.error, 'error'); btn.disabled = false; btn.textContent = 'Envoyer'; }
      else {
        toast(res.message, 'success'); closeModal();
        state.currentUser = await api(`/api/user/${getId(state.currentUser)}`);
        navigate('pending');
      }
    };
    reader.onerror = () => { toast("Erreur lecture image", 'error'); btn.disabled = false; btn.textContent = 'Envoyer'; };
    reader.readAsDataURL(file);
  };
}

// ==================== FORMULAIRES ADMIN (DELEGATION) ====================
document.addEventListener('submit', async function(e) {
  if (e.target.id === 'addVideoForm') {
    e.preventDefault();
    const res = await api('/api/admin/videos', 'POST', {
      platform: $('#videoPlatform').value, title: $('#videoTitle').value,
      url: $('#videoUrl').value, duration: parseInt($('#videoDuration').value),
      reward: parseInt($('#videoReward').value)
    });
    if (res.error) toast(res.error, 'error');
    else { toast('Vidéo ajoutée!', 'success'); setAdminTab('videos'); }
  }

  if (e.target.id === 'addFormationForm') {
    e.preventDefault();
    let imageBase64 = '';
    const imageFile = $('#formationImage')?.files[0];
    if (imageFile) {
      imageBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(imageFile);
      });
    }
    const res = await api('/api/admin/formations', 'POST', {
      title: $('#formationTitle').value, description: $('#formationDescription').value,
      link: $('#formationLink').value, category: $('#formationCategory').value || 'Général',
      image: imageBase64
    });
    if (res.error) toast(res.error, 'error');
    else { toast('Formation ajoutée!', 'success'); setAdminTab('formations'); }
  }

  if (e.target.id === 'taskCycleForm') {
    e.preventDefault();
    const res = await api('/api/admin/tasks/cycle', 'POST', {
      activeDays: parseInt($('#activeDays').value), pauseDays: parseInt($('#pauseDays').value)
    });
    if (res.error) toast(res.error, 'error');
    else { toast('Cycle mis à jour!', 'success'); setAdminTab('tasks'); }
  }
});

document.addEventListener('change', function(e) {
  if (e.target.id === 'formationImage') {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => { $('#formationPreviewImg').src = reader.result; $('#formationImagePreview').classList.remove('hidden'); };
      reader.readAsDataURL(file);
    }
  }
});

// ==================== INITIALISATION ====================
async function init() {
  console.log('Initialisation de Motosu...');

  try {
    state.config = await api('/api/config');
    console.log('Config chargée:', state.config);
  } catch (e) {
    console.error('Erreur config:', e);
    state.config = { paymentNumbers: [], withdrawMethods: [], subscriptionAmount: 4000 };
  }

  // Code parrain via URL
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get('ref');
  if (ref) {
    localStorage.setItem('referralCode', ref);
    toast('Code parrain enregistré: ' + ref, 'success');
    window.history.replaceState({}, '', '/');
  }

  // Reconnexion automatique
  const userId = localStorage.getItem('userId');
  if (userId) {
    try {
      const user = await api(`/api/user/${userId}`);
      if (user && !user.error) {
        state.currentUser = user;
        if (user.isAdmin) navigate('admin');
        else if (user.status === 'validated') navigate('dashboard');
        else navigate('pending');
        return;
      }
    } catch (e) { console.error('Erreur reconnexion:', e); }
  }
  navigate('login');
}

// ==================== PROTECTION ANTI-COPIE ====================
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('selectstart', (e) => { if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') e.preventDefault(); });
document.addEventListener('copy', (e) => { if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') e.preventDefault(); });
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'u') { e.preventDefault(); return; }
  if (e.ctrlKey && e.key === 's') { e.preventDefault(); return; }
  if (e.key === 'F12') {
    console.log('%c⚠️ ATTENTION', 'color:red;font-size:30px;font-weight:bold;');
    console.log('%cCette console est destinée aux développeurs.', 'color:orange;font-size:14px;');
  }
});
document.addEventListener('dragstart', (e) => e.preventDefault());

// ==================== DÉMARRAGE ====================
console.log('Démarrage de Motosu Agencies...');
init().catch(e => { console.error('Erreur init:', e); navigate('login'); });
