// ================================================
// AUDIO PLAYER COMPONENT — Vozes da Vila Sapo
// Institutional Audio Player for Community Testimonial
// Web Audio API Voice Anonymization & Identity Preservation Engine
// Supports 5+ minutes audio playback (/audio/depoimento.ogg & /audio/depoimento.mp3)
// ================================================

export function initAudioPlayer() {
  const playBtn = document.getElementById('audio-play-btn');
  const progressBar = document.getElementById('audio-progress-bar');
  const progressFill = document.getElementById('audio-progress-fill');
  const timeCurrent = document.getElementById('audio-time-current');
  const timeTotal = document.getElementById('audio-time-total');
  const audioStatus = document.getElementById('audio-status-label');
  const fxToggleBtn = document.getElementById('audio-fx-toggle-btn');
  const fxBtnText = document.getElementById('audio-fx-btn-text');
  const fxDesc = document.getElementById('audio-fx-desc');

  if (!playBtn) return;

  // Candidates: prioritize .ogg from WhatsApp, fallback to .mp3
  const candidateSrcs = ['/audio/depoimento.ogg', '/audio/depoimento.mp3'];
  let currentSrcIdx = 0;

  const audio = new Audio();
  audio.preload = 'metadata';
  audio.src = candidateSrcs[currentSrcIdx];

  let isAudioLoaded = false;
  let simulatedTimer = null;
  let simulatedTime = 0;
  const simulatedDuration = 312; // 5 min 12 sec simulated duration fallback

  // Voice Anonymization State (Active by default for safety)
  let isAnonActive = true;
  let audioCtx = null;
  let sourceNode = null;
  let filterHighpass = null;
  let filterBandpass = null;
  let filterLowpass = null;
  let waveShaper = null;
  let gainFx = null;
  let gainDry = null;

  // Format MM:SS helper
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Distortion curve for harmonic saturation
  function makeDistortionCurve(amount = 14) {
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }
    return curve;
  }

  // Set up Web Audio API nodes
  function setupWebAudioGraph() {
    if (audioCtx) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      audioCtx = new AudioContextClass();
      sourceNode = audioCtx.createMediaElementSource(audio);

      // 1. Highpass: cuts chest resonance below 220Hz (uniquely identifies speakers)
      filterHighpass = audioCtx.createBiquadFilter();
      filterHighpass.type = 'highpass';
      filterHighpass.frequency.value = 220;

      // 2. Formant Peaking Filter: reshapes vocal tract formants around 1100Hz
      filterBandpass = audioCtx.createBiquadFilter();
      filterBandpass.type = 'peaking';
      filterBandpass.frequency.value = 1100;
      filterBandpass.Q.value = 1.8;
      filterBandpass.gain.value = 6;

      // 3. Lowpass: cuts sibilance above 3400Hz
      filterLowpass = audioCtx.createBiquadFilter();
      filterLowpass.type = 'lowpass';
      filterLowpass.frequency.value = 3400;

      // 4. Subtle Harmonic Saturation (masks biometric acoustic fingerprint)
      waveShaper = audioCtx.createWaveShaper();
      waveShaper.curve = makeDistortionCurve(14);
      waveShaper.oversample = '4x';

      // Gain controls for FX (wet) and Dry routing
      gainFx = audioCtx.createGain();
      gainDry = audioCtx.createGain();

      // FX Chain: source -> highpass -> bandpass -> waveShaper -> lowpass -> gainFx -> destination
      sourceNode.connect(filterHighpass);
      filterHighpass.connect(filterBandpass);
      filterBandpass.connect(waveShaper);
      waveShaper.connect(filterLowpass);
      filterLowpass.connect(gainFx);
      gainFx.connect(audioCtx.destination);

      // Dry Path: source -> gainDry -> destination
      sourceNode.connect(gainDry);
      gainDry.connect(audioCtx.destination);

      applyAnonState();
    } catch (err) {
      console.warn('Web Audio API not fully available for voice anonymization:', err);
    }
  }

  function applyAnonState() {
    if (isAnonActive) {
      // Voice Anonymization Active:
      // Lower playback pitch by ~2 semitones without browser pitch preservation
      audio.preservesPitch = false;
      audio.playbackRate = 0.88;

      if (gainFx) gainFx.gain.setTargetAtTime(1.0, audioCtx.currentTime, 0.05);
      if (gainDry) gainDry.gain.setTargetAtTime(0.0, audioCtx.currentTime, 0.05);

      if (fxToggleBtn) {
        fxToggleBtn.classList.add('active');
        fxToggleBtn.setAttribute('aria-pressed', 'true');
      }
      if (fxBtnText) fxBtnText.textContent = 'Filtro Ativo';
      if (fxDesc) fxDesc.textContent = 'Modulação acústica de segurança ativada';
      if (!audio.paused && audioStatus) {
        audioStatus.textContent = 'REPRODUZINDO (VOZ ANONIMIZADA)';
      }
    } else {
      // Original Natural Voice:
      audio.preservesPitch = true;
      audio.playbackRate = 1.0;

      if (gainFx) gainFx.gain.setTargetAtTime(0.0, audioCtx.currentTime, 0.05);
      if (gainDry) gainDry.gain.setTargetAtTime(1.0, audioCtx.currentTime, 0.05);

      if (fxToggleBtn) {
        fxToggleBtn.classList.remove('active');
        fxToggleBtn.setAttribute('aria-pressed', 'false');
      }
      if (fxBtnText) fxBtnText.textContent = 'Voz Original';
      if (fxDesc) fxDesc.textContent = 'Áudio natural sem filtros';
      if (!audio.paused && audioStatus) {
        audioStatus.textContent = 'REPRODUZINDO (ÁUDIO ORIGINAL)';
      }
    }
  }

  // Audio lifecycle events
  audio.addEventListener('loadedmetadata', () => {
    isAudioLoaded = true;
    if (timeTotal && !isNaN(audio.duration) && isFinite(audio.duration)) {
      timeTotal.textContent = formatTime(audio.duration);
    }
    if (audioStatus && audio.paused) {
      audioStatus.textContent = 'DEPOIMENTO EM ÁUDIO PRONTO';
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
    currentSrcIdx++;
    if (currentSrcIdx < candidateSrcs.length) {
      audio.src = candidateSrcs[currentSrcIdx];
      audio.load();
    } else {
      isAudioLoaded = false;
    }
  });

  // Toggle Play / Pause
  playBtn.addEventListener('click', () => {
    setupWebAudioGraph();
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (isAudioLoaded) {
      if (audio.paused) {
        audio.play().then(() => {
          playBtn.classList.add('playing');
          playBtn.setAttribute('aria-label', 'Pausar depoimento');
          if (audioStatus) {
            audioStatus.textContent = isAnonActive ? 'REPRODUZINDO (VOZ ANONIMIZADA)' : 'REPRODUZINDO (ÁUDIO ORIGINAL)';
          }
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
      audio.play().then(() => {
        isAudioLoaded = true;
        playBtn.classList.add('playing');
        playBtn.setAttribute('aria-label', 'Pausar depoimento');
        if (audioStatus) {
          audioStatus.textContent = isAnonActive ? 'REPRODUZINDO (VOZ ANONIMIZADA)' : 'REPRODUZINDO (ÁUDIO ORIGINAL)';
        }
      }).catch(() => {
        toggleSimulation();
      });
    }
  });

  // Toggle Voice Anonymization Filter
  if (fxToggleBtn) {
    fxToggleBtn.addEventListener('click', () => {
      isAnonActive = !isAnonActive;
      setupWebAudioGraph();
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      applyAnonState();
    });
  }

  // Simulation Fallback if real audio file is missing
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
      if (audioStatus) {
        audioStatus.textContent = isAnonActive ? 'SIMULAÇÃO (VOZ ANONIMIZADA)' : 'SIMULAÇÃO DE ÁUDIO';
      }
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

  // Scrubbing on Timeline
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

