/**
 * MOTOSU AGENCIES - Videos Module
 * Gestion du lecteur vidéo et validation
 */

function openVideo(videoId) {
  const video = state.videos.find(v => getId(v) === videoId);
  if (!video) return;

  state.currentVideo = video;
  const requiredTime = Math.ceil(video.duration * 60 * 0.8);

  // Construire l'URL d'embed
  let embedUrl = video.url;

  if (video.platform === 'youtube') {
    let videoIdYT = '';
    if (video.url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(video.url.split('?')[1]);
      videoIdYT = urlParams.get('v');
    } else if (video.url.includes('youtu.be/')) {
      videoIdYT = video.url.split('youtu.be/')[1].split('?')[0];
    } else if (video.url.includes('youtube.com/embed/')) {
      videoIdYT = video.url.split('embed/')[1].split('?')[0];
    } else if (video.videoId) {
      videoIdYT = video.videoId;
    }
    if (videoIdYT) {
      embedUrl = `https://www.youtube.com/embed/${videoIdYT}?autoplay=1&rel=0`;
    }
  } else if (video.platform === 'tiktok') {
    let tiktokId = '';
    const tiktokMatch = video.url.match(/video\/(\d+)/);
    if (tiktokMatch) {
      tiktokId = tiktokMatch[1];
    } else if (video.videoId) {
      tiktokId = video.videoId;
    }
    if (tiktokId) {
      embedUrl = `https://www.tiktok.com/embed/v2/${tiktokId}`;
    }
  }

  $('#modal').innerHTML = `
    <div class="modal" onclick="closeModal(event)">
      <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 600px;">
        <div class="flex justify-between items-start mb-4">
          <div>
            <span class="text-xs px-2 py-1 rounded-full ${video.platform === 'youtube' ? 'bg-red-100 text-red-600' : 'bg-pink-100 text-pink-600'}">
              ${video.platform === 'youtube' ? '▶️ YouTube' : '🎵 TikTok'}
            </span>
            <h2 class="text-lg font-bold mt-2">${video.title}</h2>
          </div>
          <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <div class="video-container mb-4" style="background: #000; border-radius: 12px; overflow: hidden;">
          <iframe src="${embedUrl}" frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen style="width: 100%; height: 100%; min-height: 280px;"
            referrerpolicy="strict-origin-when-cross-origin"></iframe>
        </div>
        <div class="bg-purple-50 p-3 rounded-lg mb-4">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-semibold text-purple-800">⏱️ Temps de visionnage</span>
            <span id="watchTimer" class="font-bold text-purple-600">0:00</span>
          </div>
          <div class="progress-bar"><div id="watchProgress" class="progress-fill bg-purple-500" style="width: 0%"></div></div>
          <p class="text-xs text-purple-600 mt-1">Regardez au moins ${Math.floor(requiredTime/60)}:${(requiredTime%60).toString().padStart(2,'0')} pour valider</p>
        </div>
        <div class="flex gap-3">
          <button onclick="closeModal()" class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold">Annuler</button>
          <button id="validateVideoBtn" onclick="validateVideo('${videoId}')" class="flex-1 btn-success py-3 opacity-50" disabled>
            Valider (+${video.reward} FCFA)
          </button>
        </div>
      </div>
    </div>
  `;

  // Timer de visionnage
  let watchTime = 0;
  window.videoTimer = setInterval(() => {
    watchTime++;
    const minutes = Math.floor(watchTime / 60);
    const seconds = watchTime % 60;
    const timerEl = $('#watchTimer');
    const progressEl = $('#watchProgress');
    const btnEl = $('#validateVideoBtn');

    if (timerEl) {
      timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      progressEl.style.width = `${Math.min(100, (watchTime / requiredTime) * 100)}%`;
      if (watchTime >= requiredTime) {
        btnEl.disabled = false;
        btnEl.classList.remove('opacity-50');
      }
    }
  }, 1000);
}

async function validateVideo(videoId) {
  clearInterval(window.videoTimer);
  const video = state.videos.find(v => getId(v) === videoId);

  const res = await api(`/api/videos/${videoId}/watch`, 'POST', {
    userId: getId(state.currentUser),
    watchTime: video.duration * 60
  });

  if (res.error) {
    toast(res.error, 'error');
  } else {
    toast(res.message, 'success');
    closeModal();
    state.currentUser = await api(`/api/user/${getId(state.currentUser)}`);
    navigate('videos');
  }
}
