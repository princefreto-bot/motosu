/**
 * MOTOSU AGENCIES - Admin Module
 * Panel d'administration complet
 */

let currentAdminTab = 'stats';

async function setAdminTab(tab) {
  currentAdminTab = tab;
  $$('.admin-tab').forEach(el => el.classList.remove('bg-blue-600', 'text-white'));
  $(`#tab-${tab}`)?.classList.add('bg-blue-600', 'text-white');
  const content = $('#adminContent');
  if (!content) return;

  if (tab === 'stats') { state.adminData.stats = await api('/api/admin/stats'); content.innerHTML = renderAdminStats(); }
  else if (tab === 'pending') { state.adminData.pending = await api('/api/admin/pending'); content.innerHTML = renderAdminPending(); }
  else if (tab === 'users') { state.adminData.users = await api('/api/admin/users'); content.innerHTML = renderAdminUsers(); }
  else if (tab === 'withdrawals') { state.adminData.withdrawals = await api('/api/admin/withdrawals'); content.innerHTML = renderAdminWithdrawals(); }
  else if (tab === 'videos') { state.adminData.videos = await api('/api/admin/videos'); content.innerHTML = renderAdminVideos(); }
  else if (tab === 'formations') { state.adminData.formations = await api('/api/admin/formations'); content.innerHTML = renderAdminFormations(); }
  else if (tab === 'tasks') { state.adminData.tasks = await api('/api/admin/tasks'); const ts = await api('/api/tasks/status'); state.adminData.taskCycle = ts; content.innerHTML = renderAdminTasks(); }
  else if (tab === 'config') { state.adminData.config = await api('/api/admin/config'); content.innerHTML = renderAdminConfig(); }
}

function renderAdminStats() {
  const s = state.adminData.stats;
  return `<div class="grid grid-cols-2 gap-4">
    <div class="card text-center"><p class="text-3xl font-bold text-blue-600">${s.totalUsers||0}</p><p class="text-gray-500 text-sm">Total utilisateurs</p></div>
    <div class="card text-center"><p class="text-3xl font-bold text-green-600">${s.validatedUsers||0}</p><p class="text-gray-500 text-sm">Comptes actifs</p></div>
    <div class="card text-center"><p class="text-3xl font-bold text-yellow-600">${s.pendingUsers||0}</p><p class="text-gray-500 text-sm">En attente</p></div>
    <div class="card text-center"><p class="text-3xl font-bold text-purple-600">${s.pendingWithdrawals||0}</p><p class="text-gray-500 text-sm">Retraits en attente</p></div>
    <div class="card text-center"><p class="text-3xl font-bold text-pink-600">${s.videosCount||0}</p><p class="text-gray-500 text-sm">Vidéos</p></div>
    <div class="card text-center"><p class="text-3xl font-bold text-orange-600">${s.totalWithdrawals||0} FCFA</p><p class="text-gray-500 text-sm">Total retraits</p></div>
  </div>`;
}

function renderAdminPending() {
  if (!state.adminData.pending.length) return '<div class="card text-center text-gray-500 py-8">✓ Aucun compte en attente</div>';
  return state.adminData.pending.map(u => {
    const hasProof = u.paymentProof && u.paymentProof.screenshot;
    return `<div class="card mb-3">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div class="flex-1">
          <p class="font-bold text-lg">${u.name}</p>
          <p class="text-sm text-gray-500">${u.email} • ${u.phone}</p>
          <span class="inline-block mt-1 px-2 py-1 text-xs rounded-full ${getStatusColor(u.status)}">${getStatusLabel(u.status)}</span>
          <p class="text-xs text-gray-400 mt-1">Inscrit le ${new Date(u.createdAt).toLocaleDateString('fr-FR')}</p>
          ${hasProof ? `
            <div class="mt-3 p-3 bg-orange-50 rounded-lg">
              <p class="text-sm font-semibold text-orange-700 mb-2">📸 Preuve :</p>
              <img src="${u.paymentProof.screenshot}" class="w-full max-w-xs rounded-lg border cursor-pointer" onclick="openImageFullscreen('${u.paymentProof.screenshot.replace(/'/g, "\\'")}')" onerror="this.style.display='none'">
              ${u.paymentProof.transactionId ? `<p class="text-xs text-gray-500 mt-1">ID: ${u.paymentProof.transactionId}</p>` : ''}
              <p class="text-xs text-gray-500">Tel: ${u.paymentProof.phoneUsed || 'N/A'}</p>
              <p class="text-xs text-gray-400">Envoyé: ${u.paymentProof.submittedAt ? new Date(u.paymentProof.submittedAt).toLocaleString('fr-FR') : 'N/A'}</p>
            </div>
          ` : `<div class="mt-3 p-3 bg-gray-100 rounded-lg"><p class="text-sm text-gray-500">⚠️ Aucune preuve envoyée</p></div>`}
        </div>
        <div class="flex sm:flex-col gap-2">
          <button onclick="validateUser('${getId(u)}')" class="btn-success text-sm px-4 py-2 flex-1">✓ Valider</button>
          <button onclick="rejectUser('${getId(u)}')" class="btn-danger text-sm px-4 py-2 flex-1">✗ Refuser</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function openImageFullscreen(src) {
  $('#modal').innerHTML = `
    <div class="modal" onclick="closeModal(event)" style="background:rgba(0,0,0,0.9);">
      <div onclick="event.stopPropagation()" style="max-width:95vw;max-height:95vh;">
        <button onclick="closeModal()" class="absolute top-4 right-4 text-white text-3xl z-50">&times;</button>
        <img src="${src}" class="max-w-full max-h-screen rounded-lg">
      </div>
    </div>`;
}

function renderAdminUsers() {
  return `<div class="card"><p class="text-sm text-gray-500 mb-3">Total: ${state.adminData.users.length}</p>
    <div class="space-y-2">${state.adminData.users.map(u => `
      <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
        <div><p class="font-semibold">${u.name} ${u.isAdmin?'👑':''}</p><p class="text-xs text-gray-500">${u.email}</p><p class="text-xs text-gray-500">${u.earnings} FCFA • ${u.completedTasks?.length||0} tâches • ${u.watchedVideos?.length||0} vidéos</p></div>
        <span class="px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(u.status)}">${getStatusLabel(u.status)}</span>
      </div>`).join('')}</div></div>`;
}

function renderAdminWithdrawals() {
  if (!state.adminData.withdrawals.length) return '<div class="card text-center text-gray-500 py-8">Aucune demande</div>';
  return state.adminData.withdrawals.map(w => `
    <div class="card mb-3"><div class="flex flex-col sm:flex-row sm:justify-between gap-3">
      <div><p class="font-bold text-xl text-orange-600">${w.amount?.toLocaleString()} FCFA</p><p class="font-semibold">${w.userName}</p><p class="text-sm text-gray-500">📱 Mobile Money (PayDunya)</p><p class="text-sm text-gray-600">Tel: ${w.accountNumber}</p><p class="text-sm text-gray-500">Opérateur: ${w.accountName || 'N/A'}</p><p class="text-xs text-gray-400">${new Date(w.createdAt).toLocaleDateString('fr-FR')}</p></div>
      <div class="flex flex-col gap-2 items-end">
        <span class="px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(w.status)}">${getStatusLabel(w.status)}</span>
        ${w.status==='pending'?`<button onclick="approveWithdraw('${getId(w)}')" class="btn-success text-sm px-4 py-2">✓ Approuver</button><button onclick="rejectWithdraw('${getId(w)}')" class="btn-danger text-sm px-4 py-2">✗ Refuser</button>`:''}
      </div>
    </div></div>`).join('');
}

function renderAdminVideos() {
  return `<div class="card mb-4">
    <h2 class="font-bold text-lg mb-4">➕ Ajouter une vidéo</h2>
    <form id="addVideoForm">
      <div class="grid grid-cols-2 gap-3 mb-3">
        <select id="videoPlatform" class="input mb-0" required><option value="youtube">YouTube</option><option value="tiktok">TikTok</option></select>
        <input type="number" id="videoDuration" class="input mb-0" placeholder="Durée (min)" min="1" required>
      </div>
      <input type="text" id="videoTitle" class="input" placeholder="Titre" required>
      <input type="text" id="videoUrl" class="input" placeholder="URL vidéo" required>
      <input type="number" id="videoReward" class="input" placeholder="Récompense (FCFA)" min="1" required>
      <button type="submit" class="btn-primary w-full">Ajouter</button>
    </form>
  </div>
  <div class="card">
    <h2 class="font-bold text-lg mb-4">🎬 Vidéos (${state.adminData.videos.length})</h2>
    ${!state.adminData.videos.length?'<p class="text-gray-500 text-sm text-center py-4">Aucune vidéo</p>':`
      <div class="space-y-3">${state.adminData.videos.map(v=>`
        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <div><span class="text-xs px-2 py-1 rounded-full ${v.platform==='youtube'?'bg-red-100 text-red-600':'bg-pink-100 text-pink-600'}">${v.platform==='youtube'?'YouTube':'TikTok'}</span><p class="font-semibold mt-1">${v.title}</p><p class="text-xs text-gray-500">${v.duration} min • ${v.reward} FCFA</p></div>
          <button onclick="deleteVideo('${getId(v)}')" class="text-red-500 text-xl">🗑️</button>
        </div>`).join('')}</div>`}
  </div>`;
}

function renderAdminFormations() {
  return `<div class="card mb-4">
    <h2 class="font-bold text-lg mb-4">➕ Ajouter une formation</h2>
    <form id="addFormationForm">
      <input type="text" id="formationTitle" class="input" placeholder="Titre" required>
      <textarea id="formationDescription" class="input" placeholder="Description" rows="2" required></textarea>
      <input type="text" id="formationLink" class="input" placeholder="Lien (URL)" required>
      <input type="text" id="formationCategory" class="input" placeholder="Catégorie" value="Général">
      <div class="mb-3"><label class="block text-sm font-medium text-gray-700 mb-2">Image (optionnel)</label>
        <input type="file" id="formationImage" accept="image/*" class="input">
        <div id="formationImagePreview" class="mt-2 hidden"><img id="formationPreviewImg" class="w-24 h-24 object-cover rounded-lg border"></div>
      </div>
      <button type="submit" class="btn-primary w-full">Ajouter</button>
    </form>
  </div>
  <div class="card">
    <h2 class="font-bold text-lg mb-4">📚 Formations (${state.adminData.formations?.length||0})</h2>
    ${!state.adminData.formations?.length?'<p class="text-gray-500 text-sm text-center py-4">Aucune formation</p>':`
      <div class="space-y-3">${state.adminData.formations.map(f=>`
        <div class="flex gap-3 p-3 bg-gray-50 rounded-lg">
          ${f.image?`<img src="${f.image}" class="w-16 h-16 object-cover rounded-lg flex-shrink-0" onerror="this.style.display='none'">`:`<div class="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"><span class="text-2xl">📚</span></div>`}
          <div class="flex-1"><span class="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600">${f.category||'Général'}</span><p class="font-semibold mt-1">${f.title}</p><p class="text-xs text-gray-500 truncate">${f.description}</p><a href="${f.link}" target="_blank" class="text-xs text-blue-500">🔗 Voir</a></div>
          <button onclick="deleteFormation('${getId(f)}')" class="text-red-500 text-xl self-start">🗑️</button>
        </div>`).join('')}</div>`}
  </div>`;
}

function renderAdminTasks() {
  const cycle = state.adminData.taskCycle || { isActive: true, activeDays: 2, pauseDays: 3 };
  return `<div class="card mb-4">
    <h2 class="font-bold text-lg mb-4">⏱️ Cycle des tâches</h2>
    <div class="p-4 rounded-lg ${cycle.isActive?'bg-green-50 border border-green-200':'bg-orange-50 border border-orange-200'} mb-4">
      <div class="flex items-center gap-3"><span class="text-3xl">${cycle.isActive?'✅':'⏸️'}</span>
        <div><p class="font-bold ${cycle.isActive?'text-green-700':'text-orange-700'}">${cycle.isActive?'Tâches actives':'Pause en cours'}</p><p class="text-sm text-gray-600">${cycle.message||''}</p></div>
      </div>
    </div>
    <form id="taskCycleForm" class="grid grid-cols-2 gap-3">
      <div><label class="block text-sm font-medium text-gray-700 mb-1">Jours actifs</label><input type="number" id="activeDays" class="input mb-0" value="${cycle.activeDays||2}" min="1" max="7"></div>
      <div><label class="block text-sm font-medium text-gray-700 mb-1">Jours de pause</label><input type="number" id="pauseDays" class="input mb-0" value="${cycle.pauseDays||3}" min="1" max="7"></div>
      <div class="col-span-2"><button type="submit" class="btn-primary w-full">Mettre à jour</button></div>
    </form>
  </div>
  <div class="card">
    <h2 class="font-bold text-lg mb-4">📋 Tâches (${state.adminData.tasks?.length||0})</h2>
    ${!state.adminData.tasks?.length?'<p class="text-gray-500 text-sm text-center py-4">Aucune tâche</p>':`
      <div class="space-y-2">${state.adminData.tasks.map(t=>`
        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
          <div><span class="text-xs px-2 py-1 rounded-full ${getTaskTypeColor(t.type)}">${getTaskTypeLabel(t.type)}</span><p class="font-semibold mt-1">${t.title}</p><p class="text-xs text-gray-500">${t.reward} FCFA • ${t.isActive!==false?'✅ Actif':'❌ Inactif'}</p></div>
          <div class="flex gap-2"><button onclick="toggleTask('${getId(t)}')" class="text-xl">${t.isActive!==false?'⏸️':'▶️'}</button><button onclick="deleteTask('${getId(t)}')" class="text-red-500 text-xl">🗑️</button></div>
        </div>`).join('')}</div>`}
  </div>`;
}

function renderAdminConfig() {
  return `<div class="card">
    <h2 class="font-bold text-lg mb-4">💳 Configuration Paiements</h2>
    
    <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
      <h3 class="font-bold text-green-700 mb-2">✅ PayDunya Activé</h3>
      <p class="text-sm text-gray-600">Tous les paiements et retraits sont gérés automatiquement via PayDunya.</p>
    </div>
    
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h3 class="font-bold text-blue-700 mb-2">📊 Paramètres actuels</h3>
      <ul class="text-sm text-gray-700 space-y-2">
        <li>• <strong>Activation compte :</strong> 4 000 FCFA (fixe)</li>
        <li>• <strong>Minimum retrait :</strong> 8 000 FCFA</li>
        <li>• <strong>Commission N1 :</strong> 2 000 FCFA</li>
        <li>• <strong>Commission N2 :</strong> 800 FCFA</li>
        <li>• <strong>Commission N3 :</strong> 400 FCFA</li>
      </ul>
    </div>
    
    <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
      <h3 class="font-bold text-orange-700 mb-2">🔧 Variables d'environnement Render</h3>
      <p class="text-xs text-gray-600 mb-2">Configurées dans Render Dashboard → Environment :</p>
      <ul class="text-xs text-gray-600 space-y-1 font-mono">
        <li>PAYDUNYA_API_KEY</li>
        <li>PAYDUNYA_API_SECRET</li>
        <li>PAYDUNYA_MASTER_KEY</li>
        <li>PAYDUNYA_MODE=production</li>
      </ul>
    </div>
  </div>`;
}

// Actions admin
async function validateUser(userId) { await api(`/api/admin/validate/${userId}`, 'POST'); toast('Compte validé!', 'success'); setAdminTab('pending'); }
async function rejectUser(userId) { await api(`/api/admin/reject/${userId}`, 'POST'); toast('Compte refusé', 'info'); setAdminTab('pending'); }
async function approveWithdraw(id) { await api(`/api/admin/withdraw/approve/${id}`, 'POST'); toast('Retrait approuvé!', 'success'); setAdminTab('withdrawals'); }
async function rejectWithdraw(id) { await api(`/api/admin/withdraw/reject/${id}`, 'POST'); toast('Retrait refusé, remboursé', 'info'); setAdminTab('withdrawals'); }
async function deleteVideo(id) { if(!confirm('Supprimer ?'))return; await api(`/api/admin/videos/${id}`, 'DELETE'); toast('Vidéo supprimée', 'info'); setAdminTab('videos'); }
async function deleteFormation(id) { if(!confirm('Supprimer ?'))return; await api(`/api/admin/formations/${id}`, 'DELETE'); toast('Formation supprimée', 'info'); setAdminTab('formations'); }
async function toggleTask(id) { const t = state.adminData.tasks.find(x=>getId(x)===id); if(!t)return; await api(`/api/admin/tasks/${id}`, 'PUT', {isActive:t.isActive===false}); toast('Tâche mise à jour', 'success'); setAdminTab('tasks'); }
async function deleteTask(id) { if(!confirm('Supprimer ?'))return; await api(`/api/admin/tasks/${id}`, 'DELETE'); toast('Tâche supprimée', 'info'); setAdminTab('tasks'); }

function addPaymentNumber() { state.adminData.config.paymentNumbers.push({operator:'',number:'',name:''}); $('#adminContent').innerHTML = renderAdminConfig(); }
function removePaymentNumber(i) { state.adminData.config.paymentNumbers.splice(i,1); $('#adminContent').innerHTML = renderAdminConfig(); }

async function savePaymentNumbers() {
  const numbers = [];
  state.adminData.config.paymentNumbers.forEach((_,i) => {
    const op = $(`#op-${i}`)?.value, num = $(`#num-${i}`)?.value, name = $(`#name-${i}`)?.value;
    if (op && num) numbers.push({ operator: op, number: num, name: name || '' });
  });
  const res = await api('/api/admin/config/payment-numbers', 'POST', { paymentNumbers: numbers });
  if (res.success) { toast('Numéros enregistrés!', 'success'); state.config.paymentNumbers = numbers; }
  else toast('Erreur', 'error');
}
