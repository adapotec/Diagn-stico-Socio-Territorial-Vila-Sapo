// ================================================
// MAIN — App Initialization & Presentation Deck
// Diagnóstico Socioterritorial da Vila Sapo
// Instituto Ádapo
// ================================================

import { getData } from './data.js';
import { initCharts } from './charts.js';
import { initMap, initMiniMap } from './map.js';
import { initCounters } from './counters.js';
import { initSlides } from './slides.js';
import { initAudioPlayer } from './audio-player.js';
import { initScreenshotEngine } from './screenshot.js';
import { initOrientationAndFullscreen } from './orientation.js';

// Import styles
import 'leaflet/dist/leaflet.css';
import '../css/index.css';
import '../css/components.css';
import '../css/sections.css';
import '../css/responsive.css';

async function init() {
  // Load data
  const data = await getData();

  // Update data source indicators
  const sourceEl = document.getElementById('data-source-text');
  if (sourceEl) {
    sourceEl.textContent = data.source === 'google-sheets'
      ? `Dados ao vivo • ${data.totalResponses} respostas consolidadas`
      : `Censo em andamento: famílias mapeadas às margens do Rio Ingaúra`;
  }

  const updateEl = document.getElementById('last-update');
  if (updateEl) {
    updateEl.textContent = `Atualizado em ${data.lastUpdate}`;
  }

  // Initialize Slide Deck System & Components
  initSlides();
  initCharts();
  initMap();
  initMiniMap();
  initCounters();
  initAudioPlayer();
  initScreenshotEngine();
  initOrientationAndFullscreen();

  // Ensure charts and map adjust correctly on startup
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
  }, 300);
}

// Start application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
