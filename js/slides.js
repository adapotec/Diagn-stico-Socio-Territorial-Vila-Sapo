// ================================================
// SLIDES CONTROLLER — Presentation Deck System
// Institutional Deck Inspired by Instituto Cidades Sustentáveis
// ================================================

export const SLIDE_NAMES = [
  { id: 'slide-capa', label: 'Capa' },
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

const HERO_PHOTOS = [
  '/fotos/foto-1.jpg',
  '/fotos/foto-2.jpg',
  '/fotos/foto-3.jpg',
  '/fotos/foto-4.jpg',
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
    if (currentSlideIndex === 0) {
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

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 60) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  }, { passive: true });
}

// ---------- Hero Dynamic Background Carousel ----------
function setupHeroCarousel() {
  const container = document.getElementById('hero-carousel-track');
  const dotsContainer = document.getElementById('hero-carousel-dots');
  if (!container) return;

  // Render slides in carousel track
  container.innerHTML = HERO_PHOTOS.map((src, idx) => `
    <div class="hero-bg-photo ${idx === 0 ? 'active' : ''}" style="background-image: url('${src}');" data-index="${idx}"></div>
  `).join('');

  if (dotsContainer) {
    dotsContainer.innerHTML = HERO_PHOTOS.map((_, idx) => `
      <button class="hero-carousel-dot ${idx === 0 ? 'active' : ''}" data-index="${idx}" aria-label="Foto ${idx + 1}"></button>
    `).join('');

    dotsContainer.querySelectorAll('.hero-carousel-dot').forEach(dot => {
      dot.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index, 10);
        setHeroPhoto(idx);
      });
    });
  }

  startHeroCarouselTimer();

  // Pause on hover
  container.addEventListener('mouseenter', () => clearInterval(heroCarouselInterval));
  container.addEventListener('mouseleave', () => startHeroCarouselTimer());
}

function setHeroPhoto(index) {
  heroCurrentPhoto = index;
  const photos = document.querySelectorAll('.hero-bg-photo');
  const dots = document.querySelectorAll('.hero-carousel-dot');

  photos.forEach((photo, idx) => {
    photo.classList.toggle('active', idx === heroCurrentPhoto);
  });

  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === heroCurrentPhoto);
  });
}

function startHeroCarouselTimer() {
  clearInterval(heroCarouselInterval);
  heroCarouselInterval = setInterval(() => {
    const nextIdx = (heroCurrentPhoto + 1) % HERO_PHOTOS.length;
    setHeroPhoto(nextIdx);
  }, 5000);
}

// ---------- Diagnóstico Slide Sub-tabs ----------
function setupDiagnosticoSubtabs() {
  const tabButtons = document.querySelectorAll('.diag-subtab-btn');
  const tabPanels = document.querySelectorAll('.diag-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.panel;
      
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }

      // Trigger chart resize for newly visible panel
      window.dispatchEvent(new Event('resize'));
    });
  });
}
