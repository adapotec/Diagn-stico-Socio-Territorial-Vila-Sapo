// ================================================
// AUDIO PLAYER COMPONENT — Vozes da Vila Sapo
// Institutional Audio Player for Community Testimonial
// Broadcast-Grade Voice Anonymization & Identity Shield (Web Audio API)
// Full 5+ minutes playback support (/audio/depoimento.ogg & /audio/depoimento.mp3)
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

  // Retrieve audio element from DOM or create fallback
  let audio = document.getElementById('field-audio-element');
  if (!audio) {
    audio = new Audio();
    audio.id = 'field-audio-element';
    audio.crossOrigin = 'anonymous';
    audio.preload = 'metadata';
    audio.src = '/audio/depoimento.ogg';
    document.body.appendChild(audio);
  }

  let isAudioLoaded = false;
  let simulatedTimer = null;
  let simulatedTime = 0;
  const simulatedDuration = 312; // 5 min 12 sec

  // Voice Anonymization Graph State
  let isAnonActive = true;
  let audioCtx = null;
  let sourceNode = null;
  let filterHighpass = null;
  let filterLowpass = null;
  let filterFormant = null;
  let carrierOsc = null;
  let carrierGain = null;
  let modGain = null;
  let waveShaper = null;
  let gainFx = null;
  let gainDry = null;
  let isGraphConnected = false;

  // Format MM:SS helper
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Distortion curve for electronic voice masking
  function makeDistortionCurve(amount = 28) {
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }
    return curve;
  }

  // Set up Broadcast-Grade Web Audio API Anonymization Graph
  function setupWebAudioGraph() {
    if (isGraphConnected) return;

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioCtx) {
        audioCtx = new AudioContextClass();
      }

      if (!sourceNode) {
        sourceNode = audioCtx.createMediaElementSource(audio);
      }

      // 1. Pre-filter: Cut fundamental human vocal cord frequencies (280Hz) and sibilants (2300Hz)
      filterHighpass = audioCtx.createBiquadFilter();
      filterHighpass.type = 'highpass';
      filterHighpass.frequency.setValueAtTime(280, audioCtx.currentTime);
      filterHighpass.Q.setValueAtTime(1.2, audioCtx.currentTime);

      filterLowpass = audioCtx.createBiquadFilter();
      filterLowpass.type = 'lowpass';
      filterLowpass.frequency.setValueAtTime(2300, audioCtx.currentTime);
      filterLowpass.Q.setValueAtTime(1.2, audioCtx.currentTime);

      // 2. Resonant Formant Peaking Filter: Replaces natural throat resonance with robotic mask
      filterFormant = audioCtx.createBiquadFilter();
      filterFormant.type = 'peaking';
      filterFormant.frequency.setValueAtTime(820, audioCtx.currentTime);
      filterFormant.Q.setValueAtTime(2.2, audioCtx.currentTime);
      filterFormant.gain.setValueAtTime(8.0, audioCtx.currentTime);

      // 3. Ring Modulator (TV Witness Protection Scrambler)
      // Modulates voice waveform with a 54Hz sine wave sideband generator
      carrierOsc = audioCtx.createOscillator();
      carrierOsc.type = 'sine';
      carrierOsc.frequency.setValueAtTime(54, audioCtx.currentTime);

      carrierGain = audioCtx.createGain();
      carrierGain.gain.setValueAtTime(0.65, audioCtx.currentTime); // Modulation depth

      modGain = audioCtx.createGain();
      modGain.gain.setValueAtTime(0.35, audioCtx.currentTime); // Carrier offset

      carrierOsc.connect(carrierGain);
      carrierGain.connect(modGain.gain);
      carrierOsc.start();

      // 4. WaveShaper Distortion (masking harmonic saturation)
      waveShaper = audioCtx.createWaveShaper();
      waveShaper.curve = makeDistortionCurve(28);
      waveShaper.oversample = '4x';

      // 5. Wet (FX) and Dry (Original) Gain Routing
      gainFx = audioCtx.createGain();
      gainFx.gain.setValueAtTime(1.0, audioCtx.currentTime);

      gainDry = audioCtx.createGain();
      gainDry.gain.setValueAtTime(0.0, audioCtx.currentTime); // Zero by default

      // FX Chain: source -> Highpass -> Lowpass -> Formant -> modGain -> waveShaper -> gainFx -> destination
      sourceNode.connect(filterHighpass);
      filterHighpass.connect(filterLowpass);
      filterLowpass.connect(filterFormant);
      filterFormant.connect(modGain);
      modGain.connect(waveShaper);
      waveShaper.connect(gainFx);
      gainFx.connect(audioCtx.destination);

      // Dry Chain (connected only when user deliberately switches to original voice):
      sourceNode.connect(gainDry);
      gainDry.connect(audioCtx.destination);

      isGraphConnected = true;
      applyAnonState();
    } catch (err) {
      console.warn('Web Audio Graph initialization note:', err);
    }
  }

  function applyAnonState() {
    if (isAnonActive) {
      // Voice Anonymization ACTIVE:
      // Deeper pitch and altered cadence
      audio.preservesPitch = false;
      audio.playbackRate = 0.84;

      if (gainFx && audioCtx) {
        gainFx.gain.setValueAtTime(1.0, audioCtx.currentTime);
      }
      if (gainDry && audioCtx) {
        gainDry.gain.setValueAtTime(0.0, audioCtx.currentTime);
      }

      if (fxToggleBtn) {
        fxToggleBtn.classList.add('active');
        fxToggleBtn.setAttribute('aria-pressed', 'true');
      }
      if (fxBtnText) fxBtnText.textContent = 'Filtro Ativo';
      if (fxDesc) fxDesc.textContent = 'Modulação de proteção vocal ativa (Scrambler 54Hz + Formante)';
      if (!audio.paused && audioStatus) {
        audioStatus.textContent = 'REPRODUZINDO (VOZ ANONIMIZADA // PROTEGIDA)';
      }
    } else {
      // Original Natural Voice:
      audio.preservesPitch = true;
      audio.playbackRate = 1.0;

      if (gainFx && audioCtx) {
        gainFx.gain.setValueAtTime(0.0, audioCtx.currentTime);
      }
      if (gainDry && audioCtx) {
        gainDry.gain.setValueAtTime(1.0, audioCtx.currentTime);
      }

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

  // Check if duration is already available
  if (audio.readyState >= 1 && !isNaN(audio.duration) && isFinite(audio.duration)) {
    isAudioLoaded = true;
    if (timeTotal) timeTotal.textContent = formatTime(audio.duration);
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
    isAudioLoaded = false;
  });

  // Toggle Play / Pause
  playBtn.addEventListener('click', async () => {
    try {
      setupWebAudioGraph();
      if (audioCtx && audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }
    } catch (err) {
      console.warn('AudioContext gesture error:', err);
    }

    if (isAudioLoaded || audio.readyState >= 2) {
      if (audio.paused) {
        audio.play().then(() => {
          playBtn.classList.add('playing');
          playBtn.setAttribute('aria-label', 'Pausar depoimento');
          if (audioStatus) {
            audioStatus.textContent = isAnonActive ? 'REPRODUZINDO (VOZ ANONIMIZADA // PROTEGIDA)' : 'REPRODUZINDO (ÁUDIO ORIGINAL)';
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
          audioStatus.textContent = isAnonActive ? 'REPRODUZINDO (VOZ ANONIMIZADA // PROTEGIDA)' : 'REPRODUZINDO (ÁUDIO ORIGINAL)';
        }
      }).catch(() => {
        toggleSimulation();
      });
    }
  });

  // Toggle Voice Anonymization Filter
  if (fxToggleBtn) {
    fxToggleBtn.addEventListener('click', async () => {
      isAnonActive = !isAnonActive;
      try {
        setupWebAudioGraph();
        if (audioCtx && audioCtx.state === 'suspended') {
          await audioCtx.resume();
        }
      } catch (err) {
        console.warn('AudioContext error on toggle:', err);
      }
      applyAnonState();
    });
  }

  // Simulation Fallback if real audio file cannot be loaded
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
      if ((isAudioLoaded || audio.readyState >= 1) && !isNaN(audio.duration) && audio.duration > 0) {
        audio.currentTime = pct * audio.duration;
      } else {
        simulatedTime = pct * simulatedDuration;
        if (timeCurrent) timeCurrent.textContent = formatTime(simulatedTime);
        if (progressFill) progressFill.style.width = `${pct * 100}%`;
      }
    });
  }
}
