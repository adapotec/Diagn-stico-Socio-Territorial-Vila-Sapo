// ================================================
// AUDIO PLAYER COMPONENT — Vozes da Vila Sapo
// Institutional Audio Player for Community Testimonial
// ================================================

export function initAudioPlayer() {
  const playBtn = document.getElementById('audio-play-btn');
  const progressBar = document.getElementById('audio-progress-bar');
  const progressFill = document.getElementById('audio-progress-fill');
  const timeCurrent = document.getElementById('audio-time-current');
  const timeTotal = document.getElementById('audio-time-total');
  const audioStatus = document.getElementById('audio-status-label');

  if (!playBtn) return;

  let isPlaying = false;
  let currentTime = 0;
  const duration = 165; // 2 min 45 sec simulated duration
  let timer = null;

  // Format MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (timeTotal) timeTotal.textContent = formatTime(duration);

  playBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    updatePlayerState();
  });

  function updatePlayerState() {
    if (isPlaying) {
      playBtn.classList.add('playing');
      playBtn.setAttribute('aria-label', 'Pausar depoimento');
      if (audioStatus) audioStatus.textContent = 'REPRODUZINDO DEPOIMENTO';
      
      timer = setInterval(() => {
        currentTime += 1;
        if (currentTime >= duration) {
          currentTime = 0;
          isPlaying = false;
          clearInterval(timer);
        }
        updateProgress();
      }, 1000);
    } else {
      playBtn.classList.remove('playing');
      playBtn.setAttribute('aria-label', 'Reproduzir depoimento');
      if (audioStatus) audioStatus.textContent = 'DEPOIMENTO EM ÁUDIO PRONTO';
      clearInterval(timer);
    }
  }

  function updateProgress() {
    if (timeCurrent) timeCurrent.textContent = formatTime(currentTime);
    if (progressFill) {
      const pct = (currentTime / duration) * 100;
      progressFill.style.width = `${pct}%`;
    }
  }

  if (progressBar) {
    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, clickX / rect.width));
      currentTime = pct * duration;
      updateProgress();
    });
  }
}
