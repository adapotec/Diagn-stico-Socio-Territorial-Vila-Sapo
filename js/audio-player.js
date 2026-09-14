// ================================================
// AUDIO PLAYER COMPONENT — Vozes da Vila Sapo
// Institutional Audio Player for Community Testimonial
// Supports /audio/depoimento.mp3 with simulation fallback
// ================================================

export function initAudioPlayer() {
  const playBtn = document.getElementById('audio-play-btn');
  const progressBar = document.getElementById('audio-progress-bar');
  const progressFill = document.getElementById('audio-progress-fill');
  const timeCurrent = document.getElementById('audio-time-current');
  const timeTotal = document.getElementById('audio-time-total');
  const audioStatus = document.getElementById('audio-status-label');

  if (!playBtn) return;

  const audioSrc = '/audio/depoimento.mp3';
  const audio = new Audio();
  audio.preload = 'metadata';
  audio.src = audioSrc;

  let isAudioLoaded = false;
  let simulatedTimer = null;
  let simulatedTime = 0;
  const simulatedDuration = 165; // 2 min 45 sec fallback

  // Format MM:SS helper
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (timeTotal) timeTotal.textContent = formatTime(simulatedDuration);

  // Audio events
  audio.addEventListener('loadedmetadata', () => {
    isAudioLoaded = true;
    if (timeTotal && !isNaN(audio.duration) && isFinite(audio.duration)) {
      timeTotal.textContent = formatTime(audio.duration);
    }
  });

  audio.addEventListener('canplaythrough', () => {
    isAudioLoaded = true;
  });

  audio.addEventListener('timeupdate', () => {
    if (!audio.paused && !isNaN(audio.duration) && audio.duration > 0) {
      if (timeCurrent) timeCurrent.textContent = formatTime(audio.currentTime);
      if (progressFill) {
        const pct = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${pct}%`;
      }
    }
  });

  audio.addEventListener('ended', () => {
    playBtn.classList.remove('playing');
    playBtn.setAttribute('aria-label', 'Reproduzir depoimento');
    if (audioStatus) audioStatus.textContent = 'DEPOIMENTO CONCLUÍDO';
    if (progressFill) progressFill.style.width = '0%';
    if (timeCurrent) timeCurrent.textContent = '00:00';
  });

  audio.addEventListener('error', () => {
    isAudioLoaded = false;
  });

  playBtn.addEventListener('click', () => {
    if (isAudioLoaded) {
      if (audio.paused) {
        audio.play().then(() => {
          playBtn.classList.add('playing');
          playBtn.setAttribute('aria-label', 'Pausar depoimento');
          if (audioStatus) audioStatus.textContent = 'REPRODUZINDO DEPOIMENTO (ÁUDIO OFICIAL)';
        }).catch(() => {
          toggleSimulation();
        });
      } else {
        audio.pause();
        playBtn.classList.remove('playing');
        playBtn.setAttribute('aria-label', 'Reproduzir depoimento');
        if (audioStatus) audioStatus.textContent = 'DEPOIMENTO PAUSADO';
      }
    } else {
      // Tenta reproduzir caso carregue sob demanda
      audio.play().then(() => {
        isAudioLoaded = true;
        playBtn.classList.add('playing');
        playBtn.setAttribute('aria-label', 'Pausar depoimento');
        if (audioStatus) audioStatus.textContent = 'REPRODUZINDO DEPOIMENTO (ÁUDIO OFICIAL)';
      }).catch(() => {
        toggleSimulation();
      });
    }
  });

  function toggleSimulation() {
    if (simulatedTimer) {
      clearInterval(simulatedTimer);
      simulatedTimer = null;
      playBtn.classList.remove('playing');
      playBtn.setAttribute('aria-label', 'Reproduzir depoimento');
      if (audioStatus) audioStatus.textContent = 'DEPOIMENTO EM ÁUDIO PRONTO';
    } else {
      playBtn.classList.add('playing');
      playBtn.setAttribute('aria-label', 'Pausar depoimento');
      if (audioStatus) audioStatus.textContent = 'REPRODUZINDO SIMULAÇÃO (ADICIONE ARQUIVO MP3)';
      if (timeTotal) timeTotal.textContent = formatTime(simulatedDuration);
      simulatedTimer = setInterval(() => {
        simulatedTime += 1;
        if (simulatedTime >= simulatedDuration) {
          simulatedTime = 0;
          clearInterval(simulatedTimer);
          simulatedTimer = null;
          playBtn.classList.remove('playing');
          if (audioStatus) audioStatus.textContent = 'DEPOIMENTO EM ÁUDIO PRONTO';
        }
        if (timeCurrent) timeCurrent.textContent = formatTime(simulatedTime);
        if (progressFill) {
          const pct = (simulatedTime / simulatedDuration) * 100;
          progressFill.style.width = `${pct}%`;
        }
      }, 1000);
    }
  }

  if (progressBar) {
    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, clickX / rect.width));
      if (isAudioLoaded && !isNaN(audio.duration) && audio.duration > 0) {
        audio.currentTime = pct * audio.duration;
      } else {
        simulatedTime = pct * simulatedDuration;
        if (timeCurrent) timeCurrent.textContent = formatTime(simulatedTime);
        if (progressFill) progressFill.style.width = `${pct * 100}%`;
      }
    });
  }
}
