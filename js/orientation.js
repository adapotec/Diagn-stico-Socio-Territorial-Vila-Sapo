// ================================================
// ORIENTATION & FULLSCREEN CONTROLLER — BI Dashboard Mode
// Diagnóstico Socioterritorial da Vila Sapo
// Instituto Ádapo
// ================================================

const STORAGE_KEY = 'adapo_dismiss_orientation';

export function initOrientationAndFullscreen() {
  setupFullscreenToggle();
  setupOrientationOverlay();
  setupOrientationEvents();
}

// ------------------------------------------------
// 1. FULLSCREEN API MANAGEMENT
// ------------------------------------------------

export function isFullscreenActive() {
  return !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );
}

export async function requestFullscreenMode() {
  const docEl = document.documentElement;
  try {
    if (docEl.requestFullscreen) {
      await docEl.requestFullscreen();
    } else if (docEl.webkitRequestFullscreen) {
      await docEl.webkitRequestFullscreen();
    } else if (docEl.mozRequestFullScreen) {
      await docEl.mozRequestFullScreen();
    } else if (docEl.msRequestFullscreen) {
      await docEl.msRequestFullscreen();
    }

    // Try to lock orientation to landscape on supported devices (e.g. Chrome Android)
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(() => {
        // Ignora silenciosamente se o navegador exigir PWA ou modo restrito
      });
    }
  } catch (err) {
    console.warn('[Fullscreen] Solicitação bloqueada ou não suportada:', err);
  }
}

export async function exitFullscreenMode() {
  try {
    if (document.exitFullscreen) {
      await document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      await document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      await document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      await document.msExitFullscreen();
    }

    if (screen.orientation && screen.orientation.unlock) {
      screen.orientation.unlock();
    }
  } catch (err) {
    console.warn('[Fullscreen] Erro ao sair da tela cheia:', err);
  }
}

export async function toggleFullscreenMode() {
  if (isFullscreenActive()) {
    await exitFullscreenMode();
  } else {
    await requestFullscreenMode();
  }
}

function updateFullscreenUI() {
  const btn = document.getElementById('btn-fullscreen-toggle');
  if (!btn) return;

  const isActive = isFullscreenActive();
  const iconExpand = btn.querySelector('.icon-expand');
  const iconCompress = btn.querySelector('.icon-compress');
  const label = btn.querySelector('.btn-fullscreen-label');

  if (iconExpand) iconExpand.style.display = isActive ? 'none' : 'block';
  if (iconCompress) iconCompress.style.display = isActive ? 'block' : 'none';

  if (label) {
    label.textContent = isActive ? 'Sair' : 'Tela Cheia';
  }

  btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  btn.setAttribute('title', isActive ? 'Sair da tela cheia (Esc)' : 'Expandir para tela cheia');

  // Trigger charts and map resize after transition
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
  }, 180);
}

function setupFullscreenToggle() {
  const btn = document.getElementById('btn-fullscreen-toggle');
  if (!btn) return;

  btn.addEventListener('click', async (e) => {
    e.preventDefault();
    await toggleFullscreenMode();
  });

  // Listeners para sincronizar estado quando usuário aperta Esc ou muda tela cheia nativamente
  const events = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'];
  events.forEach(evt => {
    document.addEventListener(evt, updateFullscreenUI);
  });
}

// ------------------------------------------------
// 2. MOBILE ORIENTATION OVERLAY (BI DASHBOARD GUIDANCE)
// ------------------------------------------------

function shouldShowOrientationPrompt() {
  // Verifica se já dispensou nesta sessão
  if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
    return false;
  }

  // Verifica se é tela de smartphone/tablet em modo retrato (portrait)
  const isPortrait = window.innerHeight > window.innerWidth;
  const isMobileSize = window.innerWidth <= 920;
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  return isPortrait && (isMobileSize || hasTouch);
}

function showOverlay() {
  const overlay = document.getElementById('orientation-overlay');
  if (!overlay) return;
  overlay.classList.remove('is-dismissed');
  overlay.classList.add('is-visible');
}

function hideOverlay() {
  const overlay = document.getElementById('orientation-overlay');
  if (!overlay) return;
  overlay.classList.remove('is-visible');
  overlay.classList.add('is-dismissed');
}

function setupOrientationOverlay() {
  const overlay = document.getElementById('orientation-overlay');
  const btnFullscreen = document.getElementById('btn-orientation-fullscreen');
  const btnDismiss = document.getElementById('btn-orientation-dismiss');

  if (!overlay) return;

  // Se já dispensado nesta sessão, adiciona classe is-dismissed de imediato
  if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
    overlay.classList.add('is-dismissed');
  }

  // Botão primário: Entrar em Tela Cheia & Paisagem
  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', async () => {
      await requestFullscreenMode();
      hideOverlay();
    });
  }

  // Botão secundário: Continuar no formato vertical (dispensar por esta sessão)
  if (btnDismiss) {
    btnDismiss.addEventListener('click', () => {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      hideOverlay();
    });
  }
}

// ------------------------------------------------
// 3. LISTENERS DE GIRO / REDIMENSIONAMENTO
// ------------------------------------------------

function setupOrientationEvents() {
  const checkOrientationChange = () => {
    const isLandscape = window.innerWidth > window.innerHeight;

    if (isLandscape) {
      // Girou para paisagem: esconde o overlay automaticamente
      hideOverlay();
    } else {
      // Voltou para retrato: reavalia se deve exibir (respeitando session dismiss)
      if (shouldShowOrientationPrompt()) {
        showOverlay();
      }
    }

    // Força reflow dos gráficos Chart.js e mapas Leaflet
    window.dispatchEvent(new Event('resize'));
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 250);
  };

  window.addEventListener('resize', checkOrientationChange);
  window.addEventListener('orientationchange', () => {
    setTimeout(checkOrientationChange, 150);
  });

  // Media Query listener para orientation
  if (window.matchMedia) {
    const mql = window.matchMedia('(orientation: landscape)');
    mql.addEventListener('change', checkOrientationChange);
  }
}
