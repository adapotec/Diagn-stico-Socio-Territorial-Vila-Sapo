// ================================================
// SLIDES CONTROLLER — Presentation Deck System
// Institutional Deck Inspired by Instituto Cidades Sustentáveis
// ================================================

export const SLIDE_NAMES = [
  { id: 'slide-capa', label: 'Capa' },
  { id: 'slide-introducao', label: 'Introdução' },
  { id: 'slide-diagnostico', label: 'Diagnóstico' },
  { id: 'slide-ods', label: 'ODS ONU' },
  { id: 'slide-mapa', label: 'Cartografia' },
  { id: 'slide-depoimentos', label: 'Depoimentos' },
  { id: 'slide-midia', label: 'Na Mídia' },
  { id: 'slide-adapo', label: 'Instituto Ádapo' },
];

let currentSlideIndex = 0;
let heroCarouselInterval = null;
let heroCurrentPhoto = 0;
let isHeroPlaying = true;

const HERO_PHOTOS = [
  {
    src: '/fotos/hero-1.jpg',
    tag: 'CALHA DO RIO INGAÚRA',
    caption: 'Moradias e palafitas estruturadas diretamente na margem e leito do Rio Ingaúra sob risco permanente de inundação.',
    location: 'Margens do Rio Ingaúra • Novo Angelim'
  },
  {
    src: '/fotos/hero-2.jpg',
    tag: 'SANEAMENTO INEXISTENTE',
    caption: 'Valas de esgoto a céu aberto cortando as passagens das moradias com refluxo direto durante marés e chuvas.',
    location: 'Setor Central da Vila Sapo'
  },
  {
    src: '/fotos/hero-3.jpg',
    tag: 'MOBILIDADE & VIAS',
    caption: 'Pontilhões improvisados de madeira sobre o solo lamacento e vias sem qualquer tipo de pavimentação ou drenagem.',
    location: 'Acesso Principal à Margem do Rio'
  },
  {
    src: '/fotos/hero-4.jpg',
    tag: 'VULNERABILIDADE SOCIAL',
    caption: 'Famílias residentes em área de risco geológico e hídrico permanente às margens do canal fluvial.',
    location: 'Novo Angelim • São Luís - MA'
  },
  {
    src: '/fotos/hero-5.jpg',
    tag: 'IMPACTO SOCIOAMBIENTAL',
    caption: 'Ausência total de coleta e tratamento de resíduos, com acúmulo de entulhos e proliferação de vetores.',
    location: 'Trecho Intermediário da Ocupação'
  },
  {
    src: '/fotos/hero-6.jpg',
    tag: 'RESISTÊNCIA COMUNITÁRIA',
    caption: 'Comunidade mapeada pelo Instituto Ádapo em busca de garantia de direitos e dignidade habitacional.',
    location: 'Vila Sapo • São Luís - MA'
  }
];

export function initSlides() {
  setupSlideNavigation();
  setupHeroCarousel();
  setupDiagnosticoSubtabs();
  setupKeyboardAndTouch();
  updateSlideView(0);
}

// ---------- Slide Navigation ----------
export function goToSlide(index) {
  if (index < 0 || index >= SLIDE_NAMES.length) return;
  const prevIndex = currentSlideIndex;
  currentSlideIndex = index;
  updateSlideView(prevIndex);
}

export function nextSlide() {
  if (currentSlideIndex < SLIDE_NAMES.length - 1) {
    goToSlide(currentSlideIndex + 1);
  }
}

export function prevSlide() {
  if (currentSlideIndex > 0) {
    goToSlide(currentSlideIndex - 1);
  }
}

function updateSlideView(prevIndex) {
  const slides = document.querySelectorAll('.slide-view');
  const navLinks = document.querySelectorAll('.nav-deck-link');
  const prevBtn = document.querySelector('.float-nav-btn.prev');
  const nextBtn = document.querySelector('.float-nav-btn.next');
  const progressBar = document.querySelector('.deck-progress-bar-fill');
  const slideCounter = document.querySelectorAll('.deck-slide-indicator');

  // Update Slides
  slides.forEach((slide, idx) => {
    slide.classList.remove('active', 'slide-prev');
    if (idx === currentSlideIndex) {
      slide.classList.add('active');
    } else if (idx < currentSlideIndex) {
      slide.classList.add('slide-prev');
    }
  });

  // Update Top Nav Tabs
  navLinks.forEach((link, idx) => {
    link.classList.toggle('active', idx === currentSlideIndex);
  });

  // Update Progress Bar
  const progressPercent = ((currentSlideIndex + 1) / SLIDE_NAMES.length) * 100;
  if (progressBar) {
    progressBar.style.width = `${progressPercent}%`;
  }

  // Update Slide Counters
  slideCounter.forEach(el => {
    el.textContent = `${currentSlideIndex + 1} / ${SLIDE_NAMES.length}`;
  });

  // Update Floating Navigation Buttons
  if (prevBtn) {
    // Hide global floating prev button on Capa (no prev) and on Diagnóstico (sidebar has its own integrated return button)
    if (currentSlideIndex === 0 || currentSlideIndex === 2) {
      prevBtn.classList.add('hidden');
    } else {
      prevBtn.classList.remove('hidden');
      const prevLabel = prevBtn.querySelector('.btn-label');
      if (prevLabel) {
        prevLabel.textContent = SLIDE_NAMES[currentSlideIndex - 1].label;
      }
    }
  }

  if (nextBtn) {
    if (currentSlideIndex === SLIDE_NAMES.length - 1) {
      nextBtn.classList.add('hidden');
    } else {
      nextBtn.classList.remove('hidden');
      const nextLabel = nextBtn.querySelector('.btn-label');
      if (nextLabel) {
        nextLabel.textContent = `${SLIDE_NAMES[currentSlideIndex + 1].label} →`;
      }
    }
  }

  // Window resize event to adjust Chart.js and Leaflet immediately and post-transition
  window.dispatchEvent(new Event('resize'));
  setTimeout(() => window.dispatchEvent(new Event('resize')), 200);
}

function setupSlideNavigation() {
  // Top Nav Deck Links
  const navLinks = document.querySelectorAll('.nav-deck-link');
  navLinks.forEach((link, idx) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      goToSlide(idx);
    });
  });

  // Floating Buttons
  const nextBtn = document.querySelector('.float-nav-btn.next');
  const prevBtn = document.querySelector('.float-nav-btn.prev');

  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  // Hero CTA "Iniciar Apresentação"
  const heroCta = document.querySelector('#hero-start-cta');
  if (heroCta) {
    heroCta.addEventListener('click', (e) => {
      e.preventDefault();
      goToSlide(1);
    });
  }
}

// ---------- Keyboard & Touch Controls ----------
function setupKeyboardAndTouch() {
  // Keyboard Left / Right arrows
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      prevSlide();
    }
  });

  // Touch Swipe for mobile devices
  let touchStartX = 0;
  let touchEndX = 0;

  window.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  }, { passive: true });
}

// ---------- Hero Dedicated Photo Showcase ----------
function setupHeroCarousel() {
  const track = document.getElementById('hero-carousel-track');
  const thumbsStrip = document.getElementById('hero-carousel-dots');
  const prevBtn = document.getElementById('showcase-prev-btn');
  const nextBtn = document.getElementById('showcase-next-btn');
  const playBtn = document.getElementById('showcase-play-btn');

  if (!track) return;

  // Render photo slides in track
  track.innerHTML = HERO_PHOTOS.map((item, idx) => `
    <div class="showcase-photo-slide ${idx === 0 ? 'active' : ''}" style="background-image: url('${item.src}');" data-index="${idx}"></div>
  `).join('');

  // Render thumbnails in strip
  if (thumbsStrip) {
    thumbsStrip.innerHTML = HERO_PHOTOS.map((item, idx) => `
      <button class="showcase-thumb-btn ${idx === 0 ? 'active' : ''}" data-index="${idx}" aria-label="Visualizar Foto ${idx + 1}" style="background-image: url('${item.src}');">
        <span class="thumb-idx">${idx + 1}</span>
      </button>
    `).join('');

    thumbsStrip.querySelectorAll('.showcase-thumb-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetBtn = e.target.closest('.showcase-thumb-btn');
        if (!targetBtn) return;
        const idx = parseInt(targetBtn.dataset.index, 10);
        setHeroPhoto(idx);
      });
    });
  }

  // Navigation arrows
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const prevIdx = (heroCurrentPhoto - 1 + HERO_PHOTOS.length) % HERO_PHOTOS.length;
      setHeroPhoto(prevIdx);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const nextIdx = (heroCurrentPhoto + 1) % HERO_PHOTOS.length;
      setHeroPhoto(nextIdx);
    });
  }

  // Play/Pause button
  if (playBtn) {
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isHeroPlaying = !isHeroPlaying;
      if (isHeroPlaying) {
        startHeroCarouselTimer();
        playBtn.innerHTML = '<span class="play-icon">⏸</span>';
        playBtn.setAttribute('title', 'Pausar rotação');
      } else {
        clearInterval(heroCarouselInterval);
        playBtn.innerHTML = '<span class="play-icon">▶</span>';
        playBtn.setAttribute('title', 'Reproduzir rotação automática');
      }
    });
  }

  // Start auto timer
  startHeroCarouselTimer();

  // Set initial text
  setHeroPhoto(0);
}

function setHeroPhoto(index) {
  heroCurrentPhoto = index;
  const photos = document.querySelectorAll('.showcase-photo-slide');
  const thumbs = document.querySelectorAll('.showcase-thumb-btn');
  const indexEl = document.getElementById('hero-photo-index');
  const totalEl = document.getElementById('hero-photo-total');
  const captionEl = document.getElementById('showcase-caption-text');
  const tagEl = document.querySelector('.showcase-caption-tag');

  photos.forEach((photo, idx) => {
    photo.classList.toggle('active', idx === heroCurrentPhoto);
  });

  thumbs.forEach((thumb, idx) => {
    thumb.classList.toggle('active', idx === heroCurrentPhoto);
  });

  if (indexEl) indexEl.textContent = String(heroCurrentPhoto + 1).padStart(2, '0');
  if (totalEl) totalEl.textContent = String(HERO_PHOTOS.length).padStart(2, '0');

  const photoData = HERO_PHOTOS[heroCurrentPhoto];
  if (photoData) {
    if (captionEl) captionEl.textContent = photoData.caption;
    if (tagEl) tagEl.textContent = photoData.tag;
  }
}

function startHeroCarouselTimer() {
  clearInterval(heroCarouselInterval);
  if (!isHeroPlaying) return;
  heroCarouselInterval = setInterval(() => {
    const nextIdx = (heroCurrentPhoto + 1) % HERO_PHOTOS.length;
    setHeroPhoto(nextIdx);
  }, 5000);
}

// ---------- Diagnóstico Slide Sidebar Sub-tabs ----------
function setupDiagnosticoSubtabs() {
  const tabButtons = document.querySelectorAll('.diag-subtab-btn');
  const tabPanels = document.querySelectorAll('.diag-panel');
  const activeTitleEl = document.getElementById('diag-active-topic-title');
  const activeDescEl = document.getElementById('diag-active-topic-desc');

  // Quick navigation in sidebar
  const sidebarPrevBtn = document.getElementById('diag-prev-slide-btn');
  const sidebarHomeBtn = document.getElementById('diag-home-slide-btn');
  const sidebarNextBtn = document.getElementById('diag-next-slide-btn');
  const sidebarReturnBtn = document.getElementById('diag-sidebar-return-btn');

  if (sidebarPrevBtn) sidebarPrevBtn.addEventListener('click', prevSlide);
  if (sidebarHomeBtn) sidebarHomeBtn.addEventListener('click', () => goToSlide(0));
  if (sidebarNextBtn) sidebarNextBtn.addEventListener('click', nextSlide);
  if (sidebarReturnBtn) {
    sidebarReturnBtn.addEventListener('click', (e) => {
      e.preventDefault();
      goToSlide(1);
    });
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.panel;
      const topicTitle = btn.dataset.title || btn.querySelector('.subtab-name')?.textContent || 'DIAGNÓSTICO';
      const topicDesc = btn.dataset.desc || '';

      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }

      // Update sidebar active topic footer info
      if (activeTitleEl) activeTitleEl.textContent = topicTitle;
      if (activeDescEl && topicDesc) activeDescEl.textContent = topicDesc;

      // Trigger chart resize for newly visible panel
      window.dispatchEvent(new Event('resize'));
      setTimeout(() => window.dispatchEvent(new Event('resize')), 150);
    });
  });
}
