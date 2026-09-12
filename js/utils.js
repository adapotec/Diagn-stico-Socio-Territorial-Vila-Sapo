// ================================================
// UTILS — Helper functions
// ================================================

// Format number with locale
export function formatNumber(num) {
  return new Intl.NumberFormat('pt-BR').format(num);
}

// Calculate percentage
export function percent(part, total) {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}

// Format percentage string
export function formatPercent(part, total) {
  return `${percent(part, total)}%`;
}

// Sort object entries by value descending
export function sortByValue(obj) {
  return Object.entries(obj).sort((a, b) => b[1] - a[1]);
}

// Get top N items from object
export function topN(obj, n = 5) {
  return sortByValue(obj).slice(0, n);
}

// Throttle function
export function throttle(fn, delay) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn(...args);
    }
  };
}

// Debounce function
export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Intersection observer for scroll animations
export function setupScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Trigger progress bars
          const bars = entry.target.querySelectorAll('.progress-bar-fill[data-width]');
          bars.forEach(bar => {
            bar.style.width = bar.dataset.width;
          });
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el);
  });

  return observer;
}

// Generate chart colors (Institutional high-contrast palette, ZERO purple, ZERO soft pastels)
export function chartColors(count) {
  const palette = [
    '#E86C1D', '#DC2626', '#D97706', '#059669', '#0284C7',
    '#475569', '#EA580C', '#B91C1C', '#D97706', '#0D9488',
    '#64748B', '#B45309', '#94A3B8', '#991B1B', '#334155'
  ];
  return palette.slice(0, count);
}

// Chart.js default config for Institutional Light Mode
export function getChartDefaults() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#334155',
          font: { family: "'Space Mono', monospace", size: 11, weight: '600' },
          padding: 14,
          usePointStyle: true,
          pointStyle: 'rect'
        }
      },
      tooltip: {
        backgroundColor: '#FFFFFF',
        titleColor: '#0F172A',
        bodyColor: '#334155',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        cornerRadius: 4,
        padding: 10,
        titleFont: { family: "'Inter', sans-serif", weight: '700', size: 12 },
        bodyFont: { family: "'Space Mono', monospace", size: 11 },
        displayColors: true,
        boxPadding: 4,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }
    }
  };
}

// Get bar chart options
export function getBarOptions(opts = {}) {
  const defaults = getChartDefaults();
  return {
    ...defaults,
    indexAxis: opts.horizontal ? 'y' : 'x',
    plugins: {
      ...defaults.plugins,
      legend: { display: opts.showLegend ?? false }
    },
    scales: {
      x: {
        grid: { color: 'rgba(0,0,0,0.06)', drawBorder: false },
        ticks: {
          color: '#64748B',
          font: { size: 10, family: "'Space Mono', monospace" },
          maxRotation: opts.horizontal ? 0 : 45
        }
      },
      y: {
        grid: { color: 'rgba(0,0,0,0.06)', drawBorder: false },
        ticks: {
          color: '#64748B',
          font: { size: 10, family: "'Space Mono', monospace" }
        },
        beginAtZero: true
      }
    }
  };
}

// Get doughnut/pie options
export function getDoughnutOptions(opts = {}) {
  const defaults = getChartDefaults();
  return {
    ...defaults,
    cutout: opts.cutout ?? '60%',
    plugins: {
      ...defaults.plugins,
      legend: {
        ...defaults.plugins.legend,
        position: opts.legendPosition ?? 'bottom',
        display: opts.showLegend ?? true
      }
    }
  };
}
